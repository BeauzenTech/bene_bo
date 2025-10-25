<template>
  <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
      style="z-index: 9999;"
  >
    <LoaderComponent />
  </div>
  <div v-if="!isLoading" class="col bg-white p-4">
    <div class="row" >
      <div class="col-xxl-7 col-xxxl-6">
        <WhatHappening :orderAmount="String(getCardValue(0) || '0')" id="whatHappening" />
      </div>
      <div class="col-xxl-5 col-xxxl-6">
        <div class="row">
          <div class="col-lg-12">
            <VabeneNombreCommandeProductDate id="nombreCommandeProductDate" :restaurantId="restaurantId ?? 'all'" />
          </div>

        </div>
      </div>

    </div>
    <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4 bg-white mb-8">
      <div class="col mb-6" v-if="periodiqueReportCard">
        <div class="card radius-10 border-start border-0 border-3 border-info">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div>
                <p class="mb-0 text-secondary">Ventes cette semaine</p>
                <h4 class="my-1 text-info">{{getCardValue(0)}} CHF</h4>
                <p class="mb-0 font-13">{{getCardRatio(0)}}%</p>
              </div>
              <div class="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto"><i class="fa fa-shopping-cart"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col" v-if="periodiqueReportCard">
        <div class="card radius-10 border-start border-0 border-3 border-danger">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div>
                <p class="mb-0 text-secondary">Semaine précédente</p>
                <h4 class="my-1 text-danger">{{getCardValue(1)}}</h4>
                <p class="mb-0 font-13">{{getCardRatio(1)}}%</p>
              </div>
              <div class="widgets-icons-2 rounded-circle bg-gradient-bloody text-white ms-auto"><i class="fa fa-dollar"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col" v-if="periodiqueReportCard">
        <div class="card radius-10 border-start border-0 border-3 border-success">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div>
                <p class="mb-0 text-secondary">Ce mois</p>
                <h4 class="my-1 text-primary">{{getCardValue(2)}}</h4>
                <p class="mb-0 font-13">{{getCardRatio(2)}}%</p>

              </div>
              <div class="widgets-icons-2 rounded-circle bg-gradient-ohhappiness text-white ms-auto"><i class="fa fa-bar-chart"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col" v-if="periodiqueReportCard">
        <div class="card radius-10 border-start border-0 border-3 border-warning">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div>
                <p class="mb-0 text-warning">Cette année</p>
                <h4 class="my-1 text-warning">{{getCardValue(3)}} CHF</h4>
                <p class="mb-0 font-13">{{getCardRatio(3)}}%</p>
              </div>
              <div class="widgets-icons-2 rounded-circle bg-gradient-blooker text-white ms-auto"><i class="fa fa-users"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div
        class="mb-15 mb-sm-0 d-sm-flex align-items-center justify-content-between"
        v-if="reportVente && reportVente.length >0"
    >
      <div class="title" >
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
    <div class="chart bg-white mt-4" v-if="reportVente && reportVente.length > 0" >
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
import { defineComponent } from "vue";
import VueApexCharts from "vue3-apexcharts";

import WhatHappening from "@/components/Dashboard/Ecommerce/WhatHappening.vue";

import {RepportModelData} from "@/models/report.model";
import {PeriodiqueCardReport} from "@/models/periodiqueCardReport.model";
import {reportPeriodiqueCard, reportVenteAdmin, reportVenteRestaurant} from "@/service/api";
import {ApiResponse} from "@/models/Apiresponse";
import {SellModel} from "@/models/vente.model";
import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import {UserGeneralKey, UserRole} from "@/models/user.generalkey";

