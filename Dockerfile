# Étape 1 : Builder l'application Vue.js
FROM node:18-alpine AS build-stage

WORKDIR /app

# Copier package.json et package-lock.json (ou yarn.lock) puis installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le reste du code source
COPY . .

# Builder l'application Vue.js pour la production
RUN npm run build

# Étape 2 : Servir les fichiers statiques avec Nginx
FROM nginx:stable-alpine AS production-stage

# Copier les fichiers buildés depuis la première étape vers le dossier que Nginx sert par défaut
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copier la configuration personnalisée de nginx (optionnel, sinon utilise la config par défaut)
# COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Commande par défaut pour lancer nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]