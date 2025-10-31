import {UserGeneralKey} from "@/models/user.generalkey";

export class Commons {
    static extractPublicId(url: string): string | null {
        try {
            const parts = url.split('/');
            const filename = parts[parts.length - 1]; // exemple : mon-image.png
            const publicId = filename.split('.')[0];  // on enlève l’extension
            return publicId || null;
        } catch (error) {
            console.error('Erreur lors de l’extraction du public_id :', error);
            return null;
        }
    }
}

