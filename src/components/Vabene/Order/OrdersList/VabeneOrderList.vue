<template>
  <div class="card mb-25 border-0 rounded-0 bg-white letter-spacing">
    <div
        class="card-head box-shadow bg-white d-lg-flex align-items-center justify-content-between p-15 p-sm-20 p-md-25"
    >
      <div class="d-sm-flex align-items-center">
        <Button
            @click="gotoCreate"
            class="default-btn position-relative transition border-0 fw-medium text-white pt-11 pb-11 ps-25 pe-25 pt-md-12 pb-md-12 ps-md-30 pe-md-30 rounded-1 bg-success fs-md-15 fs-lg-16 d-inline-block me-10 mb-10 mb-lg-0"
            type="button"

        >
             Ajouter une commande

          <i class="flaticon-plus position-relative ms-5 fs-12"></i>
        </Button>
<!--        <button-->
<!--            class="default-outline-btn position-relative transition fw-medium text-black pt-10 pb-10 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-30 pe-md-30 rounded-1 bg-transparent fs-md-15 fs-lg-16 d-inline-block mb-10 mb-lg-0"-->
<!--            type="button"-->
<!--        >-->
<!--          Export-->
<!--          <i class="flaticon-file-1 position-relative ms-5 top-2 fs-15"></i>-->
<!--        </button>-->
      </div>
      <div class="d-flex align-items-center">
        <form class="search-box position-relative me-15" @submit.prevent>
          <input
              v-model="searchQuery"
              type="text"
              class="form-control shadow-none text-black rounded-0 border-0"
              placeholder="Rechercher un restaurant"
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
            REF
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              NOM DU PRODUIT
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              CLIENT
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              MONTANT
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              CRÉER LE
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              COMMANDE STATUS
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              PAIEMENT STATUS
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              NUMERO TELEPHONE
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 text-end pe-0"
            ></th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="isLoading">
            <td colspan="8" class="text-center py-4">
              <LoaderComponent/>
            </td>
          </tr>
          <tr v-else-if="!isLoading && allOrder.length > 0"
              v-for="order in allOrder" :key="order.id"
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
                  <a href="#" @click="selectionOrder(order)">
                  #{{ order.reference  }}
                  </a>
                </div>
              </div>
            </th>
            <td v-if="order.orderItems.length > 0 && order.orderItems[0].productID" class="shadow-none lh-1 fw-medium text-black-emphasis">
              <a
                  href="#"
                  class="d-flex align-items-center text-decoration-none text-black fs-md-15 fs-lg-16"
              >
                <img
                    :src="order.orderItems[0].productID.image_urls[0]"
                    class="me-15"
                    width="44"
                    alt="product"
                />
                {{ order.orderItems[0].productID.name }}
              </a>
            </td>
            <td v-else class="shadow-none lh-1 fw-medium text-black-emphasis">
              -
            </td>
            <td v-if="order.guest_first_name" class="shadow-none lh-1 fw-medium text-black-emphasis">
              {{ order.guest_first_name.toUpperCase() || '-' }}
            </td>
            <td v-else class="shadow-none lh-1 fw-medium text-black-emphasis">
              {{ order.guest_first_name|| '-' }} {{ order.guest_last_name || '-' }}
            </td>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis ">
              {{ order.total_price || '-' }} CHF
            </td>
            <td v-if="order.orderItems.length > 0" class="shadow-none lh-1 fw-medium text-black-emphasis">
              {{ convertDateCreate(order.created_at)  }}

            </td>
            <td v-else class="shadow-none lh-1 fw-medium text-black-emphasis">
              <span>-</span>
            </td>
            <td class="shadow-none lh-1 fw-medium text-muted ">
              <span v-if="order.status === 'pending'" class="badge text-bg-warning fs-13">En attente</span>
              <span v-if="order.status === 'processing'" class="badge text-bg-info fs-13">En cours de traitement</span>
              <span v-if="order.status === 'ready_for_delivery'" class="badge text-bg-warning fs-13">Prêt pour livraison</span>
              <span v-if="order.status === 'out_for_delivery'" class="badge text-bg-secondary fs-13">En cours de livraison</span>
              <span v-if="order.status === 'delivered'" class="badge text-bg-primary fs-13">Livré</span>
              <span v-if="order.status === 'cancelled'" class="badge text-bg-danger fs-13">Annulé</span>
            </td>
            <td class="shadow-none lh-1 fw-medium text-muted">
              <span v-if="order.payment_status === 'pending'" class="badge text-outline-danger">En attente de paiement</span>
              <span v-if="order.payment_status === 'paid'" class="badge text-outline-primary">Payé</span>
              <span v-if="order.payment_status === 'refunded'" class="badge text-outline-muted">A remboursé</span>
              <span v-if="order.payment_status === 'cancelled'" class="badge text-outline-warning">Annuler</span>

            </td>
            <td>
              <span v-if="order.guest_phone_number"  class="badge text-bg-secondary fs-13">{{order.guest_phone_number}}</span>
              <span v-else  class="badge text-black-emphasis fs-13">-</span>
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
                        @click="selectionOrder(order)"
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
                        @click="selectionOrder(order)"
                    ><i
                        class="flaticon-pen lh-1 me-8 position-relative top-1"
                    ></i>
                      Editer</a
                    >
                  </li>
                  <li>
                    <a
                        class="dropdown-item d-flex align-items-center"
                        data-bs-toggle="modal" data-bs-target="#confirmModal"
                        href="javascript:void(0);"
                        @click="selectionOrder(order)"
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
                message="Aucune commande pour le moment"
                :colspan="8"
                textClass="text-muted"
            />
          </tr>

          </tbody>
        </table>
      </div>
      <div
          class="pagination-area d-md-flex mt-15 mt-sm-20 mt-md-25 justify-content-between align-items-center"
      >
        <p class="mb-0 text-paragraph">
          {{ paginationInfo }}
        </p>
        <nav class="mt-15 mt-md-0">
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" aria-label="Previous"
                 @click.prevent="changePage(currentPage - 1)"
              >
                <i class="flaticon-chevron-1"></i>
              </a>
            </li>
            <li
                v-for="page in generatePageNumbers()"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
            >
              <a
                  class="page-link" href="#"
                  @click.prevent="changePage(page)"
              >  {{ page }}</a>
            </li>

            <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
            >
              <a
                  class="page-link" href="#" aria-label="Next"
                  @click.prevent="changePage(currentPage + 1)"
              >
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
          <button type="button" class="btn btn-danger" @click="confirmationDeleteAction(orderSelected)" data-bs-dismiss="modal">
            <i class="fas fa-trash-alt me-2"></i>Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>


