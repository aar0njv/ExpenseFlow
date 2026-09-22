# Kubernetes Deployment Guide

This directory contains the Kubernetes manifests for deploying ExpenseFlow to a production or local (e.g. Minikube / K3s / Kind) cluster.

## Architecture & Directory Layout

```
k8s/
├── namespace.yaml           # Dedicated 'expenseflow' namespace
├── ingress.yaml             # NGINX Ingress rules (/accounts, /transactions, /reports)
├── databases/
│   ├── pv.yaml              # Local PersistentVolumes for database storage
│   ├── account-db.yaml      # Account DB StatefulSet + Headless Service
│   ├── transaction-db.yaml  # Transaction DB StatefulSet + Headless Service
│   └── report-db.yaml       # Report DB StatefulSet + Headless Service
└── services/             
    ├── account-service.yaml     # Deployment + Service
    ├── transaction-service.yaml
    └── report-service.yaml
```

### Key Design Choices

1. **Namespace Isolation**: All resources run inside the `expenseflow` namespace.
2. **Stateful vs Stateless**: Databases use `StatefulSet` with `volumeMounts` and dedicated local PVs. Services run as standard `Deployment` objects.
3. **Private Registry Access**: Deployments pull images from GitLab Container Registry via an `imagePullSecret` named `gitlab-registry-secret`.
4. **Secret Management**: Passwords, connection strings, and JWT keys are managed via Kubernetes `Secret` (`expenseflow-secret`). Service URLs and non-sensitive configurations live in a `ConfigMap` (`expenseflow-config`).

## Manual Deployment Steps

If you are deploying manually without the CI/CD pipeline, follow these steps:

### 1. Create Namespace & Secrets

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create GitLab registry pull secret (using GitLab deploy token or PAT)
kubectl create secret docker-registry gitlab-registry-secret \
  --docker-server=registry.gitlab.com \
  --docker-username=<your-username-or-token-username> \
  --docker-password=<your-deploy-token> \
  -n expenseflow

# Create application secret
kubectl create secret generic expenseflow-secret \
  --from-literal=ACCOUNT_DB_PASSWORD="change_me" \
  --from-literal=TRANSACTION_DB_PASSWORD="change_me" \
  --from-literal=REPORT_DB_PASSWORD="change_me" \
  --from-literal=ACCOUNT_DATABASE_URL="postgresql+psycopg://account_user:change_me@account-db:5432/account_db" \
  --from-literal=TRANSACTION_DATABASE_URL="postgresql+psycopg://transaction_user:change_me@transaction-db:5432/transaction_db" \
  --from-literal=REPORT_DATABASE_URL="postgresql+psycopg://report_user:change_me@report-db:5432/report_db" \
  --from-literal=JWT_SECRET_KEY="your_jwt_secret" \
  -n expenseflow

# Create configmap
kubectl create configmap expenseflow-config \
  --from-literal=JWT_ALGORITHM="HS256" \
  --from-literal=ACCESS_TOKEN_EXPIRE_MINUTES="60" \
  --from-literal=ACCOUNT_SERVICE_URL="http://account-service:8000" \
  --from-literal=REPORT_ACCOUNT_SERVICE_URL="http://account-service:8000/accounts" \
  --from-literal=REPORT_TRANSACTION_SERVICE_URL="http://transaction-service:8000/transactions/account" \
  -n expenseflow
```

### 2. Apply Manifests

```bash
# Persistent volumes & stateful databases
kubectl apply -f k8s/databases/pv.yaml
kubectl apply -f k8s/databases/

# Backend microservices & ingress
kubectl apply -f k8s/services/
kubectl apply -f k8s/ingress.yaml
```

### 3. Verify Resources

```bash
kubectl get all,pvc,ingress -n expenseflow
```

## CI/CD Pipeline Deployment

The `.gitlab-ci.yml` pipeline automates deployment in the `deploy` stage (`deploy:k8s`):

1. Configures `kubectl` credentials using `$KUBE_CONFIG`.
2. Creates/updates `gitlab-registry-secret` using deploy token variables (`$CI_DEPLOY_USER` / `$CI_DEPLOY_PASSWORD`).
3. Formats and applies `expenseflow-secret` and `expenseflow-config` dynamically from CI/CD variables.
4. Applies all manifests and checks deployment rollout status using `kubectl rollout status`.

