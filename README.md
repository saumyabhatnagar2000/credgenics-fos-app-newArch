# Credgenics FOS App

## Getting started
  1. **Fork** the git repo first and clone it on your local system.
  2. Install all the javascript packages using `yarn install`
  3. Run the server on localhost using `yarn start`
## Contribution Guidelines
  We would love your contributions to this project. please follow the below guidelines to contibute to this project.
  **Code Formatter** : `eslint and prettier`

   1. Please create a JIRA ticket for anything you are working on OR want to work on related to this project.
   2. Always create a new branch for every JIRA ticket example `git branch P4-123`.
   3. Commit message style :
      ```
      P4-123 | what you did in 50chars.

      description of the commit
      ```
      Example :
      ```
      P4-123 | Add RCA headers

      Added RCA headers for api routes
      ```
   4. After that raise a PR to the develop branch or required branch only from this JIRA ticket branch.
   5. Ask a peer for a PR review and if any changes or suggestion implement them and push to the same branch on your fork.
### `1 JIRA ticket = 1 GIT branch = 1 Commit`
So you can have multiple commits related to the JIRA ticket on the corresponding branch but when this PR is merged with the target branch it needs to be only `1 Commit` to keep the git history clean.
