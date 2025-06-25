<template>
  <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
      style="z-index: 9999;"
  >
    <LoaderComponent />
  </div>
  <div v-else class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing bg-white">
    <div class="col-md-2">
      <div class="form-group position-relative transition mt-2">
        <label class="d-block text-black fw-semibold mb-10 fs-16">
          Filtre par restaurant
        </label>
        <v-select
            v-model="restaurantSelected"
            :options="originalRestaurant"
            label="name"
            :reduce="restaurant => restaurant.id"
            placeholder="Restaurant"
        />
      </div>
    </div>

    <div class="container mb-50"  v-if="periodiqueReportCard">
      <div class="row mb-2 mt-2">
        <div class="row">
          <div class="col-lg-6">
            <VabeneTauxOrderCategorieDate :restaurantId="restaurantSelected ?? 'all'"/>
          </div>
          <div class="col-lg-6">
            <VabeneNombreCommandeProductDate :restaurantId="restaurantSelected ?? 'all'" />
          </div>
          <div class="col-lg-6">
            <VabeneTopProduitReportSell  :restaurantId="restaurantSelected ?? 'all'" />
          </div>
          <div class="col-lg-6">
            <VabeneAverageReportSell />
          </div>
        </div>

      </div>
      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4">
        <div class="col">
          <div class="card radius-10 border-start border-0 border-3 border-info">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div>
                  <p class="mb-0 text-secondary">Ventes cette semaine</p>
                  <h4 class="my-1 text-info">{{periodiqueReportCard.currentMonth.value}} CHF</h4>
                  <p v-if="periodiqueReportCard.currentMonth.ratio" class="mb-0 font-13">{{periodiqueReportCard.currentMonth.ratio ?? '0'}} cette semaine</p>
                  <p v-else  class="mb-0 font-13">0</p>
                </div>
                <div class="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto"><i class="fa fa-shopping-cart"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card radius-10 border-start border-0 border-3 border-danger">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div>
                  <p class="mb-0 text-secondary">Semaine passée</p>
                  <h4 class="my-1 text-danger">{{periodiqueReportCard.lastWeek.value}}</h4>
                  <p v-if="periodiqueReportCard.lastWeek.ratio" class="mb-0 font-13">{{periodiqueReportCard.lastWeek.ratio}}%</p>
                  <p v-else class="mb-0 font-13">0%</p>
                </div>
                <div class="widgets-icons-2 rounded-circle bg-gradient-bloody text-white ms-auto"><i class="fa fa-dollar"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card radius-10 border-start border-0 border-3 border-success">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div>
                  <p class="mb-0 text-secondary">Mois passée</p>
                  <h4 class="my-1 text-primary">{{periodiqueReportCard.lastMonth.value}}</h4>
                  <p v-if="periodiqueReportCard.lastMonth.ratio" class="mb-0 font-13">{{periodiqueReportCard.lastMonth.ratio}}%</p>
                  <p v-else class="mb-0 font-13">0%</p>

                </div>
                <div class="widgets-icons-2 rounded-circle bg-gradient-ohhappiness text-white ms-auto"><i class="fa fa-bar-chart"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card radius-10 border-start border-0 border-3 border-warning">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div>
                  <p class="mb-0 text-warning">Cette année</p>
                  <h4 class="my-1 text-warning">{{periodiqueReportCard.year.value}} CHF</h4>
                  <p v-if="periodiqueReportCard.year.ratio" class="mb-0 font-13">{{periodiqueReportCard.year.ratio}}%</p>
                  <p v-else class="mb-0 font-13">0%</p>
                </div>
                <div class="widgets-icons-2 rounded-circle bg-gradient-blooker text-white ms-auto"><i class="fa fa-users"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="mb-15 mb-sm-0 d-sm-flex align-items-center justify-content-between"
    >
      <div class="title" v-if="reportVente && reportVente.length >0">
        <span class="fw-medium text-muted fs-13 d-block mb-5 text-uppercase">
          {{getTitleForPeriod}}
        </span>
        <h4 class="card-title fw-black mb-0">{{reportVente[selectedPeriod].data[0]}} CHF</h4>
      </div>
      <div
        class="card-select mt-10 mt-sm-0 d-inline-block d-sm-flex align-items-center ps-10 pe-10 pt-5 pb-5"
      >
        <span class="fw-medium text-muted me-8">Select</span>

        <select
            class="form-select shadow-none text-black border-0 ps-0 pt-0 pb-0 pe-20 fs-14 fw-medium"
            v-model="selectedPeriod"
        >
          <option
              v-for="(option, index) in reportVente"
              :key="index"
              :value="index"
              class="fw-medium"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="chart" v-if="reportVente">
      <apexchart
        type="line"
        height="374"
        id="weeklySalesChart"
        :options="weeklySalesChart"
        :series="reportVente"
      ></apexchart>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {SellModel} from "@/models/vente.model";
