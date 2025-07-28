<template>
  <div v-if="isLoading"
    class="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
    style="z-index: 9999;">
    <LoaderComponent />
  </div>

  <div class="row" v-else>
    <div class="col-lg-5 col-xl-4">
      <LeadsInformation :lead="categorieResponse" />
    </div>
    <div class="col-lg-7 col-xl-8">
      <div class="leads-details-tabs">
        <ul class="nav nav-tabs border-0 mb-25" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link fs-md-15 fs-lg-16 fw-medium border-0 rounded-0 d-block text-center w-100 active"
              id="tasks-tab" data-bs-toggle="tab" data-bs-target="#tasks-tab-pane" type="button" role="tab"
              aria-controls="tasks-tab-pane" aria-selected="true">
              SPECIFICATION DU CLIENT
            </button>
          </li>


        </ul>
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="tasks-tab-pane" role="tabpanel" tabindex="0">
            <div class="card mb-3" v-if="categorieResponse && categorieResponse.user">
              <div class="card-header bg-warning text-white">
                Liste des adresses enregistrées
              </div>
              <div class="card-body p-3" v-if="categorieResponse.user.listeAdresses && categorieResponse.user.listeAdresses.length > 0">
                <div v-for="adresse in paginatedAdresses" :key="adresse.id" class="mb-3 border-bottom pb-2">
                  <div class="row mb-2">
                        <div class="col-sm-4 fw-bold">NPA :</div>
                        <div class="col-sm-8">{{ adresse.codePostal ?? '-' }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-sm-4 fw-bold">Localité :</div>
                        <div class="col-sm-8">{{ adresse.localite ?? '-' }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-sm-4 fw-bold">Rue :</div>
                        <div class="col-sm-8">{{ adresse.rue ?? '-' }}</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col-sm-4 fw-bold">Nº:</div>
                        <div class="col-sm-8">{{ adresse.numeroLocalite ?? '-' }}</div>
                      </div>
                </div>
                <div class="d-flex justify-content-center mt-3" >
                  <button
                    class="btn btn-sm btn-outline-secondary me-2"
                    :disabled="currentAdressePage === 1"
                    @click="goToAdressePage(currentAdressePage - 1)"
                  >
                    Précédent
                  </button>
                  <span class="align-self-center">Page {{ currentAdressePage }} / {{ totalAdressesPages }}</span>
                  <button
                    class="btn btn-sm btn-outline-secondary ms-2"
                    :disabled="currentAdressePage === totalAdressesPages"
                    @click="goToAdressePage(currentPage + 1)"
                  >
                    Suivant
                  </button>
                </div>
              </div>
              <div class="card-body p-3" v-else>
                <h5 class="mb-1">Aucune adresse enregistrée.</h5>
              </div>
            </div>
           
            <div class="card mb-3" v-if="categorieResponse">
              <div class="card-header bg-primary text-white">
                Analyse lors des commandes
              </div>
              <div class="card-body p-3">
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Points d'attention spécifiques :</div>
                  <div class="col-sm-8">{{ analyserCommande(categorieResponse.remarqueCommande) }}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Historique des types de commandes :</div>
                  <div class="col-sm-8">{{ analyserTypesCommandes(categorieResponse.typesCommandes) }}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Demande de couvert lors des commandes:</div>
                  <div class="col-sm-8">{{ analyserDemandeCouverts(categorieResponse.demandeCouverts) }}</div>
                </div>
<!--                <div class="row mb-2">-->
<!--                  <div class="col-sm-4 fw-bold">Type de cuisson préféré:</div>-->
<!--                  <div class="col-sm-8">{{ analyserListeCuisson(categorieResponse.listeCuisson) }}</div>-->
<!--                </div>-->
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Habitudes de paiement du client:</div>
                  <div class="col-sm-8">{{ analyserMoyensPaiement(categorieResponse.moyenPaiements) }}</div>
                </div>
              </div>
            </div>
            <div class="card mb-3 shadow-sm" v-if="categorieResponse && categorieResponse.user">
              <div class="card-header bg-gradient-danger text-white d-flex align-items-center">
                <i class="fas fa-history me-2"></i>
                <h5 class="mb-0">Historique de commandes</h5>
                <span class="badge bg-light text-danger ms-auto">{{ categorieResponse.user.orders ? categorieResponse.user.orders.length : 0 }} commande(s)</span>
              </div>
              <div class="card-body p-0" v-if="categorieResponse.user.orders && categorieResponse.user.orders.length > 0">
                <div v-for="commande in paginatedOrders" :key="commande.id" class="order-item p-4 border-bottom">
                  <div class="row align-items-center">
                    <div class="col-md-8">
                      <!-- En-tête de la commande -->
                      <div class="d-flex align-items-center mb-3">
                        <div class="order-number me-3">
                          <span class="badge bg-primary fs-6">{{commande.restaurantID.id === RestaurantEnum.RESTO_MORGES ? 'VBM'+ commande.nif : 'VBP'+ commande.nif}}</span>
                        </div>
                        <div class="order-type me-3">
                          <span class="badge" :class="commande.DeliveryPreference != 'immediat' ? 'bg-warning text-dark' : 'bg-success'">
                            <i class="fas" :class="commande.DeliveryPreference != 'immediat' ? 'fa-clock' : 'fa-bolt'"></i>
                            {{commande.DeliveryPreference != 'immediat' ? 'PRÉCOMMANDE' : 'IMMÉDIAT'}}
                          </span>
                        </div>
                        <div class="order-status">
                          <span class="badge" :class="getStatusBadgeClass(commande.status)">
                            {{ fetchStatusOrderFr(commande.status) }}
                          </span>
                        </div>
                      </div>

                      <!-- Informations de la commande -->
                      <div class="order-details">
                        <div class="row mb-2">
                          <div class="col-sm-6">
                            <small class="text-muted">
                              <i class="fas fa-calendar-alt me-1"></i>
                              {{ convertDateCreate(commande.timeOrder) }}
                            </small>
                          </div>
                          <div class="col-sm-6">
                            <small class="text-muted">
                              <i class="fas fa-shopping-bag me-1"></i>
                              {{commande.orderItems.length }} produit(s)
                            </small>
                          </div>
                        </div>

                        <!-- Type de commande -->
                        <div class="mb-2" v-if="getOrderTypeParType(listeOrderType, commande.order_type).length > 0">
                          <span class="text-primary fw-semibold">
                            <i class="fas fa-truck me-1"></i>
                            {{ getOrderTypeParType(listeOrderType, commande.order_type)[0].libelle }}
                          </span>
                        </div>

                        <!-- Méthode de paiement -->
                        <div class="mb-2" v-if="getMethodePaiementParType(listeMethode, commande.paymentID.paymentMethod).length > 0">
                          <span class="text-info">
                            <i class="fas fa-credit-card me-1"></i>
                            {{ getMethodePaiementParType(listeMethode, commande.paymentID.paymentMethod)[0].libelle }}
                          </span>
                        </div>

                        <!-- Produits avec tooltip -->
                       <!--  <div class="mb-3">
                          <span class="text-success fw-semibold">
                            <i class="fas fa-box me-1"></i>
                            Détails produits
                          </span>
                          <span
                            class="text-primary cursor-pointer ms-2"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            :title="getProduitsTooltip(commande.orderItems)"
                            style="text-decoration: underline;"
                          >
                            <i class="fas fa-eye me-1"></i>Voir
                          </span>
                        </div> -->
                      </div>
                    </div>

                    <!-- Colonne de droite avec prix et action -->
                    <div class="col-md-4 text-end">
                      <div class="order-total mb-3">
                        <h4 class="text-success mb-0">
                          <i class="fas fa-franc-sign me-1"></i>
                          {{ commande.total_price }} CHF
                        </h4>
                        <small class="text-muted">Total net</small>
                      </div>
                      
                      <button
                        class="btn btn-primary btn-sm w-100"
                        @click="selectionOrder(commande)"
                      >
                        <i class="fas fa-eye me-1"></i>
                        Voir détail
                      </button>
                    </div>
                  </div>
                </div>
                <div class="pagination-container p-3 bg-light border-top" v-if="totalPages > 1">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="pagination-info">
                      <small class="text-muted">
                        Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, categorieResponse.user.orders.length) }} 
                        sur {{ categorieResponse.user.orders.length }} commande(s)
                      </small>
                    </div>
                    <div class="pagination-controls">
                      <button
                        class="btn btn-outline-primary btn-sm me-2"
                        :disabled="currentPage === 1"
                        @click="goToPage(currentPage - 1)"
                      >
                        <i class="fas fa-chevron-left me-1"></i>
                        Précédent
                      </button>
                      <span class="badge bg-primary mx-2 px-3 py-2">
                        Page {{ currentPage }} / {{ totalPages }}
                      </span>
                      <button
                        class="btn btn-outline-primary btn-sm ms-2"
                        :disabled="currentPage === totalPages"
                        @click="goToPage(currentPage + 1)"
                      >
                        Suivant
                        <i class="fas fa-chevron-right ms-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body p-5 text-center" v-else>
                <div class="empty-state">
                  <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                  <h5 class="text-muted mb-2">Aucune commande trouvée</h5>
                  <p class="text-muted mb-0">Ce client n'a pas encore passé de commande.</p>
                </div>
              </div>
            </div>
            <div class="card mb-3" v-else>
              <div class="card-header bg-danger text-white">
                Historique de commandes
              </div>
              <div class="card-body p-3">
                <span class="mb-1">Aucune commande.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>




  <!--  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">-->
  <!--    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">-->
  <!--      <form @submit.prevent="">-->
  <!--        <div class="row">-->
  <!--          <div class="col-md-6">-->
  <!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
  <!--              <label class="d-block text-black fw-semibold mb-10">-->
  <!--                Nom *-->
  <!--              </label>-->
  <!--              <input-->
  <!--                type="text"-->
  <!--                class="form-control shadow-none rounded-0 text-black"-->
  <!--                placeholder="e.g. "-->
  <!--                v-model="categorieData.firstName"-->
  <!--                @change="(event) => handleInput(event, 'firstName')"-->
  <!--                :class="{ 'is-valid': validTextField(categorieData.firstName) }"-->
  <!--                required-->
  <!--                disabled-->
  <!--              />-->
  <!--            </div>-->
  <!--          </div>-->

  <!--          <div class="col-md-6">-->
  <!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
  <!--              <label class="d-block text-black fw-semibold mb-10">-->
  <!--                prenom *-->
  <!--              </label>-->
  <!--              <input-->
  <!--                  type="text"-->
  <!--                  class="form-control shadow-none rounded-0 text-black"-->
  <!--                  placeholder="e.g. "-->
  <!--                  v-model="categorieData.lastName"-->
  <!--                  @change="(event) => handleInput(event, 'firstName')"-->
  <!--                  :class="{ 'is-valid': validTextField(categorieData.firstName) }"-->
  <!--                  required-->
  <!--                  disabled-->
  <!--              />-->
  <!--            </div>-->
  <!--          </div>-->

  <!--          <div class="col-md-6">-->
  <!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
  <!--              <label class="d-block text-black fw-semibold mb-10">-->
  <!--                email *-->
  <!--              </label>-->
  <!--              <input-->
  <!--                  type="text"-->
  <!--                  class="form-control shadow-none rounded-0 text-black"-->
  <!--                  placeholder="e.g. "-->
  <!--                  v-model="categorieData.email"-->
  <!--                  @change="(event) => handleInput(event, 'email')"-->
  <!--                  :class="{ 'is-valid': validTextField(categorieData.email) }"-->
  <!--                  required-->
  <!--                  disabled-->
  <!--              />-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div class="col-md-6">-->
  <!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
  <!--              <label class="d-block text-black fw-semibold mb-10">-->
  <!--                Numero telephone *-->
  <!--              </label>-->
  <!--              <input-->
  <!--                  type="text"-->
  <!--                  class="form-control shadow-none rounded-0 text-black"-->
  <!--                  placeholder="e.g. "-->
  <!--                  v-model="categorieData.phoneNumber"-->
  <!--                  @change="(event) => handleInput(event, 'phoneNumber')"-->
  <!--                  :class="{ 'is-valid': validTextField(categorieData.phoneNumber) }"-->
  <!--                  required-->
  <!--                  disabled-->
  <!--              />-->
  <!--            </div>-->
  <!--          </div>-->

  <!--          <div class="col-md-6">-->
  <!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
  <!--              <label class="d-block text-black fw-semibold mb-10">-->
  <!--                adresse *-->
  <!--              </label>-->
  <!--              <input-->
  <!--                  type="text"-->
  <!--                  class="form-control shadow-none rounded-0 text-black"-->
  <!--                  placeholder="e.g. "-->
  <!--                  v-model="categorieData.address"-->
  <!--                  @change="(event) => handleInput(event, 'address')"-->
  <!--                  :class="{ 'is-valid': validTextField(categorieData.address) }"-->
  <!--                  required-->
  <!--                  disabled-->
  <!--              />-->
  <!--            </div>-->
  <!--          </div>-->


  <!--          <div class="col-md-6">-->
  <!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
  <!--              <label class="d-block text-black fw-semibold mb-10">-->
  <!--                Ville *-->
  <!--              </label>-->
  <!--              <input-->
  <!--                  type="text"-->
  <!--                  class="form-control shadow-none rounded-0 text-black"-->
  <!--                  placeholder="e.g. "-->
  <!--                  v-model="categorieData.city"-->
  <!--                  @change="(event) => handleInput(event, 'city')"-->
  <!--                  :class="{ 'is-valid': validTextField(categorieData.city) }"-->
  <!--                  required-->
  <!--                  disabled-->
  <!--              />-->
  <!--            </div>-->
  <!--          </div>-->


  <!--          <div class="col-md-12">-->
  <!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
  <!--              <label class="d-block text-black fw-semibold mb-10">-->
  <!--                Ville *-->
  <!--              </label>-->
  <!--              <input-->
  <!--                  type="text"-->
  <!--                  class="form-control shadow-none rounded-0 text-black"-->
  <!--                  placeholder="e.g. "-->
  <!--                  v-model="categorieData.codePostal"-->
  <!--                  @change="(event) => handleInput(event, 'codePostal')"-->
  <!--                  :class="{ 'is-valid': validTextField(categorieData.codePostal) }"-->
  <!--                  required-->
  <!--                  disabled-->
  <!--              />-->
  <!--            </div>-->
  <!--          </div>-->





  <!--        </div>-->
  <!--      </form>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";


