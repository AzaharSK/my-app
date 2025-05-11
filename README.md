# BrightCoreLabs

BrightCoreLabs is an advanced educational technology platform providing immersive technical learning experiences with comprehensive interactive features for programming languages and technical skills.

## Development Setup Guide

This guide provides step-by-step instructions to set up the BrightCoreLabs development environment on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20 or later) - [Download Node.js](https://nodejs.org/)
- **PostgreSQL** (version 15 recommended) - [Download PostgreSQL](https://www.postgresql.org/download/)
- **Git** - [Download Git](https://git-scm.com/downloads)

## Option 1: Setup with VS Code Dev Containers (Recommended) or Docker 

The easiest way to get started is using VS Code with Dev Containers:

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
3. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for VS Code
4. Clone the repository:
6. Open the project in VS Code
7. When prompted, click "Reopen in Container" or use the command palette (F1) and select "Dev Containers: Reopen in Container"
8. Wait for the container to build and start (this may take a few minutes the first time)
9. The development server will automatically start (accessible at http://localhost:5000)

All dependencies, including Node.js, PostgreSQL, and required npm packages will be automatically installed in the container.

```bash
git clone https://github.com/AzaharSK/my-app.git
cd ~/my-app/.devcontainer

# docker system prune -af --volumes  # Incase want cleanup docker images
docker-compose down
docker-compose up --build
http://EC2-ublic-IP:5000/
```
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## Option 2: Manual Setup

If you prefer to set up without containers, follow these steps:

#### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/brightcorelabs.git
cd brightcorelabs
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Set Up PostgreSQL Database

1. Install PostgreSQL if you haven't already
2. Create a new database:
   ```bash
   psql -U postgres
   CREATE DATABASE brightcorelabs;
   \q
   ```
3. Create a `.env` file in the project root with the following content:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/brightcorelabs
   PGHOST=localhost
   PGUSER=postgres
   PGPASSWORD=your_password
   PGDATABASE=brightcorelabs
   PGPORT=5432
   ```
   Replace `your_password` with your actual PostgreSQL password.

#### Step 4: Initialize the Database

Run the database migration to create all required tables:

```bash
npm run db:push
```

#### Step 5: Start the Development Server

```bash
npm run dev
```

The application should now be running at http://localhost:5000.

### Troubleshooting Common Issues

#### Database Connection Issues

If you encounter database connection problems:

1. Verify your PostgreSQL server is running
2. Check your database credentials in the `.env` file
3. Ensure the database exists and is accessible
4. Try running `npm run db:push` to refresh the database schema

#### Port Conflicts

If port 5000 is already in use:

1. You can modify the port in `server/index.ts` 
2. Restart the server with `npm run dev`

#### Node.js Version Issues

This project requires Node.js version 20 or later. If you're using an older version:

1. Install [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm)
2. Run `nvm install 20` to install Node.js 20
3. Run `nvm use 20` to switch to Node.js 20

### Project Structure

```
brightcorelabs/
├── .devcontainer/    # Development container configuration
├── client/           # Frontend React application
│   ├── src/          # Source code
│   ├── components/   # Reusable UI components
│   └── pages/        # Page components
├── server/           # Backend Express server
├── shared/           # Shared code between client and server
└── ...               # Configuration files
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run db:push` - Push database schema changes
- `npm run build` - Build the application for production
- `npm run start` - Run the production build

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express Documentation](https://expressjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
