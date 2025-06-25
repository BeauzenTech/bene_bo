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

             Ajouter une categorie

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
              placeholder="Rechercher une categorie"
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
              ID
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              Libelle
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              Icone
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
              STATUS
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
          <tr v-else-if="!isLoading && allCategorie.length > 0 && userRole === UserRole.FRANCHISE"
              v-for="(categorie, index) in allCategorie" :key="categorie.id"
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
              {{ categorie.name }}
            </td>
            <th
                class="shadow-none lh-1 fw-medium text-black-emphasis title ps-0 text-capitalize"
            >
              <div class="d-flex align-items-center text-capitalize">

                <div
                    class="d-flex align-items-center ms-5 fs-md-15 fs-lg-16"
                >
                  <img
                      :src=" categorie.icone || require('@/assets/images/icon/jpg.png')"
                      class="rounded-circle me-8"
                      width="24"
                      height="24"
                      alt="categorie"
                  />
                 
                </div>
              </div>
            </th>



            <td class="shadow-none lh-1 fw-medium text-muted">
              {{ convertDateCreate(categorie.created_at)  }}
            </td>

            <td>
              <!-- Toggle switch -->
              <div class="form-check form-switch">
                <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="categorie.isActive"
                    @change="toggleCategorieActivation(categorie, categorie.isActive)"
                />

              </div>
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
                  <li>
                    <a
                        class="dropdown-item d-flex align-items-center"
                        href="javascript:void(0);"
                        @click="selectForDetail(categorie)"
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
                        @click="selectForDelete(categorie)"
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
          <tr v-else-if="!isLoading && allRestaurantCategorie.length > 0 && userRole === UserRole.RESTAURANT"
              v-for="(cat, index) in allRestaurantCategorie" :key="cat.id"
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
                  <a href="#" @click="selectForDetail(cat)">
                    {{ index + 1}} - {{ getShortUuid(cat.id) }}
                  </a>


                </div>
              </div>
            </th>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              {{ cat.category.name }}
            </td>
            <th
                class="shadow-none lh-1 fw-medium text-black-emphasis title ps-0 text-capitalize"
            >
              <div class="d-flex align-items-center text-capitalize">

                <div
                    class="d-flex align-items-center ms-5 fs-md-15 fs-lg-16"
                >
                  <img
                      :src=" cat.category.icone || require('@/assets/images/icon/jpg.png')"
                      class="rounded-circle me-8"
                      width="24"
                      height="24"
                      alt="categorie"
                  />

                </div>
              </div>
            </th>



            <td class="shadow-none lh-1 fw-medium text-muted">
              {{ convertDateCreate(cat.category.created_at)  }}
            </td>

            <td>
              <!-- Toggle switch -->
              <div class="form-check form-switch">
                <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="cat.isActive"
                    @change="toggleCategorieActivation(cat, cat.isActive)"
                />

              </div>
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
                  <li v-if="userRole != UserRole.RESTAURANT">
                    <a
                        class="dropdown-item d-flex align-items-center"
                        href="javascript:void(0);"
                        @click="selectForDetail(cat)"
                    ><i
                        class="flaticon-view lh-1 me-8 position-relative top-1"
                    ></i>
                      Voir</a
                    >
                  </li>
                  <li v-if="userRole != UserRole.RESTAURANT">
                    <a
                        class="dropdown-item d-flex align-items-center"
                        href="javascript:void(0);"
                        @click="selectForDetail(cat)"
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
                        @click="selectForDelete(cat)"
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
                message="Aucune categorie pour le moment"
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
  listeRestaurantCategorie, deleteRestaurantCategorie, toggleActivationCategorieRestaurant
} from "@/service/api";
import {UserGeneralKey, UserRole} from "@/models/user.generalkey";
import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import {ApiResponse, PaginatedCategorie, PaginatedRestaurantCategory} from "@/models/Apiresponse";
import {PaginatedUsers} from "@/models/Apiresponse";
import {CategorieModel} from "@/models/categorie.model";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {AxiosError} from "axios";
import {Commons} from "@/utils/commons.utils";
import {RestaurantCategoryModel} from "@/models/restaurantCategory.model";

