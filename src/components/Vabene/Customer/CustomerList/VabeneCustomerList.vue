<template>
  <div class="card mb-25 border-0 rounded-0 bg-white letter-spacing">
    <div
        class="card-head box-shadow bg-white d-lg-flex align-items-center justify-content-between p-15 p-sm-20 p-md-25"
    >
      <div class="d-sm-flex align-items-center">

<!--        <button-->
<!--            class="default-outline-btn position-relative transition fw-medium text-black pt-10 pb-10 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-30 pe-md-30 rounded-1 bg-transparent fs-md-15 fs-lg-16 d-inline-block mb-10 mb-lg-0"-->
<!--            type="button"-->
<!--        >-->
<!--          Export-->
<!--          <i class="flaticon-file-1 position-relative ms-5 top-2 fs-15"></i>-->
<!--        </button>-->
      </div>
      <div class="d-flex align-items-center">
        <form class="search-box position-relative me-15" @submit.prevent="handleSearch">
          <input
              v-model="searchQuery"
              type="text"
              class="form-control shadow-none text-black rounded-0 border-0"
              placeholder="Rechercher un client"
          />
          <button
              v-if="searchQuery"
              type="button"
              @click="handleClear"
              class="bg-transparent text-muted transition p-0 border-0 position-absolute"
              style="right: 40px; top: 50%; transform: translateY(-50%);"
              title="Effacer la recherche"
          >
            <i class="fas fa-times"></i>
          </button>
          <button
              type="submit"
              class="bg-transparent text-primary transition p-0 border-0"
          >
            <i class="flaticon-search-interface-symbol"></i>
          </button>
        </form>
        <button
            v-if="hasActiveSearch"
            @click="clearSearch"
            class="btn btn-sm btn-outline-secondary ms-2"
            title="Effacer la recherche"
        >
          <i class="fas fa-times"></i>
        </button>
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
              ID
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              NOM COMPLET
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              EMAIL
            </th>

            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              TÉLÉPHONE
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
              <LoaderComponent/>
            </td>
          </tr>
          <tr v-else-if="!isLoading && allCategorie.length > 0"
              v-for="(categorie, index) in allCategorie" :key="categorie.created_at"
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
                  <a href="#" @click="selectForDetail(categorie)">
                    {{ index + 1}} - {{ getShortUuid(categorie.id) }}
                  </a>


                </div>
              </div>
            </th>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              {{ categorie.firstName }}  {{ categorie.lastName }}
            </td>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              {{ categorie.firstName }}
            </td>



            <td class="shadow-none lh-1 fw-medium text-muted">
              {{ categorie.phoneNumber ? '+41'+categorie.phoneNumber : '-' }}
            </td>


            <td class="shadow-none lh-1 fw-medium text-muted">
              {{ convertDateCreate(categorie.created_at)  }}
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
                        @click="selectForDetail(categorie)"
                    ><i
                        class="flaticon-view lh-1 me-8 position-relative top-1"
                    ></i>
                      Voir</a
                    >
                  </li>

                </ul>
              </div>
            </td>
          </tr>
          <tr v-else>
            <EmptyTable
                message="Aucun client pour le moment"
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
          <button type="button" class="btn btn-danger" @click="confirmationDeleteAction(categorieSelected)" data-bs-dismiss="modal">
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
  listeCategorie,
  toggleActivationCategorie,
  deleteCategorie,
  deleteFileUpload,
  listeCustomers
} from "@/service/api";
import {UserGeneralKey} from "@/models/user.generalkey";
import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import {ApiResponse, PaginatedCategorie, PaginatedCustomer} from "@/models/Apiresponse";
import {PaginatedUsers} from "@/models/Apiresponse";
import {CategorieModel} from "@/models/categorie.model";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {AxiosError} from "axios";
import {Commons} from "@/utils/commons.utils";
import {CustomerModel} from "@/models/customer.model";

