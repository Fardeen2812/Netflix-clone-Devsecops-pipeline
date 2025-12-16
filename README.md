# 🚀 Netflix End-to-End DevSecOps Project

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status: Active Development](https://img.shields.io/badge/Status-Active%20Development-green)
![Node.js](https://img.shields.io/badge/Node.js-20-43853D?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-Ready-232F3E?style=flat&logo=amazon-aws&logoColor=white)

> **A production-grade, cloud-native streaming platform built to demonstrate advanced DevSecOps practices, microservices architecture, and secure infrastructure deployment.**

---

## 📖 About The Project

This project is a comprehensive clone of the Netflix platform, designed not just as a UI copy but as a robust engineering showcase. It evolves a monolithic application into a scalable **Microservices Architecture**, integrating a full **DevSecOps pipeline** from the ground up.

It demonstrates mastery of:
*   **Microservices Decomposition**: Breaking down a monolith into functional services (Catalog, User, Video).
*   **API Gateway Pattern**: Using a BFF (Backend for Frontend) to manage traffic and secure internal APIs.
*   **Containerization & Orchestration**: Production-ready Docker setups and orchestration.
*   **Security First**: Hardened networking, secure configurations, and planned automated security scanning.

---

## 🏗️ Architecture

The application follows a modern microservices pattern, currently orchestrated locally via Docker Compose and ready for AWS ECS/EKS deployment.

```mermaid
graph TD
    User((User))
    
    subgraph "Frontend Layer"
        UI[React / Vite Frontend]
    end
    
    subgraph "API Gateway / BFF"
        Gateway[API Gateway Service :8080]
    end
    
    subgraph "Microservices Layer"
        Catalog[Catalog Service :8081]
        UserSvc[User Service (Planned)]
        VideoSvc[Video Service (Planned)]
    end
    
    subgraph "External Providers"
        TMDB[TMDB API]
    end

    User -->|HTTPS| UI
    UI -->|JSON/REST| Gateway
    Gateway -->|Private Network| Catalog
    Gateway -->|Private Network| UserSvc
    Gateway -->|Private Network| VideoSvc
    Catalog -->|API Key| TMDB

    style Gateway fill:#f9f,stroke:#333,stroke-width:2px
    style Catalog fill:#bbf,stroke:#333,stroke-width:2px
```

---

## 🛠️ Tech Stack

### core
*   **Frontend**: React, Vite, TailwindCSS (for styling)
*   **Backend**: Node.js, Express
*   **Database**: MongoDB (Mongoose)

### Infrastructure & DevOps
*   **Containerization**: Docker, Docker Compose
*   **Orchestration**: Kubernetes (Planned)
*   **CI/CD**: Jenkins, GitHub Actions (Planned)
*   **Security**: SonarQube, Trivy (Planned)
*   **Monitoring**: Prometheus, Grafana (Planned)

---

## ⚡ Key Features

*   **Microservices Architecture**: Independent services for Catalog and API Gateway.
*   **Resilient Networking**: Implemented retries, timeouts, and keep-alives for internal service communication.
*   **Production Hardening**: Non-root container users, secure environment variable handling, and refined Dockerfiles.
*   **API Gateway**: Centralized entry point masking the complexity of the backend services.

---

## 🚀 Getting Started

Follow these steps to get the project running locally in minutes.

### Prerequisites
*   Docker & Docker Compose installed.
*   Git installed.
*   A [TMDB API Key](https://www.themoviedb.org/documentation/api).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Fardeen2812/Netflix-clone-Devsecops-pipeline.git
    cd Netflix-end2end-devsecops-project
    ```

2.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```bash
    echo "TMDB_API_KEY=your_actual_api_key_here" > .env
    ```

3.  **Start Services**
    Spin up the entire stack using Docker Compose:
    ```bash
    docker-compose up --build -d
    ```

4.  **Access the Application**
    *   **Frontend**: [http://localhost:5173](http://localhost:5173) (if running locally) or accessible via Gateway.
    *   **API Gateway**: [http://localhost:8080/health](http://localhost:8080/health)
    *   **Catalog Service**: [http://localhost:8081/health](http://localhost:8081/health)

---

## 🛣️ Roadmap

| Phase | Focus | Status |
| :--- | :--- | :--- |
| **Phase 1** | Monolith to Microservices & Dockerization | ✅ Completed |
| **Phase 2** | Orchestration (Kubernetes/EKS) | 🚧 In Progress |
| **Phase 3** | CI/CD Pipeline (Jenkins, ArgoCD) | 📅 Planned |
| **Phase 4** | Observability (Prometheus/Grafana) | 📅 Planned |

---

## 👨‍💻 Author

**Fardeen Ali**
*Cloud Engineer | DevOps Enthusiast | AWS Solutions Architect*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/fardeen-aliii)
