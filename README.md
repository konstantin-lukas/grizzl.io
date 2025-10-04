# grizzl.io

## Development Setup (Linux)
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
- `start`: Starts all necessary docker containers for development
- `stop`: Stops all docker containers in the project
- `restart`: Calls `stop` and then `start`.
- `e2e`: Starts a Playwright docker container in UI mode. To start headless mode pass `headless` as the first parameter.
  Start the project before envoking this command. You can pass any Playwright flags to this command as well.

### E2E Tests (Playwright)
E2E tests are written with Playwright and TypeScript. To start the Playwright UI, use can use the provided shell script
`bin/e2e`. For UI mode to work, you might have to add this to your `~/.bashrc` first: `xhost +local:docker`.

## Adding Languages
To extend the app with another language, you have to provide all translations files located at `src/dictionary` for
the locale of your language. You also have to extend the `LANGUAGES` constant located at `src/const/i18n.ts` with the
locale of your language as key and the name of your language in that language as value. That's it! Your new language
should now be available.