<template>
  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <form @submit.prevent="saveOpeningHours">
        <div class="row">
          <div class="col-md-12">
            <div class="d-flex align-items-center justify-content-between mb-20">
              <div>
                <h4 class="text-black fw-semibold mb-0">Configuration des horaires</h4>
                <p class="text-muted mb-0">Définissez les jours d'ouverture et les horaires de votre restaurant</p>
              </div>
              <button
                  type="button"
                  @click="goBack"
                  class="bg-transparent p-0 border-0 text-danger lh-1 fw-medium"
              >
                <i class="flaticon-delete lh-1 me-1 position-relative top-2"></i>
                <span class="position-relative">Annuler</span>
              </button>
            </div>
          </div>

          <!-- Sélection du restaurant -->
          <div class="col-md-12">
            <h5 class="text-black fw-semibold mb-15">Restaurant</h5>
            <div class="row">
              <div class="col-md-6">
                <label class="form-label text-black fw-medium">Restaurant</label>
                <v-select
                    v-model="selectedRestaurant"
                    :options="restaurantOptions"
                    label="name"
                    :reduce="restaurant => restaurant.id"
                    placeholder="Sélectionner un restaurant"
                    class="restaurant-select"
                    @change="onRestaurantChange"
                />
              </div>
            </div>
          </div>

          <!-- Configuration des jours d'ouverture -->
          <div class="col-md-12">
            <h5 class="text-black fw-semibold mb-15">Jours d'ouverture</h5>
            <div class="row">
              <div 
                v-for="day in daysOfWeek" 
                :key="day.value" 
                class="col-md-6 col-lg-4 mb-15"
              >
                <div class="card border">
                  <div class="card-body p-15">
                    <div class="d-flex align-items-center justify-content-between mb-10">
                      <h6 class="text-black fw-semibold mb-0">{{ day.label }}</h6>
                      <div class="form-check form-switch">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`day-${day.value}`"
                            v-model="openingDays[day.value].enabled"
                            @change="toggleDay(day.value)"
                        />
                        <label class="form-check-label" :for="`day-${day.value}`">
                          {{ (openingDays[day.value] && openingDays[day.value].enabled) ? 'Ouvert' : 'Fermé' }}
                        </label>
                      </div>
                    </div>
                    
                    <div v-if="openingDays[day.value] && openingDays[day.value].enabled">
                      <div class="mb-10">
                        <label class="form-label text-black fw-medium">Statut</label>
                        <select 
                          class="form-select" 
                          v-model="openingDays[day.value].status"
                        >
                          <option value="open">Ouvert</option>
                          <option value="partial">Partiellement ouvert</option>
                        </select>
                      </div>
                      
                      <div class="mb-10">
                        <label class="form-label text-black fw-medium">Description</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="openingDays[day.value].description"
                            :placeholder="`Description pour ${day.label}`"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuration des horaires -->
          <div class="col-md-12">
            <h5 class="text-black fw-semibold mb-15">Horaires détaillés</h5>
            <div v-for="day in daysOfWeek" :key="day.value">
              <div v-if="openingDays[day.value].enabled" class="mb-20">
                <h6 class="text-black fw-medium mb-10">{{ day.label }}</h6>
                <div class="row">
                  <div class="col-md-6">
                    <div class="card border">
                      <div class="card-body p-15">
                        <h6 class="text-black fw-medium mb-10">Ouverture</h6>
                        <div class="row">
                          <div class="col-6">
                            <label class="form-label text-black fw-medium">Début</label>
                            <input
                                type="time"
                                class="form-control"
                                v-model="openingDays[day.value].openingStart"
                            />
                          </div>
                          <div class="col-6">
                            <label class="form-label text-black fw-medium">Fin</label>
                            <input
                                type="time"
                                class="form-control"
                                v-model="openingDays[day.value].openingEnd"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <div class="card border">
                      <div class="card-body p-15">
                        <h6 class="text-black fw-medium mb-10">Pause (optionnelle)</h6>
                        <div class="form-check form-switch mb-10">
                          <input
                              class="form-check-input"
                              type="checkbox"
                              :id="`break-${day.value}`"
                              v-model="openingDays[day.value].hasBreak"
                          />
                          <label class="form-check-label" :for="`break-${day.value}`">
                            Pause déjeuner
                          </label>
                        </div>
                        <div v-if="openingDays[day.value].hasBreak" class="row">
                          <div class="col-6">
                            <label class="form-label text-black fw-medium">Début pause</label>
                            <input
                                type="time"
                                class="form-control"
                                v-model="openingDays[day.value].breakStart"
                            />
                          </div>
                          <div class="col-6">
                            <label class="form-label text-black fw-medium">Fin pause</label>
                            <input
                                type="time"
                                class="form-control"
                                v-model="openingDays[day.value].breakEnd"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="col-md-12">
            <div class="d-flex align-items-center justify-content-between">
              <LoaderComponent v-if="isLoading" />
              <button 
                v-else
                type="submit"
                class="default-btn transition border-0 fw-medium text-white pt-10 pb-10 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-35 pe-md-35 rounded-1 fs-md-15 fs-lg-16 bg-success"
                :disabled="!isFormValid"
                :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
              >
                <i class="flaticon-check lh-1 me-1 position-relative top-2"></i>
                Enregistrer les horaires
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import { 
  createBulkOpeningDays,
  createBulkOpeningHours,
  getOpeningDaysByRestaurant,
  getDetailedOpeningHours,
  listeRestaurant
} from "@/service/api";
import { UserGeneralKey } from "@/models/user.generalkey";
import { CreateOpeningHourRequest } from "@/models/openingHour.model";
import { CreateOpeningDayRequest } from "@/models/openingDay.model";

