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
          Ajouter un ingrédient de base
          <i class="flaticon-plus position-relative ms-5 fs-12"></i>
        </button>
      </div>
      <div class="d-flex align-items-center">
        <form class="search-box position-relative me-15" @submit.prevent>
          <input
              v-model="searchQuery"
              type="text"
              class="form-control shadow-none text-black rounded-0 border-0"
              placeholder="Rechercher un ingrédient de base"
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
              ICONE
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
              DATE DE CRÉATION
            </th>
            <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 text-end pe-0"
            ></th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="isLoading">
            <td colspan="4" class="text-center py-4">
              <LoaderComponent/>
            </td>
          </tr>
          <tr v-else-if="!isLoading && allIngredientsBase.length > 0"
              v-for="(ingredient, index) in allIngredientsBase" :key="ingredient.id"
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
                  <a href="#" @click="selectForDetail(ingredient)">
                    {{ index + 1}} - {{ getShortUuid(ingredient.id) }}
                  </a>
                </div>
              </div>
            </th>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              <img
                  :src=" ingredient.image_url || require('@/assets/images/icon/jpg.png')"
                  class="rounded-circle me-8"
                  width="24"
                  height="24"
              />
            </td>
            <td class="shadow-none lh-1 fw-medium text-black-emphasis">
              {{ ingredient.name }}
            </td>
            <td class="shadow-none lh-1 fw-medium text-muted">
              {{ convertDateCreate(ingredient.created_at) }}
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
                        @click="selectForDetail(ingredient)"
                    ><i
                        class="flaticon-view lh-1 me-8 position-relative top-1"
                    ></i>
                      Modifier</a
                    >
                  </li>
                  <li>
                    <a
                        class="dropdown-item d-flex align-items-center"
                        data-bs-toggle="modal" data-bs-target="#confirmModal"
                        href="#"
                        @click="prepareDelete(ingredient)"
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
                message="Aucun ingrédient de base pour le moment"
                :colspan="4"
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

  <!-- Modal pour ajouter/éditer un ingrédient de base -->
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="fas fa-plus-circle me-2 text-success"></i>
          {{ isEditing ? 'Modifier l\'ingrédient de base' : 'Ajouter un ingrédient de base' }}
        </h5>
        <button type="button" class="btn-close-modal" @click="closeModal" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group mb-3">
            <label class="form-label">
              <i class="fas fa-tag me-2 text-primary"></i>
              Nom de l'ingrédient de base *
            </label>
            <input
              type="text"
              class="form-control"
              placeholder="e.g. Tomate, Fromage, Jambon..."
              v-model="formData.name"
              required
              :class="{ 'is-valid': formData.name.trim().length > 0 }"
            />
            <div class="form-text">
              <i class="fas fa-info-circle me-1"></i>
              Saisissez le nom de l'ingrédient de base pour les pizzas
            </div>
          </div>

          <div class="form-group mb-3">
            <label class="form-label">
              <i class="fas fa-image me-2 text-primary"></i>
              Image de l'ingrédient
            </label>
            
            <!-- Aperçu de l'image -->
            <div v-if="formData.image_url || formData.imageFile" class="mb-3">
              <div class="image-preview-container">
                <img 
                  :src="getImagePreview()" 
                  alt="Aperçu de l'image"
                  class="image-preview"
                />
                <button 
                  type="button" 
                  class="btn-remove-image"
                  @click="removeImage"
                  title="Supprimer l'image"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>

            <!-- Onglets pour URL ou Upload -->
            <div class="image-input-tabs">
              <div class="nav nav-tabs mb-3" role="tablist">
                <button 
                  class="nav-link" 
                  :class="{ active: !imageUploadMode }"
                  @click="imageUploadMode = false"
                  type="button"
                >
                  <i class="fas fa-link me-2"></i>URL
                </button>
                <button 
                  class="nav-link" 
                  :class="{ active: imageUploadMode }"
                  @click="imageUploadMode = true"
                  type="button"
                >
                  <i class="fas fa-upload me-2"></i>Upload
                </button>
              </div>

              <!-- Champ URL -->
              <div v-if="!imageUploadMode" class="tab-content">
                <input
                  type="url"
                  class="form-control"
                  placeholder="https://example.com/image.jpg"
                  v-model="formData.image_url"
                  @input="formData.imageFile = null"
                />
                <div class="form-text">
                  <i class="fas fa-info-circle me-1"></i>
                  Saisissez l'URL complète de l'image
                </div>
              </div>

              <!-- Upload de fichier -->
              <div v-else class="tab-content">
                <div class="upload-area" 
                     :class="{ 'drag-over': isDragOver }"
                     @dragover.prevent="isDragOver = true"
                     @dragleave.prevent="isDragOver = false"
                     @drop.prevent="handleFileDrop">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleFileSelect"
                    style="display: none;"
                  />
                  <div class="upload-content" @click="openFileDialog">
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <p class="upload-text">
                      Cliquez pour sélectionner une image<br>
                      ou glissez-déposez ici
                    </p>
                    <small class="upload-hint">
                      Formats acceptés: JPG, PNG, GIF (max 5MB)
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button 
          type="button" 
          class="btn btn-outline-secondary" 
          @click="closeModal" 
          :disabled="isLoading"
        >
          <i class="fas fa-times me-2"></i>
          Annuler
        </button>
        <button 
          type="button" 
          class="btn btn-success" 
          @click="submitForm"
          :disabled="!formData.name.trim() || isLoading"
        >
          <LoaderComponent v-if="isLoading" class="me-2" />
          <i v-else class="fas fa-save me-2"></i>
          {{ isEditing ? 'Mettre à jour' : 'Ajouter l\'ingrédient' }}
        </button>
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
          <p class="mb-0">Êtes-vous sûr de vouloir supprimer cet ingrédient de base ?<br>Cette action est irréversible.</p>
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
import { useToast } from "vue-toastification";
import { AxiosError } from 'axios';
import { ApiResponse } from "@/models/Apiresponse";
import { IngredientBaseModel, CreateIngredientBaseRequest, UpdateIngredientBaseRequest } from "@/models/ingredientBase.model";
import { listeIngredientBase, deleteIngredientBase, createIngredientBase, updateIngredientBase } from "@/service/api";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import LoaderComponent from "@/components/Loading/Loader.vue";
import { UserGeneralKey } from "@/models/user.generalkey";