export default defineComponent({
  name: "VabeneCategorieList",
  components: {LoaderComponent, EmptyTable},
  data(){
    return{
      userRole: localStorage.getItem(UserGeneralKey.USER_ROLE),
      categorieResponse: null as ApiResponse<PaginatedCategorie> | null,
      categorieRestaurantResponse: null as ApiResponse<PaginatedRestaurantCategory> | null,
      isLoading: false,
      currentPage: 1 ,
      searchQuery: '', // Ajout du champ de recherche
      originalCategories:  [] as CategorieModel[], // Stockage des utilisateurs originaux
      originalRestaurantCategorie: [] as RestaurantCategoryModel[],
      categorieSelected: null,
    }
  },
  computed: {
    UserRole() {
      return UserRole
    },
    allCategorie():  CategorieModel[] {
      const categories = this.categorieResponse?.data?.items || this.originalCategories;

      // Filtrage par searchQuery
      const filtered = this.searchQuery
          ? categories.filter(categorie => {
            const query = this.searchQuery.toLowerCase();
            return (
                categorie.name?.toLowerCase().includes(query) ||
                categorie.description?.toLowerCase().includes(query)
            );
          })
          : categories;

      // Tri alphabétique par name
      return filtered.sort((a, b) => {
        const nameA = a.name?.toLowerCase() || '';
        const nameB = b.name?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
    },
    allRestaurantCategorie():  RestaurantCategoryModel[] {
      const categories = this.categorieRestaurantResponse?.data?.items || this.originalRestaurantCategorie;

      // Filtrage par searchQuery
      const filtered = this.searchQuery
          ? categories.filter(categorie => {
            const query = this.searchQuery.toLowerCase();
            return (
                categorie.category.name?.toLowerCase().includes(query) ||
                categorie.category.description?.toLowerCase().includes(query)
            );
          })
          : categories;

      // Tri alphabétique par name
      return filtered.sort((a, b) => {
        const nameA = a.category.name?.toLowerCase() || '';
        const nameB = b.category.name?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
    },

    pagination(): any {
      if(this.userRole === UserRole.FRANCHISE){
        return this.categorieResponse?.data?.pagination || {
          current_page: 1,
          total_items: 0,
          total_pages: 1,
          items_per_page: 8
        };
      }
      else{
        return this.categorieRestaurantResponse?.data?.pagination || {
          current_page: 1,
          total_items: 0,
          total_pages: 1,
          items_per_page: 8
        };
      }

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
        name: "VabeneAddCategoriePage",
        params: { action: ActionCrud.ADD }
      });
    },
    selectForDetail(categorie){
      if(this.userRole === UserRole.FRANCHISE){
        this.categorieSelected = categorie;
        console.log(categorie)
        this.$router.push({
          name: "VabeneAddCategoriePage",
          params: { action: ActionCrud.EDIT, categorieID: categorie.id }
        });
      }

    },
    selectForDelete(categorie){
      this.categorieSelected = categorie;

      console.log(categorie)
      // this.$router.push({
      //   name: "VabeneAddCategoriePage",
      //   params: { action: 'edit' }
      // });
    },
    async deleteFileUpload(fileID) {
      try {
        const response = await deleteFileUpload(fileID);
        console.log(response);
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
      if(this.userRole === UserRole.FRANCHISE){
        const publicID = Commons.extractPublicId(categorie.icone)
        console.log("publicID", publicID);
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
      }
      else{
        try {
          const response = await deleteRestaurantCategorie(categorie.id) as ApiResponse<any>;
          if (response.code === 201 || response.code === 200) {
            this.categorieResponse = response;
            this.toast.success(response.message);
          }
        } catch (error) {
          console.error(error);
        } finally {
          if(this.userRole === UserRole.FRANCHISE){
            setTimeout(() =>  {
              this.fetchCategories(1);
            }, 3000);
          }
          else{
            setTimeout(() =>  {
              this.fetchCategoriesRestaurant(1);
            }, 3000);
          }

        }
      }

    },
    async toggleCategorieActivation(categorie, status){
      //this.isLoading = true;
      if(this.userRole === UserRole.FRANCHISE){
        console.log(status)
        const payload = {
          'status': status
        }
        try {
          const response = await toggleActivationCategorie(categorie.id, payload) as ApiResponse<any>;
          //console.log(response)
          if (response.code === 200) {
            this.categorieResponse = response;
            if (response.data) {
              const responseDecoded = response.data
              console.log(responseDecoded)
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
      }
      else{

        try {
          const response = await toggleActivationCategorieRestaurant(categorie.id) as ApiResponse<any>;
          //console.log(response)
          if (response.code === 200) {
            this.toast.success(response.message);
            if (response.data) {
              const responseDecoded = response.data
              console.log(responseDecoded)
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
            this.fetchCategoriesRestaurant(1);
          }, 2000);
        }
      }

    },
    fetchRole(role: string): string {
      return UserGeneralKey.getRole(role);
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    async fetchCategories(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeCategorie(page, "1") as ApiResponse<PaginatedCategorie>;
        console.log(response)
        if (response.code === 200) {
          this.categorieResponse = response;
          if (response.data?.items) {
            this.originalCategories = response.data.items;
          }
          if (response.data && response.data.pagination) {
            this.currentPage = response.data.pagination.current_page;
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchCategoriesRestaurant(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeRestaurantCategorie(page, "1") as ApiResponse<PaginatedRestaurantCategory>;
        console.log(response)
        if (response.code === 200) {
          this.categorieRestaurantResponse = response;
          if (response.data?.items) {
            this.originalRestaurantCategorie = response.data.items;
          }
          if (response.data && response.data.pagination) {
            this.currentPage = response.data.pagination.current_page;
          }
        }
      } catch (error) {

        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        if(this.userRole === UserRole.FRANCHISE){
          this.fetchCategories(page);
        }
        else{
          this.fetchCategoriesRestaurant(page)
        }
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
    if(this.userRole === UserRole.FRANCHISE){
      this.fetchCategories();
    }
    else{
      this.fetchCategoriesRestaurant()
    }

  }
});
</script>