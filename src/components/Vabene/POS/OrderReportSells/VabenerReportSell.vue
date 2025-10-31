<template>
  <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
      style="z-index: 9999;"
  >
    <LoaderComponent />
  </div>
  <div v-else class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing bg-white">
    <div class="col-md-2" v-if="useRole === UserRole.FRANCHISE">
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
    <div class="col-md-2" v-if="useRole === UserRole.RESTAURANT">
      <div class="form-group position-relative transition mt-2" v-if="originalRestaurant.length > 0">
        <label class="d-block text-black fw-semibold mb-10 fs-30">
         {{originalRestaurant[0].name}}
        </label>

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
          <!-- <div class="col-lg-6">
            <VabeneAverageReportSell :restaurantId="restaurantSelected ?? 'all'" />
          </div> -->
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
        <h4 class="card-title fw-black mb-0">{{getSelectedPeriodTotal}} CHF</h4>
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
        :key="chartKey"
        type="line"
        height="374"
        id="weeklySalesChart"
        :options="weeklySalesChart"
        :series="formattedSeries"
      ></apexchart>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {SellModel} from "@/models/vente.model";
import {
  detailRestaurant,
  listeRestaurant,
  reportPeriodiqueCard,
  reportVenteAdmin,
  reportVenteRestaurant
} from "@/service/api";
import {ApiResponse, PaginatedRestaurant} from "@/models/Apiresponse";
import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import {RepportModelData} from "@/models/report.model";
import {PeriodiqueCardReport} from "@/models/periodiqueCardReport.model";
import VabeneAverageReportSell from "@/components/Vabene/POS/OrderReportSells/VabeneAverageReportSell.vue";
import VabeneTauxOrderCategorieDate from "@/components/Vabene/POS/OrderReportSells/VabeneTauxOrderCategorieDate.vue";
import VabeneNombreCommandeProductDate
  from "@/components/Vabene/POS/OrderReportSells/VabeneNombreCommandeProductDate.vue";
import {RestaurantModel} from "@/models/restaurant.model";
import {UserGeneralKey, UserRole} from "@/models/user.generalkey";

