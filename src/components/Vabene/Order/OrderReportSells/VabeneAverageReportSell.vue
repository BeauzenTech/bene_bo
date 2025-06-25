<template>
  <div class="card mb-25 border-0 rounded-0 bg-white daily-sales-box">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <div class="row">
        <div class="col-md-6">
          <span
              class="d-block mb-6 fs-13 text-uppercase fs-13 d-block text-uppercase text-dark-emphasis fw-bold"
          >
       QUANTITÉ MOYENNE D'UN <br>
        PRODUIT PAR COMMANDE
      </span>
          <h4 class="fw-black mb-12 lh-1">{{round(average_amount)}} CHF</h4>
          <span class="fw-bold text-success text-badge d-inline-block">
        {{round(amountTotal)}} commande(s)
        <i class="flaticon-up-arrow fs-11 lh-1 position-relative top-1"></i>
      </span>
        </div>
        <div class="col-md-6">
          <div class="form-group   position-relative transition">
            <v-select
                v-model="productSelected"
                :options="originalProducts"
                label="name"
                :reduce="product => product.id"
                placeholder="Produit"
            />
          </div>
        </div>
      </div>
      <div class="chart">
        <apexchart
            type="bar"
            height="150"
            width="220"
            id="averageDailySalesChart"
            :options="averageDailySalesChart"
            :series="expected"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {TopProductSellModel} from "@/models/TopProductSell.model";
import {CategorieModel} from "@/models/categorie.model";
import {averageReportSell, listeCategorieActive, listeProducts, topProductReportSell} from "@/service/api";
import {ApiResponse, PaginatedCategorie, PaginatedProduct} from "@/models/Apiresponse";
import {useToast} from "vue-toastification";
import {AverageReportModel} from "@/models/averageReport.model";
import {ProductModel} from "@/models/product.model";
import {round} from "@popperjs/core/lib/utils/math";

export default defineComponent({
  name: "VabeneAverageReportSell",
  props: {
    restaurantId: {
      type: String as PropType<string>,
      required: true
    },
  },
  data: function () {
    return {
      topAverageResponse: [] as AverageReportModel[],
      originalProducts: [] as ProductModel[], // Stockage des utilisateurs originaux
      productSelected: null as ProductModel | null,
      amountTotal: 0,
      average_amount: 0,
      display: 0,
      puttingAmount: 0,
      newRestoId: null as string | null,
      expected: [
        { name: "", data: [0, 5, 10, 15, 20] },

      ] as { name: string; data: number[] }[],
      colorsIndexed: ["#002D01", "#F4D3AE", "#B83C37"],
      expectedColors: [] as string[], // Couleurs liées à chaque valeur dans expected
      sales: [
        {
          name: "Sales",
          data: [],
        },
      ],
      averageDailySalesChart: {
        chart: {
          type: "bar",
          height: 150,
          width: 220,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
            columnWidth: "35%",
            borderRadiusApplication: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: [] as string[],
        stroke: {
          show: false,
        },
        xaxis: {
          categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          labels: {
            show: false,
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
        },
        yaxis: {
          show: false,
          tickAmount: 8,
          labels: {
            show: true,
            style: {
              fontFamily: "Red Hat Display, sans-serif",
              colors: ["#9C9AB6"],
              fontSize: "14px",
              fontWeight: 500,
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          style: {
            fontSize: "14px",
            fontFamily: "Red Hat Display, sans-serif",
          },
          y: {
            formatter: function (val: string) {
              return val + "%";
            },
          },
        },
        grid: {
          show: false,
          strokeDashArray: 5,
          borderColor: "#f0f0f0",
        },
      },
    };
  },
  methods: {
    round,

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
            this.originalProducts = response.data.items;
            this.productSelected = this.originalProducts[0]
            await this.fetchAverageProductSell(this.productSelected.id as string)
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      }
    },
    async fetchAverageProductSell(productID, restaurantID?: string) {
      this.topAverageResponse = []
      this.expected = [
        { name: "", data: [0, 5, 10, 15, 20] },
      ] as { name: string; data: number[] }[],
      this.averageDailySalesChart.colors = []
      this.display = 0
      this.amountTotal = 0
      this.average_amount = 0
      this.puttingAmount = 0
      try {
        const response = await averageReportSell(productID, restaurantID) as ApiResponse<AverageReportModel[]>;
        console.log(response)
        if (response.code === 200 || response.code === 201) {
          this.topAverageResponse = response.data as AverageReportModel[];
          if(this.topAverageResponse.length > 0){
            for (let index = 0; index < this.topAverageResponse.length; index++) {
              this.display += Number(this.topAverageResponse[index].average_quantity)
              this.puttingAmount += Number(this.topAverageResponse[index].total_amount)
              const color = this.colorsIndexed[index % this.colorsIndexed.length];
                // Met à jour le `y`
              console.log(this.expected[0])
                this.expected[0].name = this.topAverageResponse[0].product_name ?? '';
                // Ajoute une valeur dans le `group`
                this.expected[0].data.push(Number(this.topAverageResponse[index].average_quantity)); //

              this.averageDailySalesChart.colors.push(color);
            }
            this.amountTotal = Number(this.display.toFixed(2)); // string avec 2 décimales garanties
            this.average_amount = Number(this.puttingAmount.toFixed(2));
            console.log('average', this.expected)
          }

        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors de la recuperation de average ");
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
  },
  watch:{
    restaurantId(newVal, oldVal){
      if (typeof newVal === 'string' && newVal !== oldVal) {
        console.log("Nouvelle option restaurant ID sélectionnée :", newVal);
        this.newRestoId = newVal;
        if(newVal !== 'all'){
          if(this.productSelected){
            this.fetchAverageProductSell(this.productSelected.id, newVal);
          }
        }
        else{
          if(this.productSelected){
            this.fetchAverageProductSell(this.productSelected.id);
          }
        }

      }
    },
    productSelected(newVal, oldVal) {
      if (typeof newVal === 'string' && newVal !== oldVal) {
        console.log("Nouvelle catégorie sélectionnée :", newVal);
        this.expected = [
          { name: "", data: [0, 5, 10, 15, 20] },
        ] as { name: string; data: number[] }[]
        this.amountTotal = 0
        this.productSelected = this.originalProducts.find(c => c.id === newVal) ?? null;
        if(this.productSelected  && this.newRestoId !== 'all'){
          this.fetchAverageProductSell(this.productSelected.id as string, this.newRestoId as string);
        }
        else{
          if(this.productSelected){
            this.fetchAverageProductSell(this.productSelected.id);
          }
        }
      }
    }
  }
});
</script>