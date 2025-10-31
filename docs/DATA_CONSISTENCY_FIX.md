# Correction des Incohérences de Données - Dashboard VaBene

## 🔍 Incohérences Identifiées

### 1. **Mélange de Sources de Données**
- **Problème** : Les cartes utilisent `periodiqueReportCard` tandis que le graphique utilise `reportVente`
- **Impact** : Affichage de données incohérentes entre les cartes et le graphique

### 2. **Mauvais Mapping des Données dans les Cartes**
- **Problème** : La carte "Ventes cette semaine" affichait `currentMonth.value` au lieu de `currentWeek.value`
- **Impact** : Affichage de données incorrectes pour la période actuelle

### 3. **Incohérence dans les Labels**
- **Problème** : Certaines cartes n'affichent pas "CHF" de manière cohérente
- **Impact** : Interface utilisateur incohérente

### 4. **Données JSON vs Affichage**
D'après les données JSON fournies :
```json
{
  "current_week": 0,
  "previous_week": 98,
  "current_month": 0,
  "previous_month": 98,
  "current_year": 397
}
```

Mais l'affichage montrait :
- "Semaine passée" : 0 CHF (au lieu de 98 CHF)
- "Cette année" : 98 CHF (au lieu de 397 CHF)

## ✅ Corrections Apportées

### 1. **Correction des Cartes**
```vue
<!-- Avant -->
<h4>{{Math.floor(periodiqueReportCard.currentMonth.value)}} CHF</h4>

<!-- Après -->
<h4>{{Math.floor(periodiqueReportCard.currentWeek.value)}} CHF</h4>
```

### 2. **Ajout de "CHF" Manquant**
```vue
<!-- Avant -->
<h4>{{ Math.floor(periodiqueReportCard.lastWeek.value) }}</h4>

<!-- Après -->
<h4>{{ Math.floor(periodiqueReportCard.lastWeek.value) }} CHF</h4>
```

### 3. **Méthode de Vérification de Cohérence**
```javascript
checkDataConsistency() {
  // Compare les données des cartes avec celles du graphique
  // Affiche des logs de débogage pour identifier les incohérences
}
```

### 4. **Synchronisation des Données**
- Ajout d'appels à `checkDataConsistency()` après chaque récupération de données
- Vérification automatique de la cohérence entre les sources

## 🎯 Résultat Attendu

Après ces corrections :
1. **Cohérence** : Les cartes et le graphique affichent des données cohérentes
2. **Précision** : Les bonnes valeurs sont affichées pour chaque période
3. **Traçabilité** : Les logs permettent d'identifier rapidement les incohérences
4. **Maintenance** : Code plus robuste et facile à déboguer

## 🔧 Utilisation

1. **Ouvrir la console du navigateur** (F12)
2. **Recharger la page** pour voir les logs de vérification
3. **Vérifier les logs** :
   ```
   🔍 === VÉRIFICATION COHÉRENCE DES DONNÉES ===
   📊 Données periodiqueReportCard: {...}
   📈 Données reportVente: {...}
   🔍 Comparaison des totaux:
   Cette semaine - Carte: X, Graphique: Y
   ...
   ```

## 📝 Notes Techniques

- Les données `periodiqueReportCard` viennent de l'API `reportPeriodiqueCard`
- Les données `reportVente` viennent de l'API `reportVenteAdmin` ou `reportVenteRestaurant`
- Les deux sources doivent être synchronisées pour un affichage cohérent
