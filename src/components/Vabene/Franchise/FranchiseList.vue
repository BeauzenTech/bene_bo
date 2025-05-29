<template>
  <div class="card mb-25 border-0 rounded-0 bg-white letter-spacing">
    <div
      class="card-head box-shadow bg-white d-lg-flex align-items-center justify-content-between p-15 p-sm-20 p-md-25"
    >
      <div class="d-sm-flex align-items-center">
        <button
          class="default-btn position-relative transition border-0 fw-medium text-white pt-11 pb-11 ps-25 pe-25 pt-md-12 pb-md-12 ps-md-30 pe-md-30 rounded-1 bg-success fs-md-15 fs-lg-16 d-inline-block me-10 mb-10 mb-lg-0"
          type="button"
          @click="gotoCreate"
        >
          Ajouter une franchise
          <i class="flaticon-plus position-relative ms-5 fs-12"></i>
        </button>
<!--        <button-->
<!--          class="default-outline-btn position-relative transition fw-medium text-black pt-10 pb-10 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-30 pe-md-30 rounded-1 bg-transparent fs-md-15 fs-lg-16 d-inline-block mb-10 mb-lg-0"-->
<!--          type="button"-->
<!--        >-->
<!--          Export-->
<!--          <i class="flaticon-file-1 position-relative ms-5 top-2 fs-15"></i>-->
<!--        </button>-->
      </div>
      <div class="d-flex align-items-center">
        <form class="search-box position-relative me-15" @submit.prevent>
          <input
            type="text"
            class="form-control shadow-none text-black rounded-0 border-0"
            placeholder="Rechercher une franchise"
            v-model="searchQuery"
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
  </div>

  <div
      class="row"
  >
    <LoaderComponent v-if="isLoading"/>
    <div class="col-sm-6 col-lg-4 col-xxxl-3"
         v-else-if="!isLoading && allFranchises.length > 0"
         v-for="franchise in allFranchises" :key="franchise.id"
    >
      <div class="card mb-25 border-0 rounded-0 bg-white seller-card">
        <div class="card-body letter-spacing">
          <div
              class="mb-15 mb-md-20 mb-lg-25 d-flex align-items-center justify-content-between"
          >
            <div class="icon position-relative text-center rounded-circle">
              <img
                  :src="franchise.logo"
                  class="position-absolute start-0 end-0 ms-auto me-auto"
                  width="70"
                  height="70"
                  alt="seller"
              />
            </div>
            <div class="dropdown">
              <button
                  class="dropdown-toggle card-dot-btn lh-1 position-relative top-4 bg-transparent border-0 shadow-none p-0 transition"
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
                  >
                    <i
                        class="flaticon-view lh-1 me-8 position-relative top-1"
                    ></i>
                    Voir
                  </a>
                </li>
                <li>
                  <a
                      class="dropdown-item d-flex align-items-center"
                      href="javascript:void(0);"
                  >
                    <i
                        class="flaticon-pen lh-1 me-8 position-relative top-1"
                    ></i>
                    Editer
                  </a>
                </li>
                <li>
                  <a
                      class="dropdown-item d-flex align-items-center"
                      data-bs-toggle="modal" data-bs-target="#confirmModal"
                      href="javascript:void(0);"
                      @click="selectionFranchise(franchise)"
                  >
                    <i
                        class="flaticon-delete lh-1 me-8 position-relative top-1"
                    ></i>
                    Supprimer
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <h5 class="fs-18 fw-semibold text-black mb-5 mb-md-8">{{ franchise.name }}  <input
              class="form-check-input"
              type="checkbox"
              v-model="franchise.is_active"
              @change="toggleFranchiseActivation(franchise, franchise.is_active)"
          /></h5>
          <span class="text-paragraph d-block">
            Adresse:
            <span class="text-primary fw-semibold">{{ franchise.address }}</span>
          </span>
          <ul
              class="list mt-15 mt-lg-25 ps-0 mb-0 list-unstyled d-flex justify-content-between"
          >
            <li>
              <span
                  class="d-block text-dark-emphasis text-uppercase fw-medium fs-12 mb-5 mb-md-8"
              >
                RESTAURANTS
              </span>
              <span class="d-block text-dark fw-medium">2</span>
            </li>
            <li>
              <span
                  class="d-block text-dark-emphasis text-uppercase fw-medium fs-12 mb-5 mb-md-8"
              >
                PRODUITS
              </span>
              <span class="d-block text-dark fw-medium">62</span>
            </li>
            <li>
              <span
                  class="d-block text-dark-emphasis text-uppercase fw-medium fs-12 mb-5 mb-md-8"
              >
                CODE POSTAL
              </span>
              <span class="d-block text-dark fw-medium">{{ franchise.postalCode }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <empty-table v-else message="Aucune franchise pour le moment."/>
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


  <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmModalLabel">Confirmation de suppression</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <p class="mb-0">Êtes-vous sûr de vouloir supprimer cette franchise ?<br>Cette action est irrevesible.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="fas fa-times me-2"></i>Annuler
          </button>
          <button type="button" class="btn btn-danger" @click="confirmationDeleteAction(franchiseSelected)" data-bs-dismiss="modal">
            <i class="fas fa-trash-alt me-2"></i>Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>


</template>

<script lang="ts">
import LoaderComponent from "@/components/Loading/Loader.vue";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import {ApiResponse, PaginatedFrachises} from "@/models/Apiresponse";
import {deleteFranchise, deleteUser, listefranchises, toggleActivationFranchise} from "@/service/api";
import {UserGeneralKey} from "@/models/user.generalkey";
import {useToast} from "vue-toastification";
import {FranchiseModel} from "@/models/franchise.model";
import {defineComponent} from "vue";

export default defineComponent({
  name: "FranchiseList",
  // eslint-disable-next-line vue/no-unused-components
  components: {LoaderComponent, EmptyTable},
  data(){
    return{
      franchiseResponse: null as ApiResponse<PaginatedFrachises> | null,
      isLoading: false,
      currentPage: 1 ,
      searchQuery: '', // Ajout du champ de recherche
      originalFranchises: [] as FranchiseModel[], // Stockage des utilisateurs originaux
      franchiseSelected: null,
    }
  },
  computed: {
    allFranchises(): FranchiseModel[] {
      const franchises = this.franchiseResponse?.data?.items || this.originalFranchises;
      if (!this.searchQuery) return franchises;

      const query = this.searchQuery.toLowerCase();
      return franchises.filter(franchise => {
        return (
            (franchise.name?.toLowerCase().includes(query)) ||
            (franchise.email?.toLowerCase().includes(query)) ||
            (franchise.address?.toLowerCase().includes(query)) ||
            (franchise.postalCode?.includes(query))
        );
      });
    },

    pagination(): any {
      return this.franchiseResponse?.data?.pagination || {
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
    async confirmationDeleteAction(franchise){
      try {
        const response = await deleteFranchise(franchise.id) as ApiResponse<any>;
        //console.log(response)
        if (response.code === 201) {
          this.toast.success(response.message);
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des franchises");
        console.error(error);
      } finally {
        setTimeout(() =>  {
          this.fetchFranchises(1);
        }, 2000);
      }
    },
    async toggleFranchiseActivation(franchise, status){
      //this.isLoading = true;
      console.log(status)
      const payload = {
        'status': status
      }
      try {
        const response = await toggleActivationFranchise(franchise.id, payload) as ApiResponse<any>;
        //console.log(response)
        if (response.code === 200) {
          if (response.data) {
            const responseDecoded = response.data
            console.log(responseDecoded)
            this.toast.success(response.message);

          }

        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des franchises");
        console.error(error);
      } finally {
        setTimeout(() =>  {
          this.fetchFranchises(1);
        }, 2000);
      }
    },
    gotoCreate(){
      this.$router.push("/ajout-franchise");
    },
    selectionFranchise(franchise){
      this.franchiseSelected = franchise;
    },
    // async confirmationDeleteAction(franchise){
    //   try {
    //     const response = await deleteUser(user.id) as ApiResponse<any>;
    //     //console.log(response)
    //     if (response.code === 201) {
    //       this.usersResponse = response;
    //       this.toast.success(response.message);
    //
    //     } else {
    //       this.toast.error(response.message);
    //     }
    //   } catch (error) {
    //     this.toast.error("Erreur lors du chargement des utilisateurs");
    //     console.error(error);
    //   } finally {
    //     setTimeout(() =>  {
    //       this.fetchUsers(1);
    //     }, 2000);
    //   }
    // },
    // async toggleUserActivation(user, status){
    //   //this.isLoading = true;
    //   console.log(status)
    //   const payload = {
    //     'status': status
    //   }
    //   try {
    //     const response = await toggleActivationUser(user.id, payload) as ApiResponse<any>;
    //     //console.log(response)
    //     if (response.code === 201) {
    //       this.usersResponse = response;
    //       if (response.data) {
    //         const responseDecoded = response.data
    //         console.log(responseDecoded)
    //         this.toast.success(response.message);
    //
    //       }
    //
    //     } else {
    //       this.toast.error(response.message);
    //     }
    //   } catch (error) {
    //     this.toast.error("Erreur lors du chargement des utilisateurs");
    //     console.error(error);
    //   } finally {
    //     setTimeout(() =>  {
    //       this.fetchUsers(1);
    //     }, 2000);
    //   }
    // },

    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    async fetchFranchises(page = 1) {
      this.isLoading = true;
      try {
        const response = await listefranchises(page) as ApiResponse<PaginatedFrachises>;
        console.log(response)
        if (response.code === 200) {
          this.franchiseResponse = response;
          if (response.data?.items) {
            this.originalFranchises = response.data.items;
          }
          if (response.data && response.data.pagination) {
            this.currentPage = response.data.pagination.current_page;
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des franchises");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.fetchFranchises(page);
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
  mounted(){
    this.fetchFranchises();
  }

})
</script>