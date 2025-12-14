# 🚀 Netflix Clone – End-to-End DevSecOps & AWS Microservices Project

A production-grade Netflix-style streaming platform built by incrementally evolving a working monolith into a microservices-based architecture. This project focuses on real-world system design, containerization, DevSecOps practices, and AWS-ready cloud architecture rather than just UI cloning.

---

## 🎯 Project Objective

To build a Netflix-like platform following modern engineering practices:

* Start with a working application and identify bounded contexts.
* Extract microservices incrementally (Strangler Fig pattern).
* Introduce an **API Gateway (BFF)**.
* Harden services for production reliability (networking, security).
* Containerize using Docker best practices.
* Prepare the entire system for a scalable AWS deployment.

---

## ⭐ Why This Project Stands Out

This repository documents the entire engineering journey and focuses on real-world patterns:

* **Incremental Migration:** Monolith to Microservices migration.
* **Architecture:** Real API Gateway / Backend-for-Frontend (BFF) design.
* **Containerization:** Production-grade multi-stage Docker images.
* **Networking Hardening:** Outbound API calls with TLS stabilization, keep-alive, retries, and timeouts.
* **Cloud Ready:** Environment-driven configuration designed for ECS Fargate and Kubernetes.
* **Roadmap:** Clear DevSecOps and AWS architecture phases planned.

---

## 🏗️ Current Architecture (Phase 1)

The system currently runs as a decoupled stack:

**Frontend (React / Vite) → API Gateway → Catalog Service → TMDB API**

---

## 📂 Repository Structure

```
Netflix-end2end-devsecops-project/
│
├── frontend/                  # React Netflix-style UI
├── services/                  # Backend microservices
│   ├── api-gateway/           # API Gateway / BFF (Backend For Frontend)
│   └── catalog-service/       # Content metadata service
├── infra/                     # Infrastructure as Code (e.g., Terraform, CloudFormation) - Upcoming
├── package.json               # Root tooling and scripts
└── README.md                  # Project documentation
```


---

## 🔬 Implemented Microservices

### 1. Catalog Service

| Purpose | Endpoints |
| :--- | :--- |
| Fetch, cache, and serve movie/TV metadata. | `GET /health` |
| Securely proxy the TMDB APIs. | `GET /catalog/trending` |
| Provide content data for frontend rows. | `GET /catalog/netflix-originals` |
| | `GET /catalog/top-rated` |
| | `GET /catalog/action` |

**Key Features:** Hardened Axios client with keep-alive, retries, and timeouts; independent runtime; Dockerized.

### 2. API Gateway (BFF)

| Purpose | Endpoints |
| :--- | :--- |
| Single entry point for the frontend. | `GET /health` |
| Hide internal microservice topology. | `GET /api/trending` |
| Route requests to backend services. | `GET /api/netflix-originals` |
| Ready for authentication/authorization integration. | `GET /api/top-rated` |
| | `GET /api/action` |

**Key Features:** Environment-driven service discovery; clean API surface; container-network ready.

---

## 🐳 Docker & Containerization

### Standard Container Practices

Both services utilize the following production best practices:

* **Base Image:** Node 20 Alpine.
* **Security:** Non-root container user; no development dependencies in production.
* **Configuration:** Runtime configuration via environment variables.

### Production Hardening Implemented

* TLS handshake stabilization.
* Connection reuse with keep-alive.
* Retry logic for transient network failures.
* Request timeouts to prevent hanging sockets.
* Explicit environment variable validation and defensive API Gateway behavior.

> These patterns map directly to ECS Fargate and Kubernetes production environments.

### Running Services Locally

#### Catalog Service

1.  Build the Docker image:
    ```bash
    docker build -t catalog-service .
    ```
2.  Run the container:
    *(Note: Replace `your_tmdb_api_key` with a real key)*
    ```bash
    docker run -p 8081:8081 \
      -e TMDB_API_KEY=your_tmdb_api_key \
      catalog-service
    ```

#### API Gateway

1.  Build the Docker image:
    ```bash
    docker build -t api-gateway .
    ```
2.  Run the container:
    *(Note: `CATALOG_SERVICE_URL` uses `host.docker.internal` to access the catalog service running on the host machine's port 8081.)*
    ```bash
    docker run -p 8080:8080 \
      -e CATALOG_SERVICE_URL=[http://host.docker.internal:8081](http://host.docker.internal:8081) \
      api-gateway
    ```

---

## 🗺️ Project Journey So Far

| Stage | Status |
| :--- | :--- |
| Built a Netflix-style frontend UI | ✅ |
| Implemented a backend monolith | ✅ |
| Identified service boundaries & Extracted Catalog Service | ✅ |
| Introduced an API Gateway (BFF) | ✅ |
| Resolved ES Module and environment loading issues | ✅ |
| Dockerized services using production best practices | ✅ |
| Hardened outbound networking for containerized environments | ✅ |

### Upcoming Work

#### Phase 2 – Platform Expansion
* Docker Compose for local orchestration.
* Video / Playback Service.
* Recommendation Service.
* User Profile and Watchlist Service.

#### Phase 3 – AWS Deployment (Cloud Architecture)
* Amazon ECR for container registry.
* ECS Fargate for serverless container execution.
* Application Load Balancer (ALB) with path-based routing.
* AWS API Gateway integration (optional).
* DynamoDB for metadata and user data.
* S3 and CloudFront for media delivery.
* Amazon Cognito for authentication.

#### Phase 4 – DevSecOps & Observability
* Jenkins CI/CD pipelines.
* Container and dependency security scanning.
* Centralized logging.
* Prometheus and Grafana monitoring.
* IAM least-privilege enforcement.

---

## ✅ Project Status

* **Status:** Active Development
* **Readiness:** Architecture validated, services containerized, ready for AWS deployment.

---

## 👨‍💻 Author

 **Fardeen**
* Cloud-Engineer / DevOps/Devsecops / AWS Solution Architect*
* linkedin- www.linkedin.com/in/fardeen-aliii