# RUNBOOK

This runbook documents how to operate the Jira Agent Mode app in this repository.

## Running the CI/CD pipeline

- Navigate to the **Actions** tab of this repo in GitHub.
- Select the **Forge CI/CD** workflow and click **Run workflow** (or wait for a push on `main`).
- The pipeline deploys and installs the Forge app on both Confluence and Jira using the secrets configured in GitHub.

## Atlassian credentials

The CI/CD workflow uses the following secrets (defined in GitHub repo settings):
- `FORGE_EMAIL`: your Atlassian email address.
- `FORGE_API_TOKEN`: API token for Forge CLI.
- `ATLASSIAN_SITE`: the Atlassian site domain (e.g. jiraagentmode.atlassian.net).

For manual testing via the UI, log in to Confluence using:
- Email: `ahmed.m.m.abdellatif@hotmail.com`
- Password: (see credentials provided outside this repo).

## Testing the macro

1. Open the Confluence test page at the URL in `STATUS.md`.
2. Edit the page, insert the **Jira Issues Clone** macro via `/` command.
3. Configure the macro with your JQL and max results as described in `STATUS.md`.
4. Publish and verify the output.
