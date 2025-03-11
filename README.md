# WFRC Bike Map

## Mockups & Design

[Architecture Diagram](https://docs.google.com/presentation/d/1Qkbl3NFZnzbS-L1Wifedvun4SQVMqNHA9gEgAG6-988/edit#slide=id.p)

[Mockups](https://docs.google.com/presentation/d/1FZjX4FpiWq74R5NJUhI3lR-AuOMo_z28XR0BxEGwxEQ/edit#slide=id.p)

## Development Environment

### Set Up

1. Install [Node.js](https://nodejs.org/en/download/)
1. Clone this repository `git clone https://github.com/agrc/wfrc-bike-map`
1. Change to the directory `cd wfrc-bike-map`
1. Install the dependencies `pnpm install`
1. Switch to `dev` branch `git switch dev`
1. Create a new branch `git switch -c feature/your-feature-name` or `git switch -c fix/your-bug-name`

### Run

Execute `pnpm start` to start a web server and view the website

Run `pnpm test` to run the unit tests

Run `pnpm run format` to format the code

Run `pnpm run lint` to lint the code

### Pull Request

Make commits following the [Angular Conventional Commits Format](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format). This will allow the automated change log to work correctly.

Once you have committed your updates, push your branch to GitHub and create a pull request against the `dev` branch. This will trigger a GitHub Action to run the tests and linting and deploy your version to a firebase preview channel for review.

## Deploy

One-time tasks:

- [ ] Update the analytics code in `index.html`

This website is tested and deployed with GitHub Actions.

## Remote Configs

This app is configurable via [Firebase Remote Configs](https://firebase.google.com/docs/remote-config). This allows admins to update various parts of the application without having to deploy a new build.

[Dev Configs](https://console.firebase.google.com/project/ut-dts-agrc-wfrc-bike-map-dev/config/env/firebase)
[Prod Configs](https://console.firebase.google.com/project/ut-dts-agrc-wfrc-bike-map-prod/config/env/firebase)

Once any changes are published, the values should be reflected in the corresponding application environment within 60 seconds.

If you add a new config, make sure to run `pnpm run download-configs:dev` so that you have the necessary default values during development. This is done automatically in CI.

[!NOTE]
JSON values can only contain a single level object. Nested objects are not supported by the react context component in this app at the moment.
