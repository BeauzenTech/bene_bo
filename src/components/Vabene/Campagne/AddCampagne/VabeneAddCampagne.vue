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

          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Choix de la cible
              </label>
              <v-select
                  v-model="restaurantSelected"
                  :options="originalRestaurant"
                  label="name"
                  :reduce="restaurant => restaurant.id"
                  placeholder="Restaurant"
              />
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
                  :reduce="user => user.email"
                  placeholder="Selectionner un client"
              />

              <button
                  type="button"
                  @click="addUserToDestination"
                  class="bg-transparent p-0 border-0 mt-2 text-warning lh-1 fw-medium"
                  :disabled="!userSelected"
              >
                <i
                    class="flaticon-users-group lh-1 me-1 position-relative top-2"
                ></i>
                <span class="position-relative">Ajouter à la campagne</span>
              </button>
              
              <!-- Liste des destinataires -->
              <div v-if="categorieData.destination.length > 0" class="mt-3">
                <div class="alert alert-info">
                  <i class="fas fa-info-circle me-2"></i>
                  <strong>{{ categorieData.destination.length }}</strong> destinataire(s) sélectionné(s)
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="(email, index) in categorieData.destination"
                    :key="index"
                    class="badge bg-primary d-flex align-items-center"
                  >
                    {{ email }}
                    <button
                      type="button"
                      class="btn-close btn-close-white ms-2"
                      @click="removeDestination(index)"
                      title="Supprimer ce destinataire"
                    ></button>
                  </span>
                </div>
              </div>
            </div>

          </div>

          <div class="col-md-12" v-if="actionDetected == ActionCrud.ADD">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Planifier l'envoi (optionnel)
              </label>
              <input
                type="datetime-local"
                class="form-control shadow-none rounded-0 text-black"
                v-model="scheduledAt"
                placeholder="Sélectionner une date et heure"
              />
              <small class="text-muted">
                <i class="fas fa-info-circle me-1"></i>
                Laissez vide pour envoyer immédiatement
              </small>
            </div>
          </div>


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
                Envoyer la campagne
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
  createCampagne,
  detailCampagne,
  getAllCustomers,
  listeRestaurant,
  updateCategorie,
  uploadFile
} from "@/service/api";

