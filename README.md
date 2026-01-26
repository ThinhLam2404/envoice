# Envoice

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

**Envoice** is a scalable, microservices-based invoice management system built with **NestJS** and **Nx**. It leverages an event-driven architecture with Kafka, robust authentication via Keycloak, and a modern infrastructure stack including PostgreSQL, MongoDB, and Redis.

## 🏗 Architecture Overview

The system is designed as a **Monorepo** using Nx, enabling efficient development and code sharing.

### System Architecture

The application follows a microservices architecture with an event-driven design:

- **Client Implementation**:

  - **Client/Frontend**: Interacts with the backend via the **BFF Service**.
  - **BFF Service (HTTP :3300)**: Backend for Frontend that aggregates data and exposes endpoints to the client. It communicates with backend services via TCP and handles Webhooks.

- **Core Microservices** (TCP Communication):

  - **Invoice Service**: Handles CRUD operations for invoices.
    - Sends "Generate PDF" requests to the **PDF Generator**.
    - Sends "Upload File" requests to the **Media Service**.
    - Triggers "Pay" requests to the **Payment Service**.
    - Publishes `invoice.sent` events to **Kafka**.
    - Reads/Writes to **MongoDB**.
  - **User Access**: Manages user management and authentication.
    - Connects to **Authorizer** (gRPC) for authentication.
    - Uses **Keycloak (:8180)** for Identity Management.
    - Reads/Writes to **MongoDB**.

- **Support Services**:

  - **PDF Generator**: Worker service for HTML to PDF conversion using Puppeteer.
  - **Media Service**: Handles file uploads to **Cloudinary**.
  - **Payment Service**: Integrates with **Stripe** for payment processing.
  - **Mail Service**: Consumes events from **Kafka** to send emails via **SMTP Server**.
  - **Authorizer**: gRPC service for centralized authorization.

- **Security & Caching**:
  - **UserGuard**: Cache layer acting as a guard check, utilizing **Redis (:6379)** for token caching and communicating with the Authorizer.

### Infrastructure Stack

- **Database**:
  - **MongoDB (Port 27017)**: Document database, Replica Set ready, used with Mongoose ODM.
  - **PostgreSQL**: Primary transactional database.
- **Messaging**:
  - **Kafka (Port 9092)**: Event streaming platform implementing producer/consumer patterns with auto topic creation.
- **Identity & Security**:
  - **Keycloak (Port 8180)**: IAM solution supporting OAuth 2.0 / OpenID Connect and User Federation.
  - **Redis (Port 6379)**: Usage for cache store, session management, and token caching (providing significant performance boosts). Includes Redis Insight UI (Port 5540).
- **Observability**:
  - **Grafana (Port 3000)**: Monitoring dashboard and log visualization.
  - **Loki + Promtail (Port 3100)**: Log aggregation server and log collection agent using LogQL.
  - **Prometheus**: Metrics collection.

## 📦 Microservices

The application consists of the following microservices:

| Service             | Description                                                                    | Type         |
| :------------------ | :----------------------------------------------------------------------------- | :----------- |
| **`bff`**           | **Backend for Frontend**. Aggregates data and exposes REST APIs to the client. | API Gateway  |
| **`user-access`**   | Manages user identities, authentication integration, and profiles.             | Microservice |
| **`invoice`**       | Core domain service for managing invoices.                                     | Microservice |
| **`product`**       | Manages product catalog and inventory data.                                    | Microservice |
| **`pdf-generator`** | specialized service for generating PDF documents (e.g., invoices).             | Worker       |
| **`media`**         | Handles file uploads and media asset management.                               | Microservice |
| **`mail`**          | Handles email notifications and transactional, emails.                         | Worker       |
| **`authorizer`**    | Centralized authorization and policy enforcement.                              | Microservice |

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or higher
- **pnpm**: Package manager (`npm install -g pnpm`)
- **Docker** & **Docker Compose**: For running the infrastructure

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd envoice
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

## 🛠 Infrastructure Setup

Before running the applications, you need to spin up the required infrastructure (Databases, Broker, Auth, etc.).

1.  **Start Infrastructure**:
    Using the provided provider compose file:

    ```bash
    docker-compose -f docker-compose.provider.yaml up -d
    ```

    **Services & Ports:**

    - **Introduction**: 27017
    - **PostgreSQL**: 5432
    - **Redis**: 6379 (Insight UI: 5540)
    - **Kafka**: 9092 (External: 29092)
    - **Keycloak**: 8180 (Admin: admin/admin)
    - **PgAdmin**: 5050 (Email: admin@admin.com / Pass: admin)
    - **Grafana**: 3000 (Monitoring UI)
    - **Prometheus**: 9090
    - **Loki**: 3100
    - **Promtail**: 3101

## 🏃‍♂️ Running the Application

You can run the entire suite or specific services using Nx.

### Development Mode

**Run everything (Heavy!):**

```bash
pnpm dev
```

**Run Lite Version (Selected Core Services):**
Wrapper script defined in `package.json`:

```bash
pnpm dev-lite
```

_Runs: bff, user-access, authorizer, invoice, pdf-generator, media, mail_

### Manual Service Start

To run a specific service:

```bash
npx nx serve <app-name>
# Example:
npx nx serve bff
npx nx serve invoice
```

## 🧪 Development Commands

- **Test**: `npx nx test <app>`
- **Build**: `npx nx build <app>`
- **Graph**: Visualize the project dependencies:
  ```bash
  npx nx graph
  ```

## 🚢 Deployment

For detailed deployment instructions using Docker and Docker Compose, please refer to [DEPLOYMENT.md](./DEPLOYMENT.md).

Quick start:

```bash
# 1. Start Infrastructure
docker-compose -f docker-compose.provider.yaml up -d

# 2. Build Apps
pnpm nx run-many --target=build --all --prod

# 3. Start Services
docker-compose up -d --build
```

## 📝 License

MIT
