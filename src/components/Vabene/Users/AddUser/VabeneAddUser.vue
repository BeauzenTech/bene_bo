<template>
  <div v-if="action === ActionCrud.ADD || action === ActionCrud.EDIT" class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <form @submit.prevent="createNewAccount">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Prénom *
              </label>
              <input
                type="text"
                class="form-control shadow-none rounded-0 text-black"
                placeholder="e.g. Adam"
                v-model="userData.firstName"
                @change="(event) => handleInput(event, 'firstName')"
                :class="{ 'is-valid': validTextField(userData.firstName) }"
                :required="actionDetected === ActionCrud.ADD"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
               Nom *
              </label>
              <input
                type="text"
                class="form-control shadow-none rounded-0 text-black"
                placeholder="e.g. Smith"
                v-model="userData.lastName"
                @change="(event) => handleInput(event, 'lastName')"
                :class="{ 'is-valid': validTextField(userData.lastName) }"
                :required="actionDetected === ActionCrud.ADD"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Email *
              </label>
              <input
                  type="email"
                  v-model="userData.email"
                  @change="(event) => handleInput(event, 'email')"
                  :class="{ 'is-valid': validEmail(userData.email) }"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. adam127704@gmail.com"
                  :required="actionDetected === ActionCrud.ADD"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Mot de passe *
              </label>
              <input
                  type="password"
                  class="form-control shadow-none rounded-0 text-black"
                  :class="{ 'is-valid': validPassword(userData.password) }"
                  placeholder="**************"
                  v-model="userData.password"
                  @change="(event) => handleInput(event, 'password')"
                  :disabled="actionDetected === ActionCrud.EDIT"
                  :required="actionDetected === ActionCrud.ADD"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Numéro téléphone
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. +338830003"
                  v-model="userData.phoneNumber"
                  @change="(event) => handleInput(event, 'phoneNumber')"
                  :class="{ 'is-valid': validTextField(userData.phoneNumber) }"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Date de naissance
              </label>
              <input
                  type="date"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="01-08-1996"
                  v-model="userData.dateOfBirth"
                  @change="(event) => handleInput(event, 'dateOfBirth')"
                  :class="{ 'is-valid': validTextField(userData.dateOfBirth) }"
              />
            </div>
          </div>


          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Pays*
              </label>
              <select v-model="userData.country" class="form-select shadow-none fw-semibold rounded-0"
                      @change="(event) => handleInput(event, 'country')"
                      :class="{ 'is-valid': validTextField(userData.country) }"
              >
                <option selected>Suisse</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Code postal *
              </label>
              <v-select
                  v-model="userData.postalCode"
                  :options="allPostalCode"
                  @change="(event) => handleInput(event, 'postalCode')"
                  label="numeroPostal"
                  :reduce="postal => postal.numeroPostal"
                  placeholder="Selectionner le code postal"
                  :class="{ 'is-valid': validTextField(userData.postalCode) }"
                  :required="actionDetected === ActionCrud.ADD"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Ville
              </label>
              <v-select
                  v-model="userData.city"
                  :options="allPostalCode"
                  @change="(event) => handleInput(event, 'city')"
                  label="ville"
                  :reduce="postal => postal.ville"
                  placeholder="Selectionner la ville"
                  :class="{ 'is-valid': validTextField(userData.city) }"
                  :required="actionDetected === ActionCrud.ADD"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Adresse
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="Rue 44 batiment 34"
                  v-model="userData.addresse"
                  @change="(event) => handleInput(event, 'addresse')"
                  :class="{ 'is-valid': validTextField(userData.addresse) }"
              />
            </div>
          </div>

          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Rue *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. 43eme"
                  v-model="userData.numeroRue"
                  @change="(event) => handleInput(event, 'numeroRue')"
                  :class="{ 'is-valid': validTextField(userData.numeroRue) }"
                  :required="actionDetected === ActionCrud.ADD"
              />
            </div>
          </div>

          <div class="col-md-12"  v-if="actionDetected === ActionCrud.ADD">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Type de compte
              </label>
              <select class="form-select shadow-none fw-semibold rounded-0"
                      v-model="selectedTypeCompte"
                      @change="(event) => handleInput(event, 'roles')"
                      :class="{ 'is-valid': validTextField(userData.roles) }"
              >
                <option value="TEAM" selected>Equipe</option>
                <option value="CLASSIQUE" selected>Classique</option>
              </select>
            </div>
          </div>
          <div class="col-md-12" v-if="actionDetected === ActionCrud.ADD && selectedTypeCompte === 'TEAM'">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                RESTAURANT
              </label>
              <v-select
                  v-model="restaurantSelected"
                  :options="originalRestaurant"
                  label="name"
                  placeholder="Selectionner le restaurant"

              />
            </div>
          </div>

          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Rôle
              </label>
              <select class="form-select shadow-none fw-semibold rounded-0"
                      v-model="userData.roles"
                      @change="(event) => handleInput(event, 'roles')"
                      :class="{ 'is-valid': validTextField(userData.roles) }"
              >
                <option value="ROLE_ADMIN" selected>ADMINISTRATEUR</option>
                <option value="ROLE_RESTAURANT" selected>RESTAURANT</option>
                <option value="ROLE_SUPPORT_TECHNIQUE" selected>SUPPORT TECHNIQUE</option>
              </select>
            </div>
          </div>