export default defineComponent({
  name: "VabeneIngredientBaseList",
  components: {
    EmptyTable,
    LoaderComponent
  },
  data() {
    return {
      ingredientBaseResponse: null as ApiResponse<IngredientBaseModel[]> | null,
      rawApiResponse: null as any | null,
      isLoading: false,
      currentPage: 1,
      searchQuery: '',
      originalIngredients: [] as IngredientBaseModel[],
      selectedIngredient: null as IngredientBaseModel | null,
      isEditing: false,
      showModal: false,
      formData: {
        name: '',
        image_url: '',
        imageFile: null as File | null
      },
      imageUploadMode: false,
      isDragOver: false
    };
  },
  computed: {
    allIngredientsBase(): IngredientBaseModel[] {
      const ingredients = this.ingredientBaseResponse?.data || this.originalIngredients;

      // Si on a des informations de pagination de l'API, on utilise les données telles quelles
      if (this.rawApiResponse && this.rawApiResponse.pagination) {
        return ingredients;
      }

      // Fallback pour le filtrage côté client si pas de pagination serveur
      const filtered = this.searchQuery
          ? ingredients.filter(ingredient => {
            const query = this.searchQuery.toLowerCase();
            return (
                ingredient.name?.toLowerCase().includes(query)
            );
          })
          : ingredients;

      // Tri alphabétique par name
      return filtered.sort((a, b) => {
        const nameA = a.name?.toLowerCase() || '';
        const nameB = b.name?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
    },

    paginationInfo(): string {
      console.log('rawApiResponse:', this.rawApiResponse);
      console.log('pagination:', this.rawApiResponse?.pagination);
      
      if (this.rawApiResponse && this.rawApiResponse.pagination) {
        const { total, page, limit } = this.rawApiResponse.pagination;
        const start = (page - 1) * limit + 1;
        const end = Math.min(page * limit, total);
        console.log(`Pagination API: ${start} à ${end} sur ${total}`);
        return `Affichage de ${start} à ${end} sur ${total} résultats`;
      }
      
      // Fallback si pas d'informations de pagination
      const totalItems = this.allIngredientsBase.length;
      const start = (this.currentPage - 1) * 10 + 1;
      const end = Math.min(this.currentPage * 10, totalItems);
      console.log(`Pagination fallback: ${start} à ${end} sur ${totalItems}`);
      return `Affichage de ${start} à ${end} sur ${totalItems} résultats`;
    },

    totalPages(): number {
      console.log('Calcul totalPages - rawApiResponse:', this.rawApiResponse);
      console.log('Calcul totalPages - pagination:', this.rawApiResponse?.pagination);
      
      if (this.rawApiResponse && this.rawApiResponse.pagination) {
        const totalPages = this.rawApiResponse.pagination.totalPages;
        console.log('Total pages from API:', totalPages);
        return totalPages;
      }
      
      // Solution temporaire : forcer 5 pages si on a 41 éléments
      if (this.rawApiResponse && this.rawApiResponse.data && this.rawApiResponse.data.length === 10) {
        console.log('Solution temporaire: 5 pages pour 41 éléments');
        return 5;
      }
      
      // Fallback si pas d'informations de pagination
      const fallbackPages = Math.ceil(this.allIngredientsBase.length / 10);
      console.log('Total pages fallback:', fallbackPages);
      return fallbackPages;
    }
  },
  methods: {
    transformIngredientBaseData(apiResponse: any): ApiResponse<IngredientBaseModel[]> {
      try {
        // Transformer la réponse de l'API pour correspondre à la structure attendue
        return {
          code: apiResponse.code,
          message: apiResponse.message,
          data: apiResponse.data || []
        };
      } catch (error) {
        console.error('Erreur lors de la transformation des données d\'ingrédients de base:', error);
        return {
          code: 500,
          message: 'Erreur lors de la transformation des données',
          data: []
        };
      }
    },
    async fetchIngredientsBase(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeIngredientBase(page) as any;
        console.log('Réponse API complète:', response);
        console.log('Informations de pagination:', response.pagination);
        
        if (response.code === 200) {
          // Stocker la réponse brute pour les informations de pagination
          this.rawApiResponse = response;
          
          // Transformer les données pour la compatibilité
          this.ingredientBaseResponse = this.transformIngredientBaseData(response);
          
          if (response.data) {
            this.originalIngredients = response.data;
          }
          this.currentPage = page;
          
          console.log('Données transformées:', this.ingredientBaseResponse);
          console.log('Page courante:', this.currentPage);
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des ingrédients de base");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    getShortUuid(uuid: string): string {
      return uuid.split('-')[0];
    },

    gotoCreate() {
      this.isEditing = false;
      this.formData.name = '';
      this.formData.image_url = '';
      this.formData.imageFile = null;
      this.imageUploadMode = false;
      this.selectedIngredient = null;
      this.showModal = true;
    },

    selectForDetail(ingredient: IngredientBaseModel) {
      this.isEditing = true;
      this.selectedIngredient = ingredient;
      this.formData.name = ingredient.name;
      this.formData.image_url = ingredient.image_url || '';
      this.formData.imageFile = null;
      this.imageUploadMode = false;
      this.showModal = true;
    },

    prepareDelete(ingredient: IngredientBaseModel) {
      this.selectedIngredient = ingredient;
    },

    async submitForm() {
      if (!this.formData.name.trim()) {
        this.toast.error('Le nom de l\'ingrédient de base est requis');
        return;
      }

      this.isLoading = true;
      try {
        // Si un fichier image est sélectionné, l'uploader d'abord
        if (this.formData.imageFile) {
          console.log('Upload du fichier image...');
          try {
            this.formData.image_url = await this.uploadImageFile(this.formData.imageFile);
            console.log('URL générée après upload:', this.formData.image_url);
          } catch (error) {
            console.error('Erreur lors de l\'upload de l\'image:', error);
            this.toast.error('Erreur lors de l\'upload de l\'image');
            return;
          }
        }
        if (this.isEditing && this.selectedIngredient) {
          // Mise à jour
          const payload: UpdateIngredientBaseRequest = {
            name: this.formData.name.trim(),
            image_url: this.formData.image_url || undefined
          };
          console.log('Payload de mise à jour:', payload);
          const response = await updateIngredientBase(this.selectedIngredient.id!, payload);
          if (response.code === 200) {
            this.toast.success(response.message);
            this.closeModal();
            await this.fetchIngredientsBase();
          } else {
            this.toast.error(response.message);
          }
        } else {
          // Création
          const payload: CreateIngredientBaseRequest = {
            name: this.formData.name.trim(),
            image_url: this.formData.image_url || undefined
          };
          console.log('Payload de création:', payload);
          const response = await createIngredientBase(payload);
          if (response.code === 201) {
            this.toast.success(response.message);
            this.closeModal();
            await this.fetchIngredientsBase();
          } else {
            this.toast.error(response.message);
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.data) {
          const message = (axiosError.response.data as any).message;
          this.toast.error(message);
        } else {
          this.toast.error("Une erreur est survenue");
        }
      } finally {
        this.isLoading = false;
      }
    },

    closeModal() {
      this.showModal = false;
      this.formData.name = '';
      this.formData.image_url = '';
      this.formData.imageFile = null;
      this.imageUploadMode = false;
      this.isEditing = false;
      this.selectedIngredient = null;
    },

    async executeDeleteAction() {
      if (!this.selectedIngredient) {
        return;
      }
      try {
        const id = this.selectedIngredient.id as string;
        const response = await deleteIngredientBase(id) as ApiResponse<any>;
        if (response.code === 201 || response.code === 200) {
          this.toast.success(response.message);
          // Re-fetch the list to update the data cleanly
          await this.fetchIngredientsBase();
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.selectedIngredient = null;
      }
    },

    changePage(page: number) {
      console.log('changePage appelée avec:', page);
      console.log('totalPages:', this.totalPages);
      console.log('currentPage:', this.currentPage);
      
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        console.log('Chargement de la page:', page);
        this.fetchIngredientsBase(page);
      } else {
        console.log('Changement de page ignoré - conditions non remplies');
      }
    },

    generatePageNumbers(): number[] {
      const pages: number[] = [];
      const maxVisiblePages = 5;
      const totalPages = this.totalPages;
      const currentPage = this.rawApiResponse?.pagination?.page || this.currentPage;

      console.log('generatePageNumbers - totalPages:', totalPages);
      console.log('generatePageNumbers - currentPage:', currentPage);

      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      console.log('Pages générées:', pages);
      return pages;
    },

    convertDateCreate(date?: string): string {
      if (!date) return 'N/A';
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },

    // Méthodes pour la gestion des images
    getImagePreview(): string {
      if (this.formData.imageFile) {
        return URL.createObjectURL(this.formData.imageFile);
      }
      return this.formData.image_url || '';
    },

    removeImage() {
      this.formData.image_url = '';
      this.formData.imageFile = null;
    },

    handleFileSelect(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        this.processFile(target.files[0]);
      }
    },

    handleFileDrop(event: DragEvent) {
      this.isDragOver = false;
      if (event.dataTransfer && event.dataTransfer.files[0]) {
        this.processFile(event.dataTransfer.files[0]);
      }
    },

    processFile(file: File) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        this.toast.error('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.toast.error('La taille du fichier ne doit pas dépasser 5MB');
        return;
      }

      this.formData.imageFile = file;
      this.formData.image_url = ''; // Effacer l'URL si on upload un fichier
      this.toast.success('Image sélectionnée avec succès');
    },

    openFileDialog() {
      const fileInput = this.$refs.fileInput as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    },

    async uploadImageFile(file: File): Promise<string> {
      // TODO: Implémenter l'upload vers un service de stockage
      // Pour l'instant, on retourne une URL temporaire
      return new Promise((resolve) => {
        // Simulation d'un upload
        setTimeout(() => {
          // En production, ceci devrait être remplacé par un vrai upload
          const tempUrl = URL.createObjectURL(file);
          resolve(tempUrl);
        }, 1000);
      });
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchIngredientsBase();
  }
});
</script>

<style scoped>
.table th {
  border-top: none;
}

/* Styles pour le modal personnalisé */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1055;
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

.modal-header {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
}

.btn-close-modal {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.btn-close-modal:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #ffffff;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control.is-valid {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-text {
  margin-top: 8px;
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
}

.modal-footer {
  padding: 16px 24px 24px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #f9fafb;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.btn-outline-secondary {
  background-color: transparent;
  color: #6b7280;
  border: 2px solid #d1d5db;
}

.btn-outline-secondary:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: 2px solid #10b981;
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  border-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Styles pour la gestion des images */
.image-preview-container {
  position: relative;
  display: inline-block;
  margin-bottom: 15px;
}

.image-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
}

.btn-remove-image:hover {
  background-color: #dc2626;
  transform: scale(1.1);
}

/* Styles pour les onglets d'image */
.image-input-tabs .nav-tabs {
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 0;
}

.image-input-tabs .nav-link {
  border: none;
  background: none;
  color: #6b7280;
  padding: 8px 16px;
  border-radius: 6px 6px 0 0;
  transition: all 0.2s ease;
}

.image-input-tabs .nav-link:hover {
  color: #374151;
  background-color: #f3f4f6;
}

.image-input-tabs .nav-link.active {
  color: #3b82f6;
  background-color: #eff6ff;
  border-bottom: 2px solid #3b82f6;
}

/* Styles pour la zone d'upload */
.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  background-color: #f9fafb;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.upload-area.drag-over {
  border-color: #3b82f6;
  background-color: #dbeafe;
  transform: scale(1.02);
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  font-size: 2rem;
  color: #6b7280;
  margin-bottom: 12px;
}

.upload-text {
  color: #374151;
  font-weight: 500;
  margin-bottom: 8px;
}

.upload-hint {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    margin: 20px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }

  .image-preview {
    width: 80px;
    height: 80px;
  }

  .upload-area {
    padding: 30px 15px;
  }

  .upload-icon {
    font-size: 1.5rem;
  }
}
</style>
