"""

create-bike-features.py
Josh Reynolds - jreynolds@wfrc.org
Created: 2024-07-08
Updated: 2025-02-10

This script pulls down the most recent copies of the utah roads and
trails & pathways datasets (hosted by UGRC), merges and formats them,
and determines its best bike feature as well as which side of the
road the feature is on. The final products are 1) existing and
2) planned line layers for the wfrc-bike-app.

"""

import os
import numpy as np
from arcgis import GIS
from arcgis.features import GeoAccessor
from arcgis.features import GeoSeriesAccessor
import pandas as pd
import numbers
import zipfile
import sys
import subprocess


def determine_direction_from_angle(angle):
    """determines from cardinal direction from a provided angle"""
    if isinstance(angle, numbers.Number):
        if angle < 337.5 and angle > 292.5:
            direction = "Northwest Side"
        elif angle == 337.5:
            direction = "North-Northwest Side"
        elif (angle >= 0 and angle < 22.5) or (angle > 337.5 and angle <= 360):
            direction = "North Side"
        elif angle == 22.5:
            direction = "North-Northeast Side"
        elif angle < 67.5 and angle > 22.5:
            direction = "Northeast Side"
        elif angle == 67.5:
            direction = "East-Northeast Side"
        elif angle < 112.5 and angle > 67.5:
            direction = "East Side"
        elif angle == 112.5:
            direction = "East-Southeast Side"
        elif angle < 157.5 and angle > 112.5:
            direction = "Southeast Side"
        elif angle == 157.5:
            direction = "South-Southeast Side"
        elif angle < 202.5 and angle > 157.5:
            direction = "South Side"
        elif angle == 202.5:
            direction = "South-Southwest Side"
        elif angle < 247.5 and angle > 202.5:
            direction = "Southwest Side"
        elif angle == 247.5:
            direction = "West-Southwest Side"
        elif angle < 292.5 and angle > 247.5:
            direction = "West Side"
        elif angle == 292.5:
            direction = "West-Northwest Side"
    else:
        direction = "Not Available"

    return direction


