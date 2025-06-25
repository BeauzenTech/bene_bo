import {UserModel} from "@/models/user.model";

export class UserGeneralKey {
    static readonly USER_TOKEN = "USER_TOKEN";
    static readonly USERNAME = "USERNAME";
    static readonly USER_ID = "USER_ID";
    static readonly USER_EMAIL = "USER_EMAIL";
    static readonly USER_FIRST_NAME = "USER_FIRST_NAME";
    static readonly USER_LAST_NAME = "USER_LAST_NAME";
    static readonly USER_ROLE = "USER_ROLE";
    static readonly USER_FRANCHISE_ID = "USER_FRANCHISE_ID";
    static readonly USER_RESTAURANT_ID = "USER_RESTAURANT_ID";
    static readonly USER_PROFIL_IMG = "USER_PROFIL_IMG";



    static isTokenValid() {
        const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
        if (!token) return false;
        try {
            // On décode le token
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Date d'expiration du token (en secondes)
            const expiry = payload.exp;
            // Timestamp actuel en secondes
            const now = Math.floor(Date.now() / 1000);
            // Vérifie si le token est encore valide
            return expiry > now;
        } catch (error) {
            // Si décodage échoue, on considère le token comme invalide
            return false;
        }
    }

    static logout(){
        this.clearAllUserData()
    }

    static saveUserDatA(user: UserModel){
        localStorage.setItem(UserGeneralKey.USER_ROLE, user.roles[0]);
        localStorage.setItem(UserGeneralKey.USER_ID, user.id);
        localStorage.setItem(UserGeneralKey.USER_EMAIL, user.email);
        localStorage.setItem(UserGeneralKey.USER_FIRST_NAME, user.first_name);
        localStorage.setItem(UserGeneralKey.USER_LAST_NAME, user.last_name);
        if (typeof user.profil_picture === "string") {
            localStorage.setItem(UserGeneralKey.USER_PROFIL_IMG, user.profil_picture)
        }
        if(user.franchises.length > 0){
            localStorage.setItem(UserGeneralKey.USER_FRANCHISE_ID, user.franchises[0].id);
            if(user.franchises[0].restaurants.length > 0){
                localStorage.setItem(UserGeneralKey.USER_RESTAURANT_ID, user.franchises[0].restaurants[0].id);
            }
        }
    }

    static clearAllUserData() {
        localStorage.removeItem(UserGeneralKey.USER_TOKEN);
        localStorage.removeItem(UserGeneralKey.USERNAME);
        localStorage.removeItem(UserGeneralKey.USER_ID);
        localStorage.removeItem(UserGeneralKey.USER_EMAIL);
        localStorage.removeItem(UserGeneralKey.USER_FIRST_NAME);
        localStorage.removeItem(UserGeneralKey.USER_LAST_NAME);
        localStorage.removeItem(UserGeneralKey.USER_ROLE);
        localStorage.removeItem(UserGeneralKey.USER_FRANCHISE_ID);
        localStorage.removeItem(UserGeneralKey.USER_RESTAURANT_ID);
        localStorage.removeItem(UserGeneralKey.USER_PROFIL_IMG);
    }

    static getRole(role){
        switch(role){
            case 'ROLE_ADMIN':
                return 'Administrateur'
            case 'ROLE_CLIENT':
                return 'Client'
            case 'ROLE_FRANCHISE':
                return 'Gestion - Franchise'
            case 'ROLE_RESTAURANT':
                return 'Gestion - Restaurant'
            default:
                return 'Utilisateur'

        }
    }

    static formatDateToFrenchLocale(dateString: string): string {
        const date = new Date(dateString);

        // Options pour le formatage de la date
        const dateOptions: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };

        // Options pour le formatage de l'heure
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // format 24h
        };

        // Formater la date et l'heure séparément
        const formattedDate = date.toLocaleDateString('fr-FR', dateOptions);
        const formattedTime = date.toLocaleTimeString('fr-FR', timeOptions);

        // Combiner les deux avec "à"
        return `${formattedDate} à ${formattedTime}`;
    }
}

export enum UserRole {
    FRANCHISE = 'ROLE_ADMIN',
    RESTAURANT = 'ROLE_RESTAURANT',
}