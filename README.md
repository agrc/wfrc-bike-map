# WFRC Bike Map

## Mockups & Design

[Architecture Diagram](https://docs.google.com/presentation/d/1Qkbl3NFZnzbS-L1Wifedvun4SQVMqNHA9gEgAG6-988/edit#slide=id.p)

[Mockups](https://docs.google.com/presentation/d/1FZjX4FpiWq74R5NJUhI3lR-AuOMo_z28XR0BxEGwxEQ/edit#slide=id.p)

## Development Environment

### Set Up

1. Install [Node.js](https://nodejs.org/en/download/)
1. Clone this repository `git clone https://github.com/agrc/wfrc-bike-map`
1. Change to the directory `cd wfrc-bike-map`
1. Install the dependencies `npm install`
1. Switch to `dev` branch `git switch dev`
1. Create a new branch `git switch -c feature/your-feature-name` or `git switch -c fix/your-bug-name`

### Run

Execute `npm start` to start a web server and view the website

Run `npm test` to run the unit tests

Run `npm run format` to format the code

Run `npm run lint` to lint the code

### Pull Request

Make commits following the [Angular Conventional Commits Format](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format). This will allow the automated change log to work correctly.

Once you have committed your updates, push your branch to GitHub and create a pull request against the `dev` branch. This will trigger a GitHub Action to run the tests and linting and deploy your version to a firebase preview channel for review.

## Deploy

One-time tasks:

- [ ] Update the analytics code in `index.html`

This website is tested and deployed with GitHub Actions.