import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import {AxiosError} from 'axios';
import {ApiResponse, PaginatedCustomer, PaginatedRestaurant} from "@/models/Apiresponse";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {CampagneModel} from "@/models/campagne.model";
import {UserGeneralKey, UserRole} from "@/models/user.generalkey";
import {CustomerModel} from "@/models/customer.model";
import {RestaurantModel} from "@/models/restaurant.model";


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
    categorieID: {
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
      // Champs requis par le backend
      campaignType: 'group' as string, // 'group' ou 'individual'
      campaignTarget: 'all_restaurants' as string, // 'all_restaurants', 'specific_restaurant', 'specific_user'
      scheduledAt: null as string | null,
      isLoading: false,
      logoUpload: null,
      categorieResponse: null as CampagneModel | null,
      actionDetected: null as string | null,
      originalUsers: [] as CustomerModel[], // Stockage des utilisateurs originaux
      userSelected: null as string | null,
      sendingType: '' as string,
      typeSending: ["Individuel", "Groupé"] as string[],

      payloadCampagne: {
        title: '',
        message: '',
        destination: []
      },
      originalRestaurant: [] as RestaurantModel[], // Stockage des utilisateurs originaux
      restaurantSelected: null as string | null,
      restaurantId: null as string | null,
      fakeAllOptionFranchise: {
        id: 'all',
        name: 'Tous les restaurants'
      }
    }
  },
  methods: {
    async fetchRestaurants(page = 1) {
        this.isLoading = true;
        try {
          console.log('fetchRestaurants');
          const response = await listeRestaurant(page) as ApiResponse<PaginatedRestaurant>;

          if (response.code === 200) {
            if (response.data) {
              this.originalRestaurant = [(this.fakeAllOptionFranchise as RestaurantModel), ...response.data as any];
              this.restaurantSelected = "Tous les restaurants"
              await this.fetchUsers(1)
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

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    goBack() {
      this.$router.back()

    },
    // async sendingCampagne(){
    //     for (let i = 0; i < this.categorieData.destination.length; i++) {
    //       const destination = this.categorieData.destination[i];
    //       await this.createNewCategorie(destination);
    //     }
    //     this.toast.success("Votre campagne a été envoyé avec succès.")
    //     this.clearData()
    //
    // },
    getUserIdFromEmail(email: string | null): string | null {
      if (!email) return null;
      const user = this.originalUsers.find(u => u.email === email);
      return user ? user.id : null;
    },
    async createNewCategorie() {
        this.isLoading = true;
        const message = this.stripHtmlTags(this.categorieData.message)
        
        // Construire le payload selon les champs requis par le backend
        const payload = {
          "title": this.categorieData.title,
          "message": message,
          "destination": this.categorieData.destination,
          "type": this.campaignType,
          "target": this.campaignTarget === 'all_restaurants' ? 'all_restaurants' : 'restaurant',
          "restaurantId": this.restaurantSelected !== "Tous les restaurants" ? this.restaurantSelected : null,
          "userId": this.sendingType === 'Individuel' ? this.getUserIdFromEmail(this.userSelected) : null,
          "scheduledAt": this.scheduledAt
        }
        
        if (this.sendingType === 'Individuel' && this.userSelected && !this.categorieData.destination.includes(this.userSelected)) {
          payload.destination.push(this.userSelected);
        }
        
        console.log('Payload envoyé au backend:', payload);
        
        try {
          const response = await createCampagne(payload);
          if(response.code == 200 || response.code == 201){
                this.toast.success(response.message)
                this.clearData()
          }
          else{
            this.toast.error(response.message);
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
        const response = await getAllCustomers(page, 500);
        if (response.code === 200) {
          if (response.data?.data) {
            this.originalUsers = response.data.data.filter(item => item.newsletter && item.promotions);
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
    async getCustomerByOption(idResto?: string) {
      this.isLoading = true;
      try {
        const response: any = await getAllCustomers(1, 500);
        if (response.code === 200) {
          if (response.data) {
           console.log('getCustomerByOption', response.data);
           console.log('response.data.data (tableau des clients):', response.data.data);
           // Log pour voir les valeurs newsletter et promotions
           response.data.data.forEach((user, index) => {
             if (index < 5) { // Afficher seulement les 5 premiers pour debug
               console.log(`User ${index}:`, {
                 email: user.email,
                 newsletter: user.acceptNewsletter,
                 promotions: user.acceptPromotions
               });
             }
           });
            let filteredUsers = response.data.data.filter(item => item.acceptNewsletter && item.acceptPromotions);
            
            if (idResto && idResto !== "Tous les restaurants") {
              // Filtrer par restaurant si un restaurant spécifique est sélectionné
              // Note: CustomerModel n'a pas de restaurantId, on garde tous les utilisateurs pour l'instant
              // filteredUsers = filteredUsers.filter(user => user.restaurantId === idResto);
            }
            
            this.originalUsers = filteredUsers;
            console.log('Utilisateurs filtrés:', this.originalUsers);
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
    addUserToDestination() {
      if (this.userSelected && !this.categorieData.destination.includes(this.userSelected)) {
        this.categorieData.destination.push(this.userSelected);
        this.toast.success("Utilisateur ajouté à la campagne");
        this.userSelected = null; // Réinitialiser la sélection
      } else if (this.userSelected && this.categorieData.destination.includes(this.userSelected)) {
        this.toast.warning("Cet utilisateur est déjà dans la liste");
      } else {
        this.toast.warning("Veuillez sélectionner un utilisateur");
      }
    },
    removeDestination(index: number) {
      const removedEmail = this.categorieData.destination[index];
      this.categorieData.destination.splice(index, 1);
      this.toast.info(`Destinataire ${removedEmail} supprimé`);
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
      if(this.logoUpload && this.actionDetected === 'add'){
        this.isLoading = true;
        try {
          const response = await uploadFile(this.logoUpload);
          if (response.code === 200 || response.code === 201) {
            this.categorieData.icone = response.data
            // await this.createNewCategorie()
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
      this.fetchDetailCategorie((this as any).$route.params.campagneID)
    }

    this.fetchRestaurants(1)
    // const action = (this as any).$route.params.action
  },
  watch:{
    restaurantSelected(this: any, newVal){
      if (!newVal) return
      this.restaurantSelected = newVal as string;
      
      // Mettre à jour le target selon le restaurant sélectionné
      if(newVal !== "Tous les restaurants"){
        this.campaignTarget = 'specific_restaurant';
        this.getCustomerByOption(this.restaurantSelected)
      }
      else{
        this.campaignTarget = 'all_restaurants';
        this.getCustomerByOption();
      }
    },
    userSelected(this: any, newVal){
      // Ne pas ajouter automatiquement, laisser l'utilisateur cliquer sur le bouton
      console.log('Utilisateur sélectionné:', newVal);
    },
    sendingType(this: any, newVal){
      if (!newVal) return
      const newValue = newVal as string
      
      // Mettre à jour le type de campagne
      if(newValue === 'Individuel'){
        this.campaignType = 'individual';
        this.campaignTarget = 'specific_user';
        // Vider la liste des destinataires pour le mode individuel
        this.categorieData.destination = [];
      } else if(newValue === 'Groupé'){
        this.campaignType = 'group';
        this.campaignTarget = this.restaurantSelected !== "Tous les restaurants" ? 'specific_restaurant' : 'all_restaurants';
        
        // Vider la liste et ajouter tous les utilisateurs pour le type groupé
        this.categorieData.destination = [];
        for(let i=0; i<this.originalUsers.length; i++){
          this.categorieData.destination.push(this.originalUsers[i].email);
        }
        this.toast.info(`${this.originalUsers.length} utilisateurs ajoutés automatiquement`);
      }
      
      this.userSelected = null as string | null;
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