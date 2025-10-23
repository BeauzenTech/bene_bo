<template>
  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <form @submit.prevent="uploadLogo">
        <div class="row">


          <div class="col-md-6" v-if="actionDetected === ActionCrud.ADD">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Prenom du responsable *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. Adam"
                  v-model="franchiseData.firstName"
                  @change="(event) => handleInput(event, 'firstName')"
                  :class="{ 'is-valid': validTextField(franchiseData.firstName) }"
                  required

              />
            </div>
          </div>
          <div class="col-md-6" v-if="actionDetected === ActionCrud.ADD">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Nom du responsable *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. Smith"
                  v-model="franchiseData.lastName"
                  @change="(event) => handleInput(event, 'lastName')"
                  :class="{ 'is-valid': validTextField(franchiseData.lastName) }"
                  required

              />
            </div>
          </div>

          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Email de la franchise *
              </label>
              <input
                  type="email"
                  v-model="franchiseData.email"
                  @change="(event) => handleInput(event, 'email')"
                  :class="{ 'is-valid': validEmail(franchiseData.email) }"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. adam127704@gmail.com"
                  required

              />
            </div>
          </div>
          <div class="col-md-12" v-if="actionDetected === ActionCrud.ADD">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Mot de passe *
              </label>
              <input
                  type="password"
                  class="form-control shadow-none rounded-0 text-black"
                  :class="{ 'is-valid': validPassword(franchiseData.password) }"
                  placeholder="**************"
                  v-model="franchiseData.password"
                  @change="(event) => handleInput(event, 'password')"
                  required
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Nom de la franchise
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="AGORA"
                  v-model="franchiseData.name"
                  @change="(event) => handleInput(event, 'name')"
                  :class="{ 'is-valid': validTextField(franchiseData.name) }"
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
                  v-model="franchiseData.phoneNumber"
                  @change="(event) => handleInput(event, 'phoneNumber')"
                  :class="{ 'is-valid': validTextField(franchiseData.phoneNumber) }"
              />
            </div>
          </div>


          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Logo de la franchise *
              </label>
              <div v-if="franchiseResponse?.logo" class="form-group mb-15 mb-sm-20 mb-md-25">
                <img
                    :src=" franchiseResponse.logo || require('@/assets/images/icon/jpg.png')"
                    class="rounded-circle me-8"
                    width="120"
                    height="auto"
                    alt="logo"
                />
              </div>
              <div class="mb-0">
                <input
                    type="file"
                    class="form-control shadow-none rounded-0 text-black"
                    placeholder="**************"
                    @change="(event) => handleInput(event, 'file')"
                    :required="actionDetected === ActionCrud.ADD"
                />
              </div>
            </div>
          </div>



          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label for="franchise-description" class="d-block text-black fw-semibold mb-10">
                Description de la franchise *
              </label>
              <textarea
                  id="franchise-description"
                  class="form-control"
                  rows="5"
                  placeholder="Décrivez la franchise et ses activités (spécialité, date de création, etc...)"
                  v-model="franchiseData.description"
                  :class="{
        'is-valid': validTextField(franchiseData.description),
        'is-invalid': !validTextField(franchiseData.description) && franchiseData.description !== ''
      }"
                  @input="(event) => handleInput(event, 'description')"
              ></textarea>
            </div>
          </div>


          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Code postal *
              </label>
              <v-select
                  v-model="franchiseData.postalCode"
                  :options="allPostalCode"
                  @change="(event) => handleInput(event, 'postalCode')"
                  label="numeroPostal"
                  :reduce="postal => postal.numeroPostal"
                  placeholder="Selectionner le code postal"
                  :class="{ 'is-valid': validTextField(franchiseData.postalCode) }"
                  required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Pays*
              </label>
              <select v-model="franchiseData.country" class="form-select shadow-none fw-semibold rounded-0"
                      @change="(event) => handleInput(event, 'country')"
                      :class="{ 'is-valid': validTextField(franchiseData.country) }"
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
                  v-model="franchiseData.address"
                  @change="(event) => handleInput(event, 'addresse')"
                  :class="{ 'is-valid': validTextField(franchiseData.address) }"
              />
            </div>
          </div>
          <div class="col-md-6" v-if="actionDetected === ActionCrud.ADD">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Ville
              </label>
              <v-select
                  v-model="franchiseData.city"
                  :options="allPostalCode"
                  @change="(event) => handleInput(event, 'city')"
                  label="ville"
                  :reduce="postal => postal.ville"
                  placeholder="Selectionner la ville"
                  :class="{ 'is-valid': validTextField(franchiseData.city) }"
                  required
              />
            </div>
          </div>

          <div class="col-md-6" v-if="actionDetected === ActionCrud.ADD">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Batiment
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. Vaderna"
                  v-model="franchiseData.batiment"
                  @change="(event) => handleInput(event, 'batiment')"
                  :class="{ 'is-valid': validTextField(franchiseData.batiment) }"
                  required
              />
            </div>
          </div>
          <div class="col-md-6" v-if="actionDetected === ActionCrud.ADD">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Numero de Rue *
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. 43eme"
                  v-model="franchiseData.numeroRue"
                  @change="(event) => handleInput(event, 'numeroRue')"
                  :class="{ 'is-valid': validTextField(franchiseData.numeroRue) }"
                  required
              />
            </div>
          </div>




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

                :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
              >
                {{ actionDetected === 'edit' ? 'Mettre à jour' : ' Ajouter une franchise'}}

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


