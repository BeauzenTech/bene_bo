<template>
  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <form @submit.prevent="createRestaurantAccount">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Nom du Restaurant *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. Vega Restaurant"
                  v-model="restaurantData.name"
                  @change="(event) => handleInput(event, 'name')"
                  :class="{ 'is-valid': validTextField(restaurantData.name) }"
                  required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Numero de rue *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. 34662"
                  v-model="restaurantData.numeroRue"
                  @change="(event) => handleInput(event, 'numeroRue')"
                  :class="{ 'is-valid': validTextField(restaurantData.numeroRue) }"
                  required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Taxe *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. CHE-372.776.093 TVA"
                  v-model="restaurantData.taxe"
                  @change="(event) => handleInput(event, 'taxe')"
                  :class="{ 'is-valid': validTextField(restaurantData.taxe) }"
                  required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Prenom du responsable *
              </label>
              <input
                type="text"
                class="form-control shadow-none rounded-0 text-black"
                placeholder="e.g. Adam"
                v-model="restaurantData.firstName"
                @change="(event) => handleInput(event, 'firstName')"
                :class="{ 'is-valid': validTextField(restaurantData.firstName) }"
                required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
               Nom du responsable *
              </label>
              <input
                type="text"
                class="form-control shadow-none rounded-0 text-black"
                placeholder="e.g. Smith"
                v-model="restaurantData.lastName"
                @change="(event) => handleInput(event, 'lastName')"
                :class="{ 'is-valid': validTextField(restaurantData.lastName) }"
                required
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
                v-model="restaurantData.email"
                @change="(event) => handleInput(event, 'email')"
                :class="{ 'is-valid': validEmail(restaurantData.email) }"
                class="form-control shadow-none rounded-0 text-black"
                placeholder="e.g. adam127704@gmail.com"
                :required="actionDetected === ActionCrud.ADD"
                :disabled="actionDetected === ActionCrud.EDIT"
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
                :class="{ 'is-valid': validPassword(restaurantData.password) }"
                placeholder="**************"
                v-model="restaurantData.password"
                @change="(event) => handleInput(event, 'password')"
                :required="actionDetected === ActionCrud.ADD"
                :disabled="actionDetected === ActionCrud.EDIT"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Code postal *
              </label>
              <v-select
                  v-model="restaurantData.postalCodeID"
                  :options="allPostalCode"
                  @change="(event) => handleInput(event, 'postalCode')"
                  label="numeroPostal"
                  :reduce="postal => postal.id"
                  placeholder="Selectionner le code postal"
                  :class="{ 'is-valid': validTextField(restaurantData.postalCodeID) }"
                  required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Pays*
              </label>
              <select v-model="restaurantData.country" class="form-select shadow-none fw-semibold rounded-0"
                      @change="(event) => handleInput(event, 'country')"
                      :class="{ 'is-valid': validTextField(restaurantData.country) }"
              >
                <option selected>Suisse</option>
              </select>
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
                  v-model="restaurantData.address"
                  @change="(event) => handleInput(event, 'address')"
                  :class="{ 'is-valid': validTextField(restaurantData.address) }"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Ville
              </label>
              <v-select
                  v-model="restaurantData.city"
                  :options="allPostalCode"
                  @change="(event) => handleInput(event, 'city')"
                  label="ville"
                  :reduce="postal => postal.ville"
                  placeholder="Selectionner la ville"
                  :class="{ 'is-valid': validTextField(restaurantData.city) }"
                  required
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
                  v-model="restaurantData.phoneNumber"
                  @change="(event) => handleInput(event, 'phoneNumber')"
                  :class="{ 'is-valid': validTextField(restaurantData.phoneNumber) }"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Batiment
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. Vaderna"
                  v-model="restaurantData.batiment"
                  @change="(event) => handleInput(event, 'batiment')"
                  :class="{ 'is-valid': validTextField(restaurantData.batiment) }"
                  required
              />
            </div>
          </div>