import {listeRestaurant, reportPeriodiqueCard, reportVenteAdmin, reportVenteRestaurant} from "@/service/api";
import {ApiResponse, PaginatedRestaurant} from "@/models/Apiresponse";
import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import {RepportModelData} from "@/models/report.model";
import {PeriodiqueCardReport} from "@/models/periodiqueCardReport.model";
import VabeneTopProduitReportSell from "@/components/Vabene/Order/OrderReportSells/VabeneTopProduitReportSell.vue";
import VabeneAverageReportSell from "@/components/Vabene/Order/OrderReportSells/VabeneAverageReportSell.vue";
import VabeneTauxOrderCategorieDate from "@/components/Vabene/Order/OrderReportSells/VabeneTauxOrderCategorieDate.vue";
import VabeneNombreCommandeProductDate
  from "@/components/Vabene/Order/OrderReportSells/VabeneNombreCommandeProductDate.vue";
import {RestaurantModel} from "@/models/restaurant.model";

export default defineComponent({
  name: "VabenerReportSell",
  components: {
    VabeneTopProduitReportSell,
    VabeneAverageReportSell,
    VabeneTauxOrderCategorieDate,
    VabeneNombreCommandeProductDate,
    LoaderComponent
  },
  data(){
    return {
      reportVente: [] as RepportModelData[],
      isLoading: false,
      selectedPeriod: 2,
      weeklySalesChart: {
        chart: {
          height: 374,
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        colors: ["#3A8D35", "#F4D3AE",  "#e31b23", "#2B2A3F"],
        legend: {
          position: "top",
          fontSize: "14px",
          fontWeight: 500,
          horizontalAlign: "center",
          fontFamily: "Red Hat Display, sans-serif",
          labels: {
            colors: "#8E8DA1",
          },
          markers: {
            offsetY: -1,
            offsetX: -4,
            height: 15,
            width: 15,
          },
          itemMargin: {
            horizontal: 10,
          },
        },
        grid: {
          show: true,
          strokeDashArray: 5,
          borderColor: "#d9e9ef",
        },
        tooltip: {
          style: {
            fontSize: "14px",
            fontFamily: "Red Hat Display, sans-serif",
          },
          y: {
            formatter: function (val) {
              return  val + "K " + "CHF" ;
            },
          },
        },
        xaxis: {
          categories: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
          labels: {
            show: true,
            style: {
              fontFamily: "Red Hat Display, sans-serif",
              colors: "#9C9AB6",
              fontSize: "14px",
              fontWeight: 500,
            },
          },
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          tooltip: {
            style: {
              fontFamily: "Red Hat Display, sans-serif",
              colors: "#2b2a3f",
              fontSize: "14px",
            },
          },
        },
        yaxis: {
          show: true,
          labels: {
            style: {
              fontFamily: "Red Hat Display, sans-serif",
              colors: ["#9C9AB6"],
              fontSize: "14px",
              fontWeight: 500,
            },
          },
        },
      },
      allSells: [] as RepportModelData[],
      periodiqueReportCard: null as PeriodiqueCardReport | null,
      originalRestaurant: [] as RestaurantModel[], // Stockage des utilisateurs originaux
      restaurantSelected: null,
      fakeAllOptionFranchise: {
       id: 'all',
        name: 'Tous les resultats'
      }
    }
  },
  methods:{
    async fetchRestaurants(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeRestaurant(page) as ApiResponse<PaginatedRestaurant>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            this.originalRestaurant = [(this.fakeAllOptionFranchise as RestaurantModel), ...response.data.items];
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des restaurant");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async getReportAdmin(){
      try {
        const response = await reportVenteAdmin() as ApiResponse<SellModel>;
        console.log(response)
        if (response.code === 200) {
          if (response.data) {
            const dt = response.data as SellModel;
            this.reportVente = dt.vente as RepportModelData[]
            console.log('report sell: ', this.reportVente)
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getReportRestaurant(restaurantID: string){
      this.isLoading = true
      try {
        const response = await reportVenteRestaurant(restaurantID) as ApiResponse<SellModel>;
        if (response.code === 200) {
          if (response.data) {
            const dt = response.data as SellModel;
            this.reportVente = dt.vente as RepportModelData[]
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false
      }
    },
    async getPeriodiqueReport(){
      this.isLoading = true
      try {
        const response = await reportPeriodiqueCard() as ApiResponse<PeriodiqueCardReport>;
        if (response.code === 200) {
          if (response.data) {
            this.periodiqueReportCard = response.data
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false
      }
    },
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  async mounted(){
   await this.getReportAdmin();
   await this.getPeriodiqueReport()
    await this.fetchRestaurants()
  },

  computed: {
    getTitleForPeriod(): string {
      switch (this.selectedPeriod) {
        case 3: return "RAPPORT DE VENTE CETTE ANNÉE";
        case 1: return "RAPPORT DE VENTE SEMAINE PRÉCÉDENTE"
        case 2: return "RAPPORT DE VENTE CE MOIS-CI";
        default: return "RAPPORT DE VENTE CETTE SEMAINE";
      }
    }
  },
  watch:{
    restaurantSelected(this: any, newVal){
      if (!newVal) return
      this.restaurantSelected = newVal as string;
      console.log('restaurant selected: ',this.restaurantSelected)
    },

  }


});
</script>