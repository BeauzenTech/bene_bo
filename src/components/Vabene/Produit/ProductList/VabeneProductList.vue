<template>
  <div class="card mb-25 border-0 rounded-0 bg-white letter-spacing">
    <div
        class="card-head box-shadow bg-white d-lg-flex align-items-center justify-content-between p-15 p-sm-20 p-md-25"
    >
      <div class="d-sm-flex align-items-center">
        <button  v-if="userRole === UserRole.FRANCHISE"
            @click="gotoCreate"
            class="default-btn position-relative transition border-0 fw-medium text-white pt-11 pb-11 ps-25 pe-25 pt-md-12 pb-md-12 ps-md-30 pe-md-30 rounded-1 bg-success fs-md-15 fs-lg-16 d-inline-block me-10 mb-10 mb-lg-0"
            type="button"

        >

             Ajouter

        </button>
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
              CRÉER LE
            </th>

            <!-- <th v-if="userRole === UserRole.FRANCHISE"
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              FAVORITE
            </th>
            <th  v-if="userRole === UserRole.FRANCHISE"
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              VEDETTE
            </th> -->
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
        
          <tr v-else-if="!isLoading && allRestaurantProducts.length > 0 && ( userRole === UserRole.RESTAURANT || userRole === UserRole.FRANCHISE)"
              v-for="(pr, index) in allRestaurantProducts" :key="pr.id"
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
                  <a href="#" @click="selectForDetail(pr)">
                    {{ index + 1}} - {{ getShortUuid(String(pr.product?.id || pr.id)) }}
                  </a>


                </div>
              </div>
            </th>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              <img
                  :src=" getProductImageUrl(pr)"
                  class="rounded-circle me-8 w-50 h-auto"
                  width="24px"
                  height="24px"
              />
              {{ getProductName(pr) }}
            </td>


            <th
                class="shadow-none lh-1 fw-medium text-black-emphasis title ps-0 text-capitalize"
            >
              <span  class="badge text-bg-warning fs-13">{{getProductCategoryName(pr)}}</span>
            </th>

            <td class="shadow-none lh-1 fw-medium text-muted">
              <!-- Toggle switch -->
              <div class="form-check form-switch">
                <input
                    class="form-check-input"
                    type="checkbox"
                    :checked="getProductAvailability(pr)"
                    @change="handleProductActivationChange(pr, $event)"
                />

              </div>
            </td>
            <td v-if="hasProductSizes(pr)">
              {{ convertDateCreate(getProductCreatedAt(pr)) }}
            </td>
<!--            <td class="shadow-none lh-1 fw-medium text-muted">-->
<!--              &lt;!&ndash; Toggle switch &ndash;&gt;-->
<!--              <div class="form-check form-switch">-->
<!--                <input-->
<!--                    class="form-check-input"-->
<!--                    type="checkbox"-->
<!--                    v-model="pr.product.isFavorite"-->
<!--                    @change="toggleProductFeatureActivation(product)"-->
<!--                />-->

<!--              </div>-->
<!--            </td>-->



<!--            <td class="shadow-none lh-1 fw-medium text-muted">-->
<!--              &lt;!&ndash; Toggle switch &ndash;&gt;-->
<!--              <div class="form-check form-switch">-->
<!--                <input-->
<!--                    class="form-check-input"-->
<!--                    type="checkbox"-->
<!--                    v-model="product.isVedette"-->
<!--                    @change="toggleProductFeatureActivation(product)"-->
<!--                />-->