export default defineComponent({
  name: "VabeneCategorieList",
  components: {LoaderComponent, EmptyTable},
  data(){
    return{
      categorieResponse: null as ApiResponse<PaginatedCustomer> | null,
      isLoading: false,
      currentPage: 1 ,
      searchQuery: '', // Ajout du champ de recherche
      originalCategories: [] as CustomerModel[], // Stockage des utilisateurs originaux
      categorieSelected: null,
      restaurantId: null as string | null,
      // Paramètres de recherche
      searchFirstname: '',
      searchLastname: '',
      searchEmail: '',
      searchTel: ''
    }
  },
  computed: {
    allCategorie(): CustomerModel[] {
      return this.originalCategories;
    },
    
    hasActiveSearch(): boolean {
      return !!(this.searchFirstname || this.searchLastname || this.searchEmail || this.searchTel);
    },

    pagination(): any {
      return this.categorieResponse?.data?.pagination || {
        current_page: 1,
        total_items: 0,
        total_pages: 1,
        items_per_page: 20
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
      this.$router.push({
        name: "VabeneAddCustomerPage",
        params: { action: ActionCrud.ADD }
      });
    },
    selectForDetail(categorie){
      this.categorieSelected = categorie;
      this.$router.push({
        name: "VabeneAddCustomerPage",
        params: { action: ActionCrud.EDIT, customerID: categorie.id }
      });
    },
    selectForDelete(categorie){
      this.categorieSelected = categorie;
      // this.$router.push({
      //   name: "VabeneAddCategoriePage",
      //   params: { action: 'edit' }
      // });
    },
    async deleteFileUpload(fileID) {
      try {
        const response = await deleteFileUpload(fileID);
        if (response.code === 200) {
          // this.toast.success(response.message)

        } else {
          this.toast.error(response.message)
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.data) {
          const message = (axiosError.response.data as any).message;
          this.toast.error(message);
        } else {
          this.toast.error("Une erreur est survenue");
        }
      }
    },
    async confirmationDeleteAction(categorie){
      const publicID = Commons.extractPublicId(categorie.icone)
      try {
        const response = await deleteCategorie(categorie.id) as ApiResponse<any>;
        await this.deleteFileUpload(publicID)
        if (response.code === 201) {
          this.categorieResponse = response;
          this.toast.success(response.message);
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      } finally {
        setTimeout(() =>  {
          this.fetchCategories(1);
        }, 3000);
      }
    },
    async toggleCategorieActivation(categorie, status){
      //this.isLoading = true;
      const payload = {
        'status': status
      }
      try {
        const response = await toggleActivationCategorie(categorie.id, payload) as ApiResponse<any>;
        if (response.code === 200) {
          this.categorieResponse = response;
          if (response.data) {
            const responseDecoded = response.data
            this.toast.success(response.message);
          }

        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      } finally {
        setTimeout(() =>  {
          this.fetchCategories(1);
        }, 2000);
      }
    },
    fetchRole(role: string): string {
      return UserGeneralKey.getRole(role);
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
  
    handleSearch() {
      // Parse la recherche pour déterminer le type
      const query = this.searchQuery.trim().toLowerCase();
      
      // Reset tous les paramètres de recherche
      this.searchFirstname = '';
      this.searchLastname = '';
      this.searchEmail = '';
      this.searchTel = '';
      
      if (query) {
        // Détection simple du type de recherche
        if (query.includes('@')) {
          // Probablement un email
          this.searchEmail = query;
        } else if (query.match(/^[\d\s\-+()]+$/)) {
          // Probablement un numéro de téléphone
          this.searchTel = query.replace(/\D/g, ''); // Garde seulement les chiffres
        } else {
          // Probablement un nom/prénom
          const parts = query.split(' ');
          if (parts.length > 1) {
            this.searchFirstname = parts[0];
          } else {
            // Recherche dans prénom et nom
            this.searchFirstname = query;
          }
        }
      }
      
      this.currentPage = 1;
      this.fetchCategories(1);
    },
    
    clearSearch() {
      this.handleClear();
    },
    
    handleClear() {
      this.searchQuery = '';
      this.searchFirstname = '';
      this.searchLastname = '';
      this.searchEmail = '';
      this.searchTel = '';
      this.currentPage = 1;
      this.fetchCategories(1);
    },
    
    async fetchCategories(page = 1) {
      this.isLoading = true;
      try {

        const idResto = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID);
        if(idResto){
          this.restaurantId = idResto;
        }
        const response = await listeCustomers(
          page, 
          '20', 
          idResto ?? 'all',
          this.searchFirstname || undefined,
          this.searchLastname || undefined,
          this.searchEmail || undefined,
          this.searchTel || undefined
        ) as ApiResponse<PaginatedCustomer>;
        if (response.code === 200) {
          this.categorieResponse = response;
          if (response.data?.items) {
            this.originalCategories = response.data.items;
            
          }
          if (response.data && response.data.pagination) {
            this.currentPage = response.data.pagination.current_page;
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des customers");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.fetchCategories(page);
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
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
   this.fetchCategories();
  }
});
</script>