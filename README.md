# grizzl.io

## Starting the Project for Development (Linux)
1. Install Docker in case you haven't yet
2. Add these lines to your .bashrc (usually located at ~/.bashrc):
    ```
    export DOCKER_USER_ID=$(id -u)
    export DOCKER_GROUP_ID=$(id -g)
    ```
    If you prefer to use a different shell, you might have to edit a different file.
    The above is just for convenience when starting the containers. How can also set these values manually.
3. Clone the repo and open a shell inside it
4. Run `docker compose up`
5. The project should now be running and reachable under `localhost:3000`. For it to work make sure the relevant ports
   aren't already in use. Check the ports in the compose file if you are unsure.