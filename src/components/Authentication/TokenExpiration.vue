<template>
  <div v-if="showWarning" class="token-expiration-warning">
    <div class="alert alert-warning d-flex align-items-center" role="alert">
      <i class="fas fa-clock me-2"></i>
      <div>
        <strong>Attention :</strong> Votre session expirera dans {{ timeLeft }} minutes.
        <button @click="refreshSession" class="btn btn-sm btn-outline-warning ms-2">
          Rafraîchir la session
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { AuthService } from '@/service/auth.service';

const timeLeft = ref<number | null>(null);
const showWarning = ref(false);
let intervalId: NodeJS.Timeout | null = null;

const updateTimeLeft = () => {
  const remaining = AuthService.getTokenExpirationTime();
  timeLeft.value = remaining;
  
  // Affiche l'avertissement si moins de 10 minutes restent
  showWarning.value = remaining !== null && remaining <= 10 && remaining > 0;
};

const refreshSession = () => {
  // Ici vous pourriez implémenter un refresh token
  // Pour l'instant, on recharge la page
  window.location.reload();
};

onMounted(() => {
  // Met à jour immédiatement
  updateTimeLeft();
  
  // Met à jour toutes les minutes
  intervalId = setInterval(updateTimeLeft, 60000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.token-expiration-warning {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.alert {
  margin-bottom: 0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>