export default defineComponent({
  name: "VabeneDashPage",
  components: {
    LoaderComponent,
    WhatHappening,
    apexchart: VueApexCharts
    // VabeneNombreCommandeProductDate
  },
  data(){
    return {
      reportVente: [] as RepportModelData[],
      userRole: localStorage.getItem(UserGeneralKey.USER_ROLE),
      restaurantId: localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID) ?? null,
      isLoading: false,
      selectedPeriod: 2,
      chartKey: 0,
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
          showForSingleSeries: true,
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
              return  val + " " + "CHF" ;
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
      periodiqueReportCard: null as PeriodiqueCardReport | null
    }
  },
  methods:{
    async getReportAdmin(restaurantId?: string){
      try {
        const response = await reportVenteAdmin(restaurantId) as ApiResponse<SellModel>;
        if (response.code === 200) {
          if (response.data) {
            const dt = response.data as SellModel;
            this.reportVente = dt.vente as RepportModelData[]
            this.chartKey++; 
          }
        }
      } catch (error) {
        console.error('Error fetching admin report:', error);
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
    async getPeriodiqueReport(restaurantID?: string, filters?: any){
      this.isLoading = true
      try {
        const response = await reportPeriodiqueCard(restaurantID, filters) as ApiResponse<any>;
    
        if (response.code === 200) {
          if (response.data) {
            this.periodiqueReportCard = response.data;
            this.reportVente = response.data.vente;
          }
        }
      } catch (error) {
        console.error('Error fetching periodique report:', error);
      } finally {
        this.isLoading = false
      }
    },
    updateChartCategories() {
      let categories: string[] = [];
      switch (this.selectedPeriod) {
        case 0:
        case 1: 
          categories = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
          break;
        case 2:
          categories = ["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4"];
          break;
        case 3:
          categories = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
          break;
        default:
          categories = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
      }
      this.weeklySalesChart.xaxis.categories = categories;
      
      const colors = ["#3A8D35", "#F4D3AE", "#e31b23", "#2B2A3F"];
      this.weeklySalesChart.colors = [colors[this.selectedPeriod] || "#3A8D35"];
      
      this.chartKey++; 
    },
    getCardValue(index: number): string {
      
      if (!this.reportVente || this.reportVente.length === 0) {
        return "0";
      }
      
      let value = 0;
      switch (index) {
        case 0: 
          value = (this.reportVente[0] as any)?.total || 0;
          break;
        case 1: 
          value = (this.reportVente[1] as any)?.total || 0;
          break;
        case 2: 
          value = (this.reportVente[2] as any)?.total || 0;
          break;
        case 3: 
          value = (this.reportVente[3] as any)?.total || 0;
          break;
      }
      const result = Math.floor(value).toString();
      return result;
    },
    getCardRatio(index: number): string {
      if (!this.reportVente || this.reportVente.length === 0) return "0";
      
      return "0";
    }
  },

  setup() {
    const toast = useToast();
    return { toast };
  },
  async mounted(){
      const defaultFilters = {
        paymentMethod: 'all',
        orderType: 'all',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      };
      
      if(this.userRole === UserRole.FRANCHISE){
        await this.getReportAdmin();
        await this.getPeriodiqueReport(undefined, defaultFilters)
      }
      else{
        await this.getReportAdmin(this.restaurantId as string);
        await this.getPeriodiqueReport(this.restaurantId as string, defaultFilters)
      }
      
      this.updateChartCategories();
  },
  watch: {
    selectedPeriod() {
      this.updateChartCategories();
    }
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
      
      const selectedItem = this.reportVente[this.selectedPeriod];
      if (!selectedItem) {
        return [];
      }
      
      let data = selectedItem.data;
      if (typeof data === 'object' && !Array.isArray(data)) {
        data = Object.values(data);
      }
      
      
      const formattedItem = {
        name: selectedItem.name,
        data: Array.isArray(data) ? data : [data]
      };
      
      return [formattedItem]; 
    }
  }
});
</script>

<style scoped>
div#whatHappening.card.bg-success.mb-25.border-0.rounded-0.welcome-box{
  height: 300px !important;
  padding: 40px !important;
}

div#topProduitReport.card.mb-25.border-0.rounded-0.bg-white.expected-earnings-box{
  padding: 40px !important;
  padding-bottom: 20px !important;
  height: 300px !important;
}
</style>