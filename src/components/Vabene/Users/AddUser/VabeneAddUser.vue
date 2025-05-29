<template>
  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
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
                required
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
                v-model="userData.email"
                @change="(event) => handleInput(event, 'email')"
                :class="{ 'is-valid': validEmail(userData.email) }"
                class="form-control shadow-none rounded-0 text-black"
                placeholder="e.g. adam127704@gmail.com"
                required
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
                required
              />
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
                  required
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
                Batiment
              </label>
              <input
                  type="text"
                  class="form-control shadow-none rounded-0 text-black"
                  placeholder="e.g. Vaderna"
                  v-model="userData.batiment"
                  @change="(event) => handleInput(event, 'batiment')"
                  :class="{ 'is-valid': validTextField(userData.batiment) }"
                  required
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
                  placeholder="e.g. 43eme"
                  v-model="userData.numeroRue"
                  @change="(event) => handleInput(event, 'numeroRue')"
                  :class="{ 'is-valid': validTextField(userData.numeroRue) }"
                  required
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
                <option value="ROLE_ADMIN" selected>Administrateur</option>
                <option value="ROLE_CLIENT" selected>Client</option>
              </select>
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
                Ajouter un utilisateur
              </button>
              <button
                type="button"
                @click="goBack"
                class="bg-transparent p-0 border-0 text-danger lh-1 fw-medium"
              >
                <i
                  class="flaticon-delete lh-1 me-1 position-relative top-2"
                ></i>
                <span class="position-relative">Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";


import {createUser, fetchAllPostalCode} from "@/service/api";

import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";

export default defineComponent({
  name: "VabeneAddUser",
  components: {
    LoaderComponent
    // ImageUpload,
  },
  data(){
    return{
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
      allPostalCode: []
    }
  },
  methods: {
    clearData(){
      this.userData = {}
    },
    goBack() {
      this.$router.back()
    },
    async createNewAccount() {
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
        "numeroRue": this.userData.numeroRue
      }
      try {
        const response = await createUser(payload);
        console.log(response);
        if (response.code === 201) {
          this.toast.success(response.message)
          this.clearData()
        } else {
          this.toast.error(response.message)
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          this.toast.error(error.response.data.message)
        }
        console.error(error);
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
        if (error.response && error.response.data && error.response.data.message) {
          this.toast.error(error.response.data.message)
        }
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
    isFormValid() {
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