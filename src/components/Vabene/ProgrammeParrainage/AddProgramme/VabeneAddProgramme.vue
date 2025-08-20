<template>
  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <form @submit.prevent="uploadLogo" v-if="userRole === UserRole.FRANCHISE">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Nom *
              </label>
              <input
                type="text"
                class="form-control shadow-none rounded-0 text-black"
                placeholder="e.g. Pizza"
                v-model="categorieData.name"
                @change="(event) => handleInput(event, 'name')"
                :class="{ 'is-valid': validTextField(categorieData.name) }"

              />
            </div>
          </div>

          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Description
              </label>
              <div class="mb-0">
                <QuillEditor
                  theme="snow"
                  content-type="html"
                  placeholder="Donnez une description a la categorie"
                  toolbar="full"
                  v-model:content="categorieData.description"

                />
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Nombre de points *
              </label>
              <input
                  type="number"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. Pizza"
                  v-model="categorieData.gain"
                  @change="(event) => handleInput(event, 'gain')"
                  :class="{ 'is-valid': validNumberField(categorieData.gain) }"

              />
            </div>
          </div>

<!--          <div class="col-md-12">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                Icone *-->
<!--              </label>-->
<!--              <img v-if="categorieData.icone"-->
<!--                  :src="categorieData.icone"-->
<!--                  class="rounded-circle me-8 mb-4"-->
<!--                  width="45"-->
<!--                  height="45"-->
<!--                  alt="categorie"-->
<!--              />-->
<!--              <input-->
<!--                  type="file"-->
<!--                  class="form-control shadow-none rounded-0 text-black"-->
<!--                  placeholder="**************"-->
<!--                  @change="(event) => handleInput(event, 'file')"-->
<!--                  :required="actionDetected === 'add'"-->
<!--              />-->

<!--            </div>-->
<!--          </div>-->




          <div class="col-md-12">
            <div class="d-flex align-items-center justify-content-between" v-if="actionDetected">

              <LoaderComponent
                  v-if="isLoading"
              />
              <button v-else
                class="default-btn transition border-0 fw-medium text-white pt-10 pb-10 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-35 pe-md-35 rounded-1 fs-md-15 fs-lg-16 bg-success"
                type="submit"
                :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
              >
               {{ actionDetected === 'edit' ? 'Mettre à jour' : ' Ajouter une catégorie'}}
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
  createCategorie,
  detailCategorie,
  updateCategorie,
  uploadFile,
  deleteFileUpload,
  listeRestaurantCategorie,
  listeCategorie,
  listeCategorieActive,
  addRestaurantCategorie,
  disableCoupon,
  detailProgramme,
  updateProgramme
} from "@/service/api";

import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import { AxiosError } from 'axios';
import {ApiResponse, PaginatedCategorie, PaginatedRestaurantCategory} from "@/models/Apiresponse";
import {CategorieModel} from "@/models/categorie.model";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {UserGeneralKey, UserRole} from "@/models/user.generalkey";
import {RestaurantCategoryModel} from "@/models/restaurantCategory.model";
import {ProgrammeModel} from "@/models/programme.model";


