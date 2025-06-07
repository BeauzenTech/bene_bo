<template>
  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <form @submit.prevent="uploadLogo">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Nom *
              </label>
              <input
                type="text"
                class="form-control shadow-none rounded-0 text-black"
                placeholder="e.g. Poivre"
                v-model="ingredientData.name"
                @change="(event) => handleInput(event, 'name')"
                :class="{ 'is-valid': validTextField(ingredientData.name) }"
                required
              />
            </div>
          </div>

          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Type
              </label>
              <select class="form-select shadow-none fw-semibold rounded-0"
                      v-model="ingredientData.type"
                      @change="(event) => handleInput(event, 'type')"
                      :class="{ 'is-valid': validTextField(ingredientData.type) }"
              >
                <option value="Base offerte" selected>Base offerte</option>
                <option value="Charcuterie/viande" selected>Charcuterie/viande</option>
                <option value="Poisson" selected>Poisson</option>
                <option value="Produit laitier" selected>Produit laitier</option>
                <option value="Produit Huile" selected>Produit Huile</option>
              </select>
            </div>
          </div>

          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Prix *
              </label>
              <input
                  type="number"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. 0"
                  v-model="ingredientData.extra_cost_price"
                  @change="(event) => handleInput(event, 'prix')"
                  :class="{ 'is-valid': validTextField(ingredientData.extra_cost_price) }"
                  required
              />
            </div>
          </div>



          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Icone *
              </label>
              <input
                  type="file"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="**************"
                  @change="(event) => handleInput(event, 'file')"
                  :required="actionDetected === 'add'"
              />

            </div>
          </div>




          <div class="col-md-12">
            <div class="d-flex align-items-center justify-content-between" v-if="actionDetected">

              <LoaderComponent
                  v-if="isLoading"
              />
              <button v-else
                class="default-btn transition border-0 fw-medium text-white pt-10 pb-10 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-35 pe-md-35 rounded-1 fs-md-15 fs-lg-16 bg-success"
                type="submit"
                :disabled="!isFormValid"
                :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
              >
               {{ actionDetected === 'edit' ? 'Mettre à jour' : ' Ajouter une categorie'}}
              </button>
              <button
                type="button"
                @click="goBack"
                class="bg-transparent p-0 border-0 text-danger lh-1 fw-medium"
              >
                <i
                  class="flaticon-delete lh-1 me-1 position-relative top-2"
                ></i>
                <span class="position-relative">Annuler</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";


import {
  createIngredient,
  detailCategorie,
  detailIngredient,
  updateCategorie,
  updateIngredient,
  uploadFile
} from "@/service/api";

import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import { AxiosError } from 'axios';
import {ApiResponse, PaginatedCategorie} from "@/models/Apiresponse";
import {CategorieModel} from "@/models/categorie.model";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {IngredientModel} from "@/models/ingredient.model";


