import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { AuthService } from '@/service/auth.service';

/**
 * Guard pour vérifier l'authentification
 */
export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  // Pages publiques qui ne nécessitent pas d'authentification
  const publicPages = [
    '/',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/email-confirmation',
    '/mot-passe-oublie'
  ];

  // Vérifie si la page actuelle est publique
  const isPublicPage = publicPages.some(page => to.path.startsWith(page));

  // Si c'est une page publique, on laisse passer
  if (isPublicPage) {
    next();
    return;
  }

  // Vérifie si l'utilisateur est authentifié
  if (!AuthService.isAuthenticated()) {
    console.warn('🔐 Utilisateur non authentifié, redirection vers login');
    
    // Déconnecte l'utilisateur pour nettoyer les données
    AuthService.handleTokenExpiration();
    
    // Redirige vers la page de login
    next('/');
    return;
  }

  // Utilisateur authentifié, on laisse passer
  next();
}

/**
 * Guard pour vérifier les permissions (optionnel)
 */
export function permissionGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  // Ici vous pourriez ajouter une logique de vérification des permissions
  // basée sur le rôle de l'utilisateur
  
  // Pour l'instant, on laisse passer
  next();
}
