pipeline {
    agent any

    environment {
        IMAGE_NAME = "shop_app_front:${BUILD_NUMBER}"
        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
    }

    stages {

        stage('📥 Checkout Frontend code') {
            steps {
                echo "🔄 Cloning the repository..."
                checkout scm
            }
        }

        stage('📦 Install & Build React app') {
            steps {
                echo "📦 Installing dependencies and building the app..."
                sh '''
                    npm install
                    npm run build
                '''
            }
        }

        stage('🐳 Docker Build React app') {
            steps {
                echo "📦 Création de l’image Docker : ${IMAGE_NAME}"
                sh '''
                    docker build -t ${IMAGE_NAME} .
                    docker tag ${IMAGE_NAME} react_frontend:latest
                '''
            }
        }

        stage('🚀 Run Docker container') {
            steps {
                echo "🚀 Démarrage du conteneur..."
                sh '''
                    docker rm -f shop_container_front || true
                    docker run -d --name shop_container_front -p 3000:80 ${IMAGE_NAME}
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
