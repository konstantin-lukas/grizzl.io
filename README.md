# grizzl.io

## Development
Requirements: 
- git
- docker
- a text editor of your choosing

### Initial Setup (Linux)
1. Clone the repository
2. Add these lines to your `~/.bashrc` or `~/.zshrc` depending on the shell you're using:
   ```
   export DOCKER_USER_ID=$(id -u)
   export DOCKER_GROUP_ID=$(id -g)
   ```
   The above is just for convenience when starting the containers. You can also set these values manually.

### Starting The Project Locally
Before you can start the project, make sure you have done the [setup](#initial-setup-linux) first. 
To start the project:
1. Start a new shell inside the repository and run `docker compose up -d`.
2. The project should now be running on `http://grizzl.localhost`.
3. To shut down the project, simply run docker compose down inside the project directory.

If you are wondering, why the project uses the TLD `.localhost` and not something like `.test` or `.dev`, read 
[this](https://www.rfc-editor.org/rfc/rfc2606#section-2). The long and short of it is that with real TLDs like `.dev` 
you will run into issues with HSTS. That's why the TLDs `.test`, `.example`, `.invalid` and `.localhost` are reserved 
for development purposes. This project uses `.localhost` because it automatically points to the loop back IP address. In
practice this means, you don't have to create an entry inside the `/etc/hosts`, so it's just one step less to get the 
project running. If, for some reason, `.localhost` is not working on your system, add this to your hosts: 
`127.0.0.1 grizzl.localhost`.