# Étape 1 : build du projet Vue.js
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : serveur nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier le build final dans le dossier nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copie optionnelle d'une config nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]