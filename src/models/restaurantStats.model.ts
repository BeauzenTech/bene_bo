export interface RestaurantStatsModel {
    restaurantId: string;
    restaurantName: string;
    semaine: {
        actuelle: number;
        precedente: number;
    };
    mois: {
        actuel: number;
    };
    annee: {
        actuelle: number;
    };
}
