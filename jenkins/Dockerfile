FROM gcr.io/kaniko-project/executor:v1.23.2-debug AS kaniko
FROM jenkins/jenkins:lts
COPY --from=kaniko /kaniko/executor /usr/bin/kaniko

USER root

# Install prerequisites
RUN apt-get update && apt-get install -y \
    lsb-release \
    curl \
    unzip \
    wget \
    apt-transport-https \
    gnupg

# Install Docker CLI
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce-cli

# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf aws awscliv2.zip

# Install Trivy
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Create workspace for Kaniko
RUN mkdir -p /kaniko && chmod 777 /kaniko

# Fix Git ownership issue (Workspace owned by jenkins, running as root)
# Apply to SYSTEM config so it works for ALL users
RUN git config --system --add safe.directory '*'

# Ensure Jenkins home permissions are correct for root
# (Note: Volume mount might override this at runtime, but good to have)
RUN chown -R root:root /var/jenkins_home || true

# Run as root for Kaniko compatibility
# USER jenkins
