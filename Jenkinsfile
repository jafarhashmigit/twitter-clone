pipeline {
    agent any
      tools {nodejs "19.7.0"}
    stages {
        stage('Build') {
            steps {
                sh 'npm install' // install dependencies
                sh 'npm run build' // build the application
            }
        }
        
        stage('Test') {
            steps {
               echo 'Test the application'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploy the application'
            }
        }
    }
}
