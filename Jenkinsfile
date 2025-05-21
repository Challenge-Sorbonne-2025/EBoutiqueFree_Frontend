pipeline {
    agent {
        docker {
            image 'node:20-alpine'  // Utilise un conteneur Node pour le build frontend
            args '-v $HOME/.npm:/root/.npm'  // Cache npm
        }
    }

    environment {
        IMAGE_NAME = "react_frontend:${BUILD_NUMBER}"
        DOCKER_BUILDKIT = 1  // Active Docker BuildKit (optionnel mais recommandé)
        PATH = "/usr/local/bin:/opt/homebrew/bin:$PATH"  // Chemin Docker si local
    }

    stages {

        stage('📥 Checkout code') {
            steps {
                echo "🔄 Cloning the frontend repository..."
                checkout scm
            }
        }

        stage('📦 Install dependencies & build React app') {
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