import {
  createCategorie,
  detailCategorie,
  updateCategorie,
  uploadFile,
  deleteFileUpload,
  detailCustomer, listeOrderType, listeMethodePaiement
} from "@/service/api";
import { Tooltip } from 'bootstrap'

import { useToast } from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import { AxiosError } from 'axios';
import {ApiResponse, PaginatedCategorie, PaginatedMethodePaiement, PaginatedOrderType} from "@/models/Apiresponse";
import { CategorieModel } from "@/models/categorie.model";
import { ActionCrud } from "@/enums/actionCrud.enum";
import { CustomerModel } from "@/models/customer.model";
import LeadsInformation from "@/components/CRM/LeadDetails/LeadsInformation.vue";
import {OrderStatus} from "@/enums/orderStatut.enum";
import {OrderTypeModel} from "@/models/orderType.model";
import {UserGeneralKey} from "@/models/user.generalkey";
import {RestaurantEnum} from "../../../../enums/restaurant.enum";
import {MethodePaiementModel} from "@/models/methodePaiement.model";
import {ProductModel} from "@/models/product.model";
import {OrderItemModel} from "@/models/orderItem.model";


export default defineComponent({
  name: "VabeneAddCustomer",
  components: {
    LoaderComponent,
    LeadsInformation

  },
  props: {
    action: {
      type: String as PropType<string>,
      required: true
    },
    customerID: {
      type: String as PropType<string>,
      required: false
    },
  },
  data() {
    return {
      currentAdressePage: 1,
      itemsAdressePerPage: 3,
      currentPage: 1,
      itemsPerPage: 3,
      listeMethode: [] as MethodePaiementModel[],
      methodePaiementSelected: [] as MethodePaiementModel[],
      orderTypeSelected: [] as OrderTypeModel[],
      listeOrderType: [] as OrderTypeModel[],
      categorieData: {
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        city: '',
        codePostal: '',
        batiment: '',
        rue: '',
        created_at: ''
      },
      isLoading: false,
      logoUpload: null,
      categorieResponse: null as CustomerModel | null,
      actionDetected: null as string | null,
    }
  },
  methods: {
    selectionOrder(order){
      console.log(order)
      this.$router.push({
        name: "VabeneOrderDetailsPage",
        params: { commandeID: order.id }
      });
    },
    getProduitsTooltip(items: OrderItemModel[]) {
      return items.map(item => `(x${item.quantity}) ${item.productID.name}`).join(', ');
    },
    getMethodePaiementParType(
        liste: MethodePaiementModel[],
        type: string
    ): MethodePaiementModel[] {
      console.log(liste)
      console.log(type)
      return liste.filter(methode =>
          methode.type === type
      );
    },
    async fetchListeMethodePaiement(page = 1) {
      // this.isLoading = true;
      try {
        const response = await listeMethodePaiement(page) as ApiResponse<PaginatedMethodePaiement>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            this.listeMethode = response.data.items;
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des methodes de paiement");
        console.error(error);
      } finally {
        // this.isLoading = false;
      }
    },
    getOrderTypeParType(
        liste: OrderTypeModel[],
        type: string
    ): OrderTypeModel[] {
      return liste.filter(orderType =>
          orderType.type === type
      );
    },
    async fetchOrderType(page = 1) {
      // this.isLoading = true;
      try {
        const response = await listeOrderType(page) as ApiResponse<PaginatedOrderType>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            this.listeOrderType = response.data.items;
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des types de commandes");
        console.error(error);
      } finally {
        // this.isLoading = false;
      }
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    getStatusBadgeClass(status: string): string {
      switch (status) {
        case OrderStatus.PENDING:
          return 'bg-warning text-dark';
        case OrderStatus.PROCESSING:
          return 'bg-info text-white';
        case OrderStatus.READY_FOR_DELIVERY:
          return 'bg-primary text-white';
        case OrderStatus.OUT_FOR_DELIVERY:
          return 'bg-warning text-dark';
        case OrderStatus.DELIVERED:
          return 'bg-success text-white';
        default:
          return 'bg-danger text-white';
      }
    },
    fetchStatusOrderFr(status: string){
      switch (status) {
        case OrderStatus.PENDING:
          return 'En attente';
        case OrderStatus.PROCESSING:
          return 'En cours de traitement';
        case OrderStatus.READY_FOR_DELIVERY:
          return 'Prêt pour livraison';
        case OrderStatus.OUT_FOR_DELIVERY:
          return 'En cours de livraison';
        case OrderStatus.DELIVERED:
          return 'Livré';
        default:
          return 'Annulé';
      }
    },
    loaded() {
      setTimeout(() => {
        this.isLoading = true
      }, 1500)
      this.isLoading = false
    },
    analyserListeCuisson(listeCuisson: (string | null)[]): string {
      if (!listeCuisson || listeCuisson.length === 0) {
        return "-";
      }

      const filtered = listeCuisson.filter(val => val !== null) as string[];
      if (filtered.length === 0) {
        return "-";
      }

      const counts = filtered.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = filtered.length;
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const [topCuisson, topCount] = sorted[0];

      if (topCount === total) {
        return `Le client préfère systématiquement une cuisson "${topCuisson}".`;
      } else if (topCount > total / 2) {
        return `Le client préfère majoritairement la cuisson "${topCuisson}".`;
      } else {
        return `Les préférences de cuisson du client sont variées. Cuisson la plus fréquente : "${topCuisson}" (${topCount}/${total}).`;
      }
    },
    getMoyenPaiementName(paiement) {
      switch (paiement) {
        case 'Cash_livraison':
          return 'A la livraison'
        default:
          return 'En ligne'
      }
    },
    analyserMoyensPaiement(moyenPaiements: (string | null)[]): string {
      if (!moyenPaiements || moyenPaiements.length === 0) {
        return "-";
      }

      const filtered = moyenPaiements.filter(val => val !== null) as string[];
      if (filtered.length === 0) {
        return "-";
      }

      const counts = filtered.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = filtered.length;
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const [topMode, topCount] = sorted[0];

      if (topCount === total) {
        return `Le client utilise exclusivement le mode de paiement "${this.getMoyenPaiementName(topMode)}".`;
      } else if (topCount > total / 2) {
        return `Le client privilégie majoritairement le paiement par "${this.getMoyenPaiementName(topMode)}".`;
      } else {
        return `Le client utilise plusieurs moyens de paiement. Mode dominant : "${this.getMoyenPaiementName(topMode)}" (${topCount}/${total}).`;
      }
    },
    analyserDemandeCouverts(demandeCouverts: (boolean | number | null)[]): string {
      if (!demandeCouverts || demandeCouverts.length === 0) {
        return "-";
      }

      const filtered = demandeCouverts.filter(val => val !== null) as (boolean | number)[];
      if (filtered.length === 0) {
        return "-";
      }

      const demandes = filtered.filter(val => val === true || val === 1).length;
      const refus = filtered.filter(val => val === false || val === 0).length;
      const total = filtered.length;

      if (demandes === total) {
        return "Le client demande systématiquement des couverts avec ses commandes.";
      } else if (refus === total) {
        return "Le client ne demande jamais de couverts.";
      } else if (demandes > total / 2) {
        return "Le client demande les couverts de façon majoritaire.";
      } else {
        return "Le client ne demande que rarement des couverts.";
      }
    },
    getTypeOrderName(orderType) {
      switch (orderType) {
        case 'delivery':
          return 'A livrer'
        default:
          return 'A emporter'
      }
    },
    analyserTypesCommandes(typesCommandes: (string | null)[]): string {
      if (!typesCommandes || typesCommandes.length === 0) {
        return "-";
      }

      const filtered = typesCommandes.filter(val => val !== null);
      if (filtered.length === 0) {
        return "-";
      }

      const counts = filtered.reduce((acc, val) => {
        acc[val!] = (acc[val!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = filtered.length;
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const [topType, topCount] = sorted[0];

      if (topCount > total / 2) {
        return `Le client passe principalement des commandes de type "${this.getTypeOrderName(topType)}" (${topCount}/${total}).`;
      } else {
        return `Le client présente une variété de types de commandes. Type dominant : "${this.getTypeOrderName(topType)}" (${topCount}/${total}).`;
      }
    },
    analyserCommande(remarqueCommande: (string | null)[]): string {
      if (!remarqueCommande || remarqueCommande.length === 0) {
        return "-";
      }
      const filtered = remarqueCommande.filter(val => val !== null);
      if (filtered.length === 0) {
        return "-";
      }
      const counts = filtered.reduce((acc, val) => {
        acc[val!] = (acc[val!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const total = filtered.length;
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const [topType, topCount] = sorted[0];
      if (topCount > total / 2) {
        return `Commande majoritairement "${topType.toLowerCase()}" (${topCount}/${total}).`;
      } else {
        return `Commande variée sans prédominance nette. Type dominant : "${topType.toLowerCase()}" (${topCount}/${total}).`;
      }
    },

    clearData() {
      this.categorieData = {
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        city: '',
        codePostal: '',
        batiment: '',
        rue: '',
        created_at: ''
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    goBack() {
      this.$router.back()

    },
    // async createNewCategorie() {
    //
    //     this.isLoading = true;
    //     const payload = {
    //       "name": this.categorieData.name,
    //       "description": this.categorieData.description,
    //       "icone": this.categorieData.icone
    //     }
    //     try {
    //       const response = await createCategorie(payload);
    //       console.log(response);
    //       if (response.code === 201) {
    //         this.toast.success(response.message)
    //         this.clearData()
    //       } else {
    //         this.toast.error(response.message)
    //       }
    //     } catch (error) {
    //       const axiosError = error as AxiosError;
    //       if (axiosError.response && axiosError.response.data) {
    //         const message = (axiosError.response.data as any).message;
    //         this.toast.error(message);
    //       } else {
    //         this.toast.error("Une erreur est survenue");
    //       }
    //     } finally {
    //       this.isLoading = false;
    //     }
    //
    //
    // },
    // async updateCategorie(categorieID) {
    //   this.isLoading = true;
    //   const payload = {
    //     "name": this.categorieData.name,
    //     "description": this.categorieData.description,
    //     "icone": this.categorieData.icone
    //   }
    //   try {
    //     const response = await updateCategorie(categorieID, payload);
    //     console.log(response);
    //     if (response.code === 200) {
    //       this.toast.success(response.message)
    //       this.clearData()
    //     } else {
    //       this.toast.error(response.message)
    //     }
    //   } catch (error) {
    //     const axiosError = error as AxiosError;
    //     if (axiosError.response && axiosError.response.data) {
    //       const message = (axiosError.response.data as any).message;
    //       this.toast.error(message);
    //     } else {
    //       this.toast.error("Une erreur est survenue");
    //     }
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
    async fetchDetailCategorie(categorieID) {
      this.isLoading = true;
      try {
        const response = await detailCustomer(categorieID) as ApiResponse<CustomerModel>;
        console.log(response)
        if (response.code === 200) {
          if (response.data) {
            this.categorieResponse = response.data;
            this.categorieData.firstName = this.categorieResponse.firstName;
            this.categorieData.lastName = this.categorieResponse.lastName;
            this.categorieData.email = this.categorieResponse.email;
            this.categorieData.phoneNumber = this.categorieResponse.phoneNumber;
            this.categorieData.batiment = this.categorieResponse.batiment;
            this.categorieData.rue = this.categorieResponse.rue;
            this.categorieData.created_at = this.categorieResponse.created_at;
            this.categorieData.city = this.categorieResponse.city;
            this.categorieData.codePostal = this.categorieResponse.codePostal ?? '';
            this.categorieData.address = this.categorieResponse.address;
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
    // async uploadLogo(){
    //   console.log(this.categorieData);
    //   if(this.logoUpload && this.actionDetected === 'add'){
    //     this.isLoading = true;
    //     try {
    //       const response = await uploadFile(this.logoUpload);
    //       console.log(response);
    //       if (response.code === 200 || response.code === 201) {
    //         this.categorieData.icone = response.data
    //         await this.createNewCategorie()
    //       } else {
    //         this.toast.error(response.message)
    //       }
    //
    //     } catch (error) {
    //       const axiosError = error as AxiosError;
    //
    //       this.isLoading = false;
    //       if (axiosError.response && axiosError.response.data) {
    //         const message = (axiosError.response.data as any).message;
    //         this.toast.error(message);
    //       } else {
    //         this.toast.error("Une erreur est survenue");
    //       }
    //       console.error(axiosError);
    //
    //     }
    //   }
    //   else{
    //     await this.updateCategorie(this.categorieResponse?.id);
    //   }
    //
    //
    // },

    handleInput(event, type) {
      console.log("Valeur en temps réel :", event.target.value);
      const valueText = event.target.value;
      switch (type) {
        case 'firstName':
          this.categorieData.firstName = valueText
          this.validTextField(valueText)
          break
        case 'description':
          this.categorieData.lastName = valueText
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


    validTextField(text) {
      if (text) {
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
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    goToAdressePage(page) {
      if (page >= 1 && page <= this.totalAdressesPages) {
        this.currentAdressePage = page;
      }
    }

  },
  computed: {
    RestaurantEnum() {
      return RestaurantEnum
    },
    ActionCrud() {
      return ActionCrud
    },
    isFormValid() {
      return (
        this.validTextField(this.categorieData.firstName) &&
        this.validTextField(this.categorieData.lastName)
      );
    },
    paginatedAdresses() {
      if (!this.categorieResponse?.user?.listeAdresses) return [];
      const start = (this.currentAdressePage - 1) * this.itemsAdressePerPage;
      const end = start + this.itemsAdressePerPage;
      return this.categorieResponse.user.listeAdresses.slice(start, end);
    },
    paginatedOrders() {
      if (!this.categorieResponse?.user?.orders) return [];
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.categorieResponse.user.orders.slice(start, end);
    },
    totalPages() {
      if (!this.categorieResponse?.user?.orders) return 1;
      return Math.ceil(this.categorieResponse.user.orders.length / this.itemsPerPage);
    },
    totalAdressesPages() {
      if (!this.categorieResponse?.user?.listeAdresses) return 1;
      return Math.ceil(this.categorieResponse.user.listeAdresses.length / this.itemsAdressePerPage);
    }
  },
  setup: () => {

    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.actionDetected = (this as any).$route.params.action
    if ((this as any).$route.params.action == ActionCrud.EDIT) {
      this.fetchDetailCategorie((this as any).$route.params.customerID)
      this.fetchOrderType(1)
      this.fetchListeMethodePaiement(1)
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new Tooltip(tooltipTriggerEl)
      })
    }
    // const action = (this as any).$route.params.action
  }

});
</script>

<style>
.vs--searchable .vs__dropdown-toggle,
.vs__search,
.vs__search:focus {
  padding: 4px 6px 6px !important;
  font-size: 13px;
  color: rgba(132, 128, 128, 0.712);
}

.vs__search,
.vs__search:focus,
input.vs__search {
  font-size: 13px;
  color: rgba(132, 128, 128, 0.712);
}

/* Styles pour l'historique de commandes */
.order-item {
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.order-item:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.order-item:last-child {
  border-bottom: none !important;
}

.bg-gradient-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
}

.order-number .badge {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.order-type .badge {
  font-weight: 500;
}

.order-status .badge {
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.order-details {
  line-height: 1.6;
}

.order-total h4 {
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.8;
}

.empty-state {
  padding: 2rem 0;
}

.empty-state i {
  opacity: 0.5;
}

.pagination-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.pagination-controls .btn {
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination-controls .btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.pagination-controls .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Animation pour les badges */
.badge {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .order-item {
    padding: 1.5rem !important;
  }
  
  .order-item .row {
    flex-direction: column;
  }
  
  .order-item .col-md-4 {
    text-align: left !important;
    margin-top: 1rem;
  }
  
  .pagination-container .d-flex {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-controls {
    justify-content: center;
  }
}
</style>