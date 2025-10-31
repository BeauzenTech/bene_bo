import { UserGeneralKey } from '@/models/user.generalkey';

export class AuthService {
    private static checkInterval: NodeJS.Timeout | null = null;
    private static readonly CHECK_INTERVAL = 60000;

    static startTokenExpirationCheck(): void {
        this.stopTokenExpirationCheck();

        this.checkTokenExpiration();

        this.checkInterval = setInterval(() => {
            this.checkTokenExpiration();
        }, this.CHECK_INTERVAL);

    }

    static stopTokenExpirationCheck(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    static checkTokenExpiration(): void {
        const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
   
        if (!token) {
            return;
        }

        if (!UserGeneralKey.isTokenValid()) {
            console.warn('🔐 Token expiré détecté lors de la vérification proactive');
            this.handleTokenExpiration();
        }
    }


    static handleTokenExpiration(): void {
        UserGeneralKey.logout();

        this.showExpirationMessage();

        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    }


    private static showExpirationMessage(): void {

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

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

  
    static isAuthenticated(): boolean {
        const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
        return token ? UserGeneralKey.isTokenValid() : false;
    }

    static getTokenExpirationTime(): number | null {
        const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp;
            const now = Math.floor(Date.now() / 1000);
            const timeLeft = expiry - now;
            
            return Math.max(0, Math.floor(timeLeft / 60));
        } catch (error) {
            return null;
        }
    }
}
