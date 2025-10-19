<template>
  <div class="card mb-25 border-0 rounded-0 bg-white letter-spacing">
    <div
      class="card-head box-shadow bg-white d-lg-flex align-items-center justify-content-between p-15 p-sm-20 p-md-25"
    >
      <div class="d-sm-flex align-items-center"></div>
      <div class="d-flex align-items-center">
        <form class="search-box position-relative me-15" @submit.prevent>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control shadow-none text-black rounded-0 border-0"
            placeholder="Rechercher une transaction"
            @input="handleSearchInput"
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
                TRANSACTION ID
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
              >
                COMMANDE ID
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
                CRÉER LE
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
                <LoaderComponent />
              </td>
            </tr>
            <tr
              v-else-if="!isLoading && allPayments.length > 0"
              v-for="paiement in allPayments"
              :key="paiement.id"
            >
              <th
                v-if="paiement"
                class="shadow-none lh-1 fw-medium text-black-emphasis title ps-0 text-capitalize"
              >
                <div class="d-flex align-items-center text-capitalize">
                  <div class="form-check mb-0 text-capitalize">
                    <input class="form-check-input shadow-none" type="checkbox" />
                  </div>
                  <div class="d-flex align-items-center ms-5 fs-md-15 fs-lg-16">
                    <a href="#" @click="selectionPaiement(paiement)">
                      #{{ getShortUuid(paiement.id) }}
                    </a>
                  </div>
                </div>
              </th>
              <td class="shadow-none lh-1 fw-medium text-black-emphasis">
                <div
                  class="d-flex align-items-center ms-5 fs-md-15 fs-lg-16"
                >
                  <a href="#">
                    {{
                      paiement.paymentReference ?? "-"
                    }}
                  </a>
                </div>
              </td>

              <td
                class="shadow-none lh-1 fw-medium text-black-emphasis"
              >
                {{ paiement.clientName ?? "-" }}
              </td>


              <td class="shadow-none lh-1 fw-medium text-black-emphasis">
                {{ paiement.amount || "-" }} CHF
              </td>

              <td class="shadow-none lh-1 fw-medium text-muted">
                <span
                  v-if="paiement.status === 'completed'"
                  class="badge text-bg-success"
                  >{{ fetchStatusOrderFr(paiement.status) ?? "-" }}</span
                >
                <span v-else class="badge text-bg-warning">{{
                  fetchStatusOrderFr(paiement.status) ?? "-"
                }}</span>
              </td>
              <td >
                <span
                  v-if="paiement.status === 'pending'"
                  class="badge text-outline-danger"
                  >En attente de paiement</span
                >
                <span v-if="paiement.status === 'completed'" class="badge text-outline-primary"
                  >Payé</span
                >
                <span
                  v-if="paiement.status === 'refunded'"
                  class="badge text-outline-muted"
                  >A remboursé</span
                >
                <span
                  v-if="paiement.status === 'cancelled'"
                  class="badge text-outline-warning"
                  >Annuler</span
                >
              </td>
              <td>
                {{ convertDateCreate(paiement.created_at) ?? "-" }}
              </td>

              <td class="shadow-none lh-1 fw-medium text-body-tertiary text-end pe-0">
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
                        @click="selectionPaiement(paiement)"
                        ><i class="flaticon-view lh-1 me-8 position-relative top-1"></i>
                        Voir</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item d-flex align-items-center"
                        data-bs-toggle="modal"
                        data-bs-target="#confirmModal"
                        href="javascript:void(0);"
                        @click="selectionPaiement(paiement)"
                        ><i class="flaticon-delete lh-1 me-8 position-relative top-1"></i>
                        Supprimer</a
                      >
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr v-else>
              <EmptyTable
                message="Aucune transaction pour le moment"
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
              <a
                class="page-link"
                href="#"
                aria-label="Previous"
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
              <a class="page-link" href="#" @click.prevent="changePage(page)">
                {{ page }}</a
              >
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a
                class="page-link"
                href="#"
                aria-label="Next"
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

  <div
    class="modal fade"
    id="confirmModal"
    tabindex="-1"
    aria-labelledby="confirmModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmModalLabel">Confirmation de suppression</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-center">
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <p class="mb-0">
            Êtes-vous sûr de vouloir supprimer ce utilisateur ?<br />Cette action est
            irrevesible.
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="fas fa-times me-2"></i>Annuler
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="confirmationDeleteAction(paymentSelected)"
            data-bs-dismiss="modal"
          >
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
  listePayment,
  toggleActivationUser,
  deleteUser,
  listeOrderType,
  listeMethodePaiement,
} from "@/service/api";
import { UserGeneralKey } from "@/models/user.generalkey";
import { useToast } from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import {
  ApiResponse,
  PaginatedMethodePaiement,
  PaginatedOrderType,
  PaginatedPayment,
} from "@/models/Apiresponse";
import { PaginatedOrder } from "@/models/Apiresponse";
import { OrderModel } from "@/models/order.model";
import VabeneOrderDetailsPage from "@/pages/Vabene/Order/VabeneOrderDetailsPage.vue";
import { PaymentModel } from "@/models/payment.model";
import { MethodePaiementModel } from "@/models/methodePaiement.model";
import { OrderStatus } from "@/enums/orderStatut.enum";
import { RestaurantEnum } from "../../../../enums/restaurant.enum";

