<template>
  <div class="card mb-25 border-0 rounded-0 bg-white expected-earnings-box">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <span
          class="d-block mb-6 fs-13 text-uppercase fs-13  text-uppercase text-dark-emphasis fw-bold"
      >
        TOP PRODUITS
      </span>
      <h4 class="fw-black mb-12 lh-1">{{amountTotal}} CHF</h4>
      <table>
        <tbody>
        <tr v-for="(item, index) in topSellResponse" :key="index">
          <td class="text-muted fw-medium d-flex align-items-center gap-2">
        <span
            class="rounded-circle d-inline-block"
            :style="{
            width: '10px',
            height: '10px',
            backgroundColor: expectedEraningsChart.colors[index]
          }"
        ></span>
            {{ item.name }} -
            <span class="text-black fw-bold ms-1">{{ Number(item.total_sales).toFixed(2) }} CHF</span>
          </td>
        </tr>
        </tbody>
      </table>

      <div id="expectedEraningsChart" class="chart">
        <apexchart
            type="donut"
            height="150"
            :options="expectedEraningsChart"
            :series="expected"
        ></apexchart>
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
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {
  deleteFileUpload,
  deleteProductTemporary, listeCategorieActive,
  listeOrder, listeProducts,
  toggleActivationFeatureProduct,
  toggleActivationProduct, topProductReportSell
} from "@/service/api";
import {ApiResponse, PaginatedCategorie, PaginatedOrder, PaginatedProduct} from "@/models/Apiresponse";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {AxiosError} from "axios";
import {Commons} from "@/utils/commons.utils";
import {UserGeneralKey} from "@/models/user.generalkey";
import {CategorieModel} from "@/models/categorie.model";
import {useToast} from "vue-toastification";
import {TopProductSellModel} from "@/models/TopProductSell.model";

export default defineComponent({
  name: "VabeneTopProduitReportSell",
  props: {
    restaurantId: {
      type: String as PropType<string>,
      required: true
    },
  },
  data: function () {
    return {
      topSellResponse: [] as TopProductSellModel[],
      originalCategories: [] as CategorieModel[], // Stockage des utilisateurs originaux
      categorieSelected: null as CategorieModel | null,
      colorsIndexed: ["#002D01", "#F4D3AE", "#B83C37"],
      expectedColors: [] as string[], // Couleurs liées à chaque valeur dans expected
      newRestoId: null as string | null,
      amountTotal: 0,
      expected: [] as number[],
      expectedEraningsChart: {
        chart: {
          height: 150,
          type: "donut",
        },
        dataLabels: {
          enabled: false,
        },
        colors: [] as string[],
        legend: {
          show: false,
          fontWeight: 500,
          fontSize: "14px",
          fontFamily: "Red Hat Display, sans-serif",
          labels: {
            colors: "#9C9AB6",
          },
          markers: {
            offsetX: -2,
            offsetY: 1,
          },
        },
        stroke: {
          width: 0,
        },
        tooltip: {
          enabled: false,
          style: {
            fontSize: "14px",
            fontFamily: "Red Hat Display, sans-serif",
          },
        },
      },
    };
  },
  methods: {

    getCategorieByName(
        liste: CategorieModel[],
        name: string
    ): CategorieModel | undefined{
      console.log(liste)
      console.log(name)
      return liste.find(categorie => categorie.name === name);
    },
    async fetchCategories(page = 1) {
      try {
        const response = await listeCategorieActive(page, "0") as ApiResponse<PaginatedCategorie>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            this.originalCategories = response.data.items;
            this.categorieSelected = this.originalCategories[0];
           await this.fetchTopProductSell(this.categorieSelected.id);
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      }
    },
    async fetchTopProductSell(categoryID: string, restaurantID?: string) {
      try {
        const response = await topProductReportSell(categoryID, restaurantID) as ApiResponse<TopProductSellModel[]>;
        console.log(response)
        if (response.code === 200) {
            this.topSellResponse = response.data as TopProductSellModel[];
            if(this.topSellResponse.length > 0){
              for (let index = 0; index < this.topSellResponse.length; index++) {
                // On arrondit à 2 décimales avant de traiter
                const rawValue = Number(this.topSellResponse[index].total_sales);
                const roundedValue = Number(rawValue.toFixed(2));

                this.expected.push(roundedValue);
                this.amountTotal += roundedValue;

                const color = this.colorsIndexed[index % this.colorsIndexed.length];
                this.expectedEraningsChart.colors.push(color);
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

  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchCategories(1)
  },
  watch:{
    restaurantId(newVal, oldVal){
      if (typeof newVal === 'string' && newVal !== oldVal) {
        console.log("Nouvelle option restaurant ID sélectionnée :", newVal);
        this.newRestoId = newVal;
        if(newVal !== 'all'){
          if(this.categorieSelected){
            this.fetchTopProductSell(this.categorieSelected.id, newVal);
          }
        }
        else{
          if(this.categorieSelected){
            this.fetchTopProductSell(this.categorieSelected.id,);
          }
        }

      }
    },
    categorieSelected(newVal, oldVal) {
      if (typeof newVal === 'string' && newVal !== oldVal) {
        console.log("Nouvelle catégorie sélectionnée :", newVal);
        this.expected = []
        this.amountTotal = 0
        this.categorieSelected = this.originalCategories.find(c => c.id === newVal) ?? null;
        if(this.categorieSelected && this.newRestoId !== 'all'){
          this.fetchTopProductSell(this.categorieSelected.id as string, this.newRestoId as string);
        }
        else{
          if(this.categorieSelected){
            this.fetchTopProductSell(this.categorieSelected.id);
          }
        }
      }
    }
  }

});
</script>