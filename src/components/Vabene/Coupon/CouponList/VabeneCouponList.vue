<template>
  <div class="card mb-25 border-0 rounded-0 bg-white letter-spacing">
    <div
        class="card-head box-shadow bg-white d-lg-flex align-items-center justify-content-between p-15 p-sm-20 p-md-25"
    >
      <div class="d-sm-flex align-items-center">
        <button
            @click="gotoCreate"
            class="default-btn position-relative transition border-0 fw-medium text-white pt-11 pb-11 ps-25 pe-25 pt-md-12 pb-md-12 ps-md-30 pe-md-30 rounded-1 bg-success fs-md-15 fs-lg-16 d-inline-block me-10 mb-10 mb-lg-0"
            type="button"

        >

          Ajouter un coupon

          <i class="flaticon-plus position-relative ms-5 fs-12"></i>
        </button>
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
              placeholder="Rechercher un coupon"
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
              CODE COUPON
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              TYPE
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              VALEUR
            </th>

            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              LIMITE D'UTILISATION
            </th>

            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              ETAT
            </th>

            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
            >
              NOMBRE D'UTILISATION
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
            <td class="shadow-none badge text-bg-warning fs-13 lh-1 fw-medium text-black">
              {{  categorie.code }}
            </td>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              {{ categorie.discount_type === 'fixed' ? 'Fixe': 'Pourcentage' }}
            </td>


            <td class="shadow-none lh-1 fw-medium text-muted">
              {{ categorie.discount_type === 'fixed' ? `${categorie.discount_value} CHF` : `${categorie.discount_value}%`  }}
            </td>


            <td class="shadow-none lh-1 fw-medium text-muted">
              {{  categorie.usage_limit }}
            </td>

            <td v-if="categorie.is_used" class="shadow-none badge text-bg-danger fs-13 fs-13 lh-1 fw-medium text-white">
               Utilisé
            </td>
            <td v-else class="shadow-none badge text-bg-success fs-13 lh-1 fw-medium text-white">
              Valide
            </td>

            <td v-if="categorie.eligible_users" class="shadow-none lh-1 fw-medium text-muted">
              {{  categorie.eligible_users.length }} utilisateurs
            </td>
            <td v-else class="shadow-none lh-1 fw-medium text-muted">
              -
            </td>

            <td class="shadow-none lh-1 fw-medium text-muted">
              {{  convertDateCreate(categorie.created_at) }}
            </td>

<!--            <td>-->
<!--              <div class="form-check form-switch">-->
<!--                <input-->
<!--                    class="form-check-input"-->
<!--                    type="checkbox"-->
<!--                    v-model="categorie.is_active"-->
<!--                    @change="toggleCategorieActivation(categorie, categorie.is_active)"-->
<!--                />-->

<!--              </div>-->
<!--            </td>-->



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
                        data-bs-toggle="modal" data-bs-target="#confirmModal"
                        href="#"
                        @click="prepareDelete(categorie)"
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
                message="Aucun coupon pour le moment"
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
          <button type="button" class="btn btn-danger" @click="executeDeleteAction()"  data-bs-dismiss="modal">
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
  listeNotification, listeCoupon, toggleActivationUser, disableCoupon, deleteCoupon
} from "@/service/api";
import {UserGeneralKey} from "@/models/user.generalkey";
import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import {ApiResponse, PaginatedCategorie, PaginatedCoupon, PaginatedNotification} from "@/models/Apiresponse";
import {PaginatedUsers} from "@/models/Apiresponse";
import {CategorieModel} from "@/models/categorie.model";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {AxiosError} from "axios";
import {Commons} from "@/utils/commons.utils";
import {NotificationModel} from "@/models/notification.model";
import {CouponModel} from "@/models/coupon.model";
import VabeneAddCouponPage from "@/pages/Vabene/Coupon/VabeneAddCouponPage.vue";

