# WFRC Bike Map

## Mockups & Design

[Architecture Diagram](https://docs.google.com/presentation/d/1Qkbl3NFZnzbS-L1Wifedvun4SQVMqNHA9gEgAG6-988/edit#slide=id.p)

[Mockups](https://docs.google.com/presentation/d/1FZjX4FpiWq74R5NJUhI3lR-AuOMo_z28XR0BxEGwxEQ/edit#slide=id.p)

## Development Environment

### Set Up

1. Install app dependencies `pnpm install`
1. Duplicate `functions/.secrets.local.sample` as `.secrets.local` and fill in the values.
1. Duplicate `functions/.env.sample` as `.env.local` and fill in the values.

## Deploy

This website is tested and deployed with GitHub Actions.

## Remote Configs

This app is configurable via [Firebase Remote Configs](https://firebase.google.com/docs/remote-config). This allows admins to update various parts of the application without having to deploy a new build.

[Dev Configs](https://console.firebase.google.com/project/ut-dts-agrc-wfrc-bike-map-dev/config/env/firebase)
[Prod Configs](https://console.firebase.google.com/project/ut-dts-agrc-wfrc-bike-map-prod/config/env/firebase)

Once any changes are published, the values should be reflected in the corresponding application environment within 60 seconds.

If you add a new config, make sure to run `pnpm run download-configs:dev` so that you have the necessary default values during development. This is done automatically in CI.

> [!NOTE]
> JSON values can only contain a single level object. Nested objects are not supported by the react context component in this app at the moment.

## Feedback

User feedback is stored in the following feature services:

- [Bikeways Feedback Points](https://utah.maps.arcgis.com/home/item.html?id=bc422cc920274012a65b4aada8120edc)
- [Bikeways Feedback Lines](https://utah.maps.arcgis.com/home/item.html?id=b4605494496b4e9d95d160d8442f9522)
- [Bikeways Feedback Points (Staging)](https://utah.maps.arcgis.com/home/item.html?id=14314a0df775464689f2712209039b0b)
- [Bikeways Feedback Lines (Staging)](https://utah.maps.arcgis.com/home/item.html?id=9c9d5c765a1b4747ba542ca6f232aa5e)

Feedback emails are sent to the following Google group: `gcp-dts-ugrc-wfrc-admins@utah.gov`

## Attribution

This project was developed with the assistance of [GitHub Copilot](https://github.com/features/copilot).