def determine_primary_bike_feature_and_side(row):
    """determines the highest level bike feature between the two sides of a road"""

    # lookup table for bike facility and rankings
    bike_facility_rank_lookup = {
        "1A": 3,  # 1A Cycle track, at-grade, protected with parking
        "1B": 2,  # 1B Cycle track, protected with barrier
        "1C": 1,  # 1C Cycle track, raised and curb separated (may be multiuse with peds)
        "1D": 3,  # 1D Cycle track, bi-directional
        "1E": 3,  # 1E Cycle track, center-running
        "2A": 4,  # 2A Buffered bike lane
        "2B": 5,  # 2B Bike lane
        "2C": 4,  # 2C Bi-directional buffered bike lane
        "3A": 6,  # 3A Shoulder bikeway
        "3B": 7,  # 3B Marked shared roadway
        "3C": 8,  # 3C Signed shared roadway
        "1": 1,  # 1 Cycle track, unspecified
        "2": 5,  # 2 Bike lane, unspecified
        "3": 8,  # 3 Other bike route, unspecified
        "PP": 1,  # Parallel Bike Path, Paved
        "PU": 9,  # Parallel Bike Path, Unpaved
        "UN": 10,  # Unknown Category,
        "TrPw": 1,  # Trail or Pathway
    }

    bike_facility_name_lookup = {
        "1A": "Cycle track, at-grade, protected with parking (1A)",
        "1B": "Cycle track, protected with barrier (1B)",
        "1C": "Cycle track, raised and curb separated (1C)",
        "1D": "Cycle track, bi-directional (1D",
        "1E": "Cycle track, center-running (1E)",
        "2A": "Buffered bike lane (2A)",
        "2B": "Bike lane (2B)",
        "2C": "Bi-directional buffered bike lane (2C)",
        "3A": "Shoulder bikeway (3A)",
        "3B": "Marked shared roadway (3B)",
        "3C": "Signed shared roadway (3C)",
        "1": "Cycle track, unspecified (1)",
        "2": "Bike lane, unspecified (2)",
        "3": "Other bike route, unspecified (3)",
        "PP": "Parallel Bike Path, Paved (PP)",
        "PU": "Parallel Bike Path, Unpaved (PU)",
        "UN": "Unknown Category (UN)",
        "TrPw": "Trail or Pathway",
        "NA": "Not Available",
    }

    # -----------------------------------
    # Existing Bike Facilities
    # -----------------------------------

    # if there are bike features on both sides
    if (
        row["BIKE_L"] in bike_facility_rank_lookup.keys()
        and row["BIKE_R"] in bike_facility_rank_lookup.keys()
    ):
        # get the rank for each facility
        bl_rank = bike_facility_rank_lookup[row["BIKE_L"]]
        br_rank = bike_facility_rank_lookup[row["BIKE_R"]]

        # if bike_left's facility is better than bike_right's or they tie
        if (bl_rank < br_rank) or (bl_rank == br_rank):
            primary_feature = row["BIKE_L"]
            secondary_feature = row["BIKE_R"]

            if row["CompassA"] >= 90:
                primary_feature_degrees = row["CompassA"] - 90
            elif row["CompassA"] < 90:
                primary_feature_degrees = row["CompassA"] + 270
            else:
                primary_feature_degrees = "NA"

            if primary_feature_degrees == "NA":
                secondary_feature_degrees = "NA"
            elif primary_feature_degrees <= 180:
                secondary_feature_degrees = primary_feature_degrees + 180
            elif primary_feature_degrees > 180:
                secondary_feature_degrees = primary_feature_degrees - 180

        # if bike_right's facility is better than bike_left's
        if br_rank < bl_rank:
            primary_feature = row["BIKE_R"]
            secondary_feature = row["BIKE_L"]

            if row["CompassA"] <= 270:
                primary_feature_degrees = row["CompassA"] + 90
            elif row["CompassA"] > 270:
                primary_feature_degrees = row["CompassA"] - 270
            else:
                primary_feature_degrees = "NA"

            if primary_feature_degrees == "NA":
                secondary_feature_degrees = "NA"
            elif primary_feature_degrees <= 180:
                secondary_feature_degrees = primary_feature_degrees + 180
            elif primary_feature_degrees > 180:
                secondary_feature_degrees = primary_feature_degrees - 180

    # if bike right does not have a facility
    elif (
        row["BIKE_L"] in bike_facility_rank_lookup.keys()
        and row["BIKE_R"] not in bike_facility_rank_lookup.keys()
    ):
        primary_feature = row["BIKE_L"]
        secondary_feature = "NA"
        secondary_feature_degrees = "NA"

        if row["CompassA"] <= 270:
            primary_feature_degrees = row["CompassA"] + 90
        elif row["CompassA"] > 270:
            primary_feature_degrees = row["CompassA"] - 270
        else:
            primary_feature_degrees = "NA"

    # if bike left does not have a facility
    elif (
        row["BIKE_R"] in bike_facility_rank_lookup.keys()
        and row["BIKE_L"] not in bike_facility_rank_lookup.keys()
    ):
        primary_feature = row["BIKE_R"]
        secondary_feature = "NA"
        secondary_feature_degrees = "NA"

        if row["CompassA"] <= 270:
            primary_feature_degrees = row["CompassA"] + 90
        elif row["CompassA"] > 270:
            primary_feature_degrees = row["CompassA"] - 270
        else:
            primary_feature_degrees = "NA"

    else:
        primary_feature = "NA"
        secondary_feature = "NA"
        primary_feature_degrees = "NA"
        secondary_feature_degrees = "NA"

    row["Facility1"] = bike_facility_name_lookup[primary_feature]
    row["Facility2"] = bike_facility_name_lookup[secondary_feature]
    row["Facility1_Side"] = determine_direction_from_angle(primary_feature_degrees)
    row["Facility2_Side"] = determine_direction_from_angle(secondary_feature_degrees)

    # -----------------------------------
    # Planned Bike Facilities
    # -----------------------------------

    # are facilities planned for both sides?
    if (
        row["BIKE_PLN_L"] in bike_facility_rank_lookup.keys()
        and row["BIKE_PLN_R"] in bike_facility_rank_lookup.keys()
    ):
        bl_rank = bike_facility_rank_lookup[row["BIKE_PLN_L"]]
        br_rank = bike_facility_rank_lookup[row["BIKE_PLN_R"]]

        # if bike_left's facility is better than bike_right's or they tie
        if (bl_rank < br_rank) or (bl_rank == br_rank):
            planned_primary_feature = row["BIKE_PLN_L"]
            planned_secondary_feature = row["BIKE_PLN_R"]

            if row["CompassA"] >= 90:
                planned_primary_feature_degrees = row["CompassA"] - 90
            elif row["CompassA"] < 90:
                planned_primary_feature_degrees = row["CompassA"] + 270
            else:
                planned_primary_feature_degrees = "NA"

            if planned_primary_feature_degrees == "NA":
                planned_secondary_feature_degrees = "NA"
            elif planned_primary_feature_degrees <= 180:
                planned_secondary_feature_degrees = (
                    planned_primary_feature_degrees + 180
                )
            elif planned_primary_feature_degrees > 180:
                planned_secondary_feature_degrees = (
                    planned_primary_feature_degrees - 180
                )

        # if bike_right's facility is better than bike_left's
        if br_rank < bl_rank:
            planned_primary_feature = row["BIKE_PLN_R"]
            planned_secondary_feature = row["BIKE_PLN_L"]

            if row["CompassA"] <= 270:
                planned_primary_feature_degrees = row["CompassA"] + 90
            elif row["CompassA"] > 270:
                planned_primary_feature_degrees = row["CompassA"] - 270
            else:
                planned_primary_feature_degrees = "NA"

            if planned_primary_feature_degrees == "NA":
                planned_secondary_feature_degrees = "NA"
            elif planned_primary_feature_degrees <= 180:
                planned_secondary_feature_degrees = (
                    planned_primary_feature_degrees + 180
                )
            elif planned_primary_feature_degrees > 180:
                planned_secondary_feature_degrees = (
                    planned_primary_feature_degrees - 180
                )

    # if a new facility is only planned for left
    elif (
        row["BIKE_PLN_L"] in bike_facility_rank_lookup.keys()
        and row["BIKE_PLN_R"] not in bike_facility_rank_lookup.keys()
    ):
        bl_rank = bike_facility_rank_lookup[row["BIKE_PLN_L"]]

        # is there an existing facility on bike right?
        if row["BIKE_R"] in bike_facility_rank_lookup.keys():
            br_rank = bike_facility_rank_lookup[row["BIKE_R"]]

            # if bike_left's facility is better than bike_right's or they tie
            if (bl_rank < br_rank) or (bl_rank == br_rank):
                planned_primary_feature = row["BIKE_PLN_L"]
                planned_secondary_feature = row["BIKE_R"]

                if row["CompassA"] >= 90:
                    planned_primary_feature_degrees = row["CompassA"] - 90
                elif row["CompassA"] < 90:
                    planned_primary_feature_degrees = row["CompassA"] + 270
                else:
                    planned_primary_feature_degrees = "NA"

                if planned_primary_feature_degrees == "NA":
                    planned_secondary_feature_degrees = "NA"
                elif planned_primary_feature_degrees <= 180:
                    planned_secondary_feature_degrees = (
                        planned_primary_feature_degrees + 180
                    )
                elif planned_primary_feature_degrees > 180:
                    planned_secondary_feature_degrees = (
                        planned_primary_feature_degrees - 180
                    )

            # if bike_right's facility is better than bike_left's
            if br_rank < bl_rank:
                planned_primary_feature = row["BIKE_R"]
                planned_secondary_feature = row["BIKE_PLN_L"]

                if row["CompassA"] <= 270:
                    planned_primary_feature_degrees = row["CompassA"] + 90
                elif row["CompassA"] > 270:
                    planned_primary_feature_degrees = row["CompassA"] - 270
                else:
                    planned_primary_feature_degrees = "NA"

                if planned_primary_feature_degrees == "NA":
                    planned_secondary_feature_degrees = "NA"
                elif planned_primary_feature_degrees <= 180:
                    planned_secondary_feature_degrees = (
                        planned_primary_feature_degrees + 180
                    )
                elif planned_primary_feature_degrees > 180:
                    planned_secondary_feature_degrees = (
                        planned_primary_feature_degrees - 180
                    )

        else:
            planned_primary_feature = row["BIKE_PLN_L"]
            if row["CompassA"] <= 270:
                planned_primary_feature_degrees = row["CompassA"] + 90
            if row["CompassA"] > 270:
                planned_primary_feature_degrees = row["CompassA"] - 270
            else:
                planned_primary_feature_degrees = "NA"

            planned_secondary_feature = "NA"
            planned_secondary_feature_degrees = "NA"

    # if a new facility is only planned for right
    elif (
        row["BIKE_PLN_R"] in bike_facility_rank_lookup.keys()
        and row["BIKE_PLN_L"] not in bike_facility_rank_lookup.keys()
    ):
        br_rank = bike_facility_rank_lookup[row["BIKE_PLN_R"]]

        # is there an existing facility on bike left?
        if row["BIKE_L"] in bike_facility_rank_lookup.keys():
            bl_rank = bike_facility_rank_lookup[row["BIKE_L"]]

            # if bike_left's facility is better than bike_right's or they tie
            if (bl_rank < br_rank) or (bl_rank == br_rank):
                planned_primary_feature = row["BIKE_L"]
                planned_secondary_feature = row["BIKE_PLN_R"]

                if row["CompassA"] >= 90:
                    planned_primary_feature_degrees = row["CompassA"] - 90
                if row["CompassA"] < 90:
                    planned_primary_feature_degrees = row["CompassA"] + 270

                if planned_primary_feature_degrees == "NA":
                    planned_secondary_feature_degrees = "NA"
                elif planned_primary_feature_degrees <= 180:
                    planned_secondary_feature_degrees = (
                        planned_primary_feature_degrees + 180
                    )
                elif planned_primary_feature_degrees > 180:
                    planned_secondary_feature_degrees = (
                        planned_primary_feature_degrees - 180
                    )

            # if bike_right's facility is better than bike_left's
            if br_rank < bl_rank:
                planned_primary_feature = row["BIKE_PLN_R"]
                planned_secondary_feature = row["BIKE_L"]

                if row["CompassA"] <= 270:
                    planned_primary_feature_degrees = row["CompassA"] + 90
                elif row["CompassA"] > 270:
                    planned_primary_feature_degrees = row["CompassA"] - 270
                else:
                    planned_primary_feature_degrees = "NA"

                if planned_primary_feature_degrees == "NA":
                    planned_secondary_feature_degrees = "NA"
                elif planned_primary_feature_degrees <= 180:
                    planned_secondary_feature_degrees = (
                        planned_primary_feature_degrees + 180
                    )
                elif planned_primary_feature_degrees > 180:
                    planned_secondary_feature_degrees = (
                        planned_primary_feature_degrees - 180
                    )
        else:
            planned_primary_feature = row["BIKE_PLN_R"]
            if row["CompassA"] <= 270:
                planned_primary_feature_degrees = row["CompassA"] + 90
            elif row["CompassA"] > 270:
                planned_primary_feature_degrees = row["CompassA"] - 270
            else:
                planned_primary_feature_degrees = "NA"

            planned_secondary_feature = "NA"
            planned_secondary_feature_degrees = "NA"
    else:
        planned_primary_feature = "NA"
        planned_secondary_feature = "NA"
        planned_primary_feature_degrees = "NA"
        planned_secondary_feature_degrees = "NA"

    row["PlannedFacility1"] = bike_facility_name_lookup[planned_primary_feature]
    row["PlannedFacility2"] = bike_facility_name_lookup[planned_secondary_feature]
    row["PlannedFacility1_Side"] = determine_direction_from_angle(
        planned_primary_feature_degrees
    )
    row["PlannedFacility2_Side"] = determine_direction_from_angle(
        planned_secondary_feature_degrees
    )

    return row


