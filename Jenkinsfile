pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '663789292765'
        ECR_REPOSITORY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Build') {
            steps {
                checkout scm
                script {
                    env.IMAGE_TAG = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    echo "Image Tag set to: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build and Push catalog-service') {
            steps {
                withAWS(credentials: 'aws-creds', region: "${AWS_REGION}") {
                    sh """
                    cd ./services/catalog-service && \\
                    ls -la && \\
                    /usr/bin/kaniko \\
                    --context . \\
                    --dockerfile Dockerfile \\
                    --destination ${ECR_REPOSITORY}/catalog-service:latest \
                    --destination ${ECR_REPOSITORY}/catalog-service:${env.IMAGE_TAG} \
                    --cache=false \
                    --force
                    """
                }
            }
        }

        stage('Build and Push api-gateway') {
            steps {
                withAWS(credentials: 'aws-creds', region: "${AWS_REGION}") {
                    sh """
                    cd ./services/api-gateway && \\
                    ls -la && \\
                    /usr/bin/kaniko \\
                    --context . \\
                    --dockerfile Dockerfile \\
                    --destination ${ECR_REPOSITORY}/api-gateway:latest \
                    --destination ${ECR_REPOSITORY}/api-gateway:${env.IMAGE_TAG} \
                    --cache=false \
                    --force
                    """
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                // Scan the REMOTE image in ECR (since we don't have a local daemon)
                withAWS(credentials: 'aws-creds', region: "${AWS_REGION}") {
                    sh """
                    trivy image --severity HIGH,CRITICAL --exit-code 1 ${ECR_REPOSITORY}/catalog-service:${env.IMAGE_TAG}
                    trivy image --severity HIGH,CRITICAL --exit-code 1 ${ECR_REPOSITORY}/api-gateway:${env.IMAGE_TAG}
                    """
                }
            }
        }   

        stage('Deploy to ECS') {
            steps {
                withAWS(credentials: 'aws-creds', region: "${AWS_REGION}") {
                    sh """
                    aws ecs update-service \\
                     --cluster netflix-cluster \\
                     --service netflix-catalog-service \\
                     --force-new-deployment
                    aws ecs update-service \\
                     --cluster netflix-cluster \\
                     --service netflix-api-gateway-service \\
                     --force-new-deployment
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment Successful🚀'
        }
        failure {
            echo 'Deployment Failed❌'
        }
    }
}
// Webhook trigger test Sun Jan  4 13:36:40 IST 2026