<!--          <div class="col-md-6">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                Batiment-->
<!--              </label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control shadow-none rounded-0 text-black"-->
<!--                  placeholder="e.g. Vaderna"-->
<!--                  v-model="userData.batiment"-->
<!--                  @change="(event) => handleInput(event, 'batiment')"-->
<!--                  :class="{ 'is-valid': validTextField(userData.batiment) }"-->
<!--                  :required="actionDetected === ActionCrud.ADD"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->

          <div class="col-md-12">
            <div class="d-flex align-items-center justify-content-between">

              <LoaderComponent
                  v-if="isLoading"
              />
              <button v-else
                class="default-btn transition border-0 fw-medium text-white pt-10 pb-10 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-35 pe-md-35 rounded-1 fs-md-15 fs-lg-16 bg-success"
                type="submit"
                :disabled="!isFormValid"
                :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
              >
                {{ actionDetected === 'edit' ? 'Mettre à jour' : ' Ajouter un utilisateur'}}
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
  <div v-if="action === 'password'" class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <form @submit.prevent="updatePassword">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
               Ancien mot de passe *
              </label>
              <input
                  type="password"
                  class="form-control shadow-none rounded-0 text-black"
                  :class="{ 'is-valid': validPassword(resetUserPassword.oldPassword) }"
                  placeholder="**************"
                  v-model="resetUserPassword.oldPassword"
                  @change="(event) => handleInput(event, 'password')"

              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Nouveau mot de passe *
              </label>
              <input
                  type="password"
                  class="form-control shadow-none rounded-0 text-black"
                  :class="{ 'is-valid': validPassword(resetUserPassword.newPassword) }"
                  placeholder="**************"
                  v-model="resetUserPassword.newPassword"
                  @change="(event) => handleInput(event, 'password')"

              />
            </div>
          </div>


          <div class="col-md-12">
            <div class="d-flex align-items-center justify-content-between">

              <LoaderComponent
                  v-if="isLoading"
              />
              <button v-else
                      class="default-btn transition border-0 fw-medium text-white pt-10 pb-10 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-35 pe-md-35 rounded-1 fs-md-15 fs-lg-16 bg-success"
                      type="submit"
                      :disabled="!isUpdateForm"
                      :class="{ 'opacity-50 cursor-not-allowed': !isUpdateForm }"
              >
               Modifier mot de passe
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
  createUser,
  detailFranchise,
  detailUser,
  fetchAllPostalCode, listeRestaurant,
  updateUser,
  updateUserPassword
} from "@/service/api";

import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import {AxiosError} from "axios";
import {ApiResponse, PaginatedRestaurant} from "@/models/Apiresponse";
import {FranchiseModel} from "@/models/franchise.model";
import {UserModel} from "@/models/user.model";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {RestaurantModel} from "@/models/restaurant.model";

