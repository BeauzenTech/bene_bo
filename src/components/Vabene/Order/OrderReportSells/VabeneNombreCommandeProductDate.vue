<template>
  <div class="card mb-25 border-0 rounded-0 bg-white stats-item">
    <div class="card-body p-15 p-sm-20 p-md-25 pt-lg-30 letter-spacing">
      <div class="row justify-content-between">
        <div class="col-xxxl-12">
          <div class="row">
            <div class="col-md-4 mb-4">
              <div>
                <label class="d-block text-black fw-semibold mb-10">
                  Debut
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
                  Methode de paiement
                </label>
                <v-select
                    v-model="methodePaiementSelected"
                    :options="listeMethode"
                    label="libelle"
                    :reduce="methode => methode.type"
                    placeholder="Methode de paiement"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5 col-md-5">
          <div
              class="icon position-relative text-success rounded-1 text-center"
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
      <div v-if="tauxMoyenCommande" class="info d-flex align-items-center justify-content-between mt-15">
        <span class="fs-13 d-block text-uppercase text-dark-emphasis fw-bold">
          NOMBRE DE COMMANDES (PRODUIT)
        </span>
        <div class="d-flex align-items-center">
          <h4 class="fw-black mb-0 me-10 lh-1">{{ tauxMoyenCommande.montant }} CHF</h4>
          <span class="fw-bold text-success text-badge d-inline-block">
            <i class="flaticon-up-arrow fs-11 lh-1 position-relative top-1"></i>
            {{tauxMoyenCommande.commande}} Commande(s)
          </span>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group position-relative transition mt-2">
          <v-select
              v-model="productSelected"
              :options="originalProducts"
              label="name"
              :reduce="product => product.id"
              placeholder="produit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {
  listeCategorieActive, listeMethodePaiement, listeOrderType,
  listeProducts,
  nombreCommandeParProduct,
  tauxCommandeCategorie,
  topProductReportSell
} from "@/service/api";
import {
  ApiResponse,
  PaginatedCategorie,
  PaginatedMethodePaiement,
  PaginatedOrderType,
  PaginatedProduct
} from "@/models/Apiresponse";
import {TopProductSellModel} from "@/models/TopProductSell.model";
import {useToast} from "vue-toastification";
import {UserGeneralKey, UserRole} from "@/models/user.generalkey";
import {ProductModel} from "@/models/product.model";
import {RatioModel} from "@/models/ratio.model";
import {MethodePaiementModel} from "@/models/methodePaiement.model";
import {OrderTypeModel} from "@/models/orderType.model";