export default defineComponent({
  name: "VabenerReportSell",
  components: {
    // VabeneAverageReportSell,
    VabeneTauxOrderCategorieDate,
    VabeneNombreCommandeProductDate,
    LoaderComponent
  },
  data(){
    return {
      reportVente: [] as RepportModelData[],
      isLoading: false,
      useRole: localStorage.getItem(UserGeneralKey.USER_ROLE),
      restaurantIdStorage: localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID),
      selectedPeriod: 2,
      chartKey: 0,
      refreshInterval: null as NodeJS.Timeout | null,
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
        name: 'Tous les restaurants'
      }
    }
  },
  methods:{
    async fetchDetailRestaurant(restaurantID) {
      this.isLoading = true;
      try {
        const response = await detailRestaurant(restaurantID) as ApiResponse<RestaurantModel>;
        if (response.code === 200) {
          if(response.data){
            const dt = response.data
            this.originalRestaurant = [dt]
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
    async fetchRestaurants(page = 1) {
      const userRole = localStorage.getItem(UserGeneralKey.USER_ROLE);
      if(userRole === UserRole.RESTAURANT){
        const restoId = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID);
        await this.fetchDetailRestaurant(restoId)
      }
      else{
        this.isLoading = true;
        try {
          const response = await listeRestaurant(page) as ApiResponse<PaginatedRestaurant>;
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
      }

    },
    async getReportAdmin(restaurantId?: string){
      try {
        const response = await reportVenteAdmin(restaurantId) as ApiResponse<SellModel>;
        if (response.code === 200) {
          if (response.data) {
            const dt = response.data as SellModel;
            this.reportVente = dt.vente as RepportModelData[]
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    // async getReportRestaurant(restaurantID: string){
    //   this.isLoading = true
    //   try {
    //     const response = await reportVenteRestaurant(restaurantID) as ApiResponse<SellModel>;
    //     if (response.code === 200) {
    //       if (response.data) {
    //         const dt = response.data as SellModel;
    //         this.reportVente = dt.vente as RepportModelData[]
    //       }
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     this.isLoading = false
    //   }
    // },
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
    updateChartCategories() {
      let categories: string[] = [];
      switch (this.selectedPeriod) {
        case 0: // Cette semaine
        case 1: // Semaine précédente
          categories = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
          break;
        case 2: // Ce mois
          categories = ["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4", "Semaine 5"];
          break;
        case 3: // Cette année
          categories = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
          break;
        default:
           categories = ["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4", "Semaine 5"];
      }
      this.weeklySalesChart.xaxis.categories = categories;
      this.chartKey++; // Increment the key to force re-render
    },
    startAutoRefresh() {
      // Démarrer le rechargement automatique toutes les 2 minutes (120000 ms)
      this.refreshInterval = setInterval(() => {
        this.refreshData()
      }, 120000) // 2 minutes
    },
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
      }
    },
    async refreshData() {
      try {
        if (this.useRole === UserRole.FRANCHISE) {
          if (this.restaurantSelected && this.restaurantSelected !== 'all') {
            await this.getReportAdmin(this.restaurantSelected)
          } else {
            await this.getReportAdmin()
          }
        } else {
          await this.getReportAdmin(this.restaurantIdStorage ?? undefined)
        }
        await this.getPeriodiqueReport()
      } catch (error) {
        console.error('❌ Erreur lors du rechargement des données:', error)
      }
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  async mounted(){
    if(this.useRole === UserRole.FRANCHISE){
      await this.getReportAdmin();
    }
    else{
      await this.getReportAdmin(this.restaurantIdStorage ?? undefined);
    }
    await this.getPeriodiqueReport()
    await this.fetchRestaurants()
    
    // Initialiser les catégories du graphique
    this.updateChartCategories();
    
    // Démarrer le rechargement automatique
    this.startAutoRefresh();
  },
  beforeUnmount() {
    // Arrêter le rechargement automatique quand le composant est détruit
    this.stopAutoRefresh();
  },

  computed: {
    UserRole() {
      return UserRole
    },
    getTitleForPeriod(): string {
      switch (this.selectedPeriod) {
        case 3: return "RAPPORT DE VENTE CETTE ANNÉE";
        case 1: return "RAPPORT DE VENTE SEMAINE PRÉCÉDENTE"
        case 2: return "RAPPORT DE VENTE CE MOIS-CI";
        default: return "RAPPORT DE VENTE CETTE SEMAINE";
      }
    },
    getSelectedPeriodTotal(): string {
      if (!this.reportVente || this.reportVente.length === 0) {
        return "0";
      }
      const selectedReport = this.reportVente[this.selectedPeriod];
      if (!selectedReport || !selectedReport.data) {
        return "0";
      }
      
      // Calculer le total en additionnant toutes les valeurs
      let total = 0;
      if (Array.isArray(selectedReport.data)) {
        total = selectedReport.data.reduce((sum, value) => sum + (Number(value) || 0), 0);
      } else if (typeof selectedReport.data === 'object') {
        total = Object.values(selectedReport.data).reduce((sum, value) => sum + (Number(value) || 0), 0);
      } else {
        total = Number(selectedReport.data) || 0;
      }
      
      return Math.floor(total).toString();
    },
    formattedSeries(): any[] {
      if (!this.reportVente || this.reportVente.length === 0) {
        return [];
      }
      
      // N'afficher que la série correspondant à la période sélectionnée
      const selectedItem = this.reportVente[this.selectedPeriod];
      if (!selectedItem) {
        return [];
      }
      
      let data = selectedItem.data;
      if (typeof data === 'object' && !Array.isArray(data)) {
        data = Object.values(data);
      }
      
      return [{
        name: selectedItem.name,
        data: Array.isArray(data) ? data : [data]
      }];
    }
  },
  watch:{
    restaurantSelected(this: any, newVal){
      if (!newVal) return
      this.restaurantSelected = newVal as string;
      
      // Redémarrer le rechargement automatique avec les nouveaux paramètres
      this.stopAutoRefresh();
      this.startAutoRefresh();
      
      if(newVal !== 'all'){
         this.getReportAdmin(this.restaurantSelected);
      }
      else{
        this.getReportAdmin();
      }
    },

    selectedPeriod(this: any, newVal){
      if (!newVal) return
      this.selectedPeriod = newVal as string;
      this.updateChartCategories();
      
      // Redémarrer le rechargement automatique avec les nouveaux paramètres
      this.stopAutoRefresh();
      this.startAutoRefresh();
      
      if(this.restaurantSelected !== 'all'){
        this.getReportAdmin(this.restaurantSelected);
      }
      else{
        this.getReportAdmin();
      }
    },

  }


});
</script>