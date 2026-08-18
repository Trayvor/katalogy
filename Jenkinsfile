// Deploy statického webu "Katalógy" na interný server.
//
// Web sa NEKOMPILUJE — žiadny bundler, žiadne node_modules, žiadny build output.
// Repozitár = deploy artefakt. Jediný voliteľný krok je obnovenie snapshotu dát z API.
//
// Predpoklady na Jenkins agentovi:
//   - node >= 18 (kvôli globálnemu fetch() v scripts/fetch-data.mjs) — iba pre stage "Refresh data"
//   - rsync
//   - Jenkins credential typu "Secret text" s ID 'katalog-api-token'

pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  triggers {
    // Denné obnovenie snapshotu dát z API (mimo push-ov)
    cron('0 3 * * *')
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

    stage('Refresh data snapshot') {
      steps {
        withCredentials([string(credentialsId: 'katalog-api-token', variable: 'KATALOG_API_TOKEN')]) {
          // Zlyhanie API nesmie zhodiť deploy — použije sa commitnutý snapshot v data/
          sh 'node scripts/fetch-data.mjs || echo "WARN: dáta sa nepodarilo obnoviť, použije sa commitnutý snapshot"'
        }
      }
    }

    stage('Deploy') {
      steps {
        // $DEPLOY_DIR expanduje shell (Jenkins exportuje environment), nie Groovy
        sh 'rsync -a --delete --exclude=.git/ --exclude=.gitignore --exclude=.github/ --exclude=scripts/ --exclude=Jenkinsfile --exclude=README.md --exclude=DEPLOY.md ./ "$DEPLOY_DIR/"'
      }
    }
  }

  post {
    success { echo "Nasadené do ${env.DEPLOY_DIR}" }
    failure { echo 'Deploy zlyhal — pozri log vyššie.' }
  }
}
