# ExpenseFlow

> **Core Focus**: A personal project built to demonstrate **backend system design**, **microservices architecture**, **container orchestration** and **DevOps automation (CI/CD)** workflows.

---

ExpenseFlow is a multi-service financial tracking application built with Python (FastAPI), PostgreSQL, React, and Kubernetes. Each microservice manages its own isolated database and handles a specific domain within the expense tracking workflow.

## Microservices Architecture

- **Account Service**: Handles user authentication (JWT), account creation, profile management, and account balance updates.
- **Transaction Service**: Manages deposits and withdrawals. Communicates with the Account Service to sync balance changes.
- **Report Service**: Aggregates user transactions and account data to generate financial reports and cash flow summaries.
- **Frontend**: React dashboard for managing accounts, recording transactions, and viewing analytics.

Each Python service uses FastAPI, SQLAlchemy and Poetry for dependency management. Each microservice is backed by its own dedicated PostgreSQL database instance.

## Tech Stack

- **Backend**: Python 3.12, FastAPI, SQLAlchemy, Poetry
- **Databases**: PostgreSQL (isolated instances per service)
- **Containerization & Orchestration**: Docker, Kubernetes
- **CI/CD**: GitLab CI (automated testing, Docker build & push, automated K8s deployment)

## Getting Started (Local Development)

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development without Docker)

### Run with Docker Compose

1. Clone the repository:
   ```bash
   git clone https://gitlab.com/aar0njv-projects/expenseflow.git
   cd expenseflow
   ```

2. Start all services and databases:
   ```bash
   docker compose up --build
   ```

3. Access the services:
   - Frontend: `http://localhost:5173`
   - Account Service API Docs: `http://localhost:8001/docs`
   - Transaction Service API Docs: `http://localhost:8002/docs`
   - Report Service API Docs: `http://localhost:8003/docs`

## Kubernetes & Production Deployment

Production manifests and cluster setup guides are located in the [`k8s/`](./k8s) directory.

- **Stateful workloads**: PostgreSQL databases deployed as `StatefulSets` with `PersistentVolumeClaim` storage.
- **Stateless workloads**: Microservices deployed as `Deployments` with `ClusterIP` services.
- **Ingress**: Single entrypoint using NGINX Ingress Controller routing paths (`/accounts`, `/transactions`, `/reports`) to backend services.
- **CI/CD**: `.gitlab-ci.yml` automatically builds Docker images on commit, pushes to GitLab Container Registry & Docker Hub, and applies updates to the Kubernetes cluster.

For full Kubernetes deployment instructions, see [`k8s/README.md`](./k8s/README.md).






