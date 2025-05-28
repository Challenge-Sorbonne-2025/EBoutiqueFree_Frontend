pipeline {
    agent any

    environment {
        IMAGE_NAME = "react_frontend:${BUILD_NUMBER}"
        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
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
                echo "📦 Installing dependencies and building React..."
                sh '''
                    npm ci
                    npm run build
                '''
            }
        }

        stage('🐳 Build Docker image') {
            environment {
                PATH = "/opt/homebrew/bin:$PATH"
            }
            steps {
                echo "📦 Création de l’image Docker : ${IMAGE_NAME}..."
                sh '''
                    set -e
                    docker build -t ${IMAGE_NAME} .
                    docker tag ${IMAGE_NAME} react_frontend:latest
                '''
            }
        }


    post {
        always {
            echo '🧼 Cleaning up workspace...'
        }
        success {
            echo '✅ Frontend pipeline completed successfully!'
        }
        failure {
            echo '❌ Frontend pipeline failed!'
        }
    }
}
