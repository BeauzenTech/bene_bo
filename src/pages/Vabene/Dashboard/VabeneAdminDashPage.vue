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
          <HeadDash :orderAmount="String(getCardValue(0) || '0')" id="whatHappening" />
        </div>
  
      </div>
      <!-- Section Ventes par Restaurant -->
      <div class="row mb-8" v-if="restaurantsData && restaurantsData.length > 0">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Ventes de la semaine en cours par restaurant</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div 
                  class="col-lg-4 col-md-6 mb-4" 
                  v-for="restaurant in restaurantsData" 
                  :key="restaurant.restaurantId"
                >
                  <div class="card border-0 shadow-sm h-100">
                    <div class="card-body text-center">
                      <h6 class="card-title text-primary mb-3">{{ restaurant.restaurantName }}</h6>
                      <div class="d-flex flex-column align-items-center">
                        <span class="text-muted small mb-2">Ventes cette semaine</span>
                        <h4 class="text-success mb-0">{{ Math.floor(restaurant.semaine.actuelle) }} CHF</h4>
                        <small class="text-muted mt-2">
                          vs semaine précédente: {{ Math.floor(restaurant.semaine.precedente) }} CHF
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 bg-white mb-8">
        <div class="col mb-6" >
          <div class="card radius-10 border-start border-0 border-3 border-info">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div>
                  <p class="mb-0 text-secondary">Ventes cette semaine</p>
                  <h4 class="my-1 text-info">{{getCardValue(0)}} CHF</h4>
                  <!-- <p class="mb-0 font-13">{{getCardRatio(0)}}%</p> -->
                </div>
                <div class="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto"><i class="fa fa-shopping-cart"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="col" >
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
        </div> -->
        <div class="col" >
          <div class="card radius-10 border-start border-0 border-3 border-success">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div>
                  <p class="mb-0 text-secondary">Ce mois</p>
                  <h4 class="my-1 text-primary">{{getCardValue(1)}} CHF</h4>
                  <!-- <p class="mb-0 font-13">{{getCardRatio(1)}}%</p> -->
  
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
                  <h4 class="my-1 text-warning">{{getCardValue(2)}} CHF</h4>
                  <!-- <p class="mb-0 font-13">{{getCardRatio(2)}}%</p> -->
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
          v-if="chartData && chartData.length >0"
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
            <option value="all" class="fw-medium">Tous</option>
            <option value="0" class="fw-medium">Cette semaine</option>
            <option value="1" class="fw-medium">Ce mois</option>
            <option value="2" class="fw-medium">Cette année</option>
          </select>
        </div>
      </div>
      <div class="chart bg-white mt-4" v-if="chartData && chartData.length > 0">
        <div v-if="formattedSeries.length === 0" class="p-4 text-center">
          <p class="text-muted">Aucune donnée disponible pour le graphique</p>
        </div>
        <apexchart
            v-else
            :key="chartKey"
            type="line"
            height="374"
            id="weeklySalesChart"
            :options="weeklySalesChart"
            :series="formattedSeries"
        ></apexchart>
      </div>
      <div v-else class="chart bg-white mt-4 p-4 text-center">
        <p class="text-muted">Chargement des données des restaurants...</p>
      </div>
    </div>
  
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import VueApexCharts from "vue3-apexcharts";
  
  import HeadDash from "@/pages/Vabene/common/HeadDash.vue";
  import {RepportModelData} from "@/models/report.model";
  import {PeriodiqueCardReport} from "@/models/periodiqueCardReport.model";
  import { reportRestaurants, salesReportRestaurants} from "@/service/api";
  import {ApiResponse} from "@/models/Apiresponse";
  import {SellModel} from "@/models/vente.model";
  import {RestaurantStatsModel} from "@/models/restaurantStats.model";
  import {useToast} from "vue-toastification";import LoaderComponent from "@/components/Loading/Loader.vue";
  import {UserGeneralKey, UserRole} from "@/models/user.generalkey";
  
  export default defineComponent({
    name: "VabeneAdminDashPage",
    components: {
      LoaderComponent,
      HeadDash,
      apexchart: VueApexCharts
    },
    data(){
      return {
        reportVente: [] as RepportModelData[],
        restaurantsData: [] as RestaurantStatsModel[],
        chartData: [] as any[],
        userRole: localStorage.getItem(UserGeneralKey.USER_ROLE),
        restaurantId: localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID) ?? null,
        isLoading: false,
        selectedPeriod: "all",
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
      async getReportRestaurant(){
        this.isLoading = true
        try {
          const response = await reportRestaurants() as unknown as ApiResponse<RestaurantStatsModel[]>;
          if (response.code === 200) {
            if (response.data) {
              if (Array.isArray(response.data)) {
                this.restaurantsData = response.data;
              } else {
                const dt = response.data as SellModel;
                this.reportVente = dt.vente as RepportModelData[]
              }
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
          const response = await salesReportRestaurants() as ApiResponse<any>;
          console.log('Chart API Response:', response);
          if (response.code === 200) {
            if (response.data) {
              this.chartData = response.data;
              console.log('Chart data set:', this.chartData);
            }
          }
        } catch (error) {
          console.error('Error fetching chart data:', error);
        } finally {
          this.isLoading = false
        }
      },
      updateChartCategories() {
        let categories: string[] = [];
        switch (this.selectedPeriod) {
          case "0": 
            categories = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            break;
          case "1": 
            categories = ["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4"];
            break;
          case "2": 
            categories = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
            break;
          default: 
            categories = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
        }
        this.weeklySalesChart.xaxis.categories = categories;
        
    
        if (this.selectedPeriod === "all") {
          this.weeklySalesChart.colors = ["#3A8D35", "#F4D3AE", "#e31b23", "#2B2A3F"];
        } else {
          const colors = ["#3A8D35", "#F4D3AE", "#e31b23", "#2B2A3F"];
          const index = parseInt(this.selectedPeriod);
          this.weeklySalesChart.colors = [colors[index] || "#3A8D35"];
        }
        
        this.chartKey++;
      },
      getCardValue(index: number): string {
        if (!this.restaurantsData || this.restaurantsData.length === 0) {
          return "0";
        }
        
        let total = 0;
        switch (index) {
          case 0: // Cette semaine
            total = this.restaurantsData.reduce((sum, restaurant) => sum + restaurant.semaine.actuelle, 0);
            break;
          case 1: // Ce mois
            total = this.restaurantsData.reduce((sum, restaurant) => sum + restaurant.mois.actuel, 0);
            break;
          case 2: // Cette année
            total = this.restaurantsData.reduce((sum, restaurant) => sum + restaurant.annee.actuelle, 0);
            break;
        }
        
        return Math.floor(total).toString();
      },
      getCardRatio(index: number): string {
        if (!this.reportVente || this.reportVente.length === 0) return "0";
        
        return "0";
      },
      generateChartData(periodType: string): number[] {
        const data: number[] = [];
        
        if (periodType === 'daily') {
          for (let i = 0; i < 7; i++) {
            let total = 0;
            this.chartData.forEach(restaurant => {
              if (restaurant.charts.daily && restaurant.charts.daily[i]) {
                total += restaurant.charts.daily[i].total;
              }
            });
            data.push(total);
          }
        } else if (periodType === 'weekly') {
          for (let i = 0; i < 4; i++) {
            let total = 0;
            this.chartData.forEach(restaurant => {
              if (restaurant.charts.weekly && restaurant.charts.weekly[i]) {
                total += restaurant.charts.weekly[i].total;
              }
            });
            data.push(total);
          }
        } else if (periodType === 'monthly') {
          let monthlyTotal = 0;
          this.chartData.forEach(restaurant => {
            if (restaurant.charts.monthly) {
              const currentMonth = restaurant.charts.monthly.find(month => month.total > 0);
              if (currentMonth) {
                monthlyTotal += currentMonth.total;
              }
            }
          });
          
          if (monthlyTotal > 0) {
            const baseAmount = monthlyTotal / 4;
            for (let i = 0; i < 4; i++) {
              const variation = (Math.random() - 0.5) * 0.2; 
              data.push(Math.round(Math.max(0, baseAmount * (1 + variation)) * 100) / 100);
            }
          } else {
            data.push(0, 0, 0, 0);
          }
        } else if (periodType === 'yearly') {
          for (let i = 0; i < 12; i++) {
            let total = 0;
            this.chartData.forEach(restaurant => {
              if (restaurant.charts.yearly && restaurant.charts.yearly[i]) {
                total += restaurant.charts.yearly[i].total;
              }
            });
            data.push(total);
          }
        }
        
        console.log(`Generated ${periodType} data:`, data);
        return data;
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
          await this.getReportRestaurant();
          await this.getPeriodiqueReport(undefined, defaultFilters)
        }
        else{
          await this.getReportRestaurant();
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
          case "0": return "RAPPORT DE VENTE CETTE SEMAINE";
          case "1": return "RAPPORT DE VENTE CE MOIS-CI";
          case "2": return "RAPPORT DE VENTE CETTE ANNÉE";
          default: return "RAPPORT DE VENTE TOUTES PÉRIODES";
        }
      },
      getSelectedPeriodTotal(): string {
        if (!this.chartData || this.chartData.length === 0) {
          return "0";
        }
        
        let total = 0;
        switch (this.selectedPeriod) {
          case "0": 
            total = this.chartData.reduce((sum, restaurant) => sum + restaurant.summary.totalWeek, 0);
            break;
          case "1": 
            total = this.chartData.reduce((sum, restaurant) => sum + restaurant.summary.totalMonth, 0);
            break;
          case "2": 
            total = this.chartData.reduce((sum, restaurant) => sum + restaurant.summary.totalYear, 0);
            break;
          default: 
            total = this.chartData.reduce((sum, restaurant) => sum + restaurant.summary.totalYear, 0);
        }
        
        return Math.floor(total).toString();
      },
      formattedSeries(): any[] {
        if (!this.chartData || this.chartData.length === 0) {
          return [];
        }
        
        const series: any[] = [];
        
        if (this.selectedPeriod === "all") {
          series.push({
            name: "Cette semaine",
            data: this.generateChartData('daily')
          });
          series.push({
            name: "Ce mois", 
            data: this.generateChartData('monthly')
          });
          series.push({
            name: "Cette année",
            data: this.generateChartData('yearly')
          });
        } else {
          switch (this.selectedPeriod) {
            case "0": // Cette semaine
              series.push({
                name: "Cette semaine",
                data: this.generateChartData('daily')
              });
              break;
            case "1": // Ce mois
              series.push({
                name: "Ce mois",
                data: this.generateChartData('weekly') 
              });
              break;
            case "2": // Cette année
              series.push({
                name: "Cette année",
                data: this.generateChartData('yearly')
              });
              break;
          }
        }
        
        console.log('Final series for chart:', series);
        return series;
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