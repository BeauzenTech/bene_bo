# Système de Gestion des Horaires d'Ouverture

## Vue d'ensemble

Le système de gestion des horaires d'ouverture permet aux restaurants de configurer leurs jours d'ouverture et leurs horaires détaillés. Il est similaire au système de gestion des zones de livraison et suit la même architecture.

## Fonctionnalités

### 1. Gestion des Jours d'Ouverture
- Configuration du statut de chaque jour (Ouvert, Fermé, Partiellement ouvert)
- Description personnalisée pour chaque jour
- Interface intuitive avec des cartes pour chaque jour de la semaine

### 2. Gestion des Horaires Détaillés
- Configuration des heures d'ouverture (début et fin)
- Gestion des pauses (optionnelles)
- Horaires différents pour chaque jour de la semaine

### 3. Interface Utilisateur
- Liste des horaires configurés avec vue d'ensemble
- Formulaire de configuration avec interface intuitive
- Breadcrumb de navigation
- Actions de modification et suppression

## Structure des Fichiers

### Modèles TypeScript
- `src/models/openingDay.model.ts` - Modèles pour les jours d'ouverture
- `src/models/openingHour.model.ts` - Modèles pour les horaires détaillés

### Composants Vue
- `src/components/Vabene/OpeningHours/OpeningHoursList/VabeneOpeningHoursList.vue` - Liste des horaires
- `src/components/Vabene/OpeningHours/AddOpeningHours/VabeneAddOpeningHours.vue` - Configuration des horaires

### Pages
- `src/pages/Vabene/OpeningHours/VabeneOpeningHoursPage.vue` - Page principale
- `src/pages/Vabene/OpeningHours/VabeneAddOpeningHoursPage.vue` - Page de configuration

### API
- Fonctions ajoutées dans `src/service/api.ts` pour la gestion des horaires

## Routes

- `/opening-hours` - Liste des horaires d'ouverture
- `/opening-hours/add` - Ajouter des horaires
- `/opening-hours/edit` - Modifier des horaires

## Navigation

Le lien "Horaires d'ouverture" a été ajouté dans la sidebar sous la section "Restaurants", juste après "Zones de livraison".

## API Endpoints

### Jours d'Ouverture
- `GET /v1/opening-days/restaurant/{restaurantId}` - Récupérer les jours d'ouverture
- `POST /v1/opening-days/bulk` - Créer/mettre à jour les jours en masse
- `DELETE /v1/opening-days/{dayId}` - Supprimer un jour d'ouverture

### Horaires Détaillés
- `GET /v1/opening-hours/restaurant/{restaurantId}/formatted` - Horaires formatés
- `GET /v1/opening-hours/restaurant/{restaurantId}` - Horaires détaillés
- `POST /v1/opening-hours/bulk` - Créer/mettre à jour les horaires en masse
- `DELETE /v1/opening-hours/{hourId}` - Supprimer un horaire

## Structure des Données

### Jour d'Ouverture
```typescript
interface OpeningDayModel {
  id: string;
  restaurantId: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  status: 'open' | 'closed' | 'partial';
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Horaire Détaillé
```typescript
interface OpeningHourModel {
  id: string;
  restaurantId: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  scheduleType: 'opening' | 'break';
  startTime: string;
  endTime: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Utilisation

1. **Accès** : Via la sidebar > Restaurants > Horaires d'ouverture
2. **Configuration** : Cliquer sur "Ajouter des horaires" pour configurer
3. **Gestion** : Utiliser les boutons d'action pour modifier ou supprimer

## Notes Techniques

- Le système utilise les mêmes patterns que les zones de livraison
- Gestion des erreurs avec toast notifications
- Interface responsive avec Bootstrap
- Validation des formulaires côté client
- Intégration avec le système d'authentification existant
