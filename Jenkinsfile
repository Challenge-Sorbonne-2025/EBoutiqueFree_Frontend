pipeline {
    agent any

    stages {
        stage('📥 Checkout') {
            steps {
                checkout scm
            }
        }

        stage('📦 Install and Build') {
            steps {
                sh '''
                    npm ci
                    npm run build
                '''
            }
        }

        stage('🐳 Build Docker image') {
            steps {
                sh '''
                    docker build -t shop_app_front:${BUILD_NUMBER} .
                    docker tag shop_app_front:${BUILD_NUMBER} shop_app_front:latest
                '''
            }
        }
    }
}