export default defineComponent({
  name: "VabeneAddUser",
  components: {
    LoaderComponent
  },
  props: {
    action: {
      type: String as PropType<string>,
      required: true
    },
    userID: {
      type: String as PropType<string>,
      required: false
    },
  },
  data(){
    return{
      resetUserPassword: {
        oldPassword: '',
        newPassword: ''
      },
      userData: {
        email: '',
        roles: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        addresse: '',
        city: '',
        postalCode: '',
        country: 'Suisse',
        batiment: '',
        numeroRue: ''
      },
      isLoading: false,
      allPostalCode: [],
      actionDetected: null as string | null,
      userResponse: null as UserModel | null,
      allTypeCompte: ["TEAM", "CLASSIQUE"],
      selectedTypeCompte: '',
      restaurantSelected: null as RestaurantModel | null,
      originalRestaurant: [] as RestaurantModel[]
    }
  },
  methods: {
    clearData(){
      this.userData = {
        email: '',
        roles: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        addresse: '',
        city: '',
        postalCode: '',
        country: 'Suisse',
        batiment: '',
        numeroRue: ''
      }
    },
    goBack() {
      this.$router.back()
    },
    async createNewAccount() {
      if(this.actionDetected === ActionCrud.ADD){
        this.isLoading = true;
        const payload = {
          "email": this.userData.email,
          "roles": this.userData.roles,
          "password": this.userData.password,
          "firstName": this.userData.firstName,
          "lastName": this.userData.lastName,
          "phoneNumber": this.userData.phoneNumber,
          "dateOfBirth": this.userData.dateOfBirth,
          "address": this.userData.addresse,
          "city": this.userData.city,
          "postalCode": this.userData.postalCode,
          "country": this.userData.country,
          "batiment": this.userData.batiment,
          "numeroRue": this.userData.numeroRue,
          "restaurantId": this.restaurantSelected?.id
        }
        console.log(payload)
        // try {
        //   const response = await createUser(payload);
        //   console.log(response);
        //   if (response.code === 201) {
        //     this.toast.success(response.message)
        //     this.clearData()
        //   } else {
        //     this.toast.error(response.message)
        //   }
        // } catch (error) {
        //   const axiosError = error as AxiosError;
        //   if (axiosError.response && axiosError.response.data) {
        //     const message = (axiosError.response.data as any).message;
        //     this.toast.error(message);
        //   } else {
        //     this.toast.error("Une erreur est survenue");
        //   }
        // } finally {
        //   this.isLoading = false;
        // }
      }
      else{
          await this.updateAccount(this.userResponse?.id)
      }

    },
    async updatePassword() {

      if(this.userResponse){
        this.isLoading = true;
        const payload = {
          "oldPassword": this.resetUserPassword.oldPassword,
          "password": this.resetUserPassword.newPassword
        }
        try {
          const response = await updateUserPassword(this.userResponse.id ,payload);
          console.log(response);
          if (response.code === 201 || response.code === 200) {
            this.toast.success(response.message)
            setTimeout(() => {
              window.location.reload();
            }, 1000);

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
    async updateAccount(userID) {
      this.isLoading = true;
      const payload = {
        "firstName": this.userData.firstName,
        "lastName": this.userData.lastName,
        "phoneNumber": this.userData.phoneNumber,
        "dateOfBirth": this.userData.dateOfBirth,
        "address": this.userData.addresse,
        "city": this.userData.city,
        "postalCode": this.userData.postalCode,
        "country": this.userData.country,
      }
      try {
        const response = await updateUser(userID ,payload);
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
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
    async fetchPostalCode() {
      this.isLoading = true;
      try {
        const response = await fetchAllPostalCode();
        console.log(response);
        if (response.code === 200) {
          this.allPostalCode = response.data
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
    async fetchDetailUser(userID) {
      this.isLoading = true;
      try {
        const response = await detailUser(userID) as ApiResponse<UserModel>;
        console.log(response)
        if (response.code === 200) {
          if(response.data){
            this.userResponse = response.data;
            this.userData.email = this.userResponse.email;
            this.userData.firstName = this.userResponse.first_name;
            this.userData.lastName = this.userResponse.last_name;
            this.userData.city = this.userResponse.city ?? '';
            this.userData.addresse = this.userResponse.address ?? '';
            this.userData.phoneNumber = this.userResponse.phone_number ?? '';
            this.userData.postalCode = this.userResponse.postal_code;
            this.userData.numeroRue = this.userResponse.numeroRue ?? '';
            this.userData.batiment = this.userResponse.batiment ?? '';
            this.userData.roles = this.userResponse.roles[0] ?? '';
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
    async fetchRestaurants(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeRestaurant(page) as ApiResponse<PaginatedRestaurant>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            this.originalRestaurant = response.data.items;
          }

        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des restaurant");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    handleInput(event, type) {
      console.log("Valeur en temps réel :", event.target.value);
      const valueText = event.target.value;
      switch (type){
        case 'email':
          this.userData.email = valueText
          this.validEmail(valueText)
          break
        case 'old':
          this.resetUserPassword.oldPassword = valueText
          this.validPassword(valueText)
          break
        case 'new':
          this.resetUserPassword.newPassword = valueText
          this.validPassword(valueText)
          break
        case 'password':
          this.userData.password = valueText
          this.validPassword(valueText)
          break
        case 'firstName':
          this.userData.firstName = valueText
          this.validTextField(valueText)
          break

        case 'lastName':
          this.userData.lastName = valueText
          this.validTextField(valueText)
          break

        case 'addresse':
          this.userData.addresse = valueText
          this.validTextField(valueText)
          break

        case 'phoneNumber':
          this.userData.phoneNumber = valueText
          this.validTextField(valueText)
          break

        case 'dateOfBirth':
          this.userData.dateOfBirth = valueText
          this.validTextField(valueText)
          break

        case 'city':
          this.userData.city = valueText
          this.validTextField(valueText)
          break

        case 'postalCode':
          this.userData.postalCode = valueText
          this.validTextField(valueText)
          break

        case 'country':
          this.userData.country = valueText
          this.validTextField(valueText)
          break

        case 'roles':
          this.userData.roles = valueText
          this.validTextField(valueText)
          break

        case 'batiment':
          this.userData.batiment = valueText
          this.validTextField(valueText)
          break

        case 'numeroRue':
          this.userData.numeroRue = valueText
          this.validTextField(valueText)
          break

      }
    },
    validEmail(email) {
      if(email){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim())
      }
    },
    validPassword(password){
      if (password){
        return password.trim().length > 0
      }
    },

    validTextField(text){
      if (text){
        return text.trim().length > 0
      }
    }

  },
  computed: {
    ActionCrud() {
      return ActionCrud
    },
    isUpdateForm(){
      return (
          this.validPassword(this.resetUserPassword.oldPassword) &&
          this.validPassword(this.resetUserPassword.newPassword)
      );
    },
    isFormValid() {
      if(this.actionDetected === ActionCrud.ADD){
        return (
            this.validEmail(this.userData.email) &&
            this.validPassword(this.userData.password) &&
            this.validTextField(this.userData.firstName) &&
            this.validTextField(this.userData.lastName) &&
            this.validTextField(this.userData.roles) &&
            this.validTextField(this.userData.postalCode) &&
            this.validTextField(this.userData.country)
        );
      }
      else{
        return true
      }
    }
  },
  setup: () => {
    // const modules = {
    //   module: BlotFormatter,
    //   ImageUploader,
    //   options: {
    //     upload: (file: string | Blob) => {
    //       return new Promise((resolve, reject) => {
    //         const formData = new FormData();
    //         formData.append("image", file);
    //
    //         axios
    //           .post("/upload-image", formData)
    //           .then((res: { data: { url: unknown } }) => {
    //             console.log(res);
    //             resolve(res.data.url);
    //           })
    //           .catch((err: unknown) => {
    //             reject("Upload failed");
    //             console.error("Error:", err);
    //           });
    //       });
    //     },
    //   },
    // };
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchPostalCode();
    this.fetchRestaurants(1)
    this.actionDetected = (this as any).$route.params.action
    if((this as any).$route.params.action == ActionCrud.EDIT || (this as any).$route.params.action == 'password'){
      this.fetchDetailUser((this as any).$route.params.userID)

    }
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