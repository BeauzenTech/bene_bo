<template>
  <div class="card mb-25 border-0 rounded-0 bg-white stats-item">
    <div class="card-body p-15 p-sm-20 p-md-25 pt-lg-30 letter-spacing">
      <div class="row justify-content-between">
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
      <div class="info d-flex align-items-center justify-content-between mt-15">
        <span class="fs-13 d-block text-uppercase text-dark-emphasis fw-bold">
          TAUX MOYEN DE COMMANDES (CATEGORIE)
        </span>
        <div class="d-flex align-items-center">
          <h4 class="fw-black mb-0 me-10 lh-1">{{ tauxMoyenCommande }}</h4>
          <span class="fw-bold text-success text-badge d-inline-block">
            <i class="flaticon-up-arrow fs-11 lh-1 position-relative top-1"></i>
            %
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {CategorieModel} from "@/models/categorie.model";
import {listeCategorieActive, tauxCommandeCategorie, topProductReportSell} from "@/service/api";
import {ApiResponse, PaginatedCategorie} from "@/models/Apiresponse";
import {TopProductSellModel} from "@/models/TopProductSell.model";
import {useToast} from "vue-toastification";
import {UserGeneralKey, UserRole} from "@/models/user.generalkey";

export default defineComponent({
  name: "VabeneTauxOrderCategorieDate",

  data: function () {
    return {
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
      tauxMoyenCommande: 0 as number
    };
  },
  methods: {
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
          if(this.categorieSelected){
            this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, this.startDate, this.endDate);
          }
          break
        case 'endDate':
          this.endDate = valueText
            if(this.categorieSelected){
              this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, this.startDate, this.endDate);
            }
          break


      }
    },
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
            this.startDate = this.getSameDayLastMonth()
            this.endDate = this.getTodayDate()
            const userRole = localStorage.getItem(UserGeneralKey.USER_ROLE);
            if(userRole === UserRole.RESTAURANT){
              const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID);
              await this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, this.startDate, this.endDate, (restaurantID as string));
            }
            else{
              await this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, this.startDate, this.endDate);
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
    async fetchTauxCommandeMoyenByCategorie(categoryID: string, startDate?: string, endDate?: string, restaurantId?: string) {
      try {
        const response = await tauxCommandeCategorie(categoryID, startDate, endDate, restaurantId) as ApiResponse<number>;
        console.log(response)
        if (response.code === 200) {
          this.tauxMoyenCommande = response.data as number;
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
    this.fetchCategories(1)
  },
  watch:{
    categorieSelected(newVal, oldVal) {
      if (typeof newVal === 'string' && newVal !== oldVal) {
        console.log("Nouvelle catégorie sélectionnée :", newVal);
        // this.expected = []
        // this.amountTotal = 0
        this.categorieSelected = this.originalCategories.find(c => c.id === newVal) ?? null;
        if(this.categorieSelected){
           this.fetchTauxCommandeMoyenByCategorie(this.categorieSelected.id, this.startDate, this.endDate);
        }
      }
    }
  }
});
</script>