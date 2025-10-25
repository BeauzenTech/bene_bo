<template>
  <div class="card mb-25 border-0 rounded-0 bg-white letter-spacing">
    <div
      class="card-head box-shadow bg-white d-lg-flex align-items-center justify-content-between p-15 p-sm-20 p-md-25">
      <div class="d-sm-flex align-items-center">
        <!--        <Button-->
        <!--            @click="gotoCreate"-->
        <!--            class="default-btn position-relative transition border-0 fw-medium text-white pt-11 pb-11 ps-25 pe-25 pt-md-12 pb-md-12 ps-md-30 pe-md-30 rounded-1 bg-success fs-md-15 fs-lg-16 d-inline-block me-10 mb-10 mb-lg-0"-->
        <!--            type="button"-->

        <!--        >-->
        <!--             Ajouter une commande-->

        <!--          <i class="flaticon-plus position-relative ms-5 fs-12"></i>-->
        <!--        </Button>-->
        <!--        <button-->
        <!--            class="default-outline-btn position-relative transition fw-medium text-black pt-10 pb-10 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-30 pe-md-30 rounded-1 bg-transparent fs-md-15 fs-lg-16 d-inline-block mb-10 mb-lg-0"-->
        <!--            type="button"-->
        <!--        >-->
        <!--          Export-->
        <!--          <i class="flaticon-file-1 position-relative ms-5 top-2 fs-15"></i>-->
        <!--        </button>-->
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
      </div>
      </div>
      <div class="d-flex align-items-center">
        <form class="search-box position-relative me-15" @submit.prevent>
          <input v-model="searchQuery" type="text" class="form-control shadow-none text-black rounded-0 border-0"
            placeholder="Rechercher une commande" @input="handleSearch" />
          <button type="submit" class="bg-transparent text-primary transition p-0 border-0">
            <i class="flaticon-search-interface-symbol"></i>
          </button>
        </form>
        <button
          class="dot-btn lh-1 position-relative top-3 bg-transparent border-0 shadow-none p-0 transition d-inline-block"
          type="button">
          <i class="flaticon-dots"></i>
        </button>
      </div>
    </div>
    <div class="card-body p-15 p-sm-20 p-md-25">
      <div class="table-responsive">
        <table class="table text-nowrap align-middle mb-0">
          <thead>
            <tr>
              <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 ps-0">
                REF
              </th>
              <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                TYPE
              </th>
              <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                CLIENT
              </th>
              <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                MONTANT
              </th>
              <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                CRÉER LE
              </th>
              <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                COMMANDE STATUS
              </th>
              <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                PAIEMENT STATUS
              </th>
              <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                NUMÉRO TÉLÉPHONE
              </th>
              <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 text-end pe-0">
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="8" class="text-center py-4">
                <LoaderComponent />
              </td>
            </tr>
            <tr v-else-if="!isLoading && allOrder.length > 0" v-for="order in allOrder" :key="order.id">

              <th class="shadow-none lh-1 fw-medium text-black-emphasis title ps-0 text-capitalize">
                <div class="d-flex align-items-center text-capitalize">
                  <div class="form-check mb-0 text-capitalize">
                    <input class="form-check-input shadow-none" type="checkbox" />
                  </div>
                  <div class="d-flex align-items-center ms-5 fs-md-15 fs-lg-16">
                    <a href="#" @click="selectionOrder(order)">
                      {{ getOrderTransactionReference(order) }}
                    </a>
                  </div>
                </div>
              </th>
              <td class="shadow-none lh-1 fw-medium text-muted ">
                <span v-if="order.order_type === 'click_collect'" class="badge text-bg-secondary fs-13">À
                  emporter</span>
                <span v-if="order.order_type === 'dine_in'" class="badge text-bg-info fs-13">Sur place</span>
                <span v-if="order.order_type === 'delivery'" class="badge text-bg-success fs-13">À livrer</span>
              </td>

              <td class="shadow-none lh-1 fw-medium text-black-emphasis">
                {{ getOrderCustomerName(order) }}
              </td>
              <td class="shadow-none lh-1 fw-medium text-black-emphasis ">
                {{ getOrderTotal(order) }} CHF
              </td>
              <td v-if="getOrderItems(order).length > 0" class="shadow-none lh-1 fw-medium text-black-emphasis">
              
               {{ formatInTimeZone(order.created_at, 'Europe/Zurich', 'dd/MM/yyyy HH:mm') }} 

              </td>
              <td v-else class="shadow-none lh-1 fw-medium text-black-emphasis">
                <span>-</span>
              </td>
              <td class="shadow-none lh-1 fw-medium text-muted ">
                <span v-if="order.status === 'pending'" class="badge text-bg-warning fs-13">En attente</span>
                <span v-if="order.status === 'processing'" class="badge text-bg-info fs-13">En cours de
                  traitement</span>
                <span v-if="order.status === 'ready_for_delivery'" class="badge text-bg-warning fs-13">Prêt pour
                  livraison</span>
                <span v-if="order.status === 'out_for_delivery'" class="badge text-bg-secondary fs-13">En cours de
                  livraison</span>
                <span v-if="order.status === 'delivered'" class="badge text-bg-primary fs-13">Livré</span>
                <span v-if="order.status === 'cancelled'" class="badge text-bg-danger fs-13">Annulé</span>
              </td>
              <td class="shadow-none lh-1 fw-medium text-muted" v-if="getOrderPayment(order)">
                <span v-if="getOrderPayment(order).status === 'pending'" class="badge text-outline-danger">En attente de
                  paiement</span>
                <span v-if="getOrderPayment(order).status === 'paid'" class="badge text-outline-primary">Payé</span>
                <span v-if="getOrderPayment(order).status === 'refunded'" class="badge text-outline-muted">A remboursé</span>
                <span v-if="getOrderPayment(order).status === 'cancelled'" class="badge text-outline-warning">Annuler</span>

              </td>
              <td>
                <span v-if="getOrderCustomerPhone(order) !== '-'" class="badge text-bg-secondary fs-13">{{ getOrderCustomerPhone(order) }}</span>
                <span v-else class="badge text-black-emphasis fs-13">-</span>
              </td>
              <td class="shadow-none lh-1 fw-medium text-body-tertiary text-end pe-0">
                <div class="dropdown">
                  <button class="dropdown-toggle lh-1 bg-transparent border-0 shadow-none p-0 transition" type="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="flaticon-dots"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item d-flex align-items-center" href="javascript:void(0);"
                        @click="selectionOrder(order)"><i class="flaticon-view lh-1 me-8 position-relative top-1"></i>
                        Voir</a>
                    </li>
                    <li>
                      <a class="dropdown-item d-flex align-items-center" href="javascript:void(0);"
                        @click="selectionOrder(order)"><i class="flaticon-pen lh-1 me-8 position-relative top-1"></i>
                        Editer</a>
                    </li>
                    <li>
                      <a class="dropdown-item d-flex align-items-center" data-bs-toggle="modal"
                        data-bs-target="#confirmModal" href="javascript:void(0);" @click="selectionOrder(order)"><i
                          class="flaticon-delete lh-1 me-8 position-relative top-1"></i>
                        Supprimer</a>
                    </li>
                  </ul>
                </div>
              </td>

            </tr>
            <tr v-else>
              <EmptyTable message="Aucune commande pour le moment" :colspan="8" textClass="text-muted" />
            </tr>

          </tbody>
        </table>
      </div>
      <div class="pagination-area d-md-flex mt-15 mt-sm-20 mt-md-25 justify-content-between align-items-center"
        style="max-width: 100%; overflow-x: auto;">
        <p class="mb-0 text-paragraph" style="min-width: 100px; text-align: center;">
          {{ paginationInfo }}
        </p>
        <nav class="mt-15 mt-md-0">
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" aria-label="Previous" @click.prevent="changePage(currentPage - 1)">
                <i class="flaticon-chevron-1"></i>
              </a>
            </li>
            <li v-for="page in generatePageNumbers()" :key="page" class="page-item"
              :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="changePage(page)"> {{ page }}</a>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" aria-label="Next" @click.prevent="changePage(currentPage + 1)">
                <i class="flaticon-chevron"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>




  <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmModalLabel">Confirmation de suppression</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <p class="mb-0">Êtes-vous sûr de vouloir supprimer ce utilisateur ?<br>Cette action est irrevesible.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="fas fa-times me-2"></i>Annuler
          </button>
          <button type="button" class="btn btn-danger" @click="confirmationDeleteAction(orderSelected)"
            data-bs-dismiss="modal">
            <i class="fas fa-trash-alt me-2"></i>Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>


