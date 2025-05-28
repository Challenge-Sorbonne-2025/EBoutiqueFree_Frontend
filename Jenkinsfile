pipeline {
    agent any

    environment {
        IMAGE_NAME = "shop_app_Front:${BUILD_NUMBER}"
        PYTHONUNBUFFERED = 1
        PATH = "/opt/homebrew/bin:$PATH"
    }

    stages {

        stage('📥 Checkout Frontend code') {
            steps {
                echo "🔄 Cloning the repository..."
                checkout scm
            }
        }

        stage('🐳 Docker Build React app') {
            steps {
                echo "📦 Création de l’image Docker : ${env.IMAGE_NAME}"
                sh '''
                    set -e
                    docker build -t ${IMAGE_NAME} .
                    docker tag ${IMAGE_NAME} react_frontend:latest
                '''
            }
        }

        stage('🚀 Run Docker container') {
            steps {
                echo "🚀 Démarrage du conteneur..."
                sh '''
                    set -e
                    docker rm -f shop_container_front || true
                    docker run -d --name shop_container_front -p 3000:3000 ${IMAGE_NAME}
                '''
            }
        }
    }

    post {
        always {
            echo '🧹 Nettoyage des fichiers temporaires...'
            cleanWs()
        }
        success {
            echo '✅ Pipeline terminé avec succès.'
        }
        failure {
            echo '❌ Échec du pipeline.'
        }
    }
}