interface DayConfig {
  enabled: boolean;
  status: 'open' | 'partial';
  description: string;
  openingStart: string;
  openingEnd: string;
  hasBreak: boolean;
  breakStart: string;
  breakEnd: string;
}

export default defineComponent({
  name: "VabeneAddOpeningHours",
  components: {
    LoaderComponent
  },
  data() {
    const daysOfWeek = [
      { value: 'monday', label: 'Lundi' },
      { value: 'tuesday', label: 'Mardi' },
      { value: 'wednesday', label: 'Mercredi' },
      { value: 'thursday', label: 'Jeudi' },
      { value: 'friday', label: 'Vendredi' },
      { value: 'saturday', label: 'Samedi' },
      { value: 'sunday', label: 'Dimanche' }
    ];
    
    // Initialiser openingDays immédiatement
    const openingDays: Record<string, DayConfig> = {};
    daysOfWeek.forEach(day => {
      openingDays[day.value] = {
        enabled: false,
        status: 'open',
        description: '',
        openingStart: '09:00',
        openingEnd: '18:00',
        hasBreak: false,
        breakStart: '12:00',
        breakEnd: '14:00'
      };
    });
    
    return {
      isLoading: false,
      restaurantId: null as string | null,
      selectedRestaurant: null as string | null,
      restaurantOptions: [] as any[],
      daysOfWeek,
      openingDays
    }
  },
  computed: {
    isFormValid(): boolean {
      const enabledDays = Object.values(this.openingDays).filter(day => day && day.enabled);
      return enabledDays.length > 0;
    }
  },
  methods: {
    initializeDays() {
      // L'initialisation se fait déjà dans data(), cette méthode est maintenant optionnelle
      console.log('OpeningDays initialized:', this.openingDays);
    },
    async fetchRestaurants() {
      try {
        const response = await listeRestaurant(1) as any;
        console.log('Réponse API restaurants:', response);
        
        if (response.code === 200 && response.data) {
          this.restaurantOptions = response.data;
          console.log('Restaurants chargés:', this.restaurantOptions.length);
          
          // Sélectionner le premier restaurant par défaut
          if (this.restaurantOptions.length > 0) {
            this.selectedRestaurant = this.restaurantOptions[0].id;
            this.restaurantId = this.selectedRestaurant;
            console.log('Restaurant sélectionné par défaut:', this.selectedRestaurant);
          }
        } else {
          this.toast.error(response.message || "Erreur lors du chargement des restaurants");
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des restaurants");
        console.error(error);
      }
    },
    onRestaurantChange(restaurantId: string) {
      console.log('Changement de restaurant:', restaurantId);
      this.restaurantId = restaurantId;
    },
    toggleDay(dayValue: string) {
      const day = this.openingDays[dayValue];
      if (!day.enabled) {
        // Reset values when disabling
        day.status = 'open';
        day.description = '';
        day.openingStart = '09:00';
        day.openingEnd = '18:00';
        day.hasBreak = false;
        day.breakStart = '12:00';
        day.breakEnd = '14:00';
      }
    },
    async saveOpeningHours() {
      this.isLoading = true;
      try {
        if (!this.selectedRestaurant) {
          this.toast.error("Veuillez sélectionner un restaurant");
          return;
        }

        // Préparer les données des jours d'ouverture
        const daysData: CreateOpeningDayRequest[] = [];
        const schedulesData: CreateOpeningHourRequest[] = [];

        Object.entries(this.openingDays).forEach(([dayOfWeek, config]) => {
          if (config && config.enabled) {
            // Ajouter le jour d'ouverture
            daysData.push({
              dayOfWeek: dayOfWeek as any,
              status: config.status || 'open',
              description: config.description || ''
            });

            // Ajouter les horaires d'ouverture
            if (config.openingStart && config.openingEnd) {
              schedulesData.push({
                dayOfWeek: dayOfWeek as any,
                scheduleType: 'opening',
                startTime: config.openingStart,
                endTime: config.openingEnd,
                description: 'Ouverture'
              });
            }

            // Ajouter la pause si configurée
            if (config.hasBreak && config.breakStart && config.breakEnd) {
              schedulesData.push({
                dayOfWeek: dayOfWeek as any,
                scheduleType: 'break',
                startTime: config.breakStart,
                endTime: config.breakEnd,
                description: 'Pause déjeuner'
              });
            }
          }
        });

        // Envoyer les données
        if (daysData.length > 0) {
          try {
            await createBulkOpeningDays(this.selectedRestaurant, daysData);
          } catch (error) {
            console.warn("API createBulkOpeningDays non implémentée:", error);
          }
        }
        
        if (schedulesData.length > 0) {
          try {
            await createBulkOpeningHours(this.selectedRestaurant, schedulesData);
          } catch (error) {
            console.warn("API createBulkOpeningHours non implémentée:", error);
          }
        }

        this.toast.success("Horaires enregistrés avec succès");
        this.$router.push('/opening-hours');
      } catch (error) {
        console.error("Erreur lors de l'enregistrement des horaires:", error);
        this.toast.error("Erreur lors de l'enregistrement des horaires");
      } finally {
        this.isLoading = false;
      }
    },
    goBack() {
      this.$router.back();
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    // Charger les restaurants au lieu d'utiliser localStorage
    this.fetchRestaurants();
    this.initializeDays();
  }
});
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.restaurant-select {
  min-width: 200px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.vs--searchable .vs__dropdown-toggle, .vs__search, .vs__search:focus {
  padding: 4px 6px 6px !important;
  font-size: 13px;
  color: rgba(132, 128, 128, 0.712);
}

.vs__search, .vs__search:focus, input.vs__search{
  font-size: 13px;
  color: rgba(132, 128, 128, 0.712);
}

.form-check-input:checked {
  background-color: #28a745;
  border-color: #28a745;
}

.form-select, .form-control {
  border-radius: 0.375rem;
}

.form-label {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}
</style>
