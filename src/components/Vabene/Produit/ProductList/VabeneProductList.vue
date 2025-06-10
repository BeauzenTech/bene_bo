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

             Ajouter

        </Button>
        <div class="col-md-12">
          <div class="form-group   position-relative transition">
            <v-select
                v-model="categorieSelected"
                :options="originalCategories"
                label="name"
                :reduce="categorie => categorie.id"
                placeholder="Filtrer par categorie"

            />
          </div>
        </div>
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
              placeholder="Rechercher un produit"
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
              NOM
            </th>


            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              CATEGORIE
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
              CREER LE
            </th>

            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              FAVORITE
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              VEDETTE
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              TAILLE
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              TEMPS DE CUISSON
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
          <tr v-else-if="!isLoading && allProducts.length > 0"
              v-for="(product, index) in allProducts" :key="product.id"
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
                  <a href="#" @click="selectForDetail(product)">
                    {{ index + 1}} - {{ getShortUuid(product.id) }}
                  </a>


                </div>
              </div>
            </th>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              <img
                  :src=" product.image_urls[0] || require('@/assets/images/icon/jpg.png')"
                  class="rounded-circle me-8 w-50 h-auto"
                  width="24px"
                  height="24px"
                  alt="product"
              />
              {{ product.name }}
            </td>


            <th
                class="shadow-none lh-1 fw-medium text-black-emphasis title ps-0 text-capitalize"
            >
              <span  class="badge text-bg-warning fs-13">{{product.categorieID.name}}</span>
            </th>

            <td class="shadow-none lh-1 fw-medium text-muted">
              <!-- Toggle switch -->
              <div class="form-check form-switch">
                <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="product.isActive"
                    @change="toggleProductActivation(product, product.isActive)"
                />

              </div>
            </td>
            <td v-if="product.productSizes">
              {{ convertDateCreate(product.created_at) }}
            </td>
            <td class="shadow-none lh-1 fw-medium text-muted">
              <!-- Toggle switch -->
              <div class="form-check form-switch">
                <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="product.isFavorite"
                    @change="toggleProductFeatureActivation(product)"
                />

              </div>
            </td>



            <td class="shadow-none lh-1 fw-medium text-muted">
              <!-- Toggle switch -->
              <div class="form-check form-switch">
                <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="product.isVedette"
                    @change="toggleProductFeatureActivation(product)"
                />

              </div>
            </td>

            <td v-if="product.productSizes">
              {{ product.productSizes.length  }} Taille(s)
            </td>

            <td v-if="product.productSizes">
              {{ product.cookingTime  }} minutes
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
                        @click="selectForDetail(product)"
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
                        @click="selectForDetail(product)"
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
                        @click="selectForDelete(product)"
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
                message="Aucun produit pour le moment"
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
          <button type="button" class="btn btn-danger" @click="confirmationDeleteAction(productSelected)" data-bs-dismiss="modal">
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
  deleteFileUpload,
  deleteIngredient, deleteProductTemporary, listeCategorie, listeCategorieActive,
  listeIngredient,
  listeProducts, toggleActivationFeatureProduct,
  toggleActivationIngredient, toggleActivationProduct
} from "@/service/api";
import {UserGeneralKey} from "@/models/user.generalkey";
import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import {ApiResponse, PaginatedCategorie, PaginatedIngredient, PaginatedProduct} from "@/models/Apiresponse";
import {PaginatedUsers} from "@/models/Apiresponse";
import {CategorieModel} from "@/models/categorie.model";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {AxiosError} from "axios";
import {Commons} from "@/utils/commons.utils";
import {IngredientModel} from "@/models/ingredient.model";
import {ProductModel} from "@/models/product.model";
import {MethodePaiementModel} from "@/models/methodePaiement.model";
import {Modal} from "bootstrap";