export default defineComponent({
  name: "VabeneNotificationList",
  components: {LoaderComponent, EmptyTable},
  data(){
    return{
      categorieResponse: null as ApiResponse<PaginatedCoupon> | null,
      rawApiResponse: null as any | null,
      isLoading: false,
      currentPage: 1 ,
      searchQuery: '', // Ajout du champ de recherche
      originalCategories: [] as CouponModel[], // Stockage des utilisateurs originaux
      categorieSelected: null as CouponModel | null,
    }
  },
  computed: {
    allCategorie(): CouponModel[] {
      const categories = this.categorieResponse?.data?.items || this.originalCategories;

      // Filtrage par searchQuery
      const filtered = this.searchQuery
          ? categories.filter(categorie => {
            const query = this.searchQuery.toLowerCase();
            return (
                categorie.code?.toLowerCase().includes(query) ||
                categorie.discount_type?.toLowerCase().includes(query)
            );
          })
          : categories;

      // Tri alphabétique par code
      return filtered.sort((a, b) => {
        const nameA = a.code?.toLowerCase() || '';
        const nameB = b.code?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
    },

    pagination(): any {
      return this.categorieResponse?.data?.pagination || {
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
    transformCouponData(apiResponse: any): ApiResponse<PaginatedCoupon> {
      try {
        // Transformer la réponse de l'API pour correspondre à la structure attendue
        const transformedData: PaginatedCoupon = {
          items: apiResponse.data || [],
          pagination: {
            current_page: apiResponse.pagination?.page || 1,
            total_items: apiResponse.pagination?.total || 0,
            total_pages: apiResponse.pagination?.totalPages || 1,
            items_per_page: apiResponse.pagination?.limit || 10
          }
        };

        return {
          code: apiResponse.code,
          message: apiResponse.message,
          data: transformedData
        };
      } catch (error) {
        console.error('Erreur lors de la transformation des données de coupons:', error);
        return {
          code: 500,
          message: 'Erreur lors de la transformation des données',
          data: {
            items: [],
            pagination: {
              current_page: 1,
              total_items: 0,
              total_pages: 1,
              items_per_page: 10
            }
          }
        };
      }
    },
    prepareDelete(categorie) {
      this.categorieSelected = categorie;
      // The modal will open via data-bs-toggle="modal" in the template.
    },
    // async toggleCategorieActivation(categorie, status){
    //   const payload = {
    //     'status': status
    //   }
    //   try {
    //     const response = await disableCoupon(categorie.code, payload) as ApiResponse<any>;
    //     if (response.code === 200) {
    //       const responseDecoded = response.data
    //       this.toast.success(response.message);
    //       setTimeout(() =>  {
    //         this.fetchCategories(1);
    //       }, 3000);
    //     } else {
    //       this.toast.error(response.message)
    //     }
    //   } catch (error) {
    //     this.toast.error("Erreur lors du chargement des categories");
    //     console.error(error);
    //   }
    // },
    truncateDescription(description: string, maxCharsPerLine = 50): string {
      const maxLength = maxCharsPerLine * 2; // 2 lignes

      // Supprime toutes les balises HTML
      const plainText = description.replace(/<[^>]+>/g, '').trim();

      // Si le texte est déjà court, on le retourne tel quel
      if (plainText.length <= maxLength) {
        return plainText;
      }

      // Coupe proprement à l'espace précédent
      const truncated = plainText.slice(0, maxLength);
      const lastSpace = truncated.lastIndexOf(" ");
      return truncated.slice(0, lastSpace) + "…";
    },
    getShortUuid(uuid: string): string {
      return uuid.split('-')[0];
    },
    gotoCreate(){
      this.$router.push({
        name: "VabeneAddCouponPage",
        params: { action: ActionCrud.ADD }
      });
    },
    selectForDetail(categorie){
      this.categorieSelected = categorie;
      this.$router.push({
        name: "VabeneAddCouponPage",
        params: { action: ActionCrud.EDIT, couponID: categorie.id }
      });
    },
    selectForDelete(categorie){
      if(categorie.id){
        this.categorieSelected = categorie
      }
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
    async executeDeleteAction(){
      if (!this.categorieSelected) {
        return;
      }
      try {
        const id = this.categorieSelected.id as string
        const response = await deleteCoupon(id) as ApiResponse<any>;
        if (response.code === 201 || response.code === 200) {
          this.toast.success(response.message);

          // Re-fetch the list to update the data cleanly
          await this.fetchCategories(this.currentPage);
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.categorieSelected = null;

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
        const response = await listeCoupon(page) as any;
        if (response.code === 200) {
          // Stocker la réponse brute pour référence
          this.rawApiResponse = response;
          
          // Transformer les données pour la compatibilité
          this.categorieResponse = this.transformCouponData(response);
          
          if (this.categorieResponse.data?.items) {
            this.originalCategories = this.categorieResponse.data.items;
          }
          if (this.categorieResponse.data && this.categorieResponse.data.pagination) {
            this.currentPage = this.categorieResponse.data.pagination.current_page;
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des coupons");
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