def calc_lts(row):
    # Calculate level of traffic stress adapted from

    local_roads = ["11", "12", "13", "14", "15", "16", "17", "18", "99"]
    major_roads = ["6", "8", "9", "10"]
    highways = ["1", "2", "3", "4", "5", "7"]

    cartocode = row["CARTOCODE"]
    aadt = row["AADT2023"]
    speed = row["SPEED_LMT"]

    if "Facility1" in row.index.tolist():
        facility_type = row["Facility1"]
    else:
        facility_type = row["PlannedFacility1"]

    # ==================
    # Trail & Pathway
    # ==================

    if facility_type in [
        "Trail or Pathway",
        "Parallel Bike Path, Paved (PP)",
        "Parallel Bike Path, Unpaved (PU)",
    ]:
        return 0

    # ==============
    # Cycle Track
    # ==============
    elif "1" in facility_type:
        # local roads
        if cartocode in local_roads:
            if aadt <= 2500:
                if speed <= 25:
                    return 0
                elif speed >= 30 and speed <= 35:
                    return 1
                elif speed >= 40 and speed <= 45:
                    return 2
                elif speed >= 50:
                    return 3
            elif aadt >= 2500:
                if speed <= 25:
                    return 1
                elif speed >= 30 and speed <= 35:
                    return 1
                elif speed >= 40 and speed <= 45:
                    return 2
                elif speed >= 50:
                    return 3
        # major roads
        elif cartocode in major_roads:
            if aadt <= 10000:
                if speed <= 25:
                    return 1
                elif speed >= 30 and speed <= 35:
                    return 2
                elif speed >= 40 and speed <= 45:
                    return 3
                elif speed >= 50:
                    return 3
            elif aadt >= 10000:
                if speed <= 25:
                    return 1
                elif speed >= 30 and speed <= 35:
                    return 2
                elif speed >= 40 and speed <= 45:
                    return 3
                elif speed >= 50:
                    return 3
        # highways
        elif cartocode in highways:
            if speed <= 25:
                return 2
            elif speed >= 30 and speed <= 35:
                return 3
            elif speed >= 40 and speed <= 45:
                return 4
            elif speed >= 50:
                return 4

    # ============
    # Bike Lane
    # ============
    elif "2" in facility_type:
        # local roads
        if cartocode in local_roads:
            if aadt <= 2500:
                if speed <= 25:
                    return 1
                elif speed >= 30 and speed <= 35:
                    return 2
                elif speed >= 40 and speed <= 45:
                    return 3
                elif speed >= 50:
                    return 3
            elif aadt >= 2500:
                if speed <= 25:
                    return 1
                elif speed >= 30 and speed <= 35:
                    return 2
                elif speed >= 40 and speed <= 45:
                    return 3
                elif speed >= 50:
                    return 4
        # major roads
        elif cartocode in major_roads:
            if aadt <= 10000:
                if speed <= 25:
                    return 1
                elif speed >= 30 and speed <= 35:
                    return 2
                elif speed >= 40 and speed <= 45:
                    return 3
                elif speed >= 50:
                    return 4
            elif aadt >= 10000:
                if speed <= 25:
                    return 2
                elif speed >= 30 and speed <= 35:
                    return 3
                elif speed >= 40 and speed <= 45:
                    return 4
                elif speed >= 50:
                    return 4
        # highways
        elif cartocode in highways:
            if speed <= 25:
                return 3
            elif speed >= 30 and speed <= 35:
                return 4
            elif speed >= 40 and speed <= 45:
                return 4
            elif speed >= 50:
                return 4

    # =============================
    # Shoulder & Shared Roadway
    # =============================
    elif "3" in facility_type:
        # local roads
        if cartocode in local_roads:
            if aadt <= 2500:
                if speed <= 25:
                    return 2
                elif speed >= 30 and speed <= 35:
                    return 2
                elif speed >= 40 and speed <= 45:
                    return 3
                elif speed >= 50:
                    return 4
            elif aadt >= 2500:
                if speed <= 25:
                    return 2
                elif speed >= 30 and speed <= 35:
                    return 3
                elif speed >= 40 and speed <= 45:
                    return 3
                elif speed >= 50:
                    return 4
        # major roads
        elif cartocode in major_roads:
            if aadt <= 5000:
                if speed <= 25:
                    return 2
                elif speed >= 30 and speed <= 35:
                    return 3
                elif speed >= 40 and speed <= 45:
                    return 4
                elif speed >= 50:
                    return 4
            elif aadt >= 5000:
                if speed <= 25:
                    return 3
                elif speed >= 30 and speed <= 35:
                    return 4
                elif speed >= 40 and speed <= 45:
                    return 4
                elif speed >= 50:
                    return 4
        # highways
        elif cartocode in highways:
            if speed <= 25:
                return 4
            elif speed >= 30 and speed <= 35:
                return 4
            elif speed >= 40 and speed <= 45:
                return 4
            elif speed >= 50:
                return 4

    # ==================
    # No Facility
    # ==================

    elif "Not Available" in facility_type:
        # local roads
        if cartocode in local_roads:
            if aadt <= 2500:
                if speed <= 25:
                    return 2
                elif speed >= 30 and speed <= 35:
                    return 3
                elif speed >= 40 and speed <= 45:
                    return 4
                elif speed >= 50:
                    return 4
            elif aadt >= 2500:
                if speed <= 25:
                    return 3
                elif speed >= 30 and speed <= 35:
                    return 3
                elif speed >= 40 and speed <= 45:
                    return 4
                elif speed >= 50:
                    return 4
        # major roads
        elif cartocode in major_roads:
            if aadt <= 5000:
                if speed <= 25:
                    return 3
                elif speed >= 30 and speed <= 35:
                    return 4
                elif speed >= 40 and speed <= 45:
                    return 4
                elif speed >= 50:
                    return 4
            elif aadt >= 5000:
                if speed <= 25:
                    return 4
                elif speed >= 30 and speed <= 35:
                    return 4
                elif speed >= 40 and speed <= 45:
                    return 4
                elif speed >= 50:
                    return 4
        # highways
        elif cartocode in highways:
            if speed <= 25:
                return 4
            elif speed >= 30 and speed <= 35:
                return 4
            elif speed >= 40 and speed <= 45:
                return 4
            elif speed >= 50:
                return 4


