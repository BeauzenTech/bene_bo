<template>
  <div class="card mb-25 border-0 rounded-0 bg-white letter-spacing">
    <div
        class="card-head box-shadow bg-white d-lg-flex align-items-center justify-content-between p-15 p-sm-20 p-md-25"
    >
      <div class="d-sm-flex align-items-center">
        <div class="me-3">
          <label class="form-label text-muted small mb-1">Restaurant</label>
          <v-select
              v-model="selectedRestaurant"
              :options="restaurantOptions"
              label="name"
              :reduce="restaurant => restaurant.id"
              placeholder="Sélectionner un restaurant"
              class="restaurant-select"
              @change="onRestaurantChange"
              @input="onRestaurantChange"
          />
        </div>
        <button
            @click="gotoCreate"
            class="default-btn position-relative transition border-0 fw-medium text-white pt-11 pb-11 ps-25 pe-25 pt-md-12 pb-md-12 ps-md-30 pe-md-30 rounded-1 bg-success fs-md-15 fs-lg-16 d-inline-block me-10 mb-10 mb-lg-0"
            type="button"
            :disabled="!selectedRestaurant"
        >
          Ajouter une zone de livraison
          <i class="flaticon-plus position-relative ms-5 fs-12"></i>
        </button>
      </div>
      <div class="d-flex align-items-center">
        <form class="search-box position-relative me-15" @submit.prevent>
          <input
              v-model="searchQuery"
              type="text"
              class="form-control shadow-none text-black rounded-0 border-0"
              placeholder="Rechercher une zone"
              @input="currentPage = 1"
          />
          <button
              type="submit"
              class="bg-transparent text-primary transition p-0 border-0"
          >
            <i class="flaticon-search-interface-symbol"></i>
          </button>
        </form>
        <button
            class="dot-btn lh-1 position-relative top-3 bg-transparent border-0 shadow-none p-0 transition d-inline-block"
            type="button"
        >
          <i class="flaticon-dots"></i>
        </button>
      </div>
    </div>
    <div class="card-body p-15 p-sm-20 p-md-25">
      <div class="table-responsive">
        <table class="table text-nowrap align-middle mb-0">
          <thead>
          <tr>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 ps-0"
            >
              NOM DE LA ZONE
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              MONTANT MINIMUM
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              FRAIS DE LIVRAISON
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              CODES POSTAUX
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              STATUS
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              CRÉÉ LE
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 text-end pe-0"
            ></th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="isLoading">
            <td colspan="7" class="text-center py-4">
              <LoaderComponent/>
            </td>
          </tr>
          <tr v-else-if="!isLoading && allZones.length > 0"
              v-for="zone in allZones" :key="zone.id"
          >
            <th
                class="shadow-none lh-1 fw-medium text-black-emphasis title ps-0 text-capitalize"
            >
              <div class="d-flex align-items-center text-capitalize">
                <div class="form-check mb-0 text-capitalize">
                  <input
                      class="form-check-input shadow-none"
                      type="checkbox"
                  />
                </div>
                <div
                    class="d-flex align-items-center ms-5 fs-md-15 fs-lg-16"
                >
                  <a href="#" @click="selectForDetail(zone)">
                    {{ zone.name }}
                  </a>
                </div>
              </div>
            </th>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              {{ formatCurrency(zone.minimumOrderAmount) }}
            </td>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              {{ zone.deliveryFee ? formatCurrency(zone.deliveryFee) : 'Gratuit' }}
            </td>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              <span class="badge bg-primary">{{ zone.postalCodes?.length || 0 }} codes</span>
            </td>
            <td>
              <!-- Toggle switch -->
              <div class="form-check form-switch">
                <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="zone.isActive"
                    @change="toggleZoneActivation(zone, zone.isActive)"
                />
              </div>
            </td>
            <td class="shadow-none lh-1 fw-medium text-muted">
              {{ convertDateCreate(zone.createdAt) }}
            </td>
            <td
                class="shadow-none lh-1 fw-medium text-body-tertiary text-end pe-0"
            >
              <div class="dropdown">
                <button
                    class="dropdown-toggle lh-1 bg-transparent border-0 shadow-none p-0 transition"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                  <i class="flaticon-dots"></i>
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a
                        class="dropdown-item d-flex align-items-center"
                        href="javascript:void(0);"
                        @click="selectForDetail(zone)"
                    ><i
                        class="flaticon-view lh-1 me-8 position-relative top-1"
                    ></i>
                      Voir</a
                    >
                  </li>
                  <li>
                    <a
                        class="dropdown-item d-flex align-items-center"
                        href="javascript:void(0);"
                        @click="selectForDetail(zone)"
                    ><i
                        class="flaticon-pen lh-1 me-8 position-relative top-1"
                    ></i>
                      Modifier</a
                    >
                  </li>
                  <li>
                    <a
                        class="dropdown-item d-flex align-items-center"
                        href="javascript:void(0);"
                        @click="viewPostalCodes(zone)"
                    ><i
                        class="flaticon-location lh-1 me-8 position-relative top-1"
                    ></i>
                      Codes postaux</a
                    >
                  </li>
                  <li>
                    <a
                        class="dropdown-item d-flex align-items-center"
                        data-bs-toggle="modal" data-bs-target="#confirmModal"
                        href="javascript:void(0);"
                        @click="selectForDelete(zone)"
                    ><i
                        class="flaticon-delete lh-1 me-8 position-relative top-1"
                    ></i>
                      Supprimer</a
                    >
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr v-else>
            <EmptyTable
                message="Aucune zone de livraison pour le moment"
                :colspan="7"
                textClass="text-muted"
            />
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal de confirmation de suppression -->
  <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmModalLabel">Confirmation de suppression</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <p class="mb-0">Êtes-vous sûr de vouloir supprimer cette zone de livraison ?<br>Cette action est irréversible.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="fas fa-times me-2"></i>Annuler
          </button>
          <button type="button" class="btn btn-danger" @click="confirmationDeleteAction(zoneSelected)" data-bs-dismiss="modal">
            <i class="fas fa-trash-alt me-2"></i>Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  getDeliveryZonesByRestaurant,
  deleteDeliveryZone,
  updateDeliveryZone,
  listeRestaurant,
  getRestaurantPostalCodes
} from "@/service/api";
import {UserGeneralKey} from "@/models/user.generalkey";
import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import {ApiResponse, PaginatedRestaurant} from "@/models/Apiresponse";
import {DeliveryZoneModel} from "@/models/deliveryZone.model";
import {RestaurantModel} from "@/models/restaurant.model";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {AxiosError} from "axios";

