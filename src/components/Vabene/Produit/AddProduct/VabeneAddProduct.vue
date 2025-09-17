<template>
  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <form @submit.prevent="uploadLogo">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Nom *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. Poivre"
                  v-model="productData.name"
                  @change="(event) => handleInput(event, 'name')"
                  :class="{ 'is-valid': validTextField(productData.name) }"
                  required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Type *
              </label>
              <v-select
                  v-model="productData.type"
                  :options="allTypeProduct"
                  label=""
                  placeholder="Selectionner un type"
              />
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Description
              </label>
              <div class="mb-0">
                <QuillEditor
                    theme="snow"
                    content-type="html"
                    placeholder="Donnez une description au produit"
                    toolbar="full"
                    v-model:content="productData.description"
                />
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Notes & valeurs nutritionnelles
              </label>
              <div class="mb-0">
                <QuillEditor
                    theme="snow"
                    content-type="html"
                    placeholder="Donnez une note et valeur nutritionnelle"
                    toolbar="full"
                    v-model:content="productData.longDescription"
                />
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-20">
            <!-- Toggle switch -->
            <label class="d-block text-black fw-semibold mb-10">
             Ajouter pointrine de Dinde
            </label>
            <div class="form-check form-switch">
              <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="addtionPointrineDine"
                  @change="togglePointrineDine"
              />

            </div>
          </div>
          <div class="col-md-3 mb-20">
            <!-- Toggle switch -->
            <label class="d-block text-black fw-semibold mb-10">
              Ajouter Jambon
            </label>
            <div class="form-check form-switch">
              <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="addtionJambon"
                  @change="toggleJambon"
              />

            </div>
          </div>
          <div class="col-md-3 mb-20">
            <!-- Toggle switch -->
            <label class="d-block text-black fw-semibold mb-10">
              Ajouter sucre glace
            </label>
            <div class="form-check form-switch">
              <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="addSucrePoudre"
                  @change="toggleSucrePoudre"
              />

            </div>
          </div>
          <div class="col-md-3 mb-20">
            <!-- Toggle switch -->
            <label class="d-block text-black fw-semibold mb-10">
              Supprimer toutes les options
            </label>
            <div class="form-check form-switch">
              <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="deleteAllOptions"
                  @change="toggleDeleAllOptions"
              />

            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Categorie *
              </label>
              <v-select
                  v-model="productData.categorieID"
                  :options="originalCategories"
                  label="name"
                  :reduce="categorie => categorie.id"
                  placeholder="Selectionner une categorie"
                  @input="onCategoryChange"
              />
            </div>
          </div>

          <!-- Ingrédients de base pour Pizza -->
          <div class="col-md-12" v-if="isPizzaCategory">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Ingrédients de base *
              </label>
              <button class="btn btn-outline-warning"
                      type="button" 
                      data-bs-toggle="modal" 
                      data-bs-target="#contentModalScrollable_pizzaIngredients"
              >
                {{ actionDetected === 'edit' ? 'Mettre à jour ingrédients' : 'Ajouter des ingrédients de base' }}
              </button>
            </div>
          <div class="mt-2">
            <div v-if="allPizzaIngredients.length > 0" class="d-flex flex-wrap gap-1">
              <span
                  v-for="ingredient in allPizzaIngredients"
                  :key="ingredient.id"
                  class="badge bg-warning text-dark px-2 py-1 rounded-pill"
                  style="font-size: 0.75rem;"
              >
                {{ ingredient.name }}
              </span>
            </div>
            <span v-else class="text-muted small">
              Aucun ingrédient sélectionné
            </span>
          </div>
          </div>
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Positionnement
              </label>
              <input
                  type="number"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. Poivre"
                  v-model="productData.ordered"

              />
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-2">
                Image *
              </label>
              <img v-if="productData.image_urls.length > 0"
                   :src="productData.image_urls[0]"
                   class="rounded-circle me-8 mb-4"
                   width="45"
                   height="45"
                   alt="produit"
              />
              <input
                  type="file"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="**************"
                  @change="(event) => handleInput(event, 'file')"
                  :required="actionDetected === 'add'"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Estimation du temps de cuisson en minutes*
              </label>
              <input
                  type="number"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. 5"
                  v-model="productData.cookingTime"
                  @change="(event) => handleInput(event, 'cookingTime')"
                  :class="{ 'is-valid': isValidCookingTime(productData.cookingTime) }"
                  required
              />
            </div>
          </div>
          <div class="col-md-6">

              <div class="form-group mb-15 mb-sm-20 mb-md-25">
                <label class="d-block text-black fw-semibold mb-10">
                  Variation du produit (Specifier les différentes tailles)*
                </label>
                <button  class="btn btn-outline-warning"
                         type="button" data-bs-toggle="modal" data-bs-target="#contentModalScrollable_productSize"
                >{{actionDetected === 'edit' ? 'Mettre a jour variation' : 'Ajouter une variation'}}</button>
              </div>
              <span
                  class="bg-transparent p-0 border-0 text-warning lh-1 fw-medium"
              >
                <span class="position-relative">{{allVariationsProduct.length > 0 ? `${allVariationsProduct.length} taille(s)` : `Aucune taille`}}</span>
              </span>

          </div>




          <div class="col-md-12">
            <div class="d-flex align-items-center justify-content-between" v-if="actionDetected">

              <LoaderComponent
                  v-if="isLoading"
              />
              <button v-else
                class="default-btn transition border-0 fw-medium text-white pt-10 pb-10 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-35 pe-md-35 rounded-1 fs-md-15 fs-lg-16 bg-success"
                type="submit"
                :disabled="!isFormValid"
                :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
              >
               {{ actionDetected === 'edit' ? 'Mettre à jour' : ' Ajouter un produit'}}
              </button>
              <button
                type="button"
                @click="goBack"
                class="bg-transparent p-0 border-0 text-danger lh-1 fw-medium"
              >
                <i
                  class="flaticon-delete lh-1 me-1 position-relative top-2"
                ></i>
                <span class="position-relative">Annuler</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="contentModalScrollable_productSize" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content flex-column justify-content-center  ">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Specifier les différentes taille du produit</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="flex-column">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group mb-15 mb-sm-20 mb-md-25">
                    <label class="d-block text-black fw-semibold mb-10">
                      Taille*
                    </label>
                    <input
                        type="text"
                        class="form-control shadow-none rounded-0 text-black"
                        placeholder="Grande"
                        v-model="productSizeDefine.taille"
                        @change="(event) => handleInput(event, 'taille')"
                        :required="actionDetected === 'add'"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group mb-15 mb-sm-20 mb-md-25">
                    <label class="d-block text-black fw-semibold mb-10">
                      Prix Emporter*
                    </label>
                    <input
                        type="text"
                        class="form-control shadow-none rounded-0 text-black"
                        placeholder="12.90"
                        v-model="productSizeDefine.price"
                        @change="(event) => handleInput(event, 'price')"
                        :required="actionDetected === 'add'"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group mb-15 mb-sm-20 mb-md-25">
                    <label class="d-block text-black fw-semibold mb-10">
                      Prix de Livraison*
                    </label>
                    <input
                        type="text"
                        class="form-control shadow-none rounded-0 text-black"
                        placeholder="12.90"
                        v-model="productSizeDefine.priceLivraison"
                        @change="(event) => handleInput(event, 'priceLivraison')"
                        :required="actionDetected === 'add'"
                    />
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group mb-15 mb-sm-20 mb-md-25">
                    <label class="d-block text-black fw-semibold mb-10">
                      Description specifique a cette taille
                    </label>
                    <div class="mb-0">
                      <QuillEditor
                          theme="snow"
                          content-type="html"
                          placeholder="Donnez une description pour cette taille"
                          toolbar="full"
                          v-model:content="productSizeDefine.generalDescription"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group mb-15 mb-sm-20 mb-md-25">
                    <button @click="addSizeVariation" class="btn btn-warning btn-sm" type="button"
                            :disabled="!isFormValidVariation"
                            :class="{ 'opacity-50 cursor-not-allowed': !isFormValidVariation }"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table text-nowrap align-middle mb-0">
                  <thead class="bg-success text-white">
                  <tr>
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
                      PRIX EMPORTER
                    </th>

                    <th
                        scope="col"
                        class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
                    >
                      PRIX DE LIVRAISON
                    </th>

                    <th
                        scope="col"
                        class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
                    >
                      DESCRIPTION
                    </th>




                  </tr>
                  </thead>
                  <tbody v-if="allVariationsProduct && allVariationsProduct.length > 0">
                  <tr
                      v-for="(variation, index) in allVariationsProduct" :key="index"
                  >
                    <th class="shadow-none lh-1 fw-bold ps-0">
                    <span
                        class="text-decoration-none text-black-emphasis"
                    >
                      {{variation.size}}
                    </span>
                    </th>
                    <td  class="shadow-none lh-1 fw-medium">
                      <span class="badge text-outline-danger">{{variation.price}} CHF</span>
                    </td>
                    <td  class="shadow-none lh-1 fw-medium">
                      <span class="badge text-outline-danger">{{variation.priceLivraison}} CHF</span>
                    </td>


                    <td v-if="variation.description"  class="shadow-none lh-1 fw-medium">
                      <span v-if="variation.description" class="text-decoration-none text-black-emphasis">{{cleanAndTruncateHtmlText(variation.description)}}</span>
                      <span v-else class="text-decoration-none text-black-emphasis">-</span>

                    </td>

                    <td class="shadow-none lh-1 fw-medium text-body-tertiary">
                      <button @click="removeSizeVariation(variation)"
                              class="btn btn-danger btn-sm " type="button"
                      >
                        Retirer
                      </button>
                    </td>

                  </tr>
                  </tbody>
                  <tbody v-else>
                  <tr>
                    <EmptyTable
                        message="Aucune taille ajouter pour le moment"
                        :colspan="8"
                        textClass="text-muted"
                    />
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="d-flex justify-content-center align-items-center mt-8">
                <button @click="updateVariationProduct(productResponse?.id, allVariationsProduct)" class="btn btn-primary btn-sm" type="button"
                        data-bs-dismiss="modal" aria-label="Close">
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour les ingrédients de base de la pizza -->
    <div class="modal fade" id="contentModalScrollable_pizzaIngredients" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content flex-column justify-content-center">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Sélectionner les ingrédients de base de la pizza</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="flex-column">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group mb-15 mb-sm-20 mb-md-25">
                    <label class="d-block text-black fw-semibold mb-10">
                      Rechercher un ingrédient de base
                    </label>
                    <div class="position-relative">
                      <input
                          type="text"
                          class="form-control shadow-none rounded-0 text-black"
                          placeholder="Tapez pour rechercher un ingrédient..."
                          v-model="searchIngredientQuery"
                          @input="searchIngredients"
                      />
                      <i class="fas fa-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                    </div>
                    <div v-if="searchResults.length > 0" class="mt-2">
                      <div class="list-group">
                        <button
                            v-for="ingredient in searchResults"
                            :key="ingredient.id"
                            type="button"
                            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                            @click="selectIngredientFromSearch(ingredient)"
                        >
                          <span>{{ ingredient.name }}</span>
                          <i class="fas fa-plus text-success"></i>
                        </button>
                      </div>
                    </div>
                    <div v-else-if="searchIngredientQuery && !isSearching" class="mt-2 text-muted">
                      <small>Aucun ingrédient trouvé pour "{{ searchIngredientQuery }}"</small>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Affichage des ingrédients sélectionnés sous forme de badges -->
              <div class="mt-3">
                <label class="d-block text-black fw-semibold mb-10">
                  Ingrédients sélectionnés
                </label>
                <div v-if="allPizzaIngredients && allPizzaIngredients.length > 0" class="d-flex flex-wrap gap-2">
                  <span
                      v-for="ingredient in allPizzaIngredients"
                      :key="ingredient.id"
                      class="badge bg-primary text-white d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                      style="font-size: 0.875rem;"
                  >
                    {{ ingredient.name }}
                    <button
                        @click="removePizzaIngredient(ingredient)"
                        type="button"
                        class="btn-close btn-close-white"
                        style="font-size: 0.6rem; margin-left: 0.25rem;"
                        aria-label="Retirer l'ingrédient"
                    ></button>
                  </span>
                </div>
                <div v-else class="text-muted">
                  <small>Aucun ingrédient sélectionné</small>
                </div>
              </div>
              <div class="d-flex justify-content-center align-items-center mt-8">
                <button @click="validatePizzaIngredients" 
                        class="btn btn-primary btn-sm" 
                        type="button"
                        data-bs-dismiss="modal" 
                        aria-label="Close">
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";