<!--          <div class="col-md-12">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                Add Some Info-->
<!--              </label>-->
<!--              <div class="mb-0">-->
<!--                <QuillEditor-->
<!--                  theme="snow"-->
<!--                  placeholder="Write your meta description"-->
<!--                  toolbar="full"-->
<!--                />-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="col-md-12">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">Status</label>-->
<!--              <div-->
<!--                class="form-check fs-md-15 fs-lg-16 text-black mb-0 d-inline-block me-15 me-md-25"-->
<!--              >-->
<!--                <input-->
<!--                  class="form-check-input shadow-none"-->
<!--                  type="radio"-->
<!--                  name="communicationRadio"-->
<!--                  id="activeRadio"-->
<!--                  checked-->
<!--                />-->
<!--                <label class="form-check-label" for="activeRadio">-->
<!--                  Active-->
<!--                </label>-->
<!--              </div>-->
<!--              <div-->
<!--                class="form-check fs-md-15 fs-lg-16 text-black mb-0 d-inline-block me-15 me-md-25"-->
<!--              >-->
<!--                <input-->
<!--                  class="form-check-input shadow-none"-->
<!--                  type="radio"-->
<!--                  name="communicationRadio"-->
<!--                  id="deactivatedRadio"-->
<!--                />-->
<!--                <label class="form-check-label" for="deactivatedRadio">-->
<!--                  Deactivated-->
<!--                </label>-->
<!--              </div>-->
<!--              <div-->
<!--                class="form-check fs-md-15 fs-lg-16 text-black mb-0 d-inline-block me-15 me-md-25"-->
<!--              >-->
<!--                <input-->
<!--                  class="form-check-input shadow-none"-->
<!--                  type="radio"-->
<!--                  name="communicationRadio"-->
<!--                  id="blockedRadio"-->
<!--                />-->
<!--                <label class="form-check-label" for="blockedRadio">-->
<!--                  Blocked-->
<!--                </label>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="col-md-12">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                Designation-->
<!--              </label>-->
<!--              <input-->
<!--                type="text"-->
<!--                class="form-control shadow-none rounded-0 text-black"-->
<!--                placeholder="add users designation"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="col-md-6">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                Company Name-->
<!--              </label>-->
<!--              <input-->
<!--                type="text"-->
<!--                class="form-control shadow-none rounded-0 text-black"-->
<!--                placeholder="e.g. EnvyTheme Software"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="col-md-6">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                Company Website-->
<!--              </label>-->
<!--              <input-->
<!--                type="text"-->
<!--                class="form-control shadow-none rounded-0 text-black"-->
<!--                placeholder="http//website.com"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="col-md-12">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                Who Will Be Able To See Your Profile?-->
<!--              </label>-->
<!--              <div-->
<!--                class="form-check fs-md-15 fs-lg-16 text-black mb-0 d-inline-block me-15 me-md-25"-->
<!--              >-->
<!--                <input-->
<!--                  class="form-check-input shadow-none"-->
<!--                  type="radio"-->
<!--                  name="communicationRadio"-->
<!--                  id="onlyMeRadio"-->
<!--                  checked-->
<!--                />-->
<!--                <label class="form-check-label" for="onlyMeRadio">-->
<!--                  Only Me-->
<!--                </label>-->
<!--              </div>-->
<!--              <div-->
<!--                class="form-check fs-md-15 fs-lg-16 text-black mb-0 d-inline-block me-15 me-md-25"-->
<!--              >-->
<!--                <input-->
<!--                  class="form-check-input shadow-none"-->
<!--                  type="radio"-->
<!--                  name="communicationRadio"-->
<!--                  id="onlyFriendsRadio"-->
<!--                />-->
<!--                <label class="form-check-label" for="onlyFriendsRadio">-->
<!--                  Only Friends-->
<!--                </label>-->
<!--              </div>-->
<!--              <div-->
<!--                class="form-check fs-md-15 fs-lg-16 text-black mb-0 d-inline-block me-15 me-md-25"-->
<!--              >-->
<!--                <input-->
<!--                  class="form-check-input shadow-none"-->
<!--                  type="radio"-->
<!--                  name="communicationRadio"-->
<!--                  id="everyoneRadio"-->
<!--                />-->
<!--                <label class="form-check-label" for="everyoneRadio">-->
<!--                  Everyone-->
<!--                </label>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="col-md-12">-->
<!--            <label class="d-block text-black fw-semibold mb-10">-->
<!--              Add Social Media Link-->
<!--            </label>-->
<!--            <div class="row">-->
<!--              <div class="col-md-6">-->
<!--                <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--                  <div class="input-group">-->
<!--                    <span-->
<!--                      class="input-group-text rounded-0 fs-14 fw-bold text-primary"-->
<!--                    >-->
<!--                      <i class="ph-bold ph-facebook-logo lh-1 fs-md-18"></i>-->
<!--                    </span>-->
<!--                    <input-->
<!--                      type="text"-->
<!--                      class="form-control shadow-none rounded-0 text-black"-->
<!--                      placeholder="facebook@example.com"-->
<!--                    />-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="col-md-6">-->
<!--                <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--                  <div class="input-group">-->
<!--                    <span-->
<!--                      class="input-group-text rounded-0 fs-14 fw-bold text-primary"-->
<!--                    >-->
<!--                      <i class="ph-fill ph-twitter-logo lh-1 fs-md-18"></i>-->
<!--                    </span>-->
<!--                    <input-->
<!--                      type="text"-->
<!--                      class="form-control shadow-none rounded-0 text-black"-->
<!--                      placeholder="twitter@example.com"-->
<!--                    />-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="col-md-6">-->
<!--                <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--                  <div class="input-group">-->
<!--                    <span-->
<!--                      class="input-group-text rounded-0 fs-14 fw-bold text-primary"-->
<!--                    >-->
<!--                      <i class="ph-bold ph-linkedin-logo lh-1 fs-md-18"></i>-->
<!--                    </span>-->
<!--                    <input-->
<!--                      type="text"-->
<!--                      class="form-control shadow-none rounded-0 text-black"-->
<!--                      placeholder="linkedin@example.com"-->
<!--                    />-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="col-md-6">-->
<!--                <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--                  <div class="input-group">-->
<!--                    <span-->
<!--                      class="input-group-text rounded-0 fs-14 fw-bold text-primary"-->
<!--                    >-->
<!--                      <i class="ph-bold ph-instagram-logo lh-1 fs-md-18"></i>-->
<!--                    </span>-->
<!--                    <input-->
<!--                      type="text"-->
<!--                      class="form-control shadow-none rounded-0 text-black"-->
<!--                      placeholder="instagram@example.com"-->
<!--                    />-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="col-md-12">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                Upload User’s Profile Picture-->
<!--              </label>-->
<!--              <ImageUpload />-->
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
                {{ actionDetected === 'edit' ? 'Mettre à jour' : ' Ajouter un restaurant'}}
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
  createRestaurant,
  createUser,
  detailRestaurant,
  detailUser,
  fetchAllPostalCode,
  updateRestaurant
} from "@/service/api";