</template>
<script lang="ts">
import { defineComponent } from "vue";
import { listeOrder, toggleActivationUser, deleteUser, listeRestaurant, listeOrderByAdmin } from "@/service/api";
import { UserGeneralKey, UserRole } from "@/models/user.generalkey";
import { useToast } from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import { ApiResponse } from "@/models/Apiresponse";
import { PaginatedOrder } from "@/models/Apiresponse";
import { OrderModel } from "@/models/order.model";
import VabeneOrderDetailsPage from "@/pages/Vabene/Order/VabeneOrderDetailsPage.vue";
import { RestaurantEnum } from "../../../../enums/restaurant.enum";
import { formatInTimeZone } from "date-fns-tz";
import { RestaurantModel } from "@/models/restaurant.model";

export default defineComponent({
  name: "VabeneOrderList",
  components: { LoaderComponent, EmptyTable },
  data() {
    return {
      orderResponse: null as ApiResponse<PaginatedOrder> | null,
      isLoading: false,
      currentPage: 1,
      searchQuery: '', // Ajout du champ de recherche
      // eslint-disable-next-line no-undef
      originalOrder: [] as OrderModel[], // Stockage des utilisateurs originaux
      orderSelected: null,
      refreshInterval: null as NodeJS.Timeout | null, // Intervalle de rafraîchissement
      lastRefreshTime: null as Date | null, // Dernier rafraîchissement
      searchTimeout: null as ReturnType<typeof setTimeout> | null, 
      restaurantOptions: [] as RestaurantModel[],
      selectedRestaurant: null as string | null,
      userRole: localStorage.getItem(UserGeneralKey.USER_ROLE),
    }
  },
  computed: {
    RestaurantEnum() {
      return RestaurantEnum
    },
    allOrder(): OrderModel[] {
      // Utiliser directement les données du serveur (recherche côté serveur)
      return (this.orderResponse?.data as any)?.orders || this.originalOrder;
    },

    pagination(): any {
      if (!this.orderResponse) {
        return {
          page: 1,
          total: 0,
          totalPages: 1,
          limit: 10
        };
      }
      
      const responsePagination = (this.orderResponse as any)?.pagination;
      
      // Si la pagination n'est pas trouvée au niveau racine, essayer dans data
      const dataPagination = (this.orderResponse?.data as any)?.pagination;
      const finalPagination = responsePagination || dataPagination;
      
      return finalPagination || {
        page: 1,
        total: 0,
        totalPages: 1,
        limit: 10
      };
    },
    paginationInfo(): string {
      const { page, limit, total } = this.pagination;
      const start = (page - 1) * limit + 1;
      const end = Math.min(page * limit, total);
      
      
      // Si total est 0, essayer de récupérer le nombre d'éléments depuis allOrder
      const actualTotal = total || this.allOrder.length;
      const actualStart = total > 0 ? start : 1;
      const actualEnd = total > 0 ? end : this.allOrder.length;
      
      return `Affichage de ${actualStart} à ${actualEnd} sur ${actualTotal} résultats`;
    },
    totalPages(): number {
      return this.pagination.totalPages;
    }
  },
  methods: {
    getShortUuid(uuid: string): string {
      return uuid.split('-')[0];
    },
    formatInTimeZone,
    gotoCreate() {
      this.$router.push("/ajout-commande");
    },
    selectionOrder(order) {
      this.orderSelected = order;
      this.$router.push({
        name: "VabeneOrderDetailsPage",
        params: { commandeID: order.id }
      });
    },
    async confirmationDeleteAction(order) {
      try {
        const response = await deleteUser(order.id) as ApiResponse<any>;
        if (response.code === 201) {
          this.orderResponse = response;
          this.toast.success(response.message);

        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des utilisateurs");
        console.error(error);
      } finally {
        setTimeout(() => {
          this.fetchOrder(1);
        }, 2000);
      }
    },
    async toggleUserActivation(user, status) {
      //this.isLoading = true;
      const payload = {
        'status': status
      }
      try {
        const response = await toggleActivationUser(user.id, payload) as ApiResponse<any>;
        if (response.code === 201) {
          this.orderResponse = response;
          if (response.data) {
            const responseDecoded = response.data
            this.toast.success(response.message);

          }

        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des utilisateurs");
        console.error(error);
      } finally {
        setTimeout(() => {
          this.fetchOrder(1);
        }, 2000);
      }
    },
    fetchRole(role: string): string {
      return UserGeneralKey.getRole(role);
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    async fetchRestaurants() {
      try {
        const response = await listeRestaurant(1) as any;
        
        if (response.code === 200 ) {
          this.restaurantOptions = response.data;
          if (this.restaurantOptions.length > 0) {
            this.selectedRestaurant = this.restaurantOptions[0].id;
            await this.fetchOrder(1, '', '', this.restaurantOptions[0].id);
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
        await this.fetchOrder(1, '', '', restaurantId);
      } 
    },
    async fetchOrder(page = 1, search = '', status = '', restaurantID = '') {
      const isAutoRefresh = this.refreshInterval && !this.isLoading;
      if (!isAutoRefresh) {
        this.isLoading = true;
      }
      if(this.userRole === UserRole.FRANCHISE){
        try{
          const response = await listeOrderByAdmin(page, 10, restaurantID, search, status) as ApiResponse<PaginatedOrder>;
          if (response.code === 200) {
          this.orderResponse = response;
          
          if ((response.data as any)?.data?.orders) {
            this.originalOrder = (response.data as any)?.data?.orders as any;
          }
          
          if ((response.data as any)?.data?.pagination) {
            this.currentPage = (response.data as any)?.data?.pagination.page;
          }
          
          
        } else {
          if (!isAutoRefresh) {
            this.toast.error(response.message);
          }
        }
        }catch (error) {
        if (!isAutoRefresh) {
          this.toast.warning("Aucune commande trouvée");
        } 
      } finally {
        this.isLoading = false;
      }
      } else {
      try {
        const response = await listeOrder(page, 10, search, status) as ApiResponse<PaginatedOrder>;
        
        if (response.code === 200) {
          this.orderResponse = response;
          
          if ((response.data as any)?.data?.orders) {
            this.originalOrder = (response.data as any)?.data?.orders as any;
          }
          
          if ((response.data as any)?.data?.pagination) {
            this.currentPage = (response.data as any)?.data?.pagination.page;
          }
          
          
        } 
      } catch (error) {
        if (!isAutoRefresh) {
          this.toast.warning("Aucune commande trouvée");
        } 
        this.isLoading = false;
      }
      }
      
    },
    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.fetchOrder(page, this.searchQuery);
      }
    },
    generatePageNumbers(): number[] {
      const pages: number[] = [];
      const maxVisiblePages = 100;
      const { page, totalPages } = this.pagination;

      let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    },
    
    startAutoRefresh() {
      if(this.userRole === UserRole.FRANCHISE){
        return;
      }
      else{
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
      this.refreshInterval = setInterval(() => {
        this.lastRefreshTime = new Date();
        this.fetchOrder(this.currentPage, this.searchQuery);
      }, 120000);
    }
    },
    
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    },
    forceRefresh() {
      this.lastRefreshTime = new Date();
      if(this.userRole !== UserRole.FRANCHISE){
        this.fetchOrder(this.currentPage, this.searchQuery);
      }
    },
    
    handleSearch() {
      this.currentPage = 1;
      this.fetchOrder(1, this.searchQuery);
    },
    getOrderTransactionReference(order: any): string {
      return order.transactionReference || order.nif || '-';
    },
    
    getOrderCustomerName(order: any): string {
      const customer = order.customer;
      if (customer) {
        return `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || '-';
      }
      return order.guest_first_name && order.guest_last_name 
        ? `${order.guest_first_name} ${order.guest_last_name}` 
        : '-';
    },
    
    getOrderTotal(order: any): string {
      return order.total || order.total_price || '-';
    },
    
    getOrderItems(order: any): any[] {
      return order.items || order.orderItems || [];
    },
    
    getOrderPayment(order: any): any {
      return order.payment || order.paymentID;
    },
    
    getOrderCustomerPhone(order: any): string {
      const customer = order.customer;
      if (customer && customer.phone) {
        return customer.phone;
      }
      return order.guest_phone_number || '-';
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  watch: {
    
    selectedRestaurant(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.onRestaurantChange(newVal);
      }
    },
    searchQuery: {
      handler(newQuery) {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
          this.handleSearch();
        }, 500);
      }
    }
  },
  mounted() {
    this.fetchRestaurants();
    this.fetchOrder();
    this.startAutoRefresh(); // Démarrer le rafraîchissement automatique
  },
  
  beforeUnmount() {
    this.stopAutoRefresh(); // Nettoyer l'intervalle lors de la destruction du composant
  }
});
</script>