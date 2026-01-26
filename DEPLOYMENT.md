# Deployment Guide

This guide explains how to deploy the Envoice microservices using Docker and Docker Compose.

## Prerequisites

- **Node.js**: v20+
- **pnpm**: `npm install -g pnpm`
- **Docker** & **Docker Compose**
- **Nx CLI**: `npm install -g nx` (optional, can use `npx nx`)

## 1. Build the Applications

Before building the Docker images, you must compile the NestJS applications. The Dockerfile expects the build artifacts to be present in `dist/apps/<app-name>`.

To build all applications:

```bash
pnpm nx run-many --target=prune --all --prod
# Or build specific apps:
# pnpm nx prune bff
# pnpm nx prune invoice
```

> **Important**: We use the `prune` target because it generates the `package.json` and `pnpm-lock.yaml` required for the Docker image installation step. Simple `build` is not enough.

## 2. Infrastructure Setup

Ensure the infrastructure services (Database, Kafka, Redis, Keycloak) are running.

```bash
docker-compose -f docker-compose.provider.yaml up -d
```

> **Note**: This creates a network (check `docker network ls`) which the application services need to join. Ensure `docker-compose.yml` references the correct network name.

## 3. Build and Run Services

Once the apps are built and infrastructure is up, use the main compose file to start the microservices.

```bash
docker-compose up -d --build
```

This command will:

1.  Build the Docker images using the generic `docker/Dockerfile`.
2.  Start the services (`bff`, `invoice`, `user-access`, etc.).
3.  Connect them to the infrastructure network.

## 4. Verification

- **BFF Service**: `http://localhost:3300`
- **Logs**: `docker-compose logs -f`

## Environment Variables

The services rely on environment variables. Ensure you have a `.env` file in the root directory or configured in your deployment environment.
