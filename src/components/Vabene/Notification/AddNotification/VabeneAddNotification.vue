<template>
  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <form @submit.prevent="createNewCategorie">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Nom *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. Nouveauté"
                  v-model="categorieData.title"
                  @change="(event) => handleInput(event, 'title')"
                  :class="{ 'is-valid': validTextField(categorieData.title) }"
                  required
                  :disabled="actionDetected == ActionCrud.EDIT"
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
                    placeholder="Donnez une description"
                    toolbar="full"
                    v-model:content="categorieData.message"
                    :disabled="actionDetected == ActionCrud.EDIT"
                />
              </div>
            </div>
          </div>

          <div class="col-md-12" v-if="actionDetected == ActionCrud.ADD">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Type d'envoi *
              </label>
              <v-select
                  v-model="sendingType"
                  :options="typeSending"
                  label=""
                  :reduce="type => type"
                  placeholder="Selectionner le type"
              />

            </div>

          </div>

          <div class="col-md-12" v-if="sendingType == 'Individuel'">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Destinataires *
              </label>
              <v-select
                  v-model="userSelected"
                  :options="originalUsers"
                  label="email"
                  :reduce="user => user.user.deviceToken"
                  placeholder="Selectionner un utilisateur"
              />

              <button
                  type="button"

                  class="bg-transparent p-0 border-0 mt-2 text-warning lh-1 fw-medium"
              >
                <i
                    class="flaticon-users-group lh-1 me-1 position-relative top-2"
                ></i>
                <span class="position-relative">{{categorieData.destination.length}} ajouté(s)</span>
              </button>
            </div>

          </div  >






          <div class="col-md-12" v-if="actionDetected == ActionCrud.ADD">
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
                Envoyer
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
  createCampagne, detailCampagne, listeUser, createNotification, listeCustomers
} from "@/service/api";

import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import { AxiosError } from 'axios';
import {ApiResponse, PaginatedCategorie, PaginatedCustomer, PaginatedUsers} from "@/models/Apiresponse";
import {CategorieModel} from "@/models/categorie.model";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {CampagneModel} from "@/models/campagne.model";
import {UserModel} from "@/models/user.model";
import {OrderTypeModel} from "@/models/orderType.model";
import {CustomerModel} from "@/models/customer.model";
import {UserGeneralKey} from "@/models/user.generalkey";


export default defineComponent({
  name: "VabeneAddCampagne",
  components: {
    LoaderComponent

  },
  props: {
    action: {
      type: String as PropType<string>,
      required: true
    },
    notificationID: {
      type: String as PropType<string>,
      required: false
    },
  },
  data(){
    return{
      categorieData: {
        name: '',
        description: '',
        icone: '',
        title: '',
        message: '',
        destination: [] as string[]
      },
      isLoading: false,
      logoUpload: null,
      categorieResponse: null as CampagneModel | null,
      actionDetected: null as string | null,
      originalUsers: [] as CustomerModel[], // Stockage des utilisateurs originaux
      userSelected: null,
      sendingType: '' as string,
      typeSending: ["Individuel", "Groupé"] as string[],
      restaurantId: null as string | null,
    }
  },
  methods: {
    stripHtmlTags(input: string): string {
      const div = document.createElement('div');
      div.innerHTML = input;
      return div.textContent || div.innerText || '';
    },
    clearData(){
      this.categorieData = {
        name: '',
        description: '',
        icone: '',
        title: '',
        message: '',
        destination: [] as string[]

      }

      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
    },
    goBack() {
      this.$router.back()

    },
    async createNewCategorie() {
      const message = this.stripHtmlTags(this.categorieData.message)

      this.isLoading = true;
      const payload = {
        "title": this.categorieData.title,
        "description": message,
        "destinationDevice": this.categorieData.destination,
        "data": []
      }
      try {
        const response = await createNotification(payload);
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
    async fetchUsers(page = 1) {
      this.isLoading = true;
      try {
        const idResto = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID);
        if(idResto){
          this.restaurantId = idResto;
        }
        const response = await listeCustomers(page, '1', idResto ?? undefined) as ApiResponse<PaginatedCustomer>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            const data = response.data.items;
            this.originalUsers = data.filter(item => item.user != null && item.user.deviceToken != null);
            console.log("filter data: ", this.originalUsers);
          }

        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des utilisateurs");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async updateCategorie(categorieID) {
      this.isLoading = true;
      const payload = {
        "name": this.categorieData.name,
        "description": this.categorieData.description,
        "icone": this.categorieData.icone
      }
      try {
        const response = await updateCategorie(categorieID, payload);
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
    async fetchDetailCategorie(categorieID) {
      this.isLoading = true;
      try {
        const response = await detailCampagne(categorieID) as ApiResponse<CampagneModel>;
        console.log(response)
        if (response.code === 200) {
          if(response.data){
            this.categorieResponse = response.data;
            this.categorieData.title = this.categorieResponse.title;
            this.categorieData.message = this.categorieResponse.message;
            this.categorieData.destination = this.categorieResponse.destination;
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
            this.categorieData.icone = response.data
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
        case 'title':
          this.categorieData.title = valueText
          this.validTextField(valueText)
          break
        case 'message':
          this.categorieData.message = valueText
          this.validTextField(valueText)
          break
        case 'icone':
          this.categorieData.icone = valueText
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
    ActionCrud() {
      return ActionCrud
    },
    isFormValid() {
      return (
          this.validTextField(this.categorieData.title) &&
          this.validTextField(this.categorieData.message)
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
      this.fetchDetailCategorie((this as any).$route.params.notificationID)
    }
    this.fetchUsers(1)
    // const action = (this as any).$route.params.action
  },
  watch:{
    userSelected(this: any, newVal){
      if (!newVal) return
      const newValue = newVal as string
      this.categorieData.destination.push(newValue)
      this.userSelected = null;
      console.log('individuel: ', this.categorieData.destination)
    },
    sendingType(this: any, newVal){
      if (!newVal) return
      const newValue = newVal as string
      if(newValue == 'Groupé'){
        for(let i=0; i<this.originalUsers.length; i++){
          this.categorieData.destination.push(this.originalUsers[i].user.deviceToken);
        }
      }
      this.userSelected = null;
      console.log('tous: ', this.categorieData.destination)
    },
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