export default defineComponent({
  name: "VabeneAddProgramme",
  components: {
    LoaderComponent

  },
  props: {
    action: {
      type: String as PropType<string>,
      required: true
    },
    categorieID: {
      type: String as PropType<string>,
      required: false
    },
  },
  data(){
    return{
      userRole: localStorage.getItem(UserGeneralKey.USER_ROLE),
      originalRestaurantCategorie: [] as RestaurantCategoryModel[],
      originalCategories: [] as CategorieModel[],
      resteCategorieModel: [] as CategorieModel[],
      categorieSelected: null,
      categorieResponse: null as ProgrammeModel | null,
      categorieData: {
        name: '',
        description: '',
        gain: ''
      },
      isLoading: false,
      logoUpload: null,
      actionDetected: ''
    }
  },
  methods: {

    filtrerElementsExclus(a: CategorieModel[], b: RestaurantCategoryModel[]): CategorieModel[] {
      const resultat: CategorieModel[] = [];

      for (let i = 0; i < a.length; i++) {
        let existe = false;

        for (let j = 0; j < b.length; j++) {
          console.log(a[i].id === b[j].category.id)
          if (a[i].id === b[j].category.id) {
            existe = true;
            break;
          }
        }

        if (!existe) {
          resultat.push(a[i]);
        }
      }

      return resultat;
    },
    async fetchCategoriesRestaurant(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeRestaurantCategorie(page, "0") as ApiResponse<PaginatedRestaurantCategory>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            this.originalRestaurantCategorie = response.data.items;
            console.log( this.originalRestaurantCategorie)
            this.resteCategorieModel = this.filtrerElementsExclus(this.originalCategories, this.originalRestaurantCategorie)
          }

        }
      } catch (error) {

        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchCategories(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeCategorieActive(page, "0") as ApiResponse<PaginatedCategorie>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            this.originalCategories = response.data.items;
            console.log(this.originalCategories)
            this.resteCategorieModel = this.filtrerElementsExclus(this.originalCategories, this.originalRestaurantCategorie)
          }

        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    clearData(){
      this.categorieData = {
        name: '',
        description: '',
        gain: ''
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    goBack() {
      this.$router.back()

    },

    async addRestaurantCategorie() {
     if(this.categorieSelected){
       this.isLoading = true;
       try {
         const response = await addRestaurantCategorie(this.categorieSelected);
         console.log(response);
         if (response.code === 201 || response.code === 200 ) {
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
     }



    },
    async createNewCategorie() {

        this.isLoading = true;
        const payload = {
          "name": this.categorieData.name,
          "description": this.categorieData.description,
          "gain": this.categorieData.gain
        }
        try {
          const response = await createCategorie(payload);
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
    async updateCategorie(categorieID) {
      this.isLoading = true;
      const payload = {
        "name": this.categorieData.name,
        "description": this.categorieData.description,
        "gain": String(this.categorieData.gain)
      }
      try {
        const response = await updateProgramme(categorieID, payload);
        console.log(response);
        if (response.code === 200 || response.code === 201) {
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
    async fetchDetailCategorie(categorieID) {
      this.isLoading = true;
      try {
        const response = await detailProgramme(categorieID) as ApiResponse<ProgrammeModel>;
        console.log(response)
        if (response.code === 200) {
          if(response.data){
            this.categorieResponse = response.data;
            this.categorieData.name = this.categorieResponse.name;
            this.categorieData.description = this.categorieResponse.description;
            this.categorieData.gain = this.categorieResponse.gain;
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
      console.log(this.categorieData);
      if(this.logoUpload && this.actionDetected === 'add'){
        this.isLoading = true;
        try {
          const response = await uploadFile(this.logoUpload);
          console.log(response);
          if (response.code === 200 || response.code === 201) {
            // this.categorieData.icone = response.data
            await this.createNewCategorie()
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
        await this.updateCategorie(this.categorieResponse?.id);
      }


    },

    handleInput(event, type) {
      console.log("Valeur en temps réel :", event.target.value);
      const valueText = event.target.value;
      switch (type){
        case 'name':
          this.categorieData.name = valueText
          this.validTextField(valueText)
          break
        case 'description':
          this.categorieData.description = valueText
          this.validTextField(valueText)
          break
        case 'gain':
          this.categorieData.gain = valueText
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
    validNumberField(value: any): boolean {
      return typeof value === 'number' && isFinite(value) && value > 0;
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
    UserRole() {
      return UserRole
    },
    isFormValid() {
      return (
          this.validTextField(this.categorieData.name) &&
          this.validTextField(this.categorieData.description) &&
          this.validNumberField(this.categorieData.gain)
      );
    }
  },
  setup: () => {

    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.actionDetected = (this as any).$route.params.action
   if(this.userRole === UserRole.FRANCHISE){
      if((this as any).$route.params.action == ActionCrud.EDIT){
        this.fetchDetailCategorie((this as any).$route.params.categorieID)
      }
    }
    else{
      // this.fetchCategories()
      // this.fetchCategoriesRestaurant()
      // console.log('reste categorie', this.resteCategorieModel)
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