def zipdir(path, ziph, ext=None):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        if ext:
            files = [fi for fi in files if fi.endswith(ext)]

        for file in files:
            ziph.write(
                os.path.join(root, file),
                os.path.relpath(os.path.join(root, file), os.path.join(path, "..")),
            )


def process_data():
    import arcpy
    from arcpy import env

    arcpy.env.overwriteOutput = True
    arcpy.env.parallelProcessingFactor = "90%"

    # create output directories
    if not os.path.exists("Outputs"):
        os.makedirs("Outputs")

    print("--creating output directories")
    outputs = [
        ".\\Outputs",
        "scratch.gdb",
        "wfrc_bike_map_features.gdb",
        "wfrc_bike_map_planned_features.gdb",
    ]
    scratch_gdb = os.path.join(outputs[0], outputs[1])
    existing_features_gdb = os.path.join(outputs[0], outputs[2])
    planned_features_gdb = os.path.join(outputs[0], outputs[3])

    if not arcpy.Exists(scratch_gdb):
        arcpy.CreateFileGDB_management(outputs[0], outputs[1])

    if not arcpy.Exists(existing_features_gdb):
        arcpy.CreateFileGDB_management(outputs[0], outputs[2])

    if not arcpy.Exists(planned_features_gdb):
        arcpy.CreateFileGDB_management(outputs[0], outputs[3])

    # store paths to datasets
    roads = "https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/UtahRoads/FeatureServer/0"
    trails = "https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/TrailsAndPathways/FeatureServer/0"
    # roads = r'E:\Data\Transportation\Roads.gdb\Roads'
    # trails = r'E:\Data\Transportation\Trails_Pathways.gdb\TrailsAndPathways'
    aadt = r".\Inputs\AADT_Unrounded.shp"
    counties = r".\Inputs\Counties.shp"
    cities = r".\Inputs\Cities.shp"

    # pull down data layers from AGOL with predefined filter
    print("--retrieving data layers")
    # roads_lyr = arcpy.MakeFeatureLayer_management(roads, 'roads_lyr', where_clause=""" (((BIKE_L IS NOT NULL AND BIKE_L NOT IN ('', ' ')) OR (BIKE_R IS NOT NULL AND BIKE_R NOT IN ('', ' '))) OR ((BIKE_PLN_L IS NOT NULL AND BIKE_PLN_L NOT IN ('', ' ')) OR (BIKE_PLN_R IS NOT NULL AND BIKE_PLN_R NOT IN ('', ' ')))) """)

    roads_lyr = arcpy.MakeFeatureLayer_management(
        roads,
        "roads_lyr",
        where_clause="""(COUNTY_L IN ('49035', '49057', '49003', '49045', '49049') Or COUNTY_R IN ('49003', '49011', '49035', '49049', '49057', '49045')) And CARTOCODE NOT IN ('1', '7', '17', '16', '99')""",
    )
    trails_lyr = arcpy.MakeFeatureLayer_management(
        trails,
        "trails_lyr",
        where_clause="""(CartoCode IN ('3 - Paved Shared Use', '3 - Shared Use Path', '8 - Bridge, Tunnel')) And (Status NOT IN ('CLOSED', 'PROPOSED', 'UPGRADE'))""",
    )  # removed 9 - Link

    # filter the layers by the counties of interest
    arcpy.management.SelectLayerByLocation(roads_lyr, "INTERSECT", counties)
    arcpy.management.SelectLayerByLocation(trails_lyr, "INTERSECT", counties)

    # merge both roads and trails and add unique id
    print("--merging roads and trails")
    bike_features = arcpy.management.Merge(
        [trails_lyr, roads_lyr],
        output=os.path.join(scratch_gdb, "bike_features"),
        add_source="ADD_SOURCE_INFO",
    )
    arcpy.management.AddField(bike_features, "UID", "LONG")
    arcpy.management.CalculateField(bike_features, "UID", "!OBJECTID!", "PYTHON3")

    # Create AADT Buffer layer
    aadt_lyr = arcpy.MakeFeatureLayer_management(
        aadt, "aadt_lyr", where_clause=""" RT_Type <> 'State Route' """
    )
    aadt_buffer = arcpy.analysis.Buffer(
        aadt_lyr, os.path.join(scratch_gdb, "aadt_buffer"), "8 Feet", "FULL", "ROUND"
    )

    # ==============================
    # spatial join roads with AADT
    # ==============================

    target_features = bike_features
    join_features = aadt_buffer
    output_features = os.path.join(scratch_gdb, "aadt_spatial_join")

    fieldmappings = arcpy.FieldMappings()
    fieldmappings.addTable(target_features)
    fieldmappings.addTable(join_features)

    # AADT 2023
    fieldindex = fieldmappings.findFieldMapIndex("AADT2023")
    fieldmap = fieldmappings.getFieldMap(fieldindex)
    fieldmap.mergeRule = "Max"
    fieldmappings.replaceFieldMap(fieldindex, fieldmap)

    # run the spatial join, use 'Join_Count' for number of units
    sj = arcpy.SpatialJoin_analysis(
        target_features,
        join_features,
        output_features,
        "JOIN_ONE_TO_ONE",
        "KEEP_ALL",
        fieldmappings,
        "HAVE_THEIR_CENTER_IN",
    )
    aadt_sj_df = pd.DataFrame.spatial.from_featureclass(sj[0])[
        ["UID", "AADT2023"]
    ].copy()

    aadt_sj_df["AADT2023"] = aadt_sj_df["AADT2023"].fillna(-9999).astype("Int32")

    # ===================================
    # spatial join for cities attribute
    # ===================================

    target_features = bike_features
    join_features = cities
    output_features = os.path.join(scratch_gdb, "bf_cities_sj")
    fieldmappings = arcpy.FieldMappings()
    fieldmappings.addTable(target_features)
    fieldmappings.addTable(join_features)
    bf_cities_sj = arcpy.SpatialJoin_analysis(
        target_features,
        join_features,
        output_features,
        "JOIN_ONE_TO_ONE",
        "KEEP_ALL",
        fieldmappings,
        match_option="HAVE_THEIR_CENTER_IN",
    )
    bf_cities_sj_df = pd.DataFrame.spatial.from_featureclass(bf_cities_sj[0])[
        ["UID", "CITY"]
    ].copy()

    # =====================================
    # spatial join for counties attribute
    # =====================================

    target_features = bike_features
    join_features = counties
    output_features = os.path.join(scratch_gdb, "bf_counties_sj")
    fieldmappings = arcpy.FieldMappings()
    fieldmappings.addTable(target_features)
    fieldmappings.addTable(join_features)
    bf_counties_sj = arcpy.SpatialJoin_analysis(
        target_features,
        join_features,
        output_features,
        "JOIN_ONE_TO_ONE",
        "KEEP_ALL",
        fieldmappings,
        match_option="HAVE_THEIR_CENTER_IN",
    )
    bf_counties_sj_df = pd.DataFrame.spatial.from_featureclass(bf_counties_sj[0])[
        ["UID", "CNTY_NAME"]
    ].copy()
    bf_counties_sj_df.columns = ["UID", "COUNTY"]

    # ===================================
    # add directionality to line features
    # ===================================

    print("--computing directional mean")
    bf_dm = arcpy.stats.DirectionalMean(
        bike_features,
        os.path.join(scratch_gdb, "bike_features_directional_mean"),
        "DIRECTION",
        "UID",
    )
    bf_dm_df = pd.DataFrame.spatial.from_featureclass(bf_dm[0])[
        ["UID", "CompassA"]
    ].copy()

    # data formatting
    bike_features_df = pd.DataFrame.spatial.from_featureclass(bike_features[0])
    bf_all = (
        bike_features_df.merge(bf_dm_df, on="UID", how="left")
        .merge(bf_cities_sj_df, on="UID", how="left")
        .merge(bf_counties_sj_df, on="UID", how="left")
        .merge(aadt_sj_df, on="UID", how="left")
    )
    bf_all = bf_all[
        [
            "UID",
            "Status",
            "CartoCode",
            "FULLNAME",
            "PrimaryName",
            "BIKE_L",
            "BIKE_R",
            "BIKE_PLN_L",
            "BIKE_PLN_R",
            "MERGE_SRC",
            "SPEED_LMT",
            "AADT2023",
            "CompassA",
            "CITY",
            "COUNTY",
            "GlobalID",
            "SHAPE",
        ]
    ]
    bf_all.loc[
        (bf_all["MERGE_SRC"] == "trails_lyr")
        & (bf_all["Status"].isin(["Future", "Proposed", "PROPOSED"]) == False),
        "BIKE_L",
    ] = "TrPw"
    bf_all.loc[
        (bf_all["MERGE_SRC"] == "trails_lyr")
        & (bf_all["Status"].isin(["Future", "Proposed", "PROPOSED"]) == False),
        "BIKE_R",
    ] = "TrPw"

    # planned trails
    bf_all.loc[
        (bf_all["MERGE_SRC"] == "trails_lyr")
        & (bf_all["Status"].isin(["Future", "Proposed", "PROPOSED"]) == True),
        "BIKE_PLN_L",
    ] = "TrPw"
    bf_all.loc[
        (bf_all["MERGE_SRC"] == "trails_lyr")
        & (bf_all["Status"].isin(["Future", "Proposed", "PROPOSED"]) == True),
        "BIKE_PLN_R",
    ] = "TrPw"

    # create source field
    bf_all.loc[bf_all["MERGE_SRC"].isin(["roads_lyr"]) == True, "SOURCE"] = "Utah Roads"
    bf_all.loc[bf_all["MERGE_SRC"].isin(["trails_lyr"]) == True, "SOURCE"] = (
        "Trails Pathways"
    )

    # transfer name field
    bf_all.loc[bf_all["MERGE_SRC"].isin(["roads_lyr"]) == True, "NAME"] = bf_all[
        "FULLNAME"
    ]
    bf_all.loc[bf_all["MERGE_SRC"].isin(["trails_lyr"]) == True, "NAME"] = bf_all[
        "PrimaryName"
    ]

    # determine the bike feature order and side
    print("--determining primary bike feature and side")
    bf_all = bf_all[bf_all["CompassA"].isnull() != True]  # get rid of circles
    bf_all_processed = bf_all.apply(determine_primary_bike_feature_and_side, axis=1)

    # data formatting, split existing and planned features
    bf_all_processed.rename(
        {"CartoCode": "CARTOCODE", "GlobalID": "SOURCE_ID"}, axis=1, inplace=True
    )
    bf_all_processed["NOTES"] = np.nan
    bf_all_processed.spatial.to_featureclass(
        location=os.path.join(scratch_gdb, "bf_all_processed"), sanitize_columns=False
    )

    planned_bf = bf_all_processed[
        (bf_all_processed["PlannedFacility1"] != "Not Available")
        & (bf_all_processed["PlannedFacility2"] != "Not Available")
    ].copy()
    existing_bf = bf_all_processed.copy()

    existing_bf.drop(
        [
            "PlannedFacility1",
            "PlannedFacility2",
            "PlannedFacility1_Side",
            "PlannedFacility2_Side",
        ],
        axis=1,
        inplace=True,
    )
    planned_bf.drop(
        ["Facility1", "Facility2", "Facility1_Side", "Facility2_Side"],
        axis=1,
        inplace=True,
    )

    # calculate level of traffic stress
    existing_bf["LTS_SCORE"] = existing_bf.apply(calc_lts, axis=1)
    planned_bf["LTS_SCORE"] = planned_bf.apply(calc_lts, axis=1)

    lts_codes = {
        0: "0: All ages and abilities",
        1: "1: Almost everyone",
        2: "2: Interested but concerned",
        3: "3: Enthused and confident",
        4: "4: Strong and fearless",
    }

    existing_bf["LTS_SCORE"] = existing_bf["LTS_SCORE"].map(lts_codes)
    planned_bf["LTS_SCORE"] = planned_bf["LTS_SCORE"].map(lts_codes)

    # planned_bf.spatial.to_featureclass(location=os.path.join(scratch_gdb, 'draft_planned_bike_features'), sanitize_columns=False)
    # existing_bf.spatial.to_featureclass(location=os.path.join(scratch_gdb, 'draft_bike_features'), sanitize_columns=False)

    planned_bf = planned_bf[
        [
            "UID",
            "CITY",
            "COUNTY",
            "NAME",
            "PlannedFacility1",
            "PlannedFacility2",
            "PlannedFacility1_Side",
            "PlannedFacility2_Side",
            "LTS_SCORE",
            "NOTES",
            "CARTOCODE",
            "SOURCE",
            "SOURCE_ID",
            "SHAPE",
        ]
    ].copy()
    existing_bf = existing_bf[
        [
            "UID",
            "CITY",
            "COUNTY",
            "NAME",
            "Facility1",
            "Facility2",
            "Facility1_Side",
            "Facility2_Side",
            "LTS_SCORE",
            "NOTES",
            "CARTOCODE",
            "SOURCE",
            "SOURCE_ID",
            "SHAPE",
        ]
    ].copy()

    # export as geodatabase feature class
    print("--exporting data layers")
    existing_bf.spatial.to_featureclass(
        location=os.path.join(scratch_gdb, "bike_features_before_dissolve"),
        sanitize_columns=False,
    )
    planned_bf.spatial.to_featureclass(
        location=os.path.join(scratch_gdb, "planned_bike_features_before_dissolve"),
        sanitize_columns=False,
    )

    # dissolve common links
    arcpy.management.Dissolve(
        in_features=os.path.join(scratch_gdb, "bike_features_before_dissolve"),
        out_feature_class=os.path.join(existing_features_gdb, "bike_features"),
        dissolve_field="CITY;COUNTY;NAME;Facility1;Facility2;Facility1_Side;Facility2_Side;LTS_SCORE;CARTOCODE;NOTES;SOURCE",
        # statistics_fields=[['SOURCE_ID','CONCATENATE']],
        multi_part="SINGLE_PART",
        unsplit_lines="UNSPLIT_LINES",
        # concatenation_separator=";"
    )

    # arcpy.management.AddField(os.path.join(existing_features_gdb, 'bike_features'), 'SOURCE_ID', "TEXT")
    # arcpy.management.CalculateField(os.path.join(existing_features_gdb, 'bike_features'), "SOURCE_ID", '!CONCATENATE_SOURCE_ID!', "PYTHON3")

    arcpy.management.Dissolve(
        in_features=os.path.join(scratch_gdb, "planned_bike_features_before_dissolve"),
        out_feature_class=os.path.join(planned_features_gdb, "planned_bike_features"),
        dissolve_field="CITY;COUNTY;NAME;PlannedFacility1;PlannedFacility2;PlannedFacility1_Side;PlannedFacility2_Side;LTS_SCORE;CARTOCODE;NOTES;SOURCE",
        # statistics_fields=[['SOURCE_ID','CONCATENATE']],
        multi_part="SINGLE_PART",
        unsplit_lines="UNSPLIT_LINES",
        # concatenation_separator=";"
    )

    # arcpy.management.AddField(os.path.join(existing_features_gdb, 'planned_bike_features'), 'SOURCE_ID', "TEXT")
    # arcpy.management.CalculateField(os.path.join(existing_features_gdb, 'planned_bike_features'), "SOURCE_ID", '!CONCATENATE_SOURCE_ID!', "PYTHON3")

    del planned_bf
    del existing_bf
    del planned_features_gdb
    del existing_features_gdb

    # Restart the script to zip the GDBs in a new process
    # os.execv(sys.executable, [sys.executable] + sys.argv + ["zip"])
    subprocess.Popen([sys.executable] + sys.argv + ["zip"], close_fds=True)
    sys.exit()


