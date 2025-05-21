pipeline {
    agent any  // Utilise directement l'agent Jenkins local (avec accès Docker)

    environment {
        IMAGE_NAME = "react_frontend:${BUILD_NUMBER}"
        PATH = "/usr/local/bin:/opt/homebrew/bin:$PATH"  // Adapter à ton Mac
    }

    stages {

        stage('📥 Checkout code') {
            steps {
                echo "🔄 Cloning the frontend repository..."
                checkout scm
            }
        }

        stage('📦 Install dependencies & build React app') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-v $HOME/.npm:/root/.npm'
                }
            }
            steps {
                echo "📦 Running npm ci and build..."
                sh '''
                    npm ci
                    npm run build
                '''
            }
        }

        stage('🐳 Docker build') {
            steps {
                echo "🐳 Building Docker image ${IMAGE_NAME}..."
                sh '''
                    docker build -t ${IMAGE_NAME} .
                    docker tag ${IMAGE_NAME} react_frontend:latest
                '''
            }
        }

    }

    post {
        always {
            echo '🧼 Cleaning up build workspace if needed...'
        }
        success {
            echo '🎉 Frontend CI pipeline completed successfully!'
        }
        failure {
            echo '❌ Frontend pipeline failed!'
        }
    }
}
