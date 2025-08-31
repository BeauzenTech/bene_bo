<template>
  <div class="timezone-test">
    <h3>Test de détection du fuseau horaire</h3>
    
    <div class="timezone-info">
      <div class="info-item">
        <strong>Fuseau horaire détecté:</strong> {{ detectedTimezone }}
      </div>
      
      <div class="info-item">
        <strong>Heure locale actuelle:</strong> {{ currentLocalTime }}
      </div>
      
      <div class="info-item">
        <strong>Heure UTC:</strong> {{ currentUtcTime }}
      </div>
      
      <div class="info-item">
        <strong>Offset local:</strong> {{ localOffset }}
      </div>
    </div>
    
    <div class="date-examples">
      <h4>Exemples de formatage de dates</h4>
      
      <div class="example-item">
        <strong>Date de commande (format local):</strong> {{ formatLocalDate(orderDate) }}
      </div>
      
      <div class="example-item">
        <strong>Date de commande (format UTC):</strong> {{ formatUtcDate(orderDate) }}
      </div>
    </div>
    
    <div class="available-times">
      <h4>Heures disponibles pour aujourd'hui</h4>
      <div class="times-list">
        <span v-for="time in availableTimes" :key="time" class="time-item">
          {{ time }}
        </span>
      </div>
    </div>
    
    <div class="available-dates">
      <h4>Dates disponibles</h4>
      <div class="dates-list">
        <div v-for="date in availableDates" :key="date.value" class="date-item">
          <strong>{{ date.value }}</strong> - {{ date.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  detectTimezone,
  getCurrentTimezone,
  getCurrentLocalDateFormatted,
  formatLocalDate,
  getAvailableTimes,
  getAvailableDates,
  initializeTimezone
} from '@/utils/timezone'

const detectedTimezone = ref('')
const currentLocalTime = ref('')
const currentUtcTime = ref('')
const localOffset = ref('')
const orderDate = ref('2024-01-15T14:30:00Z')
const availableTimes = ref<string[]>([])
const availableDates = ref<Array<{ value: string; label: string }>>([])

const formatUtcDate = (date: string) => {
  return new Date(date).toLocaleString('fr-FR', { timeZone: 'UTC' })
}

onMounted(() => {
  // Initialiser le fuseau horaire
  initializeTimezone()
  
  // Récupérer les informations
  detectedTimezone.value = getCurrentTimezone()
  currentLocalTime.value = getCurrentLocalDateFormatted('dd/MM/yyyy HH:mm:ss')
  currentUtcTime.value = new Date().toLocaleString('fr-FR', { timeZone: 'UTC' })
  localOffset.value = `${new Date().getTimezoneOffset() / -60} heures`
  
  // Récupérer les heures et dates disponibles
  availableTimes.value = getAvailableTimes(new Date().toISOString().split('T')[0])
  availableDates.value = getAvailableDates()
})
</script>

<style scoped>
.timezone-test {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 20px;
}

.timezone-info {
  margin: 20px 0;
}

.info-item {
  margin: 10px 0;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.date-examples {
  margin: 20px 0;
}

.example-item {
  margin: 10px 0;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #28a745;
}

.available-times {
  margin: 20px 0;
}

.times-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.time-item {
  padding: 4px 8px;
  background: #e9ecef;
  border-radius: 4px;
  font-size: 12px;
}

.available-dates {
  margin: 20px 0;
}

.date-item {
  margin: 5px 0;
  padding: 8px;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #ffc107;
}
</style>
