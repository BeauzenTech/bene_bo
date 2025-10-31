<template>
  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <div class="d-flex align-items-center justify-content-between mb-20">
        <div>
          <h4 class="text-black fw-semibold mb-0">Horaires d'ouverture</h4>
          <p class="text-muted mb-0">Gérez les horaires d'ouverture de votre restaurant</p>
        </div>
        <div class="d-flex align-items-center gap-3">
          <div>
            <label class="form-label text-muted small mb-1">Restaurant</label>
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
          <router-link
              to="/opening-hours/add"
              class="default-btn transition border-0 fw-medium text-white pt-10 pb-10 ps-25 pe-25 rounded-1 fs-md-15 fs-lg-16 bg-success"
              :disabled="!selectedRestaurant"
          >
            <i class="flaticon-plus lh-1 me-1 position-relative top-2"></i>
            Ajouter des horaires
          </router-link>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <LoaderComponent />
      </div>

      <div v-else-if="formattedHours.length === 0" class="text-center py-5">
        <div class="mb-3">
          <i class="flaticon-clock text-muted" style="font-size: 3rem;"></i>
        </div>
        <h5 class="text-muted mb-2">Aucun horaire configuré</h5>
        <p class="text-muted mb-3">Commencez par configurer les horaires d'ouverture de votre restaurant.</p>
        <router-link
            to="/opening-hours/add"
            class="default-btn transition border-0 fw-medium text-white pt-10 pb-10 ps-25 pe-25 rounded-1 fs-md-15 fs-lg-16 bg-success"
        >
          <i class="flaticon-plus lh-1 me-1 position-relative top-2"></i>
          Configurer les horaires
        </router-link>
      </div>

      <div v-else class="row">
        <div class="col-12">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th class="text-black fw-semibold">Jour</th>
                  <th class="text-black fw-semibold">Statut</th>
                  <th class="text-black fw-semibold">Horaires</th>
                  <th class="text-black fw-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(day, index) in validFormattedHours" :key="index">
                  <td class="text-black fw-medium">
                    {{ getDayName(day.dayOfWeek || '') }}
                  </td>
                  <td>
                    <span 
                      class="badge"
                      :class="{
                        'bg-success': day.status === 'open',
                        'bg-warning': day.status === 'partial',
                        'bg-danger': day.status === 'closed'
                      }"
                    >
                      {{ getStatusText(day.status || 'closed') }}
                    </span>
                  </td>
                  <td>
                    <div v-if="day.schedules && Array.isArray(day.schedules) && day.schedules.length > 0">
                      <div v-for="(schedule, idx) in validSchedules(day.schedules)" :key="idx" class="mb-1">
                        <small class="text-muted">
                          <i class="flaticon-clock me-1"></i>
                          {{ formatTime(schedule.startTime) }} - {{ formatTime(schedule.endTime) }}
                          <span v-if="schedule.type === 'break'" class="text-warning">(Pause)</span>
                        </small>
                      </div>
                    </div>
                    <span v-else class="text-muted">Fermé</span>
                  </td>
                  <td>
                    <div class="d-flex gap-2">
                      <button
                          @click="editDay(day)"
                          class="btn btn-sm btn-outline-primary"
                          title="Modifier"
                      >
                        <i class="flaticon-edit"></i>
                      </button>
                      <button
                          @click="deleteDay(day)"
                          class="btn btn-sm btn-outline-danger"
                          title="Supprimer"
                      >
                        <i class="flaticon-delete"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import { 
  getOpeningHoursByRestaurant,
  deleteOpeningDay,
  deleteOpeningHour,
  listeRestaurant
} from "@/service/api";
import { UserGeneralKey } from "@/models/user.generalkey";
import { FormattedOpeningHours } from "@/models/openingHour.model";