def zip_gdb():
    # zip the files up for AGOL
    print("--begin zipping outputs")
    outputs = [
        ".\\Outputs",
        "scratch.gdb",
        "wfrc_bike_map_features.gdb",
        "wfrc_bike_map_planned_features.gdb",
    ]
    existing_features_gdb = os.path.join(outputs[0], outputs[2])
    planned_features_gdb = os.path.join(outputs[0], outputs[3])
    planned_zip_name = os.path.join(
        outputs[0], "wfrc_bike_map_planned_features.gdb.zip"
    )
    existing_zip_name = os.path.join(outputs[0], "wfrc_bike_map_features.gdb.zip")

    # delete existing zip files
    if os.path.exists(planned_zip_name):
        os.remove(planned_zip_name)
    if os.path.exists(existing_zip_name):
        os.remove(existing_zip_name)

    with zipfile.ZipFile(planned_zip_name, "w", zipfile.ZIP_DEFLATED) as planned_zip:
        zipdir(planned_features_gdb, planned_zip)

    with zipfile.ZipFile(existing_zip_name, "w", zipfile.ZIP_DEFLATED) as existing_zip:
        zipdir(existing_features_gdb, existing_zip)

    print("--finished zipping outputs")


# runs the processing script first, then exits to release locks on files, then relaunches to zip the files
if len(sys.argv) > 1 and sys.argv[1] == "zip":
    zip_gdb()
    print("--scripts finished")
else:
    print("--begin script")
    process_data()