<!--              </div>-->
<!--            </td>-->

            <td v-if="hasProductSizes(pr)">
              {{ getProductSizesCount(pr) }} Taille(s)
            </td>

            <td v-if="hasProductSizes(pr)">
              {{ getProductCookingTime(pr) }} minutes
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
<!--                  <li>-->
<!--                    <a-->
<!--                        class="dropdown-item d-flex align-items-center"-->
<!--                        href="javascript:void(0);"-->
<!--                        @click="selectForDetail(pr)"-->
<!--                    ><i-->
<!--                        class="flaticon-view lh-1 me-8 position-relative top-1"-->
<!--                    ></i>-->
<!--                      Voir</a-->
<!--                    >-->
<!--                  </li>-->
<!--                  <li>-->
<!--                    <a-->
<!--                        class="dropdown-item d-flex align-items-center"-->
<!--                        href="javascript:void(0);"-->
<!--                        @click="selectForDetail(pr)"-->
<!--                    ><i-->
<!--                        class="flaticon-pen lh-1 me-8 position-relative top-1"-->
<!--                    ></i>-->
<!--                      Editer</a-->
<!--                    >-->
<!--                  </li>-->
<!--                  <li>-->
<!--                    <a-->
<!--                        class="dropdown-item d-flex align-items-center"-->
<!--                        data-bs-toggle="modal" data-bs-target="#confirmModal"-->
<!--                        href="javascript:void(0);"-->
<!--                        @click="selectForDelete(pr)"-->
<!--                    ><i-->
<!--                        class="flaticon-delete lh-1 me-8 position-relative top-1"-->
<!--                    ></i>-->
<!--                      Supprimer</a-->
<!--                    >-->
<!--                  </li>-->
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
  deleteIngredient, deleteProductTemporary, listeCategorie, getAllCategories,
  listeIngredient,
  listeProducts, listeRestaurantProduct, toggleActivationFeatureProduct,
  toggleActivationIngredient, toggleActivationProduct, toggleActivationProductRestaurant,
  getProductsByCategory
} from "@/service/api";
import {UserGeneralKey, UserRole} from "@/models/user.generalkey";
import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import {
  ApiResponse,
  PaginatedCategorie,
  PaginatedIngredient,
  PaginatedProduct,
  PaginatedRestaurantProduct
} from "@/models/Apiresponse";
import {PaginatedUsers} from "@/models/Apiresponse";
import {CategorieModel} from "@/models/categorie.model";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {AxiosError} from "axios";
import {Commons} from "@/utils/commons.utils";
import {IngredientModel} from "@/models/ingredient.model";
import {ProductModel} from "@/models/product.model";
import {MethodePaiementModel} from "@/models/methodePaiement.model";
import {Modal} from "bootstrap";
import {RestaurantProductModel} from "@/models/RestaurantProduct.model";

