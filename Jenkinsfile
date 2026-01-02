pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '663789292765'
        ECR_REPOSITORY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    stages {
        stage('Build') {
            steps {
                checkout scm    
            }
        }

        stage('Authenticate to ECR') {
            steps {
                script {
                   withAWS(credentials: 'aws-creds', region: "${AWS_REGION}") {
                        sh '''
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPOSITORY}
                        '''
                   }    
                }
            }
        }

        stage('Build catalog-service') {
            steps {
                sh """
                docker build \\
                --platform linux/amd64 \\
                -t ${ECR_REPOSITORY}/catalog-service:latest \\
                ./services/catalog-service
                """
            }
        }

        stage('Build api-gateway') {
            steps {
                sh """
                docker build \\
                --platform linux/amd64 \\
                -t ${ECR_REPOSITORY}/api-gateway:latest \\
                ./services/api-gateway
                """
            }
        }

        stage('Trivy Scan') {
            steps {
                sh """
                trivy image --severity HIGH,CRITICAL --exit-code 0 ${ECR_REPOSITORY}/catalog-service:latest
                trivy image --severity HIGH,CRITICAL --exit-code 0 ${ECR_REPOSITORY}/api-gateway:latest
                """
            }
        }   

        stage('Push Images') {
            steps {
                sh """
                docker push ${ECR_REPOSITORY}/catalog-service:latest
                docker push ${ECR_REPOSITORY}/api-gateway:latest
                """         
            }
        }

        stage('Deploy to ECS') {
            steps {
                withAWS(credentials: 'aws-creds', region: "${AWS_REGION}") {
                    sh """
                    aws ecs update-service \\
                     --cluster netflix-cluster \\
                     --service catalog-service \\
                     --force-new-deployment
                    aws ecs update-service \\
                     --cluster netflix-cluster \\
                     --service api-gateway \\
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
