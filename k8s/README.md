
## Kubernetes Architecture & Deployment

The application is deployed to Kubernetes using a modular architecture with 6 isolated Pods: 3 stateless microservices and 3 stateful PostgreSQL databases.

### 1. Workload Separation & Resource Types
- **Stateless Microservices (`Deployments`)**: `account-service`, `transaction-service`, and `report-service` run as Kubernetes Deployments with multiple replicas for horizontal scaling.
- **Stateful Databases (`StatefulSets`)**: `account-db`, `transaction-db`, and `report-db` run as StatefulSets with dedicated `PersistentVolumeClaim` (PVC) to ensure database state persistance.

### 2. Private Container Registry Authentication
To pull container images securely from a private GitLab Container Registry:
- Credentials are stored in a Kubernetes Secret of type `kubernetes.io/dockerconfigjson` (`gitlab-registry-secret`).
- Each application Deployment manifest references `imagePullSecrets: [{ name: "gitlab-registry-secret" }]`.
- The CI/CD pipeline dynamically updates this secret using `$CI_DEPLOY_USER` or `$CI_JOB_TOKEN`.

### 3. Dynamic Secrets & Zero Hardcoding
- **Secret & ConfigMap Separation**:
  - `expenseflow-secret`: Stores database passwords, database connection strings (`postgresql+psycopg://...`), and JWT secret keys.
  - `expenseflow-config`: Stores non-sensitive settings like service URLs and token expiration timeouts.
- **Templates**: Reference templates `k8s/configmap.yaml.template` and `k8s/secret.yaml.template` are provided in the repository with placeholder values.

### 4. Ingress & API Gateway Routing
An NGINX Ingress resource (`k8s/ingress.yaml`) acts as the single entry point to the cluster, routing external HTTP requests based on URL path prefixes:
- `/accounts` -> `account-service:8000`
- `/transactions` -> `transaction-service:8000`
- `/reports` -> `report-service:8000`

---

## Directory Layout (`k8s/`)

```
k8s/
├── namespace.yaml                # Dedicated 'expenseflow' namespace
├── configmap.yaml.template       # ConfigMap template for non-sensitive settings
├── secret.yaml.template          # Secret template for credentials
├── ingress.yaml                  # Ingress routing rules
├── databases/
│   ├── pv.yaml                   # Local PersistentVolumes for database storage
│   ├── account-db.yaml           # Account DB StatefulSet & Headless Service
│   ├── transaction-db.yaml       # Transaction DB StatefulSet & Headless Service
│   └── report-db.yaml            # Report DB StatefulSet & Headless Service
└── services/
    ├── account-service.yaml      # Account Service Deployment & ClusterIP Service
    ├── transaction-service.yaml  # Transaction Service Deployment & ClusterIP Service
    └── report-service.yaml      # Report Service Deployment & ClusterIP Service
```

---

## GitLab CI/CD Pipeline Automation

The `.gitlab-ci.yml` pipeline automates testing, container image packaging, dual registry publishing, and Kubernetes deployment.

### Pipeline Jobs

3. **`deploy` Stage (`deploy:k8s`)**:
   - Authenticates `kubectl` with the target Kubernetes cluster using the `$KUBE_CONFIG` variable.
   - Automatically generates or refreshes `gitlab-registry-secret`.
   - Injects GitLab CI/CD variables (`ACCOUNT_DB_PASSWORD`, `TRANSACTION_DB_PASSWORD`, `REPORT_DB_PASSWORD`, `JWT_SECRET_KEY`) into `expenseflow-secret` and `expenseflow-config`.
   - Applies Kubernetes manifests and verifies rollout completion via `kubectl rollout status`.

### Key CI/CD Variables

| Variable Name | Description |
| :--- | :--- |
| `ACCOUNT_DB_PASSWORD` | Password for the account PostgreSQL database. |
| `TRANSACTION_DB_PASSWORD` | Password for the transaction PostgreSQL database. |
| `REPORT_DB_PASSWORD` | Password for the report PostgreSQL database. |
| `JWT_SECRET_KEY` | Secret key used for signing JWT access tokens. |
| `KUBE_CONFIG` | Kubeconfig file content for cluster authentication. |

---

## Deploying Locally to Kubernetes

### 1. Create Namespace
```bash
kubectl apply -f k8s/namespace.yaml
```

### 2. Create Registry Pull Secret
```bash
kubectl create secret docker-registry gitlab-registry-secret \
  --docker-server=registry.gitlab.com \
  --docker-username=<your-username> \
  --docker-password=<your-token> \
  -n expenseflow
```

### 3. Create Secrets & ConfigMap
```bash
kubectl create secret generic expenseflow-secret \
  --from-literal=ACCOUNT_DB_PASSWORD="your_account_db_password" \
  --from-literal=TRANSACTION_DB_PASSWORD="your_transaction_db_password" \
  --from-literal=REPORT_DB_PASSWORD="your_report_db_password" \
  --from-literal=ACCOUNT_DATABASE_URL="postgresql+psycopg://account_user:your_account_db_password@account-db:5432/account_db" \
  --from-literal=TRANSACTION_DATABASE_URL="postgresql+psycopg://transaction_user:your_transaction_db_password@transaction-db:5432/transaction_db" \
  --from-literal=REPORT_DATABASE_URL="postgresql+psycopg://report_user:your_report_db_password@report-db:5432/report_db" \
  --from-literal=JWT_SECRET_KEY="your_jwt_secret" \
  -n expenseflow --dry-run=client -o yaml | kubectl apply -f -

kubectl create configmap expenseflow-config \
  --from-literal=JWT_ALGORITHM="HS256" \
  --from-literal=ACCESS_TOKEN_EXPIRE_MINUTES="60" \
  --from-literal=ACCOUNT_SERVICE_URL="http://account-service:8000" \
  --from-literal=REPORT_ACCOUNT_SERVICE_URL="http://account-service:8000/accounts" \
  --from-literal=REPORT_TRANSACTION_SERVICE_URL="http://transaction-service:8000/transactions/account" \
  -n expenseflow --dry-run=client -o yaml | kubectl apply -f -
```

### 4. Deploy Storage, Databases & Microservices
```bash
kubectl apply -f k8s/databases/pv.yaml
kubectl apply -f k8s/databases/
kubectl apply -f k8s/services/
kubectl apply -f k8s/ingress.yaml
```

### 5. Check Deployment Status
```bash
kubectl get all,pvc,ingress -n expenseflow
```
