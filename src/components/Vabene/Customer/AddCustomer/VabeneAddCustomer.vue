<template>
  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <form @submit.prevent="">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Nom *
              </label>
              <input
                type="text"
                class="form-control shadow-none rounded-0 text-black"
                placeholder="e.g. "
                v-model="categorieData.firstName"
                @change="(event) => handleInput(event, 'firstName')"
                :class="{ 'is-valid': validTextField(categorieData.firstName) }"
                required
                disabled
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                prenom *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. "
                  v-model="categorieData.lastName"
                  @change="(event) => handleInput(event, 'firstName')"
                  :class="{ 'is-valid': validTextField(categorieData.firstName) }"
                  required
                  disabled
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                email *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. "
                  v-model="categorieData.email"
                  @change="(event) => handleInput(event, 'email')"
                  :class="{ 'is-valid': validTextField(categorieData.email) }"
                  required
                  disabled
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Numero telephone *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. "
                  v-model="categorieData.phoneNumber"
                  @change="(event) => handleInput(event, 'phoneNumber')"
                  :class="{ 'is-valid': validTextField(categorieData.phoneNumber) }"
                  required
                  disabled
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                adresse *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. "
                  v-model="categorieData.address"
                  @change="(event) => handleInput(event, 'address')"
                  :class="{ 'is-valid': validTextField(categorieData.address) }"
                  required
                  disabled
              />
            </div>
          </div>


          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Ville *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. "
                  v-model="categorieData.city"
                  @change="(event) => handleInput(event, 'city')"
                  :class="{ 'is-valid': validTextField(categorieData.city) }"
                  required
                  disabled
              />
            </div>
          </div>


          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Ville *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. "
                  v-model="categorieData.codePostal"
                  @change="(event) => handleInput(event, 'codePostal')"
                  :class="{ 'is-valid': validTextField(categorieData.codePostal) }"
                  required
                  disabled
              />
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
  detailCustomer
} from "@/service/api";

import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import { AxiosError } from 'axios';
import {ApiResponse, PaginatedCategorie} from "@/models/Apiresponse";
import {CategorieModel} from "@/models/categorie.model";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {CustomerModel} from "@/models/customer.model";


export default defineComponent({
  name: "VabeneAddCustomer",
  components: {

  },
  props: {
    action: {
      type: String as PropType<string>,
      required: true
    },
    customerID: {
      type: String as PropType<string>,
      required: false
    },
  },
  data(){
    return{
      categorieData: {
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        city: '',
        codePostal: '',
        batiment: '',
        rue: '',
        created_at: ''
      },
      isLoading: false,
      logoUpload: null,
      categorieResponse: null as CustomerModel | null,
      actionDetected: null as string | null,
    }
  },
  methods: {
    clearData(){
      this.categorieData = {
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        city: '',
        codePostal: '',
        batiment: '',
        rue: '',
        created_at: ''
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    goBack() {
      this.$router.back()

    },
    // async createNewCategorie() {
    //
    //     this.isLoading = true;
    //     const payload = {
    //       "name": this.categorieData.name,
    //       "description": this.categorieData.description,
    //       "icone": this.categorieData.icone
    //     }
    //     try {
    //       const response = await createCategorie(payload);
    //       console.log(response);
    //       if (response.code === 201) {
    //         this.toast.success(response.message)
    //         this.clearData()
    //       } else {
    //         this.toast.error(response.message)
    //       }
    //     } catch (error) {
    //       const axiosError = error as AxiosError;
    //       if (axiosError.response && axiosError.response.data) {
    //         const message = (axiosError.response.data as any).message;
    //         this.toast.error(message);
    //       } else {
    //         this.toast.error("Une erreur est survenue");
    //       }
    //     } finally {
    //       this.isLoading = false;
    //     }
    //
    //
    // },
    // async updateCategorie(categorieID) {
    //   this.isLoading = true;
    //   const payload = {
    //     "name": this.categorieData.name,
    //     "description": this.categorieData.description,
    //     "icone": this.categorieData.icone
    //   }
    //   try {
    //     const response = await updateCategorie(categorieID, payload);
    //     console.log(response);
    //     if (response.code === 200) {
    //       this.toast.success(response.message)
    //       this.clearData()
    //     } else {
    //       this.toast.error(response.message)
    //     }
    //   } catch (error) {
    //     const axiosError = error as AxiosError;
    //     if (axiosError.response && axiosError.response.data) {
    //       const message = (axiosError.response.data as any).message;
    //       this.toast.error(message);
    //     } else {
    //       this.toast.error("Une erreur est survenue");
    //     }
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
    async fetchDetailCategorie(categorieID) {
      this.isLoading = true;
      try {
        const response = await detailCustomer(categorieID) as ApiResponse<CustomerModel>;
        console.log(response)
        if (response.code === 200) {
          if(response.data){
            this.categorieResponse = response.data;
            this.categorieData.firstName = this.categorieResponse.firstName;
            this.categorieData.lastName = this.categorieResponse.lastName;
            this.categorieData.email = this.categorieResponse.email;
            this.categorieData.phoneNumber = this.categorieResponse.phoneNumber;
            this.categorieData.batiment = this.categorieResponse.batiment;
            this.categorieData.rue = this.categorieResponse.rue;
            this.categorieData.created_at = this.categorieResponse.created_at;
            this.categorieData.city = this.categorieResponse.city;
            this.categorieData.codePostal = this.categorieResponse.codePostal;
            this.categorieData.address = this.categorieResponse.address;
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
    // async uploadLogo(){
    //   console.log(this.categorieData);
    //   if(this.logoUpload && this.actionDetected === 'add'){
    //     this.isLoading = true;
    //     try {
    //       const response = await uploadFile(this.logoUpload);
    //       console.log(response);
    //       if (response.code === 200 || response.code === 201) {
    //         this.categorieData.icone = response.data
    //         await this.createNewCategorie()
    //       } else {
    //         this.toast.error(response.message)
    //       }
    //
    //     } catch (error) {
    //       const axiosError = error as AxiosError;
    //
    //       this.isLoading = false;
    //       if (axiosError.response && axiosError.response.data) {
    //         const message = (axiosError.response.data as any).message;
    //         this.toast.error(message);
    //       } else {
    //         this.toast.error("Une erreur est survenue");
    //       }
    //       console.error(axiosError);
    //
    //     }
    //   }
    //   else{
    //     await this.updateCategorie(this.categorieResponse?.id);
    //   }
    //
    //
    // },

    handleInput(event, type) {
      console.log("Valeur en temps réel :", event.target.value);
      const valueText = event.target.value;
      switch (type){
        case 'firstName':
          this.categorieData.firstName = valueText
          this.validTextField(valueText)
          break
        case 'description':
          this.categorieData.lastName = valueText
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
          this.validTextField(this.categorieData.firstName) &&
          this.validTextField(this.categorieData.lastName)
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
      this.fetchDetailCategorie((this as any).$route.params.customerID)
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