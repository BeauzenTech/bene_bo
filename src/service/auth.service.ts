import { UserGeneralKey } from '@/models/user.generalkey';

export class AuthService {
    private static checkInterval: NodeJS.Timeout | null = null;
    private static readonly CHECK_INTERVAL = 60000; // Vérification toutes les minutes

    /**
     * Démarre la vérification automatique des tokens expirés
     */
    static startTokenExpirationCheck(): void {
        // Arrête la vérification précédente si elle existe
        this.stopTokenExpirationCheck();

        // Vérifie immédiatement
        this.checkTokenExpiration();

        // Configure la vérification périodique
        this.checkInterval = setInterval(() => {
            this.checkTokenExpiration();
        }, this.CHECK_INTERVAL);

    }

    /**
     * Arrête la vérification automatique des tokens
     */
    static stopTokenExpirationCheck(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    /**
     * Vérifie si le token est expiré et déconnecte si nécessaire
     */
    static checkTokenExpiration(): void {
        const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
        
        // Si pas de token, pas besoin de vérifier
        if (!token) {
            return;
        }

        // Vérifie si le token est valide
        if (!UserGeneralKey.isTokenValid()) {
            console.warn('🔐 Token expiré détecté lors de la vérification proactive');
            this.handleTokenExpiration();
        }
    }

    /**
     * Gère l'expiration du token
     */
    static handleTokenExpiration(): void {
        // Déconnecte l'utilisateur
        UserGeneralKey.logout();

        // Affiche un message à l'utilisateur
        this.showExpirationMessage();

        // Redirige vers la page de login après un délai
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    }

    /**
     * Affiche un message d'expiration à l'utilisateur
     */
    private static showExpirationMessage(): void {
        // Crée une notification temporaire
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        notification.textContent = '🔐 Votre session a expiré. Redirection vers la page de connexion...';
        
        document.body.appendChild(notification);

        // Supprime la notification après 3 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    /**
     * Vérifie si l'utilisateur est connecté
     */
    static isAuthenticated(): boolean {
        const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
        return token ? UserGeneralKey.isTokenValid() : false;
    }

    /**
     * Obtient le temps restant avant expiration du token (en minutes)
     */
    static getTokenExpirationTime(): number | null {
        const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp;
            const now = Math.floor(Date.now() / 1000);
            const timeLeft = expiry - now;
            
            return Math.max(0, Math.floor(timeLeft / 60)); // Retourne en minutes
        } catch (error) {
            return null;
        }
    }
}
