# SonarQube DevOps Lab

![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![SonarQube](https://img.shields.io/badge/SonarQube-Community-4E9BCD?logo=sonarqube&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)
![Statut](https://img.shields.io/badge/Projet-Laboratoire_d'apprentissage-orange)

## Présentation

**SonarQube DevOps Lab** est un laboratoire pratique consacré à l'apprentissage des pratiques DevOps, avec un accent particulier sur l'analyse de la qualité du code, les tests automatisés et l'intégration continue.

Ce projet consiste à mettre en place un environnement complet permettant d'analyser automatiquement une application, de mesurer sa couverture de tests et de contrôler sa qualité à l'aide de SonarQube.

L'objectif est de comprendre concrètement comment les différents outils d'une chaîne CI/CD interagissent dans un environnement de développement moderne.

## Objectifs pédagogiques

Ce laboratoire a pour objectifs de :

- Comprendre le fonctionnement de l'analyse statique du code avec SonarQube.
- Déployer SonarQube et PostgreSQL avec Docker Compose.
- Développer et tester une API REST avec Node.js et Express.
- Automatiser les tests avec Jest et Supertest.
- Mesurer la couverture du code.
- Intégrer SonarQube dans un pipeline CI/CD.
- Configurer un runner GitHub Actions auto-hébergé.
- Comprendre le fonctionnement des Quality Gates.
- Mettre en place des règles de protection sur les branches Git.
- Expérimenter les bonnes pratiques de qualité logicielle et d'automatisation.

## Architecture du laboratoire

L'architecture repose sur plusieurs composants qui communiquent entre eux pour automatiser les contrôles de qualité.

```text
                  Développeur
                       |
                       v
                 Dépôt GitHub
                       |
                       v
                GitHub Actions
                       |
                       v
              Runner auto-hébergé
                   macOS ARM64
                       |
                +------+------+
                |             |
                v             v
          Tests Jest      SonarScanner
                |             |
                |             v
                |         SonarQube
                |             |
                |             v
                |         PostgreSQL
                |
                v
          Résultats des tests
```

Le runner GitHub Actions exécute les différentes étapes du pipeline sur une machine locale. SonarScanner transmet ensuite les résultats d'analyse au serveur SonarQube.

## Technologies utilisées

| Technologie | Utilisation |
|---|---|
| Node.js | Environnement d'exécution |
| Express | Développement de l'API REST |
| Jest | Tests automatisés |
| Supertest | Tests des endpoints HTTP |
| Docker | Conteneurisation |
| Docker Compose | Orchestration des services |
| PostgreSQL | Base de données de SonarQube |
| SonarQube Community Build | Analyse de la qualité du code |
| SonarScanner | Exécution des analyses |
| GitHub Actions | Automatisation CI/CD |
| Git | Gestion du code source |

## Structure du projet

```text
sonarqube-devops-lab/
│
├── .github/
│   └── workflows/
│       └── sonarqube.yml
│
├── task-manager-api/
│   ├── src/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   └── tasks.test.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── sonar-project.properties
│
├── docker-compose.yaml
├── .env
├── .gitignore
└── README.md
```

## 1. Déploiement de SonarQube

SonarQube et PostgreSQL sont déployés à l'aide de Docker Compose.

### Prérequis

- Docker Desktop ou Docker Engine
- Docker Compose
- Node.js 24 ou supérieur
- npm
- Git

### Configuration des variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
SONAR_DB_PASSWORD=mot_de_passe_securise
```

Ce fichier contient les informations sensibles et ne doit pas être versionné dans Git.

### Démarrage des services

```bash
docker compose up -d
```

Vérifier l'état des conteneurs :

```bash
docker compose ps
```

Consulter les logs de SonarQube :

```bash
docker compose logs -f sonarqube
```

L'interface SonarQube est accessible à l'adresse :

http://localhost:9000

Les identifiants initiaux sont :

- Identifiant : `admin`
- Mot de passe : `admin`

Le mot de passe doit être modifié lors de la première connexion.

### Arrêt des services

```bash
docker compose down
```

Les volumes Docker sont conservés lors de cette opération.

Pour supprimer également les volumes et toutes les données persistantes :

```bash
docker compose down -v
```

**Attention : cette dernière commande entraîne la suppression des données SonarQube et PostgreSQL.**

## 2. Application Task Manager API

Le laboratoire intègre une API REST développée avec Node.js et Express.

Cette application sert de support aux expérimentations d'analyse statique et de tests automatisés.

### Installation des dépendances

```bash
cd task-manager-api
npm ci
```

### Démarrage de l'application

```bash
npm start
```

### Exécution des tests

```bash
npm test
```

### Génération du rapport de couverture

```bash
npm test -- --coverage
```

Les tests utilisent Jest et Supertest pour vérifier le comportement des différents endpoints de l'API.

## 3. Configuration de SonarQube

La configuration de l'analyse est définie dans le fichier :

`task-manager-api/sonar-project.properties`

Principales propriétés utilisées :

```properties
sonar.projectKey=task-manager-api
sonar.projectName=Task Manager API

sonar.sources=src
sonar.tests=tests

sonar.test.inclusions=**/*.test.js
sonar.exclusions=**/node_modules/**,**/coverage/**

sonar.sourceEncoding=UTF-8

sonar.javascript.lcov.reportPaths=coverage/lcov.info

sonar.coverage.exclusions=src/server.js
```

Le fichier permet notamment de définir les sources à analyser, les tests à prendre en compte et le rapport de couverture à transmettre à SonarQube.

### Analyse locale

Depuis le répertoire `task-manager-api` :

```bash
npm ci
npm test -- --coverage
npx @sonar/scan
```

L'URL du serveur SonarQube et le token d'authentification doivent être configurés dans l'environnement avant de lancer l'analyse.

## 4. Intégration continue avec GitHub Actions

Le pipeline CI/CD est défini dans :

`.github/workflows/sonarqube.yml`

Il automatise les opérations suivantes :

1. Récupération du dépôt GitHub.
2. Installation de Node.js.
3. Installation des dépendances avec `npm ci`.
4. Exécution des tests automatisés.
5. Génération des rapports de couverture.
6. Analyse statique avec SonarQube sur les push vers `main`.
7. Vérification du Quality Gate.

### Secrets GitHub

Les secrets suivants doivent être configurés dans les paramètres du dépôt :

| Secret | Description |
|---|---|
| `SONAR_HOST_URL` | Adresse du serveur SonarQube |
| `SONAR_TOKEN` | Jeton d'authentification SonarQube |

Configuration actuelle :

```text
SONAR_HOST_URL=http://localhost:9000
```

Les tokens et mots de passe ne doivent jamais être enregistrés directement dans le dépôt.

### Runner GitHub Actions auto-hébergé

Le pipeline utilise un runner auto-hébergé installé sur un MacBook équipé d'une puce Apple Silicon.

Labels configurés :

```text
self-hosted
macOS
ARM64
macos
sonarqube
```

Démarrage manuel du runner :

```bash
cd ~/actions-runner
./run.sh
```

Le terminal doit rester ouvert pendant l'exécution des workflows.

## 5. Quality Gate et indicateurs de qualité

Le Quality Gate permet de déterminer si le code analysé respecte les critères de qualité définis dans SonarQube.

Les premiers résultats obtenus dans ce laboratoire sont les suivants :

| Indicateur | Résultat |
|---|---:|
| Sécurité | A |
| Fiabilité | A |
| Maintenabilité | A |
| Couverture des tests | 100 % |
| Duplication du code | 0 % |
| Quality Gate | Passed |

Ces résultats correspondent à une analyse réalisée sur la version actuelle de l'application. Ils pourront évoluer au fil des modifications du code.

## 6. Gestion des branches et Pull Requests

Le dépôt utilise une règle de protection sur la branche `main`.

Le processus de développement visé est le suivant :

```text
Création d'une branche
          |
          v
Développement
          |
          v
Tests locaux
          |
          v
Push sur GitHub
          |
          v
Création d'une Pull Request
          |
          v
Exécution des tests CI
          |
          v
Validation et revue
          |
          v
Fusion dans main
          |
          v
Analyse SonarQube
          |
          v
Vérification du Quality Gate
```

Dans la configuration actuelle de SonarQube Community Build :

- Les tests automatisés sont exécutés sur les Pull Requests.
- L'analyse SonarQube est exécutée sur les push vers `main`.
- La protection de branche impose la réussite des contrôles requis avant la fusion.

## 7. Feuille de route des expérimentations

Ce laboratoire est évolutif. Plusieurs expérimentations sont prévues afin d'approfondir les connaissances acquises.

- [x] Déployer SonarQube avec Docker Compose.
- [x] Configurer PostgreSQL et les volumes persistants.
- [x] Développer une API REST avec Node.js.
- [x] Mettre en place les tests automatisés.
- [x] Mesurer la couverture du code.
- [x] Intégrer SonarQube au projet.
- [x] Automatiser l'analyse avec GitHub Actions.
- [x] Configurer un runner auto-hébergé.
- [x] Mettre en place un Quality Gate.
- [x] Protéger la branche principale.
- [ ] Introduire volontairement des défauts dans le code.
- [ ] Étudier les règles de détection SonarQube.
- [ ] Expérimenter les vulnérabilités et les problèmes de sécurité.
- [ ] Renforcer la sécurité du pipeline CI/CD.
- [ ] Explorer l'utilisation de runners CI/CD conteneurisés.

## Conclusion

Ce projet constitue un environnement pratique d'apprentissage des outils et des mécanismes utilisés dans une chaîne DevOps moderne.

L'objectif est de comprendre non seulement comment configurer les différents outils, mais également comment ils collaborent pour améliorer la qualité, la fiabilité et la maintenabilité des applications.