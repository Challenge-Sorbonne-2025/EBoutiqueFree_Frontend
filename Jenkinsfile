pipeline {
    agent any

    environment {
        IMAGE_NAME = "react_frontend:${BUILD_NUMBER}"
    }

    stages {

        stage('📥 Checkout code') {
            steps {
                echo "🔄 Cloning frontend repository..."
                checkout scm
            }
        }

        stage('📦 Install dependencies & build') {
            steps {
                echo "📦 Installing and building frontend..."
                sh '''
                    npm ci
                    npm run build
                '''
            }
        }

        stage('🐳 Docker build') {
            environment {
                PATH = "/opt/homebrew/bin:$PATH" // Si Docker est installé via Homebrew sur macOS
            }
            steps {
                echo "🐳 Building Docker image..."
                sh '''
                    docker build -t ${IMAGE_NAME} .
                    docker tag ${IMAGE_NAME} react_frontend:latest
                '''
            }
        }

    }

    post {
        success {
            echo '✅ Frontend pipeline finished successfully!'
        }
        failure {
            echo '❌ Frontend pipeline failed.'
        }
    }
}