import {
  createIngredient, createProduct,
  detailCategorie,
  detailIngredient, detailProduct, listeCategorieActive, removeVariationProduct,
  updateCategorie,
  updateIngredient, updateProduct, updateVariationProduct,
  uploadFile, listeIngredient, listeIngredientBase
} from "@/service/api";

import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import { AxiosError } from 'axios';
import {ApiResponse, PaginatedCategorie, PaginatedIngredient} from "@/models/Apiresponse";
import {CategorieModel} from "@/models/categorie.model";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {IngredientModel} from "@/models/ingredient.model";
import {IngredientBaseModel} from "@/models/ingredientBase.model";
import {ProductSizesModel} from "@/models/productSizes.model";
import {ProductModel} from "@/models/product.model";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import {CartModel} from "@/models/cart.model";


export default defineComponent({
  name: "VabeneAddProduct",
  components: {
    EmptyTable,
    LoaderComponent

  },
  props: {
    action: {
      type: String as PropType<string>,
      required: true
    },
    productID: {
      type: String as PropType<string>,
      required: false
    },
  },
  data(){
    return{
      ingredientSelected: null as IngredientModel | null,
      ingredientResponse: null as ApiResponse<PaginatedIngredient> | null,
      originalIngredients: [] as IngredientModel[], // Stockage des utilisateurs originaux
      additionalNote: [] as string[],
      addtionPointrineDine: false as boolean,
      deleteAllOptions: false as boolean,
      addtionJambon: false as boolean,
      addSucrePoudre: false as boolean,
      productData: {
        name: '',
        type: '',
        description: '',
        longDescription: '',
        additionnal: [] as string[],
        categorieID: '',
        image_urls: [] as string[],
        ingredients: [] as string[],
        cookingTime: 0 as number,
        variationsProduct: [],
        ordered: ''
      },
      isLoading: false,
      logoUpload: null,
      productResponse: null as ProductModel | null,
      actionDetected: null as string | null,
      allTypeProduct: ["Pizza", "Boisson", "Autre"] as string[],
      originalCategories: [] as CategorieModel[],
      allVariationsProduct: [] as ProductSizesModel[],
      productSizeDefine: {
        taille: '',
        generalDescription: '',
        price: "",
        priceLivraison: ""
      },
      // Propriétés pour les ingrédients de pizza
      allPizzaIngredients: [] as IngredientBaseModel[],
      selectedIngredient: null as IngredientBaseModel | null,
      availableIngredients: [] as IngredientBaseModel[],
      searchIngredientQuery: '',
      searchResults: [] as IngredientBaseModel[],
      isSearching: false,
      searchTimeout: null as NodeJS.Timeout | null
    }
  },
  methods: {
    toggleJambon() {
      const jambon = "Jambon";
      // Si on active l'ajout de poitrine
      if (this.addtionJambon) {
        if (!this.additionalNote.includes(jambon)) {
          this.additionalNote.push(jambon);
        }
      }
      else{
        const index = this.additionalNote.indexOf(jambon);
        if (index !== -1) {
          this.additionalNote.splice(index, 1);
        }
      }
    },
    toggleDeleAllOptions(){
      this.addtionPointrineDine = false
      this.addtionJambon = false
      this.addSucrePoudre = false
      this.additionalNote = [];
    },
    togglePointrineDine() {
      const poitrine = "Pointrine de Dinde";
      if (this.addtionPointrineDine) {
        if (!this.additionalNote.includes(poitrine)) {
          this.additionalNote.push(poitrine);
        }
      }
      else{
        const index = this.additionalNote.indexOf(poitrine);
        if (index !== -1) {
          this.additionalNote.splice(index, 1);
        }
      }
    },
    toggleSucrePoudre() {
      const sucre = "Sucre glace";
      if (this.addSucrePoudre) {
        if (!this.additionalNote.includes(sucre)) {
          this.additionalNote.push(sucre);
        }
      } else {
        const index = this.additionalNote.indexOf(sucre);
        if (index !== -1) {
          this.additionalNote.splice(index, 1);
        }
      }
    },
    cleanAndTruncateHtmlText(html: string): string {
      // Supprimer les balises HTML
      const textOnly = html.replace(/<[^>]*>/g, '').trim();
      // Tronquer et ajouter "..." si nécessaire
      if (textOnly.length <= 100) {
        return textOnly;
      }
      return textOnly.substring(0, 100).trim() + '...';
    },
    addSizeVariation() {
        if(this.actionDetected == ActionCrud.EDIT){
          const size = {
            taille: this.productSizeDefine.taille,
            description: this.productSizeDefine.generalDescription,
            price: this.productSizeDefine.price,
            priceLivraison: this.productSizeDefine.priceLivraison
          };
          (this.productData.variationsProduct as any[]).push(size);
          this.allVariationsProduct.push({
            size: size.taille,
            price: size.price,
            priceLivraison: size.priceLivraison,
            description: size.description
          });
          this.productSizeDefine = {
            taille: '',
            price: '',
            priceLivraison: '',
            generalDescription: ''
          }
        }
        else{
          const size = {
            taille: this.productSizeDefine.taille,
            generalDescription: this.productSizeDefine.generalDescription,
            price: this.productSizeDefine.price,
            priceLivraison: this.productSizeDefine.priceLivraison
          };
          (this.productData.variationsProduct as any[]).push(size);
          this.allVariationsProduct.push({
            id: '',
            size: size.taille,
            price: size.price,
            priceLivraison: size.priceLivraison,
            description: size.generalDescription
          });
          this.productSizeDefine = {
            taille: '',
            price: '',
            priceLivraison: '',
            generalDescription: ''
          }
        }
    },

    removeSizeVariation(sizeSelectedSelected: ProductSizesModel) {
      if (!sizeSelectedSelected) return;
      const index = this.allVariationsProduct.findIndex(
          sized => sized.size === sizeSelectedSelected.size
      );

      if (index !== -1) {
        this.allVariationsProduct.splice(index, 1);
        this.productData.variationsProduct.slice(index, 1)
      } 
      if((this as any).$route.params.action == ActionCrud.EDIT){
        this.removeProductVariationProduct(this.productResponse?.id, sizeSelectedSelected.id)
      }
    },
    async updateVariationProduct(productID, variationID) {
      let clearVariation = [] as any
      clearVariation = this.allVariationsProduct
          .filter(variation => !variation.id) // sélectionne ceux sans ID
          .map(variation => ({
            size: variation.size,
            price: variation.price,
            priceLivraison: variation.priceLivraison,
            description: variation.description
          }));
      if(this.actionDetected === 'edit' && clearVariation.length > 0){

        const payload = {
          "variationsProduct": clearVariation
        }
        try {
          const response = await updateVariationProduct(productID, payload);
          if (response.code === 200) {
            this.toast.success(response.message)
            this.clearData()
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
        } finally {
          this.isLoading = false;
        }
      }

    },
    seeValue(){
      //("potential payload: ", this.productData)
    },
    clearData(){
      this.productData = {
        name: '',
        type: '',
        description: '',
        longDescription: '',
        additionnal: [] as string[],
        categorieID: '',
        image_urls: [] as string[],
        ingredients: [] as string[],
        cookingTime: 0 as number,
        variationsProduct: [],
        ordered: ''
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    goBack() {
      this.$router.back()
    },
    async createNewProduct() {
        this.isLoading = true;
        const payload = {
          "type": this.productData.type,
          "name": this.productData.name,
          "description": this.productData.description,
          "categorieID": this.productData.categorieID,
          "image_urls": this.productData.image_urls,
          "ingredients": this.productData.ingredients,
          "ingredientsBase": this.productData.ingredients, // Ajout des ingrédients de base
          "cookingTime": parseFloat(String(this.productData.cookingTime)),
          "variationsProduct": this.productData.variationsProduct,
          "longDescription": this.productData.longDescription,
          "additionnal": this.additionalNote,
          "ordered": String(this.productData.ordered)
        }
        try {
          const response = await createProduct(payload);
          if (response.code === 201) {
            this.toast.success(response.message)
            this.clearData()
          } else {
            this.toast.error(response.message)
          }
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response && axiosError.response.data) {
            const message = (axiosError.response.data as any).error;
            this.toast.error(message);
          } else {
            this.toast.error("Une erreur est survenue");
          }
        } finally {
          this.isLoading = false;
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }


    },
    async fetchDetailProduct(productID) {
      this.isLoading = true;
      try {
        const response = await detailProduct(productID) as ApiResponse<ProductModel>;
        if (response.code === 200) {
          if(response.data){
            this.productResponse = response.data;
            this.productData.name = this.productResponse.name;
            this.productData.type = this.productResponse.type;
            this.productData.description = this.productResponse.description;
            this.productData.ingredients = this.productResponse.Ingredients?.map(ing => ing.id) || [];
            this.productData.image_urls = this.productResponse.image_urls;
            this.productData.cookingTime = this.productResponse.cookingTime;
            this.productData.categorieID = this.productResponse.categorieID.id;
            this.productData.ordered = this.productResponse.ordered
            if(this.productResponse.longDescription){
              this.productData.longDescription = this.productResponse.longDescription;
            }
            if(this.productResponse.additionnal){
              this.productData.additionnal = this.productResponse.additionnal;
              this.additionalNote = this.productResponse.additionnal;
              if(this.productData.additionnal.length > 0){
                const poitrine = "Pointrine de Dinde";
                const jambon = "Jambon";
                const sucre = "Sucre glace";
                if (this.additionalNote.includes(poitrine)) {
                  this.addtionPointrineDine = true
                }
               if (this.additionalNote.includes(jambon)){
                  this.addtionJambon = true
                }
                if (this.additionalNote.includes(sucre)){
                  this.addSucrePoudre = true
                }
              }
            }

            (this.productData.variationsProduct as any[]) = this.productResponse.productSizes;
            if(this.productResponse.productSizes.length > 0){
              (this.allVariationsProduct as any[]) = this.productResponse.productSizes.map(ps => ({
                id: ps.id,
                size: ps.size,
                price: ps.price,
                priceLivraison: ps.priceLivraison,
                description: ps.generalDescription ?? ps.description,
              }));
            }

            // Charger les ingrédients de base existants si c'est une pizza
            if (this.isPizzaCategory && this.productResponse.Ingredients && this.productResponse.Ingredients.length > 0) {
              await this.loadExistingPizzaIngredients(this.productResponse.Ingredients.map(ing => ing.id));
            }
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement du produit");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async updateProduct(productID) {
      this.isLoading = true;
      const payload = {
        "type": this.productData.type,
        "name": this.productData.name,
        "description": this.productData.description,
        "categorieID": this.productData.categorieID,
        "image_urls": this.productData.image_urls,
        "ingredients": this.productData.ingredients,
        "ingredientsBase": this.productData.ingredients, // Ajout des ingrédients de base
        "cookingTime": parseFloat(String(this.productData.cookingTime)),
        "longDescription": this.productData.longDescription,
        "additionnal": this.deleteAllOptions ? [] : this.additionalNote,
        "ordered": String(this.productData.ordered)
      }
      try {
        const response = await updateProduct(productID, payload);
        if (response.code === 200) {
          this.toast.success(response.message)
          this.clearData()
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
      } finally {
        this.isLoading = false;
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    },
    async uploadLogo(){
      if(this.logoUpload && this.actionDetected === 'add'){
        this.isLoading = true;
        try {
          const response = await uploadFile(this.logoUpload);
          if (response.code === 200 || response.code === 201) {
            this.productData.image_urls.push(response.data)
            await this.createNewProduct()
          } else {
            this.toast.error(response.message)
          }

        } catch (error) {
          const axiosError = error as AxiosError;

          this.isLoading = false;
          if (axiosError.response && axiosError.response.data) {
            const message = (axiosError.response.data as any).message;
            this.toast.error(message);
          } else {
            this.toast.error("Une erreur est survenue");
          }
          console.error(axiosError);

        }
      }
      else{
        if(this.logoUpload){
          this.isLoading = true;
          try {
            const response = await uploadFile(this.logoUpload);
            if (response.code === 200 || response.code === 201) {
              this.productData.image_urls = [response.data as string]
              await this.updateProduct(this.productResponse?.id);
            } else {
              this.toast.error(response.message)
            }
          } catch (error) {
            const axiosError = error as AxiosError;

            this.isLoading = false;
            if (axiosError.response && axiosError.response.data) {
              const message = (axiosError.response.data as any).message;
              this.toast.error(message);
            } else {
              this.toast.error("Une erreur est survenue");
            }
            console.error(axiosError);
          }
        }
        else{
          await this.updateProduct(this.productResponse?.id);
        }

      }


    },
    async removeProductVariationProduct(productID, variationID) {
      try {
        const response = await removeVariationProduct(productID, variationID) as ApiResponse<any>;
        if (response.code === 200) {
          if(response.data){
            const dt = response.data
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors de la suppression de la variation");
        console.error(error);
      }
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
        const response = await listeCategorieActive(page, "0") as ApiResponse<PaginatedCategorie>;
        if (response.code === 200) {
          if (response.data?.items) {
            this.originalCategories = response.data.items;
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

    handleInput(event, type) {
      const valueText = event.target.value;
      switch (type){
        case 'name':
          this.productData.name = valueText
          this.validTextField(valueText)
          break
        case 'categorieID':
          this.productData.categorieID = valueText
          this.validTextField(valueText)
          break
        case 'cookingTime':
          this.productData.cookingTime = valueText
          this.validTextField(valueText)
          break

        case 'taille':
          this.productSizeDefine.taille = valueText
          this.validTextField(valueText)
          break

        case 'price':
          this.productSizeDefine.price = valueText
          this.validTextField(valueText)
          break

        case 'priceLivraison':
          this.productSizeDefine.priceLivraison = valueText
          this.validTextField(valueText)
          break

        case 'generalDescription':
          this.productSizeDefine.generalDescription = valueText
          this.validTextField(valueText)
          break

        case 'file':
          // eslint-disable-next-line no-case-declarations
          const file = event.target.files[0];
          this.logoUpload = file
          this.validFileField(this.logoUpload)
          break
      }
    },

    isValidCookingTime(input: string | number): boolean {
      const value = typeof input === 'string' ? input.trim() : input;

      // Vérifie si c'est un nombre entier positif (> 0)
      const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
      return Number.isInteger(numericValue) && numericValue > 0;
    },
    validTextField(text){
      if (text){
        return text.trim().length > 0
      }
    },
    validFileField(file) {
      if (!file) return false;

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 2 * 1024 * 1024; // 2 Mo

      if (!allowedTypes.includes(file.type)) {
        this.toast.error("Type de fichier non autorisé")
        return false;
      }

      if (file.size > maxSize) {
        this.toast.error("Fichier trop volumineux")
        return false;
      }

      return true;
    },

    // Méthodes pour gérer les ingrédients de pizza
    onCategoryChange(categoryId: string) {
      // Vérifier si la catégorie sélectionnée est "Pizza"
      const selectedCategory = this.originalCategories.find(cat => cat.id === categoryId);
      if (selectedCategory && selectedCategory.name.toLowerCase() === 'pizza') {
        this.loadAvailableIngredients();
      }
    },

    async loadAvailableIngredients() {
      try {
        // Charger les ingrédients de base depuis l'API
        const response = await listeIngredientBase(1) as ApiResponse<IngredientBaseModel[]>;
        if (response.code === 200 && response.data) {
          this.availableIngredients = response.data;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des ingrédients de base:', error);
        this.toast.error('Erreur lors du chargement des ingrédients de base');
      }
    },

    async searchIngredients() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(async () => {
        if (this.searchIngredientQuery.trim().length < 2) {
          this.searchResults = [];
          return;
        }

        this.isSearching = true;
        try {
          const response = await listeIngredientBase(1, this.searchIngredientQuery.trim()) as ApiResponse<IngredientBaseModel[]>;
          if (response.code === 200 && response.data) {
            this.searchResults = response.data;
          } else {
            this.searchResults = [];
          }
        } catch (error) {
          console.error('Erreur lors de la recherche:', error);
          this.searchResults = [];
        } finally {
          this.isSearching = false;
        }
      }, 300);
    },

    selectIngredientFromSearch(ingredient: IngredientBaseModel) {
      // Vérifier si l'ingrédient n'est pas déjà ajouté
      const alreadyExists = this.allPizzaIngredients.some(
        ing => ing.id === ingredient.id
      );

      if (alreadyExists) {
        this.toast.warning('Cet ingrédient est déjà ajouté');
        return;
      }

      this.allPizzaIngredients.push(ingredient);
      this.searchIngredientQuery = '';
      this.searchResults = [];
      this.toast.success('Ingrédient ajouté avec succès');
    },

    removePizzaIngredient(ingredient: IngredientBaseModel) {
      const index = this.allPizzaIngredients.findIndex(
        ing => ing.id === ingredient.id
      );
      if (index !== -1) {
        this.allPizzaIngredients.splice(index, 1);
        this.toast.success('Ingrédient retiré avec succès');
      }
    },

    validatePizzaIngredients() {
      // Sauvegarder les ingrédients de base dans productData
      this.productData.ingredients = this.allPizzaIngredients.map(ing => ing.id).filter(id => id !== undefined) as string[];
      this.toast.success('Ingrédients de base validés');
    },

    async loadExistingPizzaIngredients(ingredientIds: string[]) {
      try {
        // Charger les détails des ingrédients de base existants
        const existingIngredients: IngredientBaseModel[] = [];
        for (const id of ingredientIds) {
          // Chercher dans les ingrédients de base disponibles
          const ingredient = this.availableIngredients.find(ing => ing.id === id);
          if (ingredient) {
            existingIngredients.push(ingredient);
          }
        }
        this.allPizzaIngredients = existingIngredients;
      } catch (error) {
        console.error('Erreur lors du chargement des ingrédients existants:', error);
        this.toast.error('Erreur lors du chargement des ingrédients existants');
      }
    }

  },
  computed: {
    allIngredient(): IngredientModel[] {
      const ingredients = this.ingredientResponse?.data?.items || this.originalIngredients;
      if (!this.searchIngredientQuery) return ingredients;

      const query = this.searchIngredientQuery.toLowerCase();
      return ingredients.filter(ingredient => {
        return (
            (ingredient.name?.toLowerCase().includes(query))
        );
      });
    },
    isPizzaCategory() {
      if (!this.productData.categorieID) return false;
      const selectedCategory = this.originalCategories.find(cat => cat.id === this.productData.categorieID);
      return selectedCategory && selectedCategory.name.toLowerCase() === 'pizza';
    },
    isFormValid() {
      return (
          this.validTextField(this.productData.name) &&
          this.validTextField(this.productData.type) &&
          this.validTextField(this.productData.categorieID) &&
          this.isValidCookingTime(this.productData.cookingTime)
      );
    },
    isFormValidVariation() {
      return (
          this.validTextField(this.productSizeDefine.taille) &&
          this.validTextField(this.productSizeDefine.price) &&
          this.validTextField(this.productSizeDefine.generalDescription)
      );
    }
  },
  setup: () => {

    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.actionDetected = (this as any).$route.params.action
    if((this as any).$route.params.action == ActionCrud.EDIT){
      this.fetchDetailProduct((this as any).$route.params.productID)
    }
    this.fetchCategories(1)
    this.loadAvailableIngredients() // Charger les ingrédients au démarrage
  }

});
</script>

<style>



.vs--searchable .vs__dropdown-toggle, .vs__search, .vs__search:focus {
  padding: 4px 6px 6px  !important;
  font-size: 13px;
  color: rgba(132, 128, 128, 0.712);
}
.vs__search, .vs__search:focus, input.vs__search{
  font-size: 13px;
  color: rgba(132, 128, 128, 0.712);
}

</style>