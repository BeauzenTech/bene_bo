# 🔐 Système de Gestion des Tokens Expirés

## Vue d'ensemble

Ce système gère automatiquement l'expiration des tokens JWT et déconnecte l'utilisateur quand nécessaire.

## Composants du système

### 1. **Vérification automatique** (`AuthService`)
- Vérifie l'expiration des tokens toutes les minutes
- Déconnecte automatiquement l'utilisateur si le token est expiré
- Affiche une notification d'expiration

### 2. **Intercepteurs API** (`api.ts`)
- Intercepte les réponses 401 (Unauthorized) du serveur
- Déconnecte automatiquement l'utilisateur
- Redirige vers la page de login

### 3. **Guard de route** (`guards.ts`)
- Vérifie l'authentification avant chaque navigation
- Redirige vers login si l'utilisateur n'est pas authentifié

### 4. **Composant d'avertissement** (`TokenExpiration.vue`)
- Affiche un avertissement 10 minutes avant expiration
- Permet de rafraîchir la session

## Utilisation

### Vérification manuelle
```typescript
import { AuthService } from '@/service/auth.service';

// Vérifier si l'utilisateur est authentifié
if (!AuthService.isAuthenticated()) {
    // Rediriger vers login
}

// Obtenir le temps restant avant expiration (en minutes)
const timeLeft = AuthService.getTokenExpirationTime();
```

### Vérification du token
```typescript
import { UserGeneralKey } from '@/models/user.generalkey';

// Vérifier si le token est valide
if (!UserGeneralKey.isTokenValid()) {
    // Token expiré
}
```

## Fonctionnalités

### ✅ Automatique
- Vérification périodique des tokens
- Déconnexion automatique
- Redirection vers login
- Notification d'expiration

### ✅ Sécurisé
- Nettoyage des données utilisateur
- Vérification avant chaque requête API
- Protection des routes

### ✅ Utilisateur-friendly
- Avertissement avant expiration
- Message d'expiration clair
- Redirection automatique

## Configuration

### Intervalle de vérification
Modifiez `CHECK_INTERVAL` dans `AuthService` :
```typescript
private static readonly CHECK_INTERVAL = 60000; // 1 minute
```

### Délai d'avertissement
Modifiez dans `TokenExpiration.vue` :
```typescript
// Affiche l'avertissement si moins de 10 minutes restent
showWarning.value = remaining !== null && remaining <= 10 && remaining > 0;
```

## Pages publiques

Les pages suivantes ne nécessitent pas d'authentification :
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/email-confirmation`
- `/mot-passe-oublie`

## Dépannage

### Token expiré mais utilisateur toujours connecté
1. Vérifiez que `AuthService.startTokenExpirationCheck()` est appelé dans `main.ts`
2. Vérifiez les logs de la console pour les erreurs
3. Assurez-vous que les intercepteurs sont bien configurés

### Redirection en boucle
1. Vérifiez que les pages publiques sont bien listées dans `guards.ts`
2. Assurez-vous que le token est correctement stocké dans localStorage

## Logs utiles

Le système génère des logs pour le débogage :
- `🔐 Vérification automatique des tokens activée`
- `🔐 Token expiré détecté lors de la vérification proactive`
- `🔐 Token expiré détecté, déconnexion automatique...`
- `🔐 Utilisateur non authentifié, redirection vers login`