export default defineComponent({
  name: "VabeneProductList",
  components: {LoaderComponent, EmptyTable},
  data(){
    return{
      isLoading: false,
      currentPage: 1 ,
      searchQuery: '', // Ajout du champ de recherche
      productSelected: null as ProductModel | null,
      productResponse: null as ApiResponse<PaginatedProduct> | null,
      originalProducts: [] as ProductModel[],
      originalCategories: [] as CategorieModel[], // Stockage des utilisateurs originaux
      categorieSelected: null as CategorieModel | null,
    }
  },
  computed: {
    allProducts(): ProductModel[] {
      const products = this.productResponse?.data?.items || this.originalProducts;
      if (!this.searchQuery) return products;
      const query = this.searchQuery.toLowerCase();
      return products.filter(product => {
        return (
            (product.name.toLowerCase().includes(query))  ||
            (product.id.toLowerCase().includes(query))
            );
      });
    },

    pagination(): any {
      return this.productResponse?.data?.pagination || {
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
      this.$router.push({
        name: "VabeneAddProductPage",
        params: { action: ActionCrud.ADD }
      });
    },
    selectForDetail(product){
      this.productSelected = product;
      console.log(product)
      this.$router.push({
        name: "VabeneAddProductPage",
        params: { action: ActionCrud.EDIT, productID: product.id }
      });
    },
    selectForDelete(product){
      this.productSelected = product;
      console.log(product)

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
    async confirmationDeleteAction(product){
      const publicID = Commons.extractPublicId(product.image_urls[0])
      console.log("publicID", publicID);
      try {

        const response = await deleteProductTemporary(product.id) as ApiResponse<any>;
        await this.deleteFileUpload(publicID)
        if (response.code === 201) {
          this.productResponse = response;
          this.toast.success(response.message);
        } else {
          console.log(response.message)
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des produits");
        console.error(error);
      } finally {
        setTimeout(() =>  {
          if(this.categorieSelected){
            this.fetchProduct(1, "existing", this.categorieSelected.id)
          }
        }, 2000);
      }
    },
    async toggleProductActivation(product, status){
      //this.isLoading = true;
      console.log(status)
      const payload = {
        'status': status
      }
      try {
        const response = await toggleActivationProduct(product.id, payload) as ApiResponse<any>;
        //console.log(response)
        if (response.code === 200) {
          this.productResponse = response;
          if (response.data) {
            const responseDecoded = response.data
            console.log(responseDecoded)
            this.toast.success(response.message);
          }

        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des produits");
        console.error(error);
      } finally {
        setTimeout(() =>  {
          if(this.categorieSelected){
            this.fetchProduct(1, "existing", this.categorieSelected.id)
          }
        }, 2000);
      }
    },
    async toggleProductFeatureActivation(product){
      //this.isLoading = true;
      console.log(product)
      const payload = {
        "isFavorite": product.isFavorite,
        "isVedette": product.isVedette,
        "isSelected": product.isSelected,
        "isSpeciality": product.isSpeciality
      }
      try {
        const response = await toggleActivationFeatureProduct(product.id, payload) as ApiResponse<any>;
        //console.log(response)
        if (response.code === 200) {
          this.productResponse = response;
          if (response.data) {
            const responseDecoded = response.data
            console.log(responseDecoded)
            this.toast.success(response.message);
          }

        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des produits");
        console.error(error);
      } finally {
        setTimeout(() =>  {
          if(this.categorieSelected){
            this.fetchProduct(1, "existing", this.categorieSelected.id)
          }
        }, 2000);
      }
    },
    fetchRole(role: string): string {
      return UserGeneralKey.getRole(role);
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    getCategorieByName(
        liste: CategorieModel[],
        name: string
    ): CategorieModel | undefined{
      console.log(liste)
      console.log(name)
      return liste.find(categorie => categorie.name === name);
    },
    async fetchCategories(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeCategorieActive(page) as ApiResponse<PaginatedCategorie>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            this.originalCategories = response.data.items;
            this.categorieSelected = this.originalCategories[0];
            console.log("categorie default: ", this.categorieSelected)
            await  this.fetchProduct(1, "existing", this.categorieSelected.id);
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchProduct(page = 1, filter: string, categorieID: string) {
      const payload = {
        "categorieID": categorieID
      }
      this.isLoading = true;
      try {
        const response = await listeProducts(page, filter, payload) as ApiResponse<PaginatedProduct>;
        console.log(response)
        if (response.code === 200) {
          this.productResponse = response;
          if (response.data?.items) {
            this.originalProducts = response.data.items;
          }
          if (response.data && response.data.pagination) {
            this.currentPage = response.data.pagination.current_page;
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        if(this.categorieSelected){
          this.fetchProduct(page, "existing", this.categorieSelected.id)
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
    this.fetchCategories(1)
  },
  watch:{
    categorieSelected(newVal, oldVal) {
      if (typeof newVal === 'string' && newVal !== oldVal) {
        console.log("Nouvelle catégorie sélectionnée :", newVal);
        this.fetchProduct(1, "existing", newVal); // ou newVal.id selon le besoin
      }
    }
  }
});
</script>