export default defineComponent({
  name: "VabeneProductList",
  components: {LoaderComponent, EmptyTable},
  data(){
    return{
      isLoading: false,
      currentPage: 1 ,
      userRole: localStorage.getItem(UserGeneralKey.USER_ROLE),
      searchQuery: '', // Ajout du champ de recherche
      productSelected: null as ProductModel | null,
      productResponse: null as ApiResponse<PaginatedProduct> | null,
      originalProducts: [] as ProductModel[],
      originalCategories: [] as CategorieModel[], // Stockage des utilisateurs originaux
      categorieSelected: null as CategorieModel | null,
      productRestaurantResponse: null as ApiResponse<PaginatedRestaurantProduct> | null,
      originalRestaurantProducts: [] as RestaurantProductModel[],
    }
  },
  computed: {
    UserRole() {
      return UserRole
    },
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
    allRestaurantProducts(): RestaurantProductModel[] {
      const products = this.productRestaurantResponse?.data?.items || this.originalRestaurantProducts;
      if (!this.searchQuery) return products;
      const query = this.searchQuery.toLowerCase();
      return products.filter(product => {
        return (
            (product.product.name.toLowerCase().includes(query))  ||
            (product.product.id.toLowerCase().includes(query))
        );
      });
    },

    pagination(): any {
        return this.productRestaurantResponse?.data?.pagination || {
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
    getProductImageUrl(product: any): string {
      try {
        // Gérer le cas où image_urls est une chaîne JSON
        let imageUrls = product.product?.image_urls || product.image_urls;
        
        if (typeof imageUrls === 'string') {
          imageUrls = JSON.parse(imageUrls);
        }
        
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
          return imageUrls[0];
        }
        
        return require('@/assets/images/icon/jpg.png');
      } catch (error) {
        return require('@/assets/images/icon/jpg.png');
      }
    },
    getProductName(product: any): string {
      return product.name || 'N/A';
    },
    getProductCategoryName(product: any): string {
      return product?.category_name || 'N/A';
    },
    hasProductSizes(product: any): boolean {
      return !!(product.variations);
    },
    getProductCreatedAt(product: any): string {
      return product?.updated_at || '';
    },
    getProductSizesCount(product: any): number {
      return product.variations?.length || 0;
    },
    getProductCookingTime(product: any): number {
      return product.cookingTime || 0;
    },
    getProductAvailability(product: any): boolean {
      return Number(product.isActive) === 1;
    },
    handleProductActivationChange(product: any, event: Event): void {
      const target = event.target as HTMLInputElement;
      this.toggleProductActivation(product, target.checked);
    },
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
      if(this.userRole === UserRole.FRANCHISE){
        this.productSelected = product;
        this.$router.push({
          name: "VabeneAddProductPage",
          params: { action: ActionCrud.EDIT, productID: product.id }
        });
      }

    },
    selectForDelete(product){
      this.productSelected = product;

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
    async confirmationDeleteAction(product){
      const publicID = Commons.extractPublicId(product.image_urls[0])
      try {

        const response = await deleteProductTemporary(product.id) as ApiResponse<any>;
        await this.deleteFileUpload(publicID)
        if (response.code === 201) {
          this.productResponse = response;
          this.toast.success(response.message);
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
      if(this.userRole === UserRole.FRANCHISE){
        const payload = {
          'status': status
        }
        try {
          const response = await toggleActivationProduct(product.id, payload) as ApiResponse<any>;
          if (response.code === 200) {
            this.productResponse = response;
            if (response.data) {
              const responseDecoded = response.data
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
      }
      else{
        const payload = {
          'status': status
        }
        try {
          const response = await toggleActivationProductRestaurant(product.id) as ApiResponse<any>;
          if (response.code === 200 || response.code === 201) {
            this.productResponse = response;
            this.toast.success(response.message);

          } else {
            this.toast.error(response.message);
          }
        } catch (error) {
          this.toast.error("Erreur lors du chargement des produits");
          console.error(error);
        } finally {
          setTimeout(() =>  {
            if(this.categorieSelected){
              this.fetchRestaurantProduct(1, this.categorieSelected.id)
            }
          }, 2000);
        }
      }

    },
    async toggleProductFeatureActivation(product){
      //this.isLoading = true;
      const payload = {
        "isFavorite": product.isFavorite,
        "isVedette": product.isVedette,
        "isSelected": product.isSelected,
        "isSpeciality": product.isSpeciality
      }
      try {
        const response = await toggleActivationFeatureProduct(product.id, payload) as ApiResponse<any>;
        if (response.code === 200) {
          this.productResponse = response;
          if (response.data) {
            const responseDecoded = response.data
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
      return liste.find(categorie => categorie.name === name);
    },
    async fetchCategories(page = 1) {
      this.isLoading = true;
      try {
        const response = await getAllCategories(1, 50) as any;
        console.log('Categories API Response:', response?.data);
        if (response?.code === 200) {
          const categoriesData = Array.isArray(response.data?.data) ? response.data?.data : [];
          this.originalCategories = categoriesData;
            this.categorieSelected = this.originalCategories[0];
          this.toast.success(response?.message);
          
           
          await this.fetchRestaurantProduct(1, this.categorieSelected.id)
            
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchProduct(page = 1, filter: string, categorieID?: string) {
      this.isLoading = true;
      try {
        if (!categorieID) {
          this.toast.error("ID de catégorie manquant");
          return;
        }
        const response = await getProductsByCategory(categorieID, page, 10) as any;
        if (response.code === 200) {
          const productsData = Array.isArray(response.data) ? response.data : [];
          
          // Stocker directement les données dans originalProducts
          this.originalProducts = productsData;
          
          // Créer la structure pour productResponse
          this.productResponse = {
            code: response.code,
            message: response.message,
            data: {
              items: productsData,
              pagination: {
                current_page: response.pagination?.page || 1,
                total_items: response.pagination?.total || 0,
                total_pages: response.pagination?.totalPages || 1,
                items_per_page: response.pagination?.limit || 10
              }
            }
          };
          
          this.currentPage = response.pagination?.page || 1;
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des produits");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchRestaurantProduct(page = 1, categoryId: string) {
      this.isLoading = true;
      try {
        const response = await getProductsByCategory(categoryId, page, 10) as any;
        console.log('Restaurant Products API Response:', response);
        console.log('Response data:', response.data);
        if (response.code === 200) {
          // L'API retourne {data: Array, pagination: {...}} dans response.data
          const productsData = Array.isArray(response.data.data) ? response.data.data : [];
          console.log('Products data:', productsData);
          
          // Stocker directement les données dans originalRestaurantProducts
          this.originalRestaurantProducts = productsData;
          
          // Créer la structure pour productRestaurantResponse
          this.productRestaurantResponse = {
            code: response.code,
            message: response.message,
            data: {
              items: productsData,
              pagination: {
                current_page: response.data.pagination?.page || 1,
                total_items: response.data.pagination?.total || 0,
                total_pages: response.data.pagination?.totalPages || 1,
                items_per_page: response.data.pagination?.limit || 10
              }
            }
          };
          
          this.currentPage = response.data.pagination?.page || 1;
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des produits");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        
          if(this.categorieSelected){
            this.fetchRestaurantProduct(page, this.categorieSelected.id)
          }
        
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
    this.fetchCategories(1)
  },
  watch:{
    categorieSelected(newVal, oldVal) {
      if (typeof newVal === 'string' && newVal !== oldVal) {
        this.categorieSelected = this.originalCategories.find(c => c.id === newVal) ?? null;
       
         this.fetchRestaurantProduct(1,  newVal);
        

      }
    }
  }
});
</script>