export default defineComponent({
  name: "VabeneTransactionList",
  components: { LoaderComponent, EmptyTable },
  data() {
    return {
      paiementResponse: null as ApiResponse<PaginatedPayment> | null,
      isLoading: false,
      currentPage: 1,
      searchQuery: "", // Ajout du champ de recherche
      // eslint-disable-next-line no-undef
      originalPayment: [] as PaymentModel[], // Stockage des utilisateurs originaux
      paymentSelected: null,
      listeMethode: [] as MethodePaiementModel[],
      methodePaiementSelected: null as MethodePaiementModel | null,
      searchTimeout: null as NodeJS.Timeout | null,
    };
  },
  computed: {
    RestaurantEnum() {
      return RestaurantEnum;
    },
    allPayments(): PaymentModel[] {
      return this.paiementResponse?.data?.items || this.originalPayment;
    },

    pagination(): any {
      return (
        this.paiementResponse?.data?.pagination || {
          current_page: 1,
          total_items: 0,
          total_pages: 1,
          items_per_page: 20,
        }
      );
    },
    paginationInfo(): string {
      const { current_page, items_per_page, total_items } = this.pagination;
      const start = (current_page - 1) * items_per_page + 1;
      const end = Math.min(current_page * items_per_page, total_items);
      return `Affichage de ${start} à ${end} sur ${total_items} résultats`;
    },
    totalPages(): number {
      return this.pagination.total_pages;
    },
  },
  methods: {
    fetchStatusOrderFr(status: string) {
      switch (status) {
        case OrderStatus.PENDING:
          return "En attente";
        case OrderStatus.PROCESSING:
          return "En cours de traitement";
        case OrderStatus.READY_FOR_DELIVERY:
          return "Près pour livraison";
        case OrderStatus.OUT_FOR_DELIVERY:
          return "En cours de livraison";
        case OrderStatus.DELIVERED:
          return "Livré";
        default:
          return "Annulé";
      }
    },
    getMethodePaiementParType(
      liste: MethodePaiementModel[],
      type: string
    ): MethodePaiementModel | undefined {
      return liste.find((methode) => methode.type === type);
    },
    getShortUuid(uuid: string): string {
      if (uuid) {
        return uuid.split("-")[0];
      }
      return "";
    },
    gotoCreate() {
      this.$router.push("/ajout-commande");
    },
    selectionPaiement(payment) {
      this.paymentSelected = payment;
      this.$router.push({
        name: "VabeneTransactionDetailsPage",
        params: { transactionID: payment.id },
      });
    },
    async confirmationDeleteAction(payment) {
      try {
        const response = (await deleteUser(payment.id)) as ApiResponse<any>;
        if (response.code === 201) {
          this.paiementResponse = response;
          this.toast.success(response.message);
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des utilisateurs");
        console.error(error);
      } finally {
        setTimeout(() => {
          this.fetchPaiement(1);
        }, 2000);
      }
    },
    async toggleUserActivation(user, status) {
      //this.isLoading = true;
      const payload = {
        status: status,
      };
      try {
        const response = (await toggleActivationUser(
          user.id,
          payload
        )) as ApiResponse<any>;
        if (response.code === 201) {
          this.paiementResponse = response;
          if (response.data) {
            const responseDecoded = response.data;
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
          this.fetchPaiement(1);
        }, 2000);
      }
    },
    fetchRole(role: string): string {
      return UserGeneralKey.getRole(role);
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    async fetchPaiement(page = 1) {
      this.isLoading = true;
      try {
        const response = (await listePayment(page, '20', this.searchQuery)) as ApiResponse<PaginatedPayment>;
        if (response.code === 200) {
          this.toast.success(response.message);
          this.paiementResponse = response;
          if (response.data) {
            this.originalPayment = response.data as any;
          }
          if (response.data && response.data.pagination) {
            this.currentPage = response.data.pagination.current_page;
          }
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des operations");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.fetchPaiement(page);
      }
    },
    generatePageNumbers(): number[] {
      const pages: number[] = [];
      const maxVisiblePages = 100;
      const { current_page, total_pages } = this.pagination;

      let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(total_pages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    },
    handleSearchInput() {
      this.currentPage = 1;
      
      // Clear existing timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      // Set new timeout for debounced search
      this.searchTimeout = setTimeout(() => {
        this.fetchPaiement(1);
      }, 500); // 500ms delay
    },
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchPaiement();
  },
});
</script>
