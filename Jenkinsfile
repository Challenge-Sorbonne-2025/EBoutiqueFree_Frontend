pipeline {
    agent any

    environment {
        IMAGE_NAME = "shop_app_front:${BUILD_NUMBER}"
        NODE_ENV = "production"
    }

    stages {

        stage('📥 Checkout code') {
            steps {
                echo "🔄 Cloning the repository..."
                checkout scm
            }
        }

        stage('📦 Build React App') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-v $HOME/.npm:/root/.npm'
                }
            }
            steps {
                echo "📦 Installing dependencies and building..."
                sh '''
                    npm ci
                    npm run build dev                    
                '''
            }
        }

        stage('🐳 Build Docker Image') {
            steps {
                echo "🐳 Building docker image..."
                sh '''
                    docker build -t ${IMAGE_NAME} .
                    docker tag ${IMAGE_NAME} shop_app_front:latest
                '''
            }
        }

        stage('🚀 Run Docker Container') {
            steps {
                echo "🚀 Running docker container..."
                sh '''
                    docker rm -f shop_container_front || true
                    docker run -d --name shop_container_front -p 3000:80 ${IMAGE_NAME}
                '''
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
    }
}
