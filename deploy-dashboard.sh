#!/bin/bash

# Script pour déployer le dashboard dans la structure apps/
echo "🚀 Déploiement du dashboard VaBene..."

# Créer le dossier apps/dashboard s'il n'existe pas
mkdir -p apps/dashboard

# Copier tous les fichiers du projet vers apps/dashboard
echo "📁 Copie des fichiers..."
cp -r src apps/dashboard/
cp -r public apps/dashboard/
cp package*.json apps/dashboard/
cp Dockerfile apps/dashboard/
cp nginx.conf apps/dashboard/
cp babel.config.js apps/dashboard/
cp .env* apps/dashboard/ 2>/dev/null || true

# Créer un .dockerignore pour optimiser le build
echo "📝 Création du .dockerignore..."
cat > apps/dashboard/.dockerignore << EOF
node_modules
npm-debug.log
.git
.gitignore
README.md
.env.local
.env.development.local
.env.test.local
.env.production.local
dist
EOF

# Créer un fichier .env pour la production si nécessaire
if [ ! -f apps/dashboard/.env.production ]; then
    echo "🔧 Création du fichier .env.production..."
    cat > apps/dashboard/.env.production << EOF
NODE_ENV=production
VUE_APP_API_URL=https://82.25.97.47/api
VUE_APP_BASE_URL=https://82.25.97.47
EOF
fi

echo "✅ Déploiement terminé !"
echo "📋 Prochaines étapes :"
echo "1. Vérifiez que tous les fichiers sont dans apps/dashboard/"
echo "2. Modifiez la configuration nginx si nécessaire"
echo "3. Lancez : docker-compose up -d dashboard"
