<template>
  <div class="card mb-25 border-0 rounded-0 bg-white stats-item">
    <div class="card-body p-15 p-sm-20 p-md-25 pt-lg-30 letter-spacing">
      <div class="row justify-content-between">
        <div class="col-xxxl-12">
          <div class="row">
            <div class="col-md-4 mb-4">
              <div>
                <label class="d-block text-black fw-semibold mb-10">
                  Début
                </label>
                <input
                    type="date"
                    class="form-control shadow-none rounded-0 text-black"
                    placeholder="e.g. 2025-05-01"
                    v-model="startDate"
                    @change="(event) => handleInput(event, 'startDate')"
                />
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div>
                <label class="d-block text-black fw-semibold mb-10">
                  Fin 
                </label>
                <input
                    type="date"
                    class="form-control shadow-none rounded-0 text-black"
                    placeholder="e.g. 2025-05-01"
                    v-model="endDate"
                    @change="(event) => handleInput(event, 'endDate')"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-7 mb-4">
              <div class="form-group position-relative transition mt-2">
                <label class="d-block text-black fw-semibold mb-10">
                  Type de commande
                </label>
                <v-select
                    v-model="orderTypeSelected"
                    :options="listeOrderType"
                    label="libelle"
                    :reduce="orderType => orderType.type"
                    placeholder="Type de commande"
                />
              </div>
            </div>
            <div class="col-md-7 mb-4">
              <div class="form-group position-relative transition mt-2">
                <label class="d-block text-black fw-semibold mb-10">
                  Méthode de paiement
                </label>
                <v-select
                    v-model="methodePaiementSelected"
                    :options="listeMethode"
                    label="libelle"
                    :reduce="methode => methode.type"
                    placeholder="Méthode de paiement"
                />
              </div>
            </div>
          </div>

        </div>

        <div class="col-lg-5 col-md-5">
          <div
              class="icon position-relative text-warning rounded-1 text-center"
          >
            <i class="flaticon-sterile-box"></i>
          </div>
        </div>
        <div class="col-lg-7 col-md-7">
          <div class="chart">
            <apexchart
                type="area"
                height="120"
                :options="answeredTicketsChart"
                :series="answered"
            ></apexchart>
          </div>
        </div>
      </div>
      <!-- <div v-if="tauxMoyenCommande" class="info d-flex align-items-center justify-content-between mt-15">
        <span class="fs-13 d-block text-uppercase text-dark-emphasis fw-bold">
          NOMBRE DE COMMANDES (CATEGORIE)
        </span>
        <div class="d-flex align-items-center">
          <h4 class="fw-black mb-0 me-10 lh-1">{{ tauxMoyenCommande.montant }} CHF</h4>
          <span class="fw-bold text-success text-badge d-inline-block">
            <i class="flaticon-up-arrow fs-11 lh-1 position-relative top-1"></i>
           {{ tauxMoyenCommande.commande}} commande(s)
          </span>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group position-relative transition mt-2">
          <v-select
              v-model="categorieSelected"
              :options="originalCategories"
              label="name"
              :reduce="categorie => categorie.id"
              placeholder="Categorie"
          />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {CategorieModel} from "@/models/categorie.model";
import {
  listeMethodePaiement,
  listeOrderType,
  tauxCommandeCategorie,
  topProductReportSell,
  getAdvancedSalesReport
} from "@/service/api";
import {ApiResponse, PaginatedCategorie, PaginatedMethodePaiement, PaginatedOrderType} from "@/models/Apiresponse";
import {TopProductSellModel} from "@/models/TopProductSell.model";
import {useToast} from "vue-toastification";
import {UserGeneralKey, UserRole} from "@/models/user.generalkey";
import {RatioModel} from "@/models/ratio.model";
import {MethodePaiementModel} from "@/models/methodePaiement.model";
import {OrderTypeModel} from "@/models/orderType.model";
import {RestaurantModel} from "@/models/restaurant.model";