export default defineComponent({
  name: "VabeneOpeningHoursList",
  components: {
    LoaderComponent
  },
  data() {
    return {
      isLoading: false,
      formattedHours: [] as any[],
      restaurantId: null as string | null,
      selectedRestaurant: null as string | null,
      restaurantOptions: [] as any[]
    }
  },
  methods: {
    async fetchOpeningHours() {
      this.isLoading = true;
      try {
        if (!this.restaurantId) {
          this.toast.error("ID du restaurant non trouvé");
          return;
        }
        
        const response = await getOpeningHoursByRestaurant(this.restaurantId);
        if (response && response.code === 200) {
          // Traiter le format de données de l'API
          const data = response.data;
          if (data && typeof data === 'object') {
            // Convertir l'objet en tableau pour l'affichage
            this.formattedHours = this.convertApiDataToArray(data);
          } else if (Array.isArray(data)) {
            this.formattedHours = data;
          } else if (data && Array.isArray(data.data)) {
            this.formattedHours = data.data;
          } else {
            this.formattedHours = [];
          }
        } else {
          // Si l'API n'est pas encore implémentée, utiliser des données de test
          console.warn("API des horaires d'ouverture non implémentée, utilisation de données de test");
          this.formattedHours = this.getMockData();
        }
      } catch (error) {
        console.error("Erreur lors du chargement des horaires:", error);
        this.toast.error("Erreur lors du chargement des horaires");
        this.formattedHours = [];
      } finally {
        this.isLoading = false;
      }
    },
    getDayName(dayOfWeek: string): string {
      const days = {
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche'
      };
      return days[dayOfWeek as keyof typeof days] || dayOfWeek;
    },
    getStatusText(status: string): string {
      const statuses = {
        open: 'Ouvert',
        partial: 'Partiel',
        closed: 'Fermé'
      };
      return statuses[status as keyof typeof statuses] || status;
    },
    formatTime(timeString: string): string {
      if (!timeString) return '';
      
      // Si c'est déjà au format HH:MM, le retourner tel quel
      if (timeString.match(/^\d{2}:\d{2}$/)) {
        return timeString;
      }
      
      // Si c'est au format HH:MM:SS, enlever les secondes
      if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
        return timeString.substring(0, 5);
      }
      
      return timeString;
    },
    editDay(day: any) {
      if (day && day.dayOfWeek) {
        this.$router.push({
          path: '/opening-hours/edit',
          query: { day: day.dayOfWeek }
        });
      }
    },
    async deleteDay(day: any) {
      if (!day || !day.dayOfWeek) return;
      
      if (confirm(`Êtes-vous sûr de vouloir supprimer les horaires du ${this.getDayName(day.dayOfWeek)} ?`)) {
        try {
          // Ici vous devriez implémenter la logique de suppression
          // en fonction de votre API
          this.toast.success("Horaires supprimés avec succès");
          await this.fetchOpeningHours();
        } catch (error) {
          this.toast.error("Erreur lors de la suppression");
        }
      }
    },
    validSchedules(schedules: any[]) {
      if (!schedules || !Array.isArray(schedules)) {
        return [];
      }
      return schedules.filter(schedule => schedule);
    },
    convertApiDataToArray(apiData: any): any[] {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const result: any[] = [];
      
      for (const day of days) {
        if (apiData[day]) {
          const dayData = apiData[day];
          result.push({
            dayOfWeek: day,
            status: dayData.isOpen ? 'open' : 'closed',
            schedules: dayData.schedules ? dayData.schedules.map((schedule: any) => ({
              type: schedule.type,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              description: schedule.description,
              isActive: schedule.isActive
            })) : []
          });
        }
      }
      
      return result;
    },
    getMockData() {
      return [
        {
          dayOfWeek: 'monday',
          status: 'open',
          schedules: [
            { type: 'opening', startTime: '09:00', endTime: '12:00', description: 'Ouverture matin' },
            { type: 'break', startTime: '12:00', endTime: '14:00', description: 'Pause déjeuner' },
            { type: 'opening', startTime: '14:00', endTime: '18:00', description: 'Ouverture après-midi' }
          ]
        },
        {
          dayOfWeek: 'tuesday',
          status: 'open',
          schedules: [
            { type: 'opening', startTime: '09:00', endTime: '18:00', description: 'Ouverture' }
          ]
        },
        {
          dayOfWeek: 'sunday',
          status: 'closed',
          schedules: []
        }
      ];
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
            await this.fetchOpeningHours();
          }
        } else {
          this.toast.error(response.message || "Erreur lors du chargement des restaurants");
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des restaurants");
        console.error(error);
      }
    },
    async onRestaurantChange(restaurantId: string) {
      console.log('Changement de restaurant:', restaurantId);
      
      if (restaurantId) {
        console.log('Début du changement de restaurant...');
        
        // Réinitialiser les données avant de charger les nouvelles
        this.formattedHours = [];
        this.isLoading = true;
        
        console.log('Données réinitialisées, chargement des nouvelles données...');
        
        // Mettre à jour l'ID du restaurant
        this.restaurantId = restaurantId;
        
        // Charger les nouvelles données
        await this.fetchOpeningHours();
        
        console.log('Changement de restaurant terminé');
      } else {
        console.log('restaurantId est vide ou null');
      }
    }
  },
  watch: {
    selectedRestaurant(newVal, oldVal) {
      console.log('selectedRestaurant watcher - ancien:', oldVal, 'nouveau:', newVal);
      if (newVal && newVal !== oldVal) {
        this.onRestaurantChange(newVal);
      }
    }
  },
  computed: {
    validFormattedHours() {
      if (!this.formattedHours || !Array.isArray(this.formattedHours)) {
        return [];
      }
      return this.formattedHours.filter(day => day);
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    // Charger les restaurants au lieu d'utiliser localStorage
    this.fetchRestaurants();
  }
});
</script>

<style scoped>
.table th {
  border-top: none;
  border-bottom: 1px solid #dee2e6;
}

.table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.75rem;
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
</style>
