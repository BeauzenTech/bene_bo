<template>
  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <form @submit.prevent="createNewCategorie">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Type de coupon *
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
          <div class="col-md-12" v-if="sendingType !== 'Fixe'">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
               Definissez le code coupon *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. 5"
                  v-model="categorieData.couponCode"
                  @change="(event) => handleInput(event, 'couponCode')"
                  :class="{ 'is-valid': validTextField(categorieData.couponCode) }"

              />
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Valeur du coupon *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. 5"
                  v-model="categorieData.value"
                  @change="(event) => handleInput(event, 'value')"
                  :class="{ 'is-valid': validTextField(categorieData.value) }"
                  required

              />
            </div>
          </div>


          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Usage limite *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. 10"
                  v-model="categorieData.limite"
                  @change="(event) => handleInput(event, 'limite')"
                  :class="{ 'is-valid': validTextField(categorieData.limite) }"
                  :required="actionDetected == ActionCrud.ADD"
              />
            </div>
          </div>


          <div class="col-md-12" v-if="categorieResponse && actionDetected === ActionCrud.EDIT">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Activation *
              </label>
              <!-- Toggle switch -->
              <div class="form-check form-switch">
                <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="categorieResponse.is_active"
                    @change="toggleCategorieActivation(categorieResponse, categorieResponse.is_active)"
                />

              </div>
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
                {{ actionDetected === 'edit' ? 'Mettre à jour' : ' Créer un coupon'}}
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

          <div class="col-md-12 mt-30">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10 fs-16">
                Liste des utilisateurs ayant utilisé le coupon
              </label>

              <ul class="list-unstyled" v-if="categorieResponse">
                <li v-if="categorieResponse.eligibleUsers.length === 0">
                  <span class="text-muted fst-italic">Aucun utilisateur trouvé</span>
                </li>
                <li  v-else v-for="(user, index) in categorieResponse?.eligibleUsers" :key="user">
                  <span class="badge bg-light text-black fw-semibold fs-14">
                   {{index + 1}} - {{ user }}
                  </span>
                </li>

              </ul>
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
  createCampagne,
  detailCampagne,
  listeUser,
  createNotification,
  listeCustomers,
  createCoupon,
  detailCoupon,
  updateCoupon, disableCoupon
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
import {CouponModel} from "@/models/coupon.model";


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
    couponID: {
      type: String as PropType<string>,
      required: false
    },
  },
  data(){
    return{
      categorieData: {
        type: '',
        value: '',
        limite: '',
        couponCode: ''
      },
      isLoading: false,
      logoUpload: null,
      categorieResponse: null as CouponModel | null,
      actionDetected: null as string | null,
      originalUsers: [] as CustomerModel[], // Stockage des utilisateurs originaux
      userSelected: null,
      sendingType: '' as string,
      typeSending: ["Fixe", "Pourcentage"] as string[],
      restaurantId: null as string | null,
    }
  },
  methods: {
    async toggleCategorieActivation(categorie, status){
      const payload = {
        'status': status
      }
      try {
        const response = await disableCoupon(categorie.code, payload) as ApiResponse<any>;
        if (response.code === 200) {
            const responseDecoded = response.data
            this.toast.success(response.message);
            this.clearData()
        } else {
          this.toast.error(response.message)
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      }
    },
    stripHtmlTags(input: string): string {
      const div = document.createElement('div');
      div.innerHTML = input;
      return div.textContent || div.innerText || '';
    },
    clearData(){
      this.categorieData = {
        type: '',
        value: '',
        limite: '',
        couponCode: ''
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    goBack() {
      this.$router.back()

    },
    async createNewCategorie() {
      if(this.actionDetected === ActionCrud.ADD){
        this.isLoading = true;
        const payload = {
          "discount_type": this.sendingType === 'Fixe' ? 'fixed' : 'percent',
          "discount_value": this.categorieData.value,
          "usage_limit": this.categorieData.limite,
          "codeCoupon": this.categorieData.couponCode
        }
        try {
          const response = await createCoupon(payload);
          if (response.code === 200 || response.code === 201) {
            this.toast.success(response.message)
            this.clearData()
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
      else{
        await this.updateCategorie(this.categorieResponse?.id)
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
        if (response.code === 200) {
          if (response.data?.items) {
            const data = response.data.items;
            this.originalUsers = data.filter(item => item.user != null && item.user.deviceToken != null);
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
        "discount_type": this.sendingType === 'Fixe' ? 'fixed' : 'percent',
        "discount_value": this.categorieData.value,
        "usage_limit": this.categorieData.limite,
        "codeCoupon": this.categorieData.couponCode
      }
      try {
        const response = await updateCoupon(categorieID, payload);
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
        const response = await detailCoupon(categorieID) as ApiResponse<CouponModel>;
        if (response.code === 200) {
          if(response.data){
            this.categorieResponse = response.data;
            this.categorieData.couponCode = this.categorieResponse.code;
            this.categorieData.value = this.categorieResponse.discount_value
            this.categorieData.type = this.categorieResponse.discount_type === 'percent' ? 'Pourcentage' : 'Fixe';
            this.sendingType = this.categorieResponse.discount_type === 'percent' ? 'Pourcentage' : 'Fixe';
            this.categorieData.limite = this.categorieResponse.usage_limit
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
      if(this.logoUpload && this.actionDetected === 'add'){
        this.isLoading = true;
        try {
          const response = await uploadFile(this.logoUpload);
          if (response.code === 200 || response.code === 201) {
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
      const valueText = event.target.value;
      switch (type){
        case 'value':
          this.categorieData.value = valueText
          this.validTextField(valueText)
          break
        case 'limite':
          this.categorieData.limite = valueText
          this.validTextField(valueText)
          break

        case 'couponCode':
          this.categorieData.couponCode = valueText
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
          this.validTextField(this.categorieData.value) &&
          this.validTextField(this.categorieData.limite)
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
      this.fetchDetailCategorie((this as any).$route.params.couponID)
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
    },
    sendingType(this: any, newVal){
      if (!newVal) return
      const newValue = newVal as string
      this.sendingType = newVal as string
      if(newValue == 'Groupé'){
        for(let i=0; i<this.originalUsers.length; i++){
          this.categorieData.destination.push(this.originalUsers[i].user.deviceToken);
        }
      }
      this.userSelected = null;
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