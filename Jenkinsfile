pipeline {
    agent any

    environment {
        IMAGE_NAME = "react_frontend:${BUILD_NUMBER}"
        PATH = "/usr/local/bin:/opt/homebrew/bin:$PATH" // Assure l'accès à Docker sur Mac
    }

    stages {

        stage('📥 Checkout frontend') {
            steps {
                echo "🔄 Cloning the frontend repository..."
                checkout scm
            }
        }

        stage('📦 Build React app') {
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
            echo '🧼 Cleaning up workspace (if needed)...'
        }
        success {
            echo '✅ Frontend pipeline completed successfully!'
        }
        failure {
            echo '❌ Frontend pipeline failed!'
        }
    }
}
