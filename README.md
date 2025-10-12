# grizzl.io

## Development (Linux)
Requirements: git, docker

1. You only need to do this step if your user:group IDs aren't 1000:1000. Add these lines to your `~/.bashrc` or `~/.zshrc` depending on the shell you're using:
   ```
   export DOCKER_USER_ID=$(id -u)
   export DOCKER_GROUP_ID=$(id -g)
   ```
   The above is just for convenience when starting the containers. You can also set these values manually.
2. Clone the repository and start a new shell inside of it.
3. Make sure localhost:80 is free and run `bin/start`.
4. The project should now be running on `http://grizzl.localhost`.
5. To shut down the project, simply run `bin/stop`.

If you are wondering, why the project uses the TLD `.localhost` and not something like `.test` or `.dev`, read 
[RFC 2606 section 2](https://www.rfc-editor.org/rfc/rfc2606#section-2) and 
[RFC 6761 section 6.3](https://www.rfc-editor.org/rfc/rfc6761#section-6.3). The long and short of it is that with real 
TLDs like `.dev` you will run into issues with HSTS. That's why the TLDs `.test`, `.example`, `.invalid` and 
`.localhost` are reserved for development purposes. This project uses `.localhost` because it automatically points to 
the loop back IP address. In practice this means, you don't have to create an entry inside the `/etc/hosts`, so it's 
just one step less to get the project running.

### Shell Scripts
The project comes with some shell scripts as shortcuts for common commands in this project. If you want details on any
command, just check the respective file in `bin`. Here's an explanation of what each command does:
- `backup`: (Production Only) Extracts and unzips backups from the database backup container.
- `e2e`: Starts a Playwright docker container in UI mode. To start headless mode pass `headless` as the first parameter.
   Start the project before envoking this command. You can pass any Playwright flags to this command as well.
- `generate`: Generates a new migration from the schemas in `lib/db/schemas` and puts it in `lib/db/migrations`
- `logs`: View the logs of any container. Provide the service name of the container as the first argument. The second
   argument is optional and specifies the amount of lines from the logs you want to see.
- `migrate`: Applies migrations from `lib/db/migrations` to the database.
- `proxy`: (Production Only) Creates the `proxy_net` network used to connect the production container to a reverse proxy.
- `purge`: Deletes ALL docker containers, images, volumes, and networks (expect built-in ones).
- `restart`: Calls `stop` and then `start`.
- `start`: Deletes all volumes, starts the project in dev mode and applies migrations.
- `start-prod`: Sets up the `proxy_net` network and starts the project in production mode (Only for testing purposes).
- `stop`: Stops all docker containers in the project if started with `start`
- `stop-prod`: Stops all docker containers in the project if started with `start-prod`
- `typecheck`: Runs a typecheck via the webserver container.
- `unit`: Runs the unit tests with vitest.

### E2E Tests (Playwright)
E2E tests are written with Playwright and TypeScript. To start the Playwright UI, use can use the provided shell script
`bin/e2e`. For UI mode to work, you might have to add this to your `~/.bashrc` first: `xhost +local:docker`.

### Database
In order to connect to the database you can use the postgres container's IP address.
You can get that from `docker network inspect grizzlio_default`. The database port is not exposed
to localhost because this project is only using port 80 to make development easier if you have other
things running on localhost.

### Adding Languages
To extend the app with another language, you have to provide all translations files located at `i18n/locales` for
the locale of your language. You also have to extend the `locales` constant located in the `i18n/locales.ts` file. 
That's it! Your new language should now be available.



## Production
To set up the app for production, you need get a proxy going that listens to the relevant http(s) ports and redirects
traffic to the docker containers. This is best done through the `proxy_net` docker network that is used by the
containers in `compose.production.yml`. You can keep the necessary configuration for this in your own separate repo.

### Database
In production the website creates a nightly backup of the database. You can use the `bin/backup` command to extract and
unzip all backups from the docker volume. You can then use `bin/restore <database_name> <username> <path_to_sql_file>`
to take one of these backups and override the current database state.