export default defineComponent({
  name: "VabeneDeliveryZoneList",
  components: {LoaderComponent, EmptyTable},
  data(){
    return{
      zonesResponse: null as ApiResponse<DeliveryZoneModel[]> | null,
      isLoading: false,
      currentPage: 1,
      searchQuery: '',
      originalZones: [] as DeliveryZoneModel[],
      zoneSelected: null,
      selectedRestaurant: null as string | null,
      restaurantOptions: [] as RestaurantModel[],
      postalCodesData: [] as any[],
    }
  },
  computed: {
    ActionCrud() {
      return ActionCrud
    },
    allZones(): DeliveryZoneModel[] {
      // Utiliser originalZones en priorité car il est mis à jour directement
      const zones = this.originalZones || this.zonesResponse?.data || [];
      console.log('allZones computed - zones disponibles:', zones.length);
      
      if (!this.searchQuery) return zones;
      const query = this.searchQuery.toLowerCase();
      return zones.filter(zone => {
        return (
            zone.name?.toLowerCase().includes(query) ||
            zone.description?.toLowerCase().includes(query)
        );
      });
    }
  },
  watch: {
    selectedRestaurant(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.onRestaurantChange(newVal);
      }
    }
  },
  methods: {
    formatCurrency(amount: number): string {
      return new Intl.NumberFormat('fr-CH', {
        style: 'currency',
        currency: 'CHF'
      }).format(amount);
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    async fetchRestaurants() {
      try {
        const response = await listeRestaurant(1) as any;
        console.log('Réponse API restaurants:', response);
        
        if (response.code === 200 && response.data) {
          this.restaurantOptions = response.data;
          if (this.restaurantOptions.length > 0) {
            this.selectedRestaurant = this.restaurantOptions[0].id;
            await this.onRestaurantChange(this.selectedRestaurant);
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
      
      if (restaurantId) {
        
        // Réinitialiser les données avant de charger les nouvelles
        this.zonesResponse = null;
        this.originalZones = [];
        this.postalCodesData = [];
        
        
        // Charger les nouvelles données
        await this.fetchZones(restaurantId);
        await this.fetchPostalCodes(restaurantId);
      } 
    },
    async fetchPostalCodes(restaurantId: string) {
      try {
        const response = await getRestaurantPostalCodes(restaurantId) as any;
        if (response.code === 200) {
          this.postalCodesData = response.data || [];
          console.log('Codes postaux du restaurant:', this.postalCodesData);
        } else {
          console.error("Erreur lors du chargement des codes postaux:", response.message);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des codes postaux:", error);
      }
    },
    gotoCreate(){
      if (!this.selectedRestaurant) {
        this.toast.error("Veuillez sélectionner un restaurant");
        return;
      }
      this.$router.push({
        name: "VabeneAddDeliveryZonePage",
        query: { restaurantId: this.selectedRestaurant }
      });
    },
    selectForDetail(zone){
      this.zoneSelected = zone;
      this.$router.push({
        name: "VabeneEditDeliveryZonePage",
        params: { zoneID: zone.id }
      });
    },
    selectForDelete(zone){
      this.zoneSelected = zone;
    },
    viewPostalCodes(zone) {
      console.log('Navigation vers les codes postaux de la zone:', zone.id);
      this.$router.push({
        name: 'VabenePostalCodesPage',
        params: { zoneId: zone.id },
        query: { zoneName: zone.name }
      });
    },
    async toggleZoneActivation(zone, isActive){
      // Convertir le booléen en nombre (true -> 1, false -> 0)
      const status = isActive ? 1 : 0;
      
      const payload = {
        'isActive': isActive  // Envoie true/false à l'API
      }
      
      console.log('Toggle zone activation:', { zoneId: zone.id, isActive, payload });
      
      try {
        const response = await updateDeliveryZone(zone.id, payload) as ApiResponse<any>;
        if (response.code === 200 || response.code === 201) {
          this.toast.success(response.message);
        } else {
          // En cas d'erreur, revenir à l'état précédent
          zone.isActive = !isActive;
          this.toast.error(response.message);
        }
      } catch (error) {
        // En cas d'erreur, revenir à l'état précédent
        zone.isActive = !isActive;
        this.toast.error("Erreur lors de la mise à jour de la zone");
        console.error(error);
      }
    },
    async confirmationDeleteAction(zone){
      try {
        const response = await deleteDeliveryZone(zone.id) as ApiResponse<any>;
        if (response.code === 200 || response.code === 201) {
          this.toast.success(response.message);
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors de la suppression de la zone");
        console.error(error);
      } finally {
        setTimeout(() =>  {
          this.fetchZones(this.selectedRestaurant || undefined);
        }, 2000);
      }
    },
    async fetchZones(restaurantId?: string) {
      this.isLoading = true;
      try {
        const targetRestaurantId = restaurantId || this.selectedRestaurant;
        if (!targetRestaurantId) {
          this.toast.error("ID du restaurant non trouvé");
          return;
        }
        
        console.log('Chargement des zones pour le restaurant:', targetRestaurantId);
        const response = await getDeliveryZonesByRestaurant(targetRestaurantId) as any;
        console.log('Réponse API zones de livraison:', response);
        
        if (response.code === 200) {
          this.zonesResponse = response;
          if (response.data) {
            this.originalZones = response.data;
            console.log('Zones chargées:', this.originalZones.length);
          } else {
            this.originalZones = [];
            console.log('Aucune zone trouvée pour ce restaurant');
          }
        } else {
          this.toast.error(response.message || "Erreur lors du chargement des zones");
          this.originalZones = [];
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des zones de livraison");
        console.error(error);
        this.originalZones = [];
      } finally {
        this.isLoading = false;
      }
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchRestaurants();
  }
});
</script>

<style scoped>
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
