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
3. Make sure localhost:80 is free and run `docker compose up -d`.
4. The project should now be running on `http://grizzl.localhost`.
5. To shut down the project, simply run `docker compose down`.

If you are wondering, why the project uses the TLD `.localhost` and not something like `.test` or `.dev`, read 
[RFC 2606 section 2](https://www.rfc-editor.org/rfc/rfc2606#section-2) and 
[RFC 6761 section 6.3](https://www.rfc-editor.org/rfc/rfc6761#section-6.3). The long and short of it is that with real 
TLDs like `.dev` you will run into issues with HSTS. That's why the TLDs `.test`, `.example`, `.invalid` and 
`.localhost` are reserved for development purposes. This project uses `.localhost` because it automatically points to 
the loop back IP address. In practice this means, you don't have to create an entry inside the `/etc/hosts`, so it's 
just one step less to get the project running.

### E2E Tests
E2E tests are written with Playwright and TypeScript. To start the Playwright UI, use can use the provided shell script
`bin/e2e`. For UI mode to work, you might have to add this to your `~/.bashrc` first: `xhost +local:docker`.