export default defineComponent({
  name: "VabeneNombreCommandeProductDate",
  props: {
    restaurantId: {
      type: String as PropType<string>,
      required: true
    },
  },
  data() {
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
      originalProducts: [] as ProductModel[], // Stockage des utilisateurs originaux
      productSelected: null as ProductModel | null,
      userRole: localStorage.getItem(UserGeneralKey.USER_ROLE),
      restaurantIdStorage: localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID),
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
        colors: ["#038F32"],
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
      newRestaurantId: null as string | null
    };
  },
  methods: {
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
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            this.listeMethode = [(this.fakeAllMethodePaiement as MethodePaiementModel), ...response.data.items];
            console.log('methodes:', this.listeMethode)
            this.methodePaiementSelected = this.getMethodePaiementParType(this.listeMethode, 'all')
            console.log('liste des methodes: ', this.listeMethode);
            console.log('methode Paiement selected: ', this.methodePaiementSelected);
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
    async fetchOrderType(page = 1) {
      // this.isLoading = true;
      try {
        const response = await listeOrderType(page) as ApiResponse<PaginatedOrderType>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            this.listeOrderType = [(this.fakeAllOrderType as OrderTypeModel), ...response.data.items];
            console.log('orderType: ', this.listeOrderType)
            this.orderTypeSelected = this.getOrderTypeParType(this.listeOrderType, 'all')
            console.log('orderType selected: ', this.orderTypeSelected);
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
    getSameDayLastMonth(): string {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      return lastMonth.toISOString().split('T')[0]; // retourne "2025-05-25"
    },
    getTodayDate(): string {
      const today = new Date();
      return today.toISOString().split('T')[0]; // retourne "2025-06-25"
    },
    handleInput(event, type) {
      console.log("Valeur en temps réel :", event.target.value);
      const valueText = event.target.value;
      switch (type){
        case 'startDate':
          console.log(valueText)
          this.startDate = valueText
          if(this.productSelected){
            if(this.userRole === UserRole.FRANCHISE){
              if(this.newRestaurantId !== 'all'){
                this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, this.newRestaurantId ?? 'all',  this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
              }
              else{
                this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, 'all' ,this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
              }
            }
            else{
                this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, this.restaurantIdStorage ?? 'all',  this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
            }

          }
          break
        case 'endDate':
          this.endDate = valueText
          if(this.productSelected){
            if(this.userRole === UserRole.FRANCHISE){
              if(this.newRestaurantId !== 'all'){
                this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, this.newRestaurantId ?? 'all',  this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
              }
              else{
                this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate,  'all', this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
              }
            }
            else{
                this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, this.restaurantIdStorage ?? 'all',  this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
            }
          }
          break


      }
    },
    getProductByName(
        liste: ProductModel[],
        name: string
    ): ProductModel | undefined{
      console.log(liste)
      console.log(name)
      return liste.find(product => product.name === name);
    },
    async fetchProduct(page = 1, filter: string, categorieID: string) {
      const payload = {
        "categorieID": categorieID
      }
      try {
        const response = await listeProducts(page, "0" ,filter, payload) as ApiResponse<PaginatedProduct>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            await this.fetchOrderType(1)
            await this.fetchListeMethodePaiement(1)
            this.originalProducts = response.data.items;
            this.productSelected = this.originalProducts[0]
            this.startDate = this.getSameDayLastMonth()
            this.endDate = this.getTodayDate()
            if(this.userRole === UserRole.FRANCHISE){
              await this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate,  'all', this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
            }
            else{
              console.log(this.restaurantIdStorage);
              await this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, this.restaurantIdStorage as string,  this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
            }



          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      }
    },

    async fetchNombreDeCommandeMoyenByProduct(productID: string, startDate: string, endDate: string, idRest: string, methodePaiement: string, orderType: string) {
      try {
        const response = await nombreCommandeParProduct(productID, startDate, endDate, idRest, methodePaiement, orderType) as ApiResponse<RatioModel>;
        console.log(response)
        if (response.code === 200) {
          this.tauxMoyenCommande = response.data as RatioModel;
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement du taux moyens");
        console.error(error);
      }
    },

  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchProduct(1, "active", '');
    if(this.userRole === UserRole.RESTAURANT){
       this.newRestaurantId = this.restaurantId
    }

  },
  watch:{
    orderTypeSelected(newVal, oldVal){
      if (typeof newVal === 'string' && newVal !== oldVal){
        this.orderTypeSelected = this.getOrderTypeParType(this.listeOrderType, newVal)
        console.log("Nouvelle option orderType sélectionnée :", newVal);
        if(this.newRestaurantId !== 'all' && this.newRestaurantId){
          if(this.productSelected){
            this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, this.newRestaurantId, this.methodePaiementSelected[0].type, newVal);
          }
        }
        else{
          if(this.productSelected){
            this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, 'all',this.methodePaiementSelected[0].type, newVal);
          }
        }
      }
    },
    methodePaiementSelected(newVal, oldVal){
      if (typeof newVal === 'string' && newVal !== oldVal){
        this.methodePaiementSelected = this.getMethodePaiementParType(this.listeMethode, newVal)
        console.log("Nouvelle option methode sélectionnée :", newVal);
        if(this.newRestaurantId !== 'all' && this.newRestaurantId){
          if(this.productSelected){
            this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, this.newRestaurantId, newVal, this.orderTypeSelected[0].type);
          }
        }
        else{
          if(this.productSelected){
            this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, 'all', newVal, this.orderTypeSelected[0].type);
          }
        }
      }
    },
    restaurantId(newVal, oldVal){
      if (typeof newVal === 'string' && newVal !== oldVal) {
        console.log("Nouvelle option restaurant ID sélectionnée :", newVal);
        this.newRestaurantId = newVal;
        if(newVal !== 'all'){
          if(this.productSelected){
            this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, newVal, this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
          }
        }
        else{
          if(this.productSelected){
            this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, 'all', this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
          }
        }

      }
    },
    productSelected(newVal, oldVal) {
      if (typeof newVal === 'string' && newVal !== oldVal) {
        console.log("Nouvelle catégorie sélectionnée :", newVal);
        // this.expected = []
        // this.amountTotal = 0
        this.productSelected = this.originalProducts.find(c => c.id === newVal) ?? null;

        if(this.productSelected  && this.newRestaurantId !== 'all'){
          this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, this.newRestaurantId ?? 'all', this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
        }
        else{
          if(this.productSelected){
            this.fetchNombreDeCommandeMoyenByProduct(this.productSelected.id, this.startDate, this.endDate, 'all' ,this.methodePaiementSelected[0].type, this.orderTypeSelected[0].type);
          }
        }
      }
    }
  }
});
</script>