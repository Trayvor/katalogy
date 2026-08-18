// Deploy statického webu "Katalógy" na interný server.
//
// Web sa NEKOMPILUJE — žiadny bundler, žiadne node_modules, žiadny build output.
// Repozitár = deploy artefakt, deploy = rsync súborov do webrootu.
//
// Dáta sa načítavajú živo z API cez reverse proxy nastavenú vo webserveri
// (pozri README.md → "Nasadenie"). Pipeline s dátami nepracuje.
//
// Predpoklady na Jenkins agentovi: rsync

pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    // Cieľový adresár na webserveri (uprav podľa prostredia)
    DEPLOY_DIR = '/var/www/katalogy'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Deploy') {
      steps {
        // $DEPLOY_DIR expanduje shell (Jenkins exportuje environment), nie Groovy
        sh 'rsync -a --delete --exclude=.git/ --exclude=.gitignore --exclude=scripts/ --exclude=Jenkinsfile --exclude=README.md ./ "$DEPLOY_DIR/"'
      }
    }
  }

  post {
    success { echo "Nasadené do ${env.DEPLOY_DIR}" }
    failure { echo 'Deploy zlyhal — pozri log vyššie.' }
  }
}
