# Système de détection automatique du fuseau horaire

## Vue d'ensemble

Le système de détection automatique du fuseau horaire permet à l'application de détecter automatiquement le fuseau horaire de la machine où elle s'exécute et d'adapter toutes les dates et heures en conséquence.

## Fonctionnalités

### 🔍 Détection automatique
- Détection automatique du fuseau horaire de la machine
- Fallback vers UTC si la détection échoue
- Sauvegarde du fuseau horaire dans localStorage pour éviter les re-détections

### 🌍 Support des fuseaux horaires
- Support de tous les fuseaux horaires courants
- Mapping automatique des offsets vers les fuseaux horaires IANA
- Gestion des changements d'heure (été/hiver)

### 📅 Fonctions utilitaires
- Formatage des dates dans le fuseau horaire local
- Conversion UTC ↔ Local
- Génération des heures et dates disponibles pour les commandes
- Validation des heures (pas d'heures passées)

## Utilisation

### Initialisation

```typescript
import { initializeTimezone } from '@/utils/timezone'

// Initialiser au démarrage de l'application
initializeTimezone()
```

### Détection du fuseau horaire

```typescript
import { getCurrentTimezone, detectTimezone } from '@/utils/timezone'

// Obtenir le fuseau horaire actuel (depuis localStorage ou détection)
const timezone = getCurrentTimezone()

// Forcer une nouvelle détection
const detectedTimezone = detectTimezone()
```

### Formatage des dates

```typescript
import { formatLocalDate, getCurrentLocalDateFormatted } from '@/utils/timezone'

// Formater une date dans le fuseau horaire local
const formattedDate = formatLocalDate('2024-01-15T14:30:00Z', 'dd/MM/yyyy - HH:mm')

// Obtenir la date actuelle formatée
const currentDate = getCurrentLocalDateFormatted('dd/MM/yyyy HH:mm:ss')
```

### Conversion de dates

```typescript
import { convertUtcToLocal, convertLocalToUtc } from '@/utils/timezone'

// Convertir UTC vers local
const localDate = convertUtcToLocal('2024-01-15T14:30:00Z')

// Convertir local vers UTC
const utcDate = convertLocalToUtc(new Date())
```

### Gestion des commandes

```typescript
import { 
  getAvailableDates, 
  getAvailableTimes, 
  formatDateForPayload,
  isTodayStillValid 
} from '@/utils/timezone'

// Obtenir les dates disponibles pour les commandes
const availableDates = getAvailableDates()

// Obtenir les heures disponibles pour une date
const availableTimes = getAvailableTimes('2024-01-15')

// Formater une date pour l'API
const apiDate = formatDateForPayload('2024-01-15', '14:30')

// Vérifier si aujourd'hui est encore valide
const isTodayValid = isTodayStillValid(21) // Avant 21h00
```

## Intégration dans les composants

### Composant Vue avec Composition API

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { 
  initializeTimezone, 
  getCurrentTimezone, 
  formatLocalDate 
} from '@/utils/timezone'

onMounted(() => {
  // Initialiser le fuseau horaire
  initializeTimezone()
  
  // Utiliser les fonctions
  const timezone = getCurrentTimezone()
})
</script>
```

### Composant Vue avec Options API

```vue
<script>
import { initializeTimezone, formatLocalDate } from '@/utils/timezone'

export default {
  mounted() {
    // Initialiser le fuseau horaire
    initializeTimezone()
  },
  
  methods: {
    formatDate(date) {
      return formatLocalDate(date, 'dd/MM/yyyy - HH:mm')
    }
  }
}
</script>
```

## Fuseaux horaires supportés

Le système supporte automatiquement les fuseaux horaires suivants :

### Europe
- `Europe/Paris` (UTC+1/+2)
- `Europe/London` (UTC+0/+1)
- `Europe/Moscow` (UTC+3)

### Amérique
- `America/New_York` (UTC-5/-4)
- `America/Chicago` (UTC-6/-5)
- `America/Denver` (UTC-7/-6)
- `America/Los_Angeles` (UTC-8/-7)

### Asie
- `Asia/Dubai` (UTC+4)
- `Asia/Kolkata` (UTC+5:30)
- `Asia/Bangkok` (UTC+7)
- `Asia/Shanghai` (UTC+8)
- `Asia/Tokyo` (UTC+9)

### Océanie
- `Australia/Sydney` (UTC+10/+11)
- `Pacific/Auckland` (UTC+12/+13)

## Stockage

Le fuseau horaire détecté est automatiquement sauvegardé dans localStorage avec la clé `APP_TIMEZONE`. Cela évite de re-détecter le fuseau horaire à chaque chargement de page.

## Gestion des erreurs

Si la détection du fuseau horaire échoue, le système utilise automatiquement UTC comme fallback et affiche un avertissement dans la console.

## Test

Un composant de test est disponible dans `src/components/TimezoneTest.vue` pour vérifier que la détection fonctionne correctement.

## Migration depuis l'ancien système

### Avant (GMT+2 codé en dur)
```typescript
const getGMT2Date = (date?: Date) => {
  const now = date || new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 2 * 3600000); // GMT+2 codé en dur
};
```

### Après (détection automatique)
```typescript
import { getCurrentLocalDate } from '@/utils/timezone'

const localDate = getCurrentLocalDate() // Détection automatique
```

## Avantages

1. **Automatique** : Aucune configuration manuelle requise
2. **Précis** : Utilise les fuseaux horaires IANA officiels
3. **Robuste** : Gestion des erreurs et fallback
4. **Performant** : Cache dans localStorage
5. **International** : Support de tous les fuseaux horaires
6. **Maintenable** : Code centralisé et réutilisable
