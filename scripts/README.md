# Running the update-bikeways.py script

Create new conda environment and install dependencies:

```bash
conda create -n bikeways python=3.11
conda activate bikeways
conda install arcpy -c esri
pip install -r requirements.txt
```

Run the script without arguments to see the usage:

```bash
python update-bikeways.py
```