</template>
<script lang="ts">
import { defineComponent } from "vue";
import {listeOrder, toggleActivationUser, deleteUser, listeRestaurant} from "@/service/api";
import {UserGeneralKey} from "@/models/user.generalkey";
import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import {ApiResponse} from "@/models/Apiresponse";
import {PaginatedOrder} from "@/models/Apiresponse";
import {OrderModel} from "@/models/order.model";
import VabeneOrderDetailsPage from "@/pages/Vabene/Order/VabeneOrderDetailsPage.vue";

export default defineComponent({
  name: "VabeneOrderList",
  components: {LoaderComponent, EmptyTable},
  data(){
    return{
      orderResponse: null as ApiResponse<PaginatedOrder> | null,
      isLoading: false,
      currentPage: 1 ,
      searchQuery: '', // Ajout du champ de recherche
      // eslint-disable-next-line no-undef
      originalOrder: [] as OrderModel[], // Stockage des utilisateurs originaux
      orderSelected: null,
    }
  },
  computed: {
    allOrder(): OrderModel[] {
      const orders = this.orderResponse?.data?.items || this.originalOrder;
      if (!this.searchQuery) return orders;
      const query = this.searchQuery.toLowerCase();
      return orders.filter(order => {
        return (
            (order.id?.toLowerCase().includes(query)) ||
            (order.status?.toLowerCase().includes(query)) ||
            (order.address?.toLowerCase().includes(query)) ||
            (order.rue?.includes(query)));
      });
    },

    pagination(): any {
      return this.orderResponse?.data?.pagination || {
        current_page: 1,
        total_items: 0,
        total_pages: 1,
        items_per_page: 8
      };
    },
    paginationInfo(): string {
      const { current_page, items_per_page, total_items } = this.pagination;
      const start = (current_page - 1) * items_per_page + 1;
      const end = Math.min(current_page * items_per_page, total_items);
      return `Affichage de ${start} à ${end} sur ${total_items} résultats`;
    },
    totalPages(): number {
      return this.pagination.total_pages;
    }
  },
  methods: {
     getShortUuid(uuid: string): string {
        return uuid.split('-')[0];
     },
    gotoCreate(){
      this.$router.push("/ajout-commande");
    },
    selectionOrder(order){
      this.orderSelected = order;
      console.log(order)
      this.$router.push({
        name: "VabeneOrderDetailsPage",
        params: { commandeID: order.id }
      });
    },
    async confirmationDeleteAction(order){
      try {
        const response = await deleteUser(order.id) as ApiResponse<any>;
        //console.log(response)
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
        setTimeout(() =>  {
          this.fetchOrder(1);
        }, 2000);
      }
    },
    async toggleUserActivation(user, status){
      //this.isLoading = true;
      console.log(status)
      const payload = {
        'status': status
      }
      try {
        const response = await toggleActivationUser(user.id, payload) as ApiResponse<any>;
        //console.log(response)
        if (response.code === 201) {
          this.orderResponse = response;
          if (response.data) {
            const responseDecoded = response.data
            console.log(responseDecoded)
            this.toast.success(response.message);

          }

        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des utilisateurs");
        console.error(error);
      } finally {
        setTimeout(() =>  {
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
    async fetchOrder(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeOrder(page) as ApiResponse<PaginatedOrder>;
        console.log(response)
        if (response.code === 200) {
          this.orderResponse = response;
          if (response.data?.items) {
            this.originalOrder = response.data.items;
          }
          if (response.data && response.data.pagination) {
            this.currentPage = response.data.pagination.current_page;
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des restaurant");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.fetchOrder(page);
      }
    },
    generatePageNumbers(): number[] {
      const pages: number[] = [];
      const maxVisiblePages = 100;
      const { current_page, total_pages } = this.pagination;

      let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(total_pages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchOrder();
  }
});
</script>