import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import {AxiosError} from "axios";
import {UserGeneralKey} from "@/models/user.generalkey";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {ApiResponse} from "@/models/Apiresponse";
import {UserModel} from "@/models/user.model";
import {RestaurantModel} from "@/models/restaurant.model";

export default defineComponent({
  name: "VabeneAddUser",
  components: {
    LoaderComponent
    // ImageUpload,
  },
  props: {
    action: {
      type: String as PropType<string>,
      required: true
    },
    restaurantID: {
      type: String as PropType<string>,
      required: false
    },
  },
  data(){
    return{
      restaurantData: {
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        batiment: "",
        numeroRue: "",
        postalCodeID: "",
        country: "",
        latitude: "",
        longitude: "",
        horaires: [

        ],
        orderType: [],
        password: "",
        firstName: "",
        lastName: "",
        taxe: ""
      },
      isLoading: false,
      actionDetected: null as string | null,
      restaurantResponse: null as RestaurantModel | null,
      allPostalCode: [],
      codePostalCode: null as string | null,
    }
  },
  methods: {
    clearData(){
      this.restaurantData = {
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        batiment: "",
        numeroRue: "",
        postalCodeID: "",
        country: "",
        latitude: "",
        longitude: "",
        horaires: [

        ],
        orderType: [],
        password: "",
        firstName: "",
        lastName: "",
        taxe: ""
      }
    },
    goBack() {
      this.$router.back()
    },
    async createRestaurantAccount() {
      if(this.actionDetected === ActionCrud.ADD){
        const franchiseID  = localStorage.getItem(UserGeneralKey.USER_FRANCHISE_ID)
        this.isLoading = true;
        const payload = {
          "franchiseID": franchiseID,
          "name": this.restaurantData.name,
          "email": this.restaurantData.email,
          "phoneNumber": this.restaurantData.phoneNumber,
          "address": this.restaurantData.address,
          "city": this.restaurantData.city,
          "batiment": this.restaurantData.batiment,
          "numeroRue": this.restaurantData.numeroRue,
          "postalCodeID": this.restaurantData.postalCodeID,
          "country": this.restaurantData.country,
          "latitude": "",
          "longitude": "",
          "horaires": [
            {
              "jour": "Lun - Dim",
              "heure": "11:00 - 14:00"
            },
            {
              "jour": "Lun - Dim",
              "heure": "18:00 - 22:00"
            }
          ],
          "orderType": ["delivery", "click_collect"],
          "password": this.restaurantData.password,
          "firstName": this.restaurantData.firstName,
          "lastName": this.restaurantData.lastName,
          "taxe": this.restaurantData.taxe
        }
        try {
          const response = await createRestaurant(payload);
          console.log(response);
          if (response.code === 201 || response.code === 200) {
            this.toast.success(response.message)
            this.clearData()
            setTimeout(() => {
              window.location.reload();
            }, 2000);
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
      else{
       await this.updateRestaurantAccount(this.restaurantID)
      }

    },
    async updateRestaurantAccount(restaurantID) {
      const franchiseID  = localStorage.getItem(UserGeneralKey.USER_FRANCHISE_ID)
      this.isLoading = true;
      const payload = {
        "franchiseID": franchiseID,
        "name": this.restaurantData.name,
        "email": this.restaurantData.email,
        "phoneNumber": this.restaurantData.phoneNumber,
        "address": this.restaurantData.address,
        "city": this.restaurantData.city,
        "batiment": this.restaurantData.batiment,
        "numeroRue": this.restaurantData.numeroRue,
        "postalCodeID": this.restaurantData.postalCodeID,
        "country": this.restaurantData.country,
        "latitude": "",
        "longitude": "",
        "horaires": [],
        "orderType": [],
        "taxe": ""
      }
      try {
        const response = await updateRestaurant(restaurantID, payload);
        console.log(response);
        if (response.code === 201 || response.code === 200) {
          this.toast.success(response.message)
          this.clearData()
          setTimeout(() => {
            window.location.reload();
          }, 2000);
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
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchDetailRestaurant(restaurantID) {
      this.isLoading = true;
      try {
        const response = await detailRestaurant(restaurantID) as ApiResponse<RestaurantModel>;
        console.log(response)
        if (response.code === 200) {
          if(response.data){
            this.restaurantResponse = response.data;
            this.restaurantData.name = this.restaurantResponse.name
            this.restaurantData.email = this.restaurantResponse.email;
            this.restaurantData.firstName = this.restaurantResponse.userID.first_name;
            this.restaurantData.lastName = this.restaurantResponse.userID.last_name;
            this.restaurantData.city = this.restaurantResponse.city ?? '';
            this.restaurantData.address = this.restaurantResponse.address ?? '';
            this.restaurantData.phoneNumber = this.restaurantResponse.phoneNumber ?? '';

            this.restaurantData.postalCodeID = this.restaurantResponse.codePostalID.id;
            this.restaurantData.numeroRue = this.restaurantResponse.numeroRue ?? '';
            this.restaurantData.batiment = this.restaurantResponse.batiment ?? '';
            this.restaurantData.taxe = this.restaurantResponse.taxe ?? '';
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

    handleInput(event, type) {
      console.log("Valeur en temps réel :", event.target.value);
      const valueText = event.target.value;
      switch (type){
        case 'firstName':
          this.restaurantData.firstName = valueText
          this.validTextField(valueText)
          break
        case 'lastName':
          this.restaurantData.lastName = valueText
          this.validTextField(valueText)
          break
        case 'address':
          this.restaurantData.address = valueText
          this.validTextField(valueText)
          break
        case 'email':
          this.restaurantData.email = valueText
          this.validEmail(valueText)
          break
        case 'password':
          this.restaurantData.password = valueText
          this.validPassword(valueText)
          break
        case 'batiment':
          this.restaurantData.batiment = valueText
          this.validTextField(valueText)
          break
        case 'taxe':
          this.restaurantData.taxe = valueText
          this.validTextField(valueText)
          break
        case 'city':
          this.restaurantData.city = valueText
          this.validTextField(valueText)
          break
        case 'name':
          this.restaurantData.name = valueText
          this.validTextField(valueText)
          break

        case 'phoneNumber':
          this.restaurantData.phoneNumber = valueText
          this.validTextField(valueText)
          break

        case 'country':
          this.restaurantData.country = valueText
          this.validTextField(valueText)
          break

        case 'numeroRue':
          this.restaurantData.numeroRue = valueText
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
    isFormValid() {
      if(this.actionDetected === ActionCrud.ADD){
        return (
            this.validEmail(this.restaurantData.email) &&
            this.validPassword(this.restaurantData.password) &&
            this.validTextField(this.restaurantData.firstName) &&
            this.validTextField(this.restaurantData.lastName) &&
            this.validTextField(this.restaurantData.phoneNumber) &&
            this.validTextField(this.restaurantData.address) &&
            this.validTextField(this.restaurantData.taxe)
        );
      }
      else{
        return (
            this.validTextField(this.restaurantData.firstName) &&
            this.validTextField(this.restaurantData.lastName) &&
            this.validTextField(this.restaurantData.phoneNumber) &&
            this.validTextField(this.restaurantData.address) &&
            this.validTextField(this.restaurantData.taxe)
        );
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
    this.actionDetected = (this as any).$route.params.action
    this.fetchPostalCode();
    if((this as any).$route.params.action == ActionCrud.EDIT){
      this.fetchDetailRestaurant((this as any).$route.params.restaurantID)
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