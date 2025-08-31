# 🚀 Guide de Déploiement - Dashboard VaBene CRM

## 📋 Prérequis

- Docker et Docker Compose installés
- Accès SSH au serveur
- Le projet dashboard dans le dossier `apps/dashboard/`

## 🔧 Configuration

### 1. Structure des dossiers

Votre structure devrait ressembler à ceci :
```
/
├── docker-compose.yml
├── apps/
│   ├── backend/          # Backend Symfony
│   ├── website/          # Site Next.js
│   └── dashboard/        # Dashboard Vue.js (ce projet)
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
│       └── dashboard.conf
└── deploy-dashboard.sh
```

### 2. Configuration de l'API

Le dashboard est configuré pour utiliser l'API sur :
- **Production** : `https://82.25.97.47/api`
- **Local** : `http://localhost:8080`

## 🚀 Déploiement

### Étape 1 : Préparer le projet

```bash
# Exécuter le script de déploiement
./deploy-dashboard.sh
```

### Étape 2 : Vérifier la configuration

```bash
# Vérifier que tous les fichiers sont présents
ls -la apps/dashboard/

# Vérifier la configuration nginx
cat nginx/conf.d/dashboard.conf
```

### Étape 3 : Déployer avec Docker

```bash
# Construire et démarrer le dashboard
docker-compose up -d dashboard

# Vérifier les logs
docker-compose logs dashboard

# Vérifier le statut
docker-compose ps dashboard
```

### Étape 4 : Configurer le domaine (optionnel)

Si vous avez un domaine, modifiez `nginx/conf.d/dashboard.conf` :

```nginx
server_name dashboard.votre-domaine.com;  # Remplacez par votre domaine
```

## 🔍 Vérification

### Vérifier l'accessibilité

```bash
# Vérifier que le dashboard répond
curl -I http://localhost/dashboard

# Vérifier les logs nginx
docker-compose logs nginx
```

### Vérifier la connectivité API

```bash
# Tester l'API backend
curl -I https://82.25.97.47/api/health
```

## 🛠️ Dépannage

### Problèmes courants

1. **Dashboard ne se charge pas**
   ```bash
   # Vérifier les logs
   docker-compose logs dashboard
   
   # Redémarrer le service
   docker-compose restart dashboard
   ```

2. **Erreur de connexion API**
   - Vérifier que le backend fonctionne sur le port 9000
   - Vérifier la configuration CORS dans le backend

3. **Problèmes nginx**
   ```bash
   # Recharger la configuration nginx
   docker-compose exec nginx nginx -s reload
   ```

### Logs utiles

```bash
# Logs du dashboard
docker-compose logs -f dashboard

# Logs nginx
docker-compose logs -f nginx

# Logs backend
docker-compose logs -f backend
```

## 🔄 Mise à jour

Pour mettre à jour le dashboard :

```bash
# Arrêter le service
docker-compose stop dashboard

# Reconstruire l'image
docker-compose build dashboard

# Redémarrer
docker-compose up -d dashboard
```

## 📝 Variables d'environnement

Le dashboard utilise ces variables d'environnement :

- `NODE_ENV=production`
- `VUE_APP_API_URL=https://82.25.97.47/api`
- `VUE_APP_BASE_URL=https://82.25.97.47`

## 🔒 Sécurité

- Le dashboard est servi via nginx avec proxy
- L'API backend est accessible uniquement via nginx
- Utilisez HTTPS en production avec des certificats SSL

## 📞 Support

En cas de problème :
1. Vérifiez les logs Docker
2. Testez la connectivité réseau
3. Vérifiez la configuration nginx
4. Contactez l'équipe de développement
