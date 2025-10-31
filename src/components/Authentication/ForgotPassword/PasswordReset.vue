<template>
  <div class="row justify-content-center">
    <div class="col-md-10 col-lg-8 col-xl-9 col-xxl-8 col-xxxl-6">
      <div class="card mb-25 border-0 rounded-0 bg-white authentication-card">
        <div class="card-body letter-spacing">
          <div class="logo-auth"></div>
          <div v-if="step === '1'">
            <h4 class="text-black fw-bold mb-0 text-center">Mot de passe oublié?</h4>
            <p class="mb-0 fs-md-15 fs-lg-16 text-paragraph text-center sub-text">
              Saisissez votre adresse e-mail ci-dessous et nous vous enverrons le mot de passe récupéré.
            </p>
            <form>
              <div class="form-group mb-15 mb-sm-20">
                <label class="d-block text-black fw-semibold mb-10">
                  Votre adresse email
                </label>
                <input
                    type="email"
                    class="form-control shadow-none rounded-0 text-black"
                    :class="{ 'is-valid': validEmail(userData.email) }"
                    placeholder="e.g. adam127704@gmail.com"
                    v-model="userData.email"
                    @change="(event) => handleInput(event, 'email')"
                    required
                />
              </div>
              <LoaderComponent
                  v-if="isLoading"
              />

              <button
                  v-else
                  class="default-btn transition border-0 fw-medium text-white rounded-1 fs-md-15 fs-lg-16 bg-success d-block w-100 mt-4"
                  type="button"
                  :disabled="!isFormValidEmail"
                  :class="{ 'opacity-50 cursor-not-allowed': !isFormValidEmail }"
                  @click="resetPasswordStepOne"
              >
                Reinitialiser
              </button>
              <div class="text-center mt-15 mt-sm-20 mt-md-25">
                <router-link
                    to="/"
                    class="link-btn text-decoration-none text-primary fw-medium fs-md-15 fs-lg-16 position-relative"
                >
                  <i class="ph-bold ph-arrow-left"></i>
                  Retour
                </router-link>
              </div>
            </form>
          </div>
          <div v-if="step === '2'">
            <h4 class="text-black fw-bold mb-0 text-center">Réinitialiser votre mot de passe?</h4>
            <p class="mb-0 fs-md-15 fs-lg-16 text-paragraph text-center sub-text">
              Saisissez le code de réinitialisation ainsi que votre nouveau mot de passe.
            </p>
            <form>
              <div class="form-group mb-15 mb-sm-20">
                <label class="d-block text-black fw-semibold mb-10">
                  Code de réinitialisation
                </label>
                <input
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]{6}"
                    maxlength="6"
                    class="form-control shadow-none rounded-0 text-black"
                    :class="{ 'is-valid': validCode(userData.code) }"
                    placeholder="Entrez le code à 6 chiffres"
                    v-model="userData.code"
                    @change="(event) => handleInput(event, 'code')"
                    required
                />
              </div>
              <div class="form-group mb-15 mb-sm-20">
                <label class="d-block text-black fw-semibold mb-10">
                  Nouveau mot de passe
                </label>
                <input
                    type="password"
                    class="form-control shadow-none rounded-0 text-black"
                    :class="{ 'is-valid': validPassword(userData.password) }"
                    placeholder="e.g. e.g. ******"
                    v-model="userData.password"
                    @change="(event) => handleInput(event, 'password')"
                    required
                />
              </div>
              <div class="form-group mb-15 mb-sm-20">
                <label class="d-block text-black fw-semibold mb-10">
                  Confirmer votre mot de passe
                </label>
                <input
                    type="password"
                    class="form-control shadow-none rounded-0 text-black"
                    placeholder="e.g. ******"
                    v-model="userData.confirmPassword"
                    @change="(event) => handleInput(event, 'confirmPassword')"
                    required
                />
                <span v-if="!isConform(userData.confirmPassword)" class="text-danger">Mot de passe incorrect.</span>
              </div>
              <LoaderComponent
                  v-if="isLoading"
              />

              <button
                  v-else
                  class="default-btn transition border-0 fw-medium text-white rounded-1 fs-md-15 fs-lg-16 bg-success d-block w-100 mt-4"
                  type="button"
                  :disabled="!isFormValidPasswordReset"
                  :class="{ 'opacity-50 cursor-not-allowed': !isFormValidPasswordReset }"
                  @click="resetPasswordStepTwo"
              >
                Reinitialiser
              </button>
              <div class="text-center mt-15 mt-sm-20 mt-md-25">
                <router-link
                    to="/"
                    class="link-btn text-decoration-none text-primary fw-medium fs-md-15 fs-lg-16 position-relative"
                >
                  <i class="ph-bold ph-arrow-left"></i>
                  Retour
                </router-link>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LoaderComponent from "@/components/Loading/Loader.vue";
import {getUserData, loginCheck, resetPasswordStepOne, resetPasswordStepTwo} from "@/service/api";
import {UserGeneralKey} from "@/models/user.generalkey";
import {useToast} from "vue-toastification";
import {defineComponent} from "vue";
import {AxiosError} from "axios";

export default defineComponent({
  name: "PasswordReset",
  components: { LoaderComponent },
  data(){
    return{
      step: '1',
      userData: {
        code: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      isLoading: false,
    }
  },
  methods: {

    gotoLogin(){
      this.$router.push({ name: 'LoginPage' })
    },
    async resetPasswordStepOne() {
      const payload = {
        "email": this.userData.email
      }
      this.isLoading = true;
      try {
        const response = await resetPasswordStepOne(payload);
        if (response.code === 200) {
          this.toast.success(response.message)
          this.step = '2'
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
    async resetPasswordStepTwo() {
      this.isLoading = true;
      try {
        const payload = {
          "code": this.userData.code,
          "email": this.userData.email,
          "password": this.userData.password
        }
        const response = await resetPasswordStepTwo(payload);

        if (response.code === 200 || response.code == 201) {
          this.toast.success(response.message)
            this.gotoLogin()
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
        case 'code':
          this.userData.code = valueText
          this.validCode(valueText)
          break
        case 'email':
          this.userData.email = valueText
          this.validEmail(valueText)
          break
        case 'password':
          this.userData.password = valueText
          this.validPassword(valueText)
          break
        case 'confirmPassword':
          this.userData.confirmPassword = valueText
          this.validPassword(valueText)
          break
      }
    },
    validCode(code: string): boolean {
      const trimmedCode = code.trim();
      const regex = /^\d{6}$/; // correspond à exactement 6 chiffres
      return regex.test(trimmedCode);
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
    isConform(password){
      return (this.userData.password === password)
    },
  },
  computed: {
    isFormValidEmail() {
      return (
          this.validEmail(this.userData.email)
      );
    },

    alertNonConform(){
      return this.userData.password != this.userData.confirmPassword
    },

    isFormValidPasswordReset() {
      return (
          this.validCode(this.userData.code) &&
          this.validPassword(this.userData.password) &&
          !this.alertNonConform
      );
    }
  },
  setup() {
    // Get toast interface
    const toast = useToast();


    return { toast }
  },

})
</script>


<style scoped>
div.row.justify-content-center{
  position: relative;
  right: 10%;
}
div.logo-auth {
  position: relative;
  left: 25%;
  margin-bottom: 30px;
  background-image: url('@/assets/images/logo.webp') ;
  background-size: contain;
  background-repeat: no-repeat;
  height: 100px;
  width: auto;
}
button:disabled {
  background-color: #c5c5c5 !important;
  cursor: not-allowed;
}
</style>