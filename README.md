<div align="center">

   <br>
   <br>

   <picture>
       <source media="(prefers-color-scheme: dark)" srcset="app/assets/svg/grizzl_logo_with_text_white.svg">
       <source media="(prefers-color-scheme: light)" srcset="app/assets/svg/grizzl_logo_with_text_black.svg">
       <img src="app/assets/svg/grizzl_logo_with_text_black.svg" alt="Grizzl Logo" width="50%" height="50%">
   </picture>

   <br>
   <br>

   <p>
      Grizzl is your all-in-one companion for everyday productivity. Effortlessly manage your finances, share polls with 
      friends, and stay on track with customizable workout timers. Available on the web and mobile—start simplifying your 
      life with Grizzl today.
   </p>

   [![Version](https://img.shields.io/github/v/release/konstantin-lukas/grizzl.io)](https://github.com/konstantin-lukas/grizzl.io/releases)
   [![Release Date](https://img.shields.io/github/release-date/konstantin-lukas/grizzl.io)](https://github.com/konstantin-lukas/grizzl.io/releases)
   [![Codecov](https://codecov.io/gh/konstantin-lukas/grizzl.io/graph/badge.svg?token=11ACXCKETJ)](https://codecov.io/gh/konstantin-lukas/grizzl.io)
   [![Issues](https://img.shields.io/github/issues/konstantin-lukas/grizzl.io)](https://github.com/konstantin-lukas/grizzl.io/issues)
   [![Monitoring](https://img.shields.io/website?url=https%3A%2F%2Fgrizzl.io)](https://grizzl.io)
   [![MIT License](https://img.shields.io/github/license/konstantin-lukas/grizzl.io)](https://raw.githubusercontent.com/konstantin-lukas/grizzl.io/main/LICENSE)

</div>

# Development (Linux)
Requirements: git, docker

1. You only need to do this step if your user:group IDs aren't 1000:1000. Add these lines to your `~/.bashrc` or `~/.zshrc` depending on the shell you're using:
   ```
   export DOCKER_USER_ID=$(id -u)
   export DOCKER_GROUP_ID=$(id -g)
   ```
   The above is just for convenience when starting the containers. You can also set these values manually.
2. Clone the repository and start a new shell inside of it.
3. Make sure localhost:80 and localhost:5432 are free and run `bin/start`.
4. The project should now be running on `http://grizzl.localhost`.
5. To shut down the project, simply run `bin/stop`.

If you are wondering, why the project uses the TLD `.localhost` and not something like `.test` or `.dev`, read 
[RFC 2606 section 2](https://www.rfc-editor.org/rfc/rfc2606#section-2) and 
[RFC 6761 section 6.3](https://www.rfc-editor.org/rfc/rfc6761#section-6.3). The long and short of it is that with real 
TLDs like `.dev` you will run into issues with HSTS. That's why the TLDs `.test`, `.example`, `.invalid` and 
`.localhost` are reserved for development purposes. This project uses `.localhost` because it automatically points to 
the loop back IP address. In practice this means, you don't have to create an entry inside the `/etc/hosts`, so it's 
just one step less to get the project running.

## Tests
This project is very thoroughly tested. There are roughly five types of tests in this project:
1. Unit tests for utilities (located at tests/unit)
2. Unit tests for composables (located at tests/nuxt/composables)
3. Unit tests for components (located at tests/nuxt/components)
4. Functional tests for the API (located at tests/e2e/spec/api)
5. End-to-end test to simulate user interactions (located at tests/e2e)

## Shell Scripts
The project comes with some shell scripts as shortcuts for common commands in this project. If you want details on any
command, just check the respective file in `bin`. Here's an explanation of what each command does:
- `backup`: (Production Only) Extracts and unzips backups from the database backup container.
- `e2e`: Starts a Playwright docker container in UI mode. To start headless mode pass `headless` as the first parameter.
   Start the project before envoking this command. You can pass any Playwright flags to this command as well.
- `unit`: Runs the unit tests with vitest.
- `components`: Runs component tests with vitest.
- `composables`: Runs composable tests with vitest.
- `generate`: Generates a new migration from the schemas in `lib/db/schemas` and puts it in `lib/db/migrations`
- `logs`: View the logs of any container. Provide the service name of the container as the first argument. The second
   argument is optional and specifies the amount of lines from the logs you want to see.
- `migrate`: Applies migrations from `lib/db/migrations` to the database.
- `proxy`: (Production Only) Creates the `proxy_net` network used to connect the production container to a reverse proxy.
- `purge`: Deletes ALL docker containers, images, volumes, and networks (expect built-in ones).
- `restart`: Calls `stop` and then `start` with the given parameters.
- `start`: Starts the project in the specified mode for local operation. Can be `dev`, `test`, or `prod`. Defaults to `dev`.
- `stop`: Stops all docker containers in the project.
- `typecheck`: Runs a typecheck via the webserver container.

## E2E Tests (Playwright)
E2E tests are written with Playwright and TypeScript. To start the Playwright UI, use can use the provided shell script
`bin/e2e`. The UI will then be available in your browser under playwright.grizzl.localhost. If you update or add 
screenshots, always start the project with `bin/start test` before running tests with `bin/snapshots`. This makes sure 
screenshots are generated from the same build used in the CI pipeline.

## Database
You can connect to the database via `localhost:5432`. The database name is `grizzl`. You can connect as the postgres 
user with the username and password `admin`.

## Adding Languages
To extend the app with another language, you have to provide all translations files located at `i18n/locales` for
the locale of your language. You also have to extend the `languages` constant located in the `shared/constants/i18n.ts` file. 
That's it! Your new language should now be available.



# Deployment
The following describes the deployment process for this specific repository. A deployment pipeline is triggered
whenever a new tag matching the pattern `v[0-9]+.[0-9]+.[0-9]+` is pushed. However, you should not do this manually.
Instead, this repository uses the Release Please action by Google. 
[Release Please](https://github.com/googleapis/release-please) maintains a release PR whenever there are new commits 
on the main branch that start with `fix[optional scope]:`, `feat[optional scope]:`, or `<type>[optional scope]!:` 
(see [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)). If any of these are present in a commit
message since the last release, they will trigger the creation or update of a release PR, resulting in a bugfix, minor,
or major version bump respectively. When you are ready to release a new version, merge the release PR. This will create 
a new tag and trigger the deployment pipeline. This will not trigger a new CI pipeline because the release PR already
requires passing all checks before it can be merged. Note that all deployments have to be approved manually by the
repository owner.

## Personal Access Token
For Google's Release Please action to be able to create new releases, you need to create a personal access token. This
token is set to expire after a set time. So, it will have to be updated regularly in the 
[personal access tokens section](https://github.com/settings/personal-access-tokens) of your account settings.
Give the new token only access to this repository and give it exactly these permissions:
- Contents (read and write)
- Issues (read and write)
- Pull requests (read and write)

Then, in the repository settings, go to the 
[Secrets and Variables section](https://github.com/konstantin-lukas/grizzl.io/settings/secrets/actions) and update the 
`RELEASE_PLEASE_TOKEN` secret with the new token.



# Production (for Self-Hosting)
To set up the app for production, you need get a proxy going that listens to the relevant http(s) ports and redirects
traffic to the docker containers. This is best done through the `proxy_net` docker network that is used by the
containers in `compose.production.yml`. You can keep the necessary configuration for this in your own separate repo.

## Database
In production the website creates a nightly backup of the database. You can use the `bin/backup` command to extract and
unzip all backups from the docker volume. You can then use `bin/restore <database_name> <username> <path_to_sql_file>`
to take one of these backups and override the current database state.

## Environment Variables
In production, the `.env` file is ignored. Instead, environment are passed via docker compose. You need to specify which
variables to pass to each container separately. And for docker compose to receive environment variables from GitHub
actions, you need to adjust `.github/workflows/cd.yml`. Also, if you want to use an environment variable in the Nuxt
part of the application, use the [runtime config](https://nuxt.com/docs/4.x/guide/going-further/runtime-config)
and override the value of the config through correctly named env vars.