export default defineComponent({
  name: "VabeneAddCategorie",
  components: {
    LoaderComponent

  },
  props: {
    action: {
      type: String as PropType<string>,
      required: true
    },
    ingredientID: {
      type: String as PropType<string>,
      required: false
    },
  },
  data(){
    return{
      ingredientData: {
        name: '',
        type: '',
        extra_cost_price: 0,
        imageUrl: ''
      },
      isLoading: false,
      logoUpload: null,
      ingredientResponse: null as IngredientModel | null,
      actionDetected: null as string | null,
    }
  },
  methods: {
    clearData(){
      this.ingredientData = {
        name: '',
        type: '',
        extra_cost_price: 0,
        imageUrl: ''
      },
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    goBack() {
      this.$router.back()

    },
    async createNewIngredient() {

        this.isLoading = true;
        const payload = {
          "name": this.ingredientData.name,
          "type": this.ingredientData.type,
          "extra_cost_price": this.ingredientData.extra_cost_price,
          "imageUrl": this.ingredientData.imageUrl
        }
        try {
          const response = await createIngredient(payload);
          console.log(response);
          if (response.code === 201) {
            this.toast.success(response.message)
            this.clearData()
          } else {
            this.toast.error(response.message)
          }
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response && axiosError.response.data) {
            const message = (axiosError.response.data as any).message;
            this.toast.error(message);
          } else {
            this.toast.error("Une erreur est survenue");
          }
        } finally {
          this.isLoading = false;
        }


    },
    async updateIngredient(ingredientID) {
      this.isLoading = true;
      const payload = {
        "name": this.ingredientData.name,
        "imageUrl": this.ingredientData.imageUrl
      }
      try {
        const response = await updateIngredient(ingredientID, payload);
        console.log(response);
        if (response.code === 200) {
          this.toast.success(response.message)
          this.clearData()
        } else {
          this.toast.error(response.message)
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.data) {
          const message = (axiosError.response.data as any).message;
          this.toast.error(message);
        } else {
          this.toast.error("Une erreur est survenue");
        }
      } finally {
        this.isLoading = false;
      }
    },
    async fetchDetailIngredient(ingredientID) {
      this.isLoading = true;
      try {
        const response = await detailIngredient(ingredientID) as ApiResponse<IngredientModel>;
        console.log(response)
        if (response.code === 200) {
          if(response.data){
            this.ingredientResponse = response.data;
            this.ingredientData.name = this.ingredientResponse.name;
            this.ingredientData.type = this.ingredientResponse.type;
            this.ingredientData.extra_cost_price = this.ingredientResponse.extra_cost_price;
            this.ingredientData.imageUrl = this.ingredientResponse.imageUrl;

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
    async uploadLogo(){
      console.log(this.ingredientData);
      if(this.logoUpload && this.actionDetected === 'add'){
        this.isLoading = true;
        try {
          const response = await uploadFile(this.logoUpload);
          console.log(response);
          if (response.code === 200 || response.code === 201) {
            this.ingredientData.imageUrl = response.data
            await this.createNewIngredient()
          } else {
            this.toast.error(response.message)
          }

        } catch (error) {
          const axiosError = error as AxiosError;

          this.isLoading = false;
          if (axiosError.response && axiosError.response.data) {
            const message = (axiosError.response.data as any).message;
            this.toast.error(message);
          } else {
            this.toast.error("Une erreur est survenue");
          }
          console.error(axiosError);

        }
      }
      else{
        await this.updateIngredient(this.ingredientResponse?.id);
      }


    },

    handleInput(event, type) {
      console.log("Valeur en temps réel :", event.target.value);
      const valueText = event.target.value;
      switch (type){
        case 'name':
          this.ingredientData.name = valueText
          this.validTextField(valueText)
          break
        case 'type':
          this.ingredientData.type = valueText
          this.validTextField(valueText)
          break
        case 'imageUrl':
          this.ingredientData.imageUrl = valueText
          this.validTextField(valueText)
          break

        case 'prix':
          this.ingredientData.extra_cost_price = valueText
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


    validTextField(text){
      if (text){
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
    }

  },
  computed: {
    isFormValid() {
      return (
          this.validTextField(this.ingredientData.name) &&
          this.validTextField(this.ingredientData.type)
      );
    }
  },
  setup: () => {

    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.actionDetected = (this as any).$route.params.action
    if((this as any).$route.params.action == ActionCrud.EDIT){
      this.fetchDetailIngredient((this as any).$route.params.ingredientID)
    }
    // const action = (this as any).$route.params.action
  }

});
</script>

<style>



.vs--searchable .vs__dropdown-toggle, .vs__search, .vs__search:focus {
  padding: 4px 6px 6px  !important;
  font-size: 13px;
  color: rgba(132, 128, 128, 0.712);
}
.vs__search, .vs__search:focus, input.vs__search{
  font-size: 13px;
  color: rgba(132, 128, 128, 0.712);
}

</style>