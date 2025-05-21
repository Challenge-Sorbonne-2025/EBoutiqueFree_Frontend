pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '-v $HOME/.npm:/root/.npm' // cache npm
        }
    }

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
