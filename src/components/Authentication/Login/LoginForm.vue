<template>
  <div class="row justify-content-center">
    <div class="col-md-10 col-lg-8 col-xl-9 col-xxl-8 col-xxxl-6">
      <div class="card mb-25 border-0 rounded-0 bg-white authentication-card">
        <div class="card-body letter-spacing">
          <div class="logo-auth"></div>
          <h4 class="text-black fw-bold mb-0 text-center">
            Connexion
          </h4>
          <form @submit.prevent="authLogin">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Email
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
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Mot de passe
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
            <div
                class="d-flex align-items-center justify-content-between mb-15 mb-md-20"
            >
              <div
                  class="form-check form-check-primary mb-0 fs-md-15 fs-lg-16 text-muted lh-1"
              >
                <input
                    class="form-check-input shadow-none"
                    type="checkbox"
                    id="remember-me"
                />
                <label class="form-check-label" for="remember-me">
                  Se souvenir
                </label>
              </div>
              <router-link
                  to="/password-oublie"
                  class="forgot-password-btn fs-md-15 fs-lg-16 text-decoration-none position-relative text-primary"
              >
                Mot de passe oublié?
              </router-link>
            </div>


              <LoaderComponent
                  v-if="isLoading"
              />

            <button
                v-else
                class="default-btn transition border-0 fw-medium text-white rounded-1 fs-md-15 fs-lg-16 bg-success d-block w-100 mt-4"
                type="submit"
                :disabled="!isFormValid"
                :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
            >
              Se connecter
            </button>
            <!-- <span
              class="d-block text-muted text-center mt-15 mt-md-30 mb-12 mb-md-20 fs-md-15 fs-lg-16"
            >
              Don’t have an account?
            </span> -->
            <!-- <router-link
              to="/register"
              class="default-btn with-border transition fw-medium rounded-1 fs-md-15 fs-lg-16 d-block w-100 text-decoration-none text-center"
            >
              Create Account
            </router-link> -->
            <!-- <span
              class="d-block or text-muted text-center mt-15 mb-15 mt-md-20 mb-md-20 fs-md-15 fs-lg-16 position-relative z-1 lh-1"
            >
              <span class="d-inline-block bg-white">Or</span>
            </span> -->
            <!-- <ul class="socials ps-0 mb-0 list-unstyled text-center">
              <li class="d-inline-block">
                <button
                  type="button"
                  class="d-block rounded-circle text-center position-relative facebook border-0 p-0"
                >
                  <i class="ph-fill ph-facebook-logo"></i>
                </button>
              </li>
              <li class="d-inline-block">
                <button
                  type="button"
                  class="d-block rounded-circle text-center position-relative google border-0 p-0"
                >
                  <i class="ph-bold ph-google-logo"></i>
                </button>
              </li>
              <li class="d-inline-block">
                <button
                  type="button"
                  class="d-block rounded-circle text-center position-relative twitter border-0 p-0"
                >
                  <i class="ph-fill ph-twitter-logo"></i>
                </button>
              </li>
              <li class="d-inline-block">
                <button
                  type="button"
                  class="d-block rounded-circle text-center position-relative linkedin border-0 p-0"
                >
                  <i class="ph-fill ph-linkedin-logo"></i>
                </button>
              </li>
            </ul> -->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginCheck, getUserData } from "@/service/api";
import LoaderComponent from "@/components/Loading/Loader.vue";
import { useToast } from "vue-toastification";
import {UserGeneralKey} from "@/models/user.generalkey";
import { debugToken, clearInvalidToken } from "@/utils/debug-token";


export default {
  name: "LoginForm",
  components: { LoaderComponent },
  data(){
    return{
      userData: {
        email: '',
        password: ''
      },
      isLoading: false,
    }
  },
  methods: {
    gotoHome(){
      this.$router.push({ name: 'VabeneDashPage' })
    },
    async authLogin() {
      this.isLoading = true;
      try {
        // Nettoyer les tokens invalides avant la connexion
        clearInvalidToken();
        
        const response = await loginCheck(this.userData);
        if (response.code === 200) {
          // Vérifier la structure de la réponse pour trouver le token
          const token = response.token || response.data?.token || response.data?.access_token;
          
          if (token) {
            localStorage.setItem(UserGeneralKey.USER_TOKEN, token);
            debugToken(); // Déboguer le token après stockage
            this.toast.success(response.message);
            await this.getUserData();
            this.gotoHome();
          } else {
            console.error('🔐 Token non trouvé dans la réponse:', response);
            this.toast.error('Token d\'authentification manquant dans la réponse');
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
           if(error.response.data.message === 'Invalid credentials.'){
             this.toast.error('Nom utilisateur ou mot de passe invalid.');
           }
           else {
             this.toast.error(error.response.data.message);
           }
        }
        console.error('🔐 Erreur de connexion:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async getUserData() {
      this.isLoading = true;
      try {
        // Vérifier le token avant d'appeler getUserData
        const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
        
        if (!token || token === 'undefined' || token === 'null') {
          this.toast.error('Token d\'authentification manquant');
          return;
        }
        
        const response = await getUserData();
        if (response.code === 200) {
          UserGeneralKey.saveUserDatA(response.data);
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          this.toast.error(error.response.data.message);
        }
        console.error('🔐 Erreur getUserData:', error);
      } finally {
        this.isLoading = false;
      }
    },
    handleInput(event, type) {
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

    }
  },
  computed: {
    isFormValid() {
      return (
          this.validEmail(this.userData.email) &&
          this.validPassword(this.userData.password)
      );
    }
  },
  setup() {
    // Get toast interface
    const toast = useToast();


    return { toast }
  },
  mounted() {
    // Nettoyer les tokens invalides au démarrage
    const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
    if (token === 'undefined' || token === 'null' || !token) {
      localStorage.removeItem(UserGeneralKey.USER_TOKEN);
    }
    
    if(UserGeneralKey.isTokenValid()){
      this.gotoHome()
    }
  }
};
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