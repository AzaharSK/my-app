# Development Container for BrightCoreLabs

This directory contains configuration files for setting up a development environment using VS Code's "Dev Containers" extension.

## Features

- Full Node.js 20 development environment
- PostgreSQL database pre-configured and ready to use
- All necessary extensions pre-installed
- Development server automatically starts on container launch
- Docker-in-Docker capability for container management

## Usage

### Prerequisites

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
3. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for VS Code

### Opening the Project in a Container

1. Clone the BrightCoreLabs repository
2. Open the project folder in VS Code
3. When prompted, click "Reopen in Container" or manually select "Dev Containers: Reopen in Container" from the command palette (F1)
4. Wait for the container to build (this may take a few minutes the first time)
5. Once the container is built and running, VS Code will connect to it and you'll be ready to develop

### Container Structure

- **app service**: Runs the Node.js application
- **db service**: Runs PostgreSQL database
- **Shared volumes**: Ensures data persistence between container restarts

### Database Access

The PostgreSQL database is pre-configured with the following credentials:
- **Host**: localhost
- **Port**: 5432
- **Username**: postgres
- **Password**: postgres
- **Database**: postgres

These credentials are automatically set as environment variables in the container.

### Customizing

You can customize the development environment by:
1. Modifying the `Dockerfile` to add additional system dependencies
2. Adding extensions to the `devcontainer.json` file
3. Adjusting the PostgreSQL configuration in `docker-compose.yml`

## Troubleshooting

If you encounter issues:

1. **Container fails to build**: Check Docker logs for details
2. **Database connection issues**: Ensure PostgreSQL container is running (`docker ps`)
3. **Port conflicts**: Modify the mapped ports in `docker-compose.yml` if 5432 is already in use

For more help with Dev Containers, see the [official documentation](https://code.visualstudio.com/docs/devcontainers/containers).