import {createFranchise, detailFranchise, fetchAllPostalCode, updateFranchise, uploadFile} from "@/service/api";

import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {AxiosError} from "axios";
import {ApiResponse} from "@/models/Apiresponse";
import {FranchiseModel} from "@/models/franchise.model";

export default defineComponent({
  name: "VabeneAddFranchise",
  components: {
    LoaderComponent

  },
  props: {
    action: {
      type: String as PropType<string>,
      required: true
    },
    franchiseID: {
      type: String as PropType<string>,
      required: false
    },
  },
  data(){
    return{
      franchiseData: {
        name: '',
        description: '',
        email: '',
        address: '',
        phoneNumber: '',
        postalCode: '',
        country: 'Suisse',
        logo: '',
        password: '',
        firstName: '',
        lastName: '',
        city: '',
        batiment: '',
        numeroRue: ''
      },
      isLoading: false,
      logoUpload: null,
      allPostalCode: [],
      actionDetected: null as string | null,
      franchiseResponse: null as FranchiseModel | null,
    }
  },
  methods: {

    clearData(){
      this.franchiseData = {
        name: '',
        description: '',
        email: '',
        address: '',
        phoneNumber: '',
        postalCode: '',
        country: 'Suisse',
        logo: '',
        password: '',
        firstName: '',
        lastName: '',
        city: '',
        batiment: '',
        numeroRue: ''
      }
    },
    goBack() {
      this.$router.back()
    },
    async createNewFranchise() {
      const payload = {
        "name": this.franchiseData.name,
        "description": this.franchiseData.description,
        "email": this.franchiseData.email,
        "address": this.franchiseData.address,
        "phoneNumber": this.franchiseData.phoneNumber,
        "postalCode": this.franchiseData.postalCode,
        "country": this.franchiseData.country,
        "logo": this.franchiseData.logo,
        "password": this.franchiseData.password,
        "firstName": this.franchiseData.firstName,
        "lastName": this.franchiseData.lastName,
        "city": this.franchiseData.city,
        "batiment": this.franchiseData.batiment,
        "numeroRue": this.franchiseData.numeroRue
      }
      try {
        const response = await createFranchise(payload);
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
    async updateFranchise(franchiseID) {
      this.isLoading = true
      const payload = {
        "name": this.franchiseData.name,
        "description": this.franchiseData.description,
        "ownerID": "",
        "email": this.franchiseData.email,
        "address": this.franchiseData.address,
        "phoneNumber": this.franchiseData.phoneNumber,
        "postalCode": this.franchiseData.postalCode,
        "country": this.franchiseData.country,
        "logo": this.franchiseData.logo,
      }
      try {
        const response = await updateFranchise(franchiseID, payload);
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
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
    async uploadLogo(){
      if(this.actionDetected === ActionCrud.ADD){
        if(this.logoUpload){
          this.isLoading = true;
          try {
            const response = await uploadFile(this.logoUpload);
            if (response.code === 200 || response.code === 201) {
              this.franchiseData.logo = response.data
              await this.createNewFranchise()
            } else {
              this.toast.error(response.message)
            }

          } catch (error) {
            this.isLoading = false;
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.data) {
              const message = (axiosError.response.data as any).message;
              this.toast.error(message);
            } else {
              this.toast.error("Une erreur est survenue");
            }
          }
        }
      }
      else{
        if(this.logoUpload){
          this.isLoading = true;
          try {
            const response = await uploadFile(this.logoUpload);
            if (response.code === 200 || response.code === 201) {
              this.franchiseData.logo = response.data
              await this.updateFranchise(this.franchiseResponse?.id)
            } else {
              this.toast.error(response.message)
            }

          } catch (error) {
            this.isLoading = false;
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.data) {
              const message = (axiosError.response.data as any).message;
              this.toast.error(message);
            } else {
              this.toast.error("Une erreur est survenue");
            }
          }
        }
        else{
          await this.updateFranchise(this.franchiseResponse?.id)
        }
      }

    },
    async fetchDetailFranchise(franchiseID) {
      this.isLoading = true;
      try {
        const response = await detailFranchise(franchiseID) as ApiResponse<FranchiseModel>;
        if (response.code === 200) {
          if(response.data){
            this.franchiseResponse = response.data;
            this.franchiseData.name = this.franchiseResponse.name;
            this.franchiseData.description = this.franchiseResponse.description;
            this.franchiseData.email = this.franchiseResponse.email;
            this.franchiseData.logo = this.franchiseResponse.logo;
            this.franchiseData.address = this.franchiseResponse.address;
            this.franchiseData.phoneNumber = this.franchiseResponse.phoneNumber;
            this.franchiseData.postalCode = this.franchiseResponse.postalCode;
            this.franchiseData.firstName = this.franchiseResponse.ownerID.first_name;
            this.franchiseData.lastName = this.franchiseResponse.ownerID.last_name;
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
    async fetchPostalCode() {
      this.isLoading = true;
      try {
        const response = await fetchAllPostalCode();
        if (response.code === 200) {
          this.allPostalCode = response.data
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

    handleInput(event, type) {
      const valueText = event.target.value;
      switch (type){
        case 'email':
          this.franchiseData.email = valueText
          this.validEmail(valueText)
          break
        case 'password':
          this.franchiseData.password = valueText
          this.validPassword(valueText)
          break
        case 'firstName':
          this.franchiseData.firstName = valueText
          this.validTextField(valueText)
          break

        case 'lastName':
          this.franchiseData.lastName = valueText
          this.validTextField(valueText)
          break

        case 'description':
          this.franchiseData.description = valueText
          this.validTextField(valueText)
          break

        // case 'addresse':
        //   this.franchiseData.addresse = valueText
        //   this.validTextField(valueText)
        //   break

        case 'phoneNumber':
          this.franchiseData.phoneNumber = valueText
          this.validTextField(valueText)
          break

        case 'city':
          this.franchiseData.city = valueText
          this.validTextField(valueText)
          break

        case 'name':
          this.franchiseData.name = valueText
          this.validTextField(valueText)
          break

        case 'postalCode':
          this.franchiseData.postalCode = valueText
          this.validTextField(valueText)
          break

        case 'country':
          this.franchiseData.country = valueText
          this.validTextField(valueText)
          break

        case 'batiment':
          this.franchiseData.batiment = valueText
          this.validTextField(valueText)
          break

        case 'numeroRue':
          this.franchiseData.numeroRue = valueText
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
      if (this.actionDetected === ActionCrud.ADD){
        return (
            this.validEmail(this.franchiseData.email) &&
            this.validPassword(this.franchiseData.password) &&
            this.validTextField(this.franchiseData.name) &&
            this.validTextField(this.franchiseData.firstName) &&
            this.validTextField(this.franchiseData.lastName) &&
            this.validTextField(this.franchiseData.address) &&
            this.validTextField(this.franchiseData.phoneNumber) &&
            this.validTextField(this.franchiseData.country) &&
            this.validTextField(this.franchiseData.city) &&
            this.validTextField(this.franchiseData.batiment) &&
            this.validTextField(this.franchiseData.numeroRue) &&
            this.validTextField(this.franchiseData.description) &&
            this.validTextField(this.franchiseData.postalCode)
        );
      }
      else{
        return (

            this.validTextField(this.franchiseData.name) &&
            this.validTextField(this.franchiseData.address) &&
            this.validTextField(this.franchiseData.phoneNumber) &&
            this.validTextField(this.franchiseData.country) &&
            this.validTextField(this.franchiseData.description) &&
            this.validTextField(this.franchiseData.postalCode)
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
    this.actionDetected = (this as any).$route.params.action
    if((this as any).$route.params.action == ActionCrud.EDIT){
      this.fetchDetailFranchise((this as any).$route.params.franchiseID)
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