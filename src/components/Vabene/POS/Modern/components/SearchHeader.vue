<template>
  <div class="search-header">
    <div class="search-container">
      <!-- Logo/Icon -->
      <div class="logo-section">
        <div class="logo-icon">
          <i class="fas fa-utensils"></i>
        </div>
      </div>
      
      <!-- Barre de recherche -->
      <div class="search-section">
        <div class="search-input-container">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            v-model="localSearch"
            @input="handleInput"
            @keyup.enter="handleSearch"
            placeholder="Search Your Menu Here"
            class="search-input"
          />
          <button v-if="localSearch" @click="clearSearch" class="clear-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <!-- Section droite - Langues et utilisateur -->
      <div class="user-section">
        <!-- Sélecteur de langue -->
        <div class="language-selector">
          <button class="lang-btn active" title="English">
            <img src="/images/flags/uk.png" alt="UK" class="flag-icon" />
          </button>
          <button class="lang-btn" title="Deutsch">
            <img src="/images/flags/de.png" alt="DE" class="flag-icon" />
          </button>
        </div>
        
        <!-- Notifications -->
        <div class="notification-btn">
          <button class="notification-icon">
            <i class="fas fa-bell"></i>
            <span class="notification-badge">3</span>
          </button>
        </div>
        
        <!-- Informations utilisateur -->
        <div class="user-info">
          <div class="user-avatar">
            <img src="/images/avatars/cashier.jpg" alt="Courtney Henry" class="avatar-img" />
          </div>
          <div class="user-details">
            <div class="user-name">Courtney Henry</div>
            <div class="user-role">Cashier 1st Shift</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  search?: string
}

interface Emits {
  (e: 'search', query: string): void
  (e: 'update:search', query: string): void
}

const props = withDefaults(defineProps<Props>(), {
  search: ''
})

const emit = defineEmits<Emits>()

const localSearch = ref(props.search)

// Watcher pour synchroniser avec la prop
watch(() => props.search, (newVal) => {
  localSearch.value = newVal
})

const handleInput = () => {
  emit('update:search', localSearch.value)
  emit('search', localSearch.value)
}

const handleSearch = () => {
  emit('search', localSearch.value)
}

const clearSearch = () => {
  localSearch.value = ''
  emit('update:search', '')
  emit('search', '')
}
</script>

<style scoped>
.search-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.search-container {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 100%;
}

/* Logo Section */
.logo-section {
  flex-shrink: 0;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

/* Search Section */
.search-section {
  flex: 1;
  max-width: 500px;
}

.search-input-container {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 48px 0 48px;
  border: 2px solid #f3f4f6;
  border-radius: 12px;
  font-size: 16px;
  color: #1f2937;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.clear-btn:hover {
  color: #6b7280;
}

/* User Section */
.user-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.language-selector {
  display: flex;
  gap: 8px;
}

.lang-btn {
  width: 32px;
  height: 32px;
  border: 2px solid transparent;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lang-btn.active {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.lang-btn:hover:not(.active) {
  border-color: #d1d5db;
}

.flag-icon {
  width: 20px;
  height: 20px;
  border-radius: 2px;
}

.notification-btn {
  position: relative;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 16px;
  transition: all 0.2s ease;
}

.notification-icon:hover {
  background: #e5e7eb;
  color: #374151;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 12px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.user-info:hover {
  background: #f9fafb;
}

.user-avatar {
  flex-shrink: 0;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 1024px) {
  .user-details {
    display: none;
  }
}

@media (max-width: 768px) {
  .search-container {
    gap: 16px;
  }
  
  .language-selector {
    display: none;
  }
  
  .search-section {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .search-header {
    padding: 12px 16px;
  }
  
  .logo-section {
    display: none;
  }
}
</style> 