export default defineComponent({
  name: "VabeneTauxOrderCategorieDate",
  props: {
    restaurantId: {
      type: String as PropType<string>,
      required: true
    },
  },
  data: function () {
    return {
      fakeAllMethodePaiement: {
        id: 'all',
        type: 'all',
        libelle: 'Toutes les methodes'
      },
      fakeAllOrderType: {
        id: 'all',
        type: 'all',
        libelle: 'Tous les types'
      },
      listeMethode: [] as MethodePaiementModel[],
      methodePaiementSelected: [] as MethodePaiementModel[],
      listeOrderType: [] as OrderTypeModel[],
      orderTypeSelected: [] as OrderTypeModel[],
      startDate: '' as string,
      endDate: '' as string,
      originalCategories: [] as CategorieModel[], // Stockage des utilisateurs originaux
      categorieSelected: null as CategorieModel | null,
      answered: [
        {
          name: "Taux moyen de commandes",
          data: [8, 9, 10, 9, 9, 8, 9, 8, 9, 8, 7],
        },
      ],
      answeredTicketsChart: {
        chart: {
          type: "area",
          toolbar: {
            show: false,
          },
        },
        colors: ["#F3C44C"],
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          show: false,
        },
        grid: {
          show: false,
          strokeDashArray: 5,
          borderColor: "#f0f0f0",
        },
        tooltip: {
          enabled: false,
          style: {
            fontSize: "14px",
            fontFamily: "Red Hat Display, sans-serif",
          },
        },
      },
      tauxMoyenCommande: null as RatioModel | null,
      newRestoId: null as string | null,
      userRole: localStorage.getItem(UserGeneralKey.USER_ROLE),
      restaurantIdStorage: localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID),
    };
  },
  methods: {
    getMethodePaiementParType(
        liste: MethodePaiementModel[],
        type: string
    ): MethodePaiementModel[] {
      return liste.filter(methode =>
          methode.type === type
      );
    },
    getOrderTypeParType(
        liste: OrderTypeModel[],
        type: string
    ): OrderTypeModel[] {
      return liste.filter(orderType =>
          orderType.type === type
      );
    },
    async fetchListeMethodePaiement(page = 1) {
      // this.isLoading = true;
      try {
        const response = await listeMethodePaiement(page) as ApiResponse<PaginatedMethodePaiement>;
        if (response.code === 200) {
          if (response.data?.items) {
            this.listeMethode = [(this.fakeAllMethodePaiement as MethodePaiementModel), ...response.data.items];
            this.methodePaiementSelected = this.getMethodePaiementParType(this.listeMethode, 'all')
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        // this.isLoading = false;
      }
    },
    async fetchOrderType(page = 1) {
      // this.isLoading = true;
      try {
        const response = await listeOrderType(page) as ApiResponse<PaginatedOrderType>;
        if (response.code === 200) {
          if (response.data?.items) {
            this.listeOrderType = [(this.fakeAllOrderType as OrderTypeModel), ...response.data.items];
            this.orderTypeSelected = this.getOrderTypeParType(this.listeOrderType, 'all')
          }
        } 
      } catch (error) {
        console.error(error);
      } finally {
        // this.isLoading = false;
      }
    },
    getSameDayLastMonth(): string {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      return lastMonth.toISOString().split('T')[0]; // retourne "2025-05-25"
    },
    getTodayDate(): string {
      const today = new Date();
      return today.toISOString().split('T')[0]; // retourne "2025-06-25"
    },
    getTodayDateTime(): string {
      // Utiliser le fuseau horaire suisse
      const today = new Date();
      const swissDate = new Date(today.toLocaleString("en-US", { timeZone: "Europe/Zurich" }));
      const year = swissDate.getFullYear();
      const month = String(swissDate.getMonth() + 1).padStart(2, '0');
      const day = String(swissDate.getDate()).padStart(2, '0');
      const hours = String(swissDate.getHours()).padStart(2, '0');
      const minutes = String(swissDate.getMinutes()).padStart(2, '0');
      const seconds = String(swissDate.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    getEndDateTime(dateString: string): string {
      const selectedDate = new Date(dateString);
      // Utiliser le fuseau horaire suisse pour aujourd'hui
      const today = new Date();
      const swissToday = new Date(today.toLocaleString("en-US", { timeZone: "Europe/Zurich" }));
      
      // Si c'est le jour même, utiliser l'heure actuelle en heure suisse
      if (selectedDate.toDateString() === swissToday.toDateString()) {
        return this.getTodayDateTime();
      } else {
        // Sinon, utiliser 23:59:59
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} 23:59:59`;
      }
    },
    handleInput(event, type) {
      const valueText = event.target.value;
      switch (type){
        case 'startDate':
          this.startDate = valueText
          if(this.categorieSelected){
            const startDateTime = `${this.startDate} 00:00:00`
            const endDateTime = this.getEndDateTime(this.endDate)
            if(this.userRole === UserRole.FRANCHISE){
              if(this.newRestoId !== 'all'){
                this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, this.newRestoId ?? 'all', this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type, 'all');
              }
              else{
                this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, 'all',this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type, 'all');
              }
            }
            else{
              this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, this.restaurantIdStorage ?? 'all', this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type, 'all');
            }

          }
          break
        case 'endDate':
          this.endDate = valueText
            if(this.categorieSelected){
              const startDateTime = `${this.startDate} 00:00:00`
              const endDateTime = this.getEndDateTime(this.endDate)
              if(this.userRole === UserRole.FRANCHISE){
                if(this.newRestoId !== 'all'){
                  this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, this.newRestoId ?? 'all', this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type, 'all');
                }
                else{
                  this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, 'all',this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type, 'all');
                }
              }
              else{
                this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, this.restaurantIdStorage ?? 'all', this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type, 'all');
              }

            }
          break


      }
    },
    getCategorieByName(
        liste: CategorieModel[],
        name: string
    ): CategorieModel | undefined{
      return liste.find(categorie => categorie.name === name);
    },
    async fetchTauxCommandeMoyenByCategorie(categoryID: string, startDate: string, endDate: string, idRest: string, methodePaiement: string, orderType: string, deliveryType: string = 'all') {
      try {
        const response = await getAdvancedSalesReport(idRest, startDate, endDate, orderType, methodePaiement, deliveryType) as ApiResponse<RatioModel>;
        if (response.code === 200) {
          this.tauxMoyenCommande = response.data as RatioModel;
        } 
      } catch (error) {
        console.error(error);
      }
    },

  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  watch:{
    orderTypeSelected(newVal, oldVal){
      if (typeof newVal === 'string' && newVal !== oldVal){
        this.orderTypeSelected = this.getOrderTypeParType(this.listeOrderType, newVal)
        if(this.categorieSelected){
          const startDateTime = `${this.startDate} 00:00:00`
          const endDateTime = this.getEndDateTime(this.endDate)
          if(this.newRestoId !== 'all' && this.newRestoId){
            this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, this.newRestoId, this.methodePaiementSelected[0].type, newVal, 'all');
          }
          else{
            this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, 'all',this.methodePaiementSelected[0].type, newVal, 'all');
          }
        }
      }
    },
    methodePaiementSelected(newVal, oldVal){
      if (typeof newVal === 'string' && newVal !== oldVal){
        this.methodePaiementSelected = this.getMethodePaiementParType(this.listeMethode, newVal)
        if(this.categorieSelected){
          const startDateTime = `${this.startDate} 00:00:00`
          const endDateTime = this.getEndDateTime(this.endDate)
          if(this.newRestoId !== 'all' && this.newRestoId){
            this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, this.newRestoId, newVal, this.orderTypeSelected[0].type, 'all');
          }
          else{
            this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, 'all',newVal, this.orderTypeSelected[0].type, 'all');
          }
        }
      }
    },
    restaurantId(newVal, oldVal){
      if (typeof newVal === 'string' && newVal !== oldVal) {
        this.newRestoId = newVal;
        if(this.categorieSelected){
          const startDateTime = `${this.startDate} 00:00:00`
          const endDateTime = this.getEndDateTime(this.endDate)
          if(newVal !== 'all'){
            this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, newVal, this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type, 'all');
          }
          else{
            this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, 'all',this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type, 'all');
          }
        }
      }
    },
    categorieSelected(newVal, oldVal) {
      if (typeof newVal === 'string' && newVal !== oldVal) {
        // this.expected = []
        // this.amountTotal = 0
        this.categorieSelected = this.originalCategories.find(c => c.id === newVal) ?? null;
        if(this.categorieSelected){
          const startDateTime = `${this.startDate} 00:00:00`
          const endDateTime = this.getEndDateTime(this.endDate)
          if(this.userRole === UserRole.FRANCHISE){
            if(this.newRestoId !== 'all'){
              this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, this.newRestoId ?? 'all', this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type, 'all');
            }
            else{
              this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, 'all', this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
            }
          }
          else{
            this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, startDateTime, endDateTime, this.restaurantIdStorage ?? 'all', this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type, 'all');
          }
        }
      }
    }
  }
});
</script>