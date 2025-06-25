<template>
  <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
      style="z-index: 9999;"
  >
    <LoaderComponent />
  </div>

  <div class="row" v-else>
    <div class="col-lg-5 col-xl-4">
      <LeadsInformation :lead="categorieResponse" />
    </div>
    <div class="col-lg-7 col-xl-8">
      <div class="leads-details-tabs">
        <ul class="nav nav-tabs border-0 mb-25" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
                class="nav-link fs-md-15 fs-lg-16 fw-medium border-0 rounded-0 d-block text-center w-100 active"
                id="tasks-tab"
                data-bs-toggle="tab"
                data-bs-target="#tasks-tab-pane"
                type="button"
                role="tab"
                aria-controls="tasks-tab-pane"
                aria-selected="true"
            >
              SPECIFICATION DU CLIENT
            </button>
          </li>


        </ul>
        <div class="tab-content" id="myTabContent">
          <div
              class="tab-pane fade show active"
              id="tasks-tab-pane"
              role="tabpanel"
              tabindex="0"
          >
            <div class="card mb-3" v-if="categorieResponse">
              <div class="card-header bg-primary text-white">
                Adresse de livraison
              </div>
              <div class="card-body p-3">
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Adresse :</div>
                  <div class="col-sm-8">{{ categorieResponse.address ?? '-' }}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Ville :</div>
                  <div class="col-sm-8">{{categorieResponse.city ?? '-'}}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Rue :</div>
                  <div class="col-sm-8">{{ categorieResponse.rue ?? '-' }}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Batiment :</div>
                  <div class="col-sm-8">{{ categorieResponse.rue ?? '-' }}</div>
                </div>
              </div>
            </div>
            <div class="card mb-3" v-if="categorieResponse">
              <div class="card-header bg-warning text-white">
                Adresse de facturation
              </div>
              <div class="card-body p-3">
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Adresse :</div>
                  <div class="col-sm-8">{{ categorieResponse.address ?? '-' }}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Ville :</div>
                  <div class="col-sm-8">{{categorieResponse.city ?? '-'}}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Rue :</div>
                  <div class="col-sm-8">{{ categorieResponse.rue ?? '-' }}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Batiment :</div>
                  <div class="col-sm-8">{{ categorieResponse.rue ?? '-' }}</div>
                </div>
              </div>
            </div>
            <div class="card mb-3" v-if="categorieResponse">
              <div class="card-header bg-primary text-white">
                Analyse lors des commandes
              </div>
              <div class="card-body p-3">
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Points d'attention spécifiques :</div>
                  <div class="col-sm-8">{{ analyserCommande(categorieResponse.remarqueCommande) }}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Historique des types de commandes :</div>
                  <div class="col-sm-8">{{analyserTypesCommandes(categorieResponse.typesCommandes)}}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Demande de couvert lors des commandes:</div>
                  <div class="col-sm-8">{{analyserDemandeCouverts(categorieResponse.demandeCouverts)}}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Type de cuisson préféré:</div>
                  <div class="col-sm-8">{{analyserListeCuisson(categorieResponse.listeCuisson)}}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-4 fw-bold">Habitudes de paiement du client:</div>
                  <div class="col-sm-8">{{analyserMoyensPaiement(categorieResponse.moyenPaiements)}}</div>
                </div>
              </div>
            </div>

          </div>


        </div>
      </div>
    </div>
  </div>




  <!--  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">-->
<!--    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">-->
<!--      <form @submit.prevent="">-->
<!--        <div class="row">-->
<!--          <div class="col-md-6">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                Nom *-->
<!--              </label>-->
<!--              <input-->
<!--                type="text"-->
<!--                class="form-control shadow-none rounded-0 text-black"-->
<!--                placeholder="e.g. "-->
<!--                v-model="categorieData.firstName"-->
<!--                @change="(event) => handleInput(event, 'firstName')"-->
<!--                :class="{ 'is-valid': validTextField(categorieData.firstName) }"-->
<!--                required-->
<!--                disabled-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="col-md-6">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                prenom *-->
<!--              </label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control shadow-none rounded-0 text-black"-->
<!--                  placeholder="e.g. "-->
<!--                  v-model="categorieData.lastName"-->
<!--                  @change="(event) => handleInput(event, 'firstName')"-->
<!--                  :class="{ 'is-valid': validTextField(categorieData.firstName) }"-->
<!--                  required-->
<!--                  disabled-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="col-md-6">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                email *-->
<!--              </label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control shadow-none rounded-0 text-black"-->
<!--                  placeholder="e.g. "-->
<!--                  v-model="categorieData.email"-->
<!--                  @change="(event) => handleInput(event, 'email')"-->
<!--                  :class="{ 'is-valid': validTextField(categorieData.email) }"-->
<!--                  required-->
<!--                  disabled-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="col-md-6">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                Numero telephone *-->
<!--              </label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control shadow-none rounded-0 text-black"-->
<!--                  placeholder="e.g. "-->
<!--                  v-model="categorieData.phoneNumber"-->
<!--                  @change="(event) => handleInput(event, 'phoneNumber')"-->
<!--                  :class="{ 'is-valid': validTextField(categorieData.phoneNumber) }"-->
<!--                  required-->
<!--                  disabled-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="col-md-6">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                adresse *-->
<!--              </label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control shadow-none rounded-0 text-black"-->
<!--                  placeholder="e.g. "-->
<!--                  v-model="categorieData.address"-->
<!--                  @change="(event) => handleInput(event, 'address')"-->
<!--                  :class="{ 'is-valid': validTextField(categorieData.address) }"-->
<!--                  required-->
<!--                  disabled-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->


<!--          <div class="col-md-6">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                Ville *-->
<!--              </label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control shadow-none rounded-0 text-black"-->
<!--                  placeholder="e.g. "-->
<!--                  v-model="categorieData.city"-->
<!--                  @change="(event) => handleInput(event, 'city')"-->
<!--                  :class="{ 'is-valid': validTextField(categorieData.city) }"-->
<!--                  required-->
<!--                  disabled-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->


<!--          <div class="col-md-12">-->
<!--            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
<!--              <label class="d-block text-black fw-semibold mb-10">-->
<!--                Ville *-->
<!--              </label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control shadow-none rounded-0 text-black"-->
<!--                  placeholder="e.g. "-->
<!--                  v-model="categorieData.codePostal"-->
<!--                  @change="(event) => handleInput(event, 'codePostal')"-->
<!--                  :class="{ 'is-valid': validTextField(categorieData.codePostal) }"-->
<!--                  required-->
<!--                  disabled-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->





<!--        </div>-->
<!--      </form>-->
<!--    </div>-->
<!--  </div>-->
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
import LeadsInformation from "@/components/CRM/LeadDetails/LeadsInformation.vue";


export default defineComponent({
  name: "VabeneAddCustomer",
  components: {
    LoaderComponent,
    LeadsInformation

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
    loaded(){
      setTimeout(() => {
        this.isLoading = true
      }, 1500)
      this.isLoading = false
    },
    analyserListeCuisson(listeCuisson: (string | null)[]): string {
      if (!listeCuisson || listeCuisson.length === 0) {
        return "-";
      }

      const filtered = listeCuisson.filter(val => val !== null) as string[];
      if (filtered.length === 0) {
        return "-";
      }

      const counts = filtered.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = filtered.length;
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const [topCuisson, topCount] = sorted[0];

      if (topCount === total) {
        return `Le client préfère systématiquement une cuisson "${topCuisson}".`;
      } else if (topCount > total / 2) {
        return `Le client préfère majoritairement la cuisson "${topCuisson}".`;
      } else {
        return `Les préférences de cuisson du client sont variées. Cuisson la plus fréquente : "${topCuisson}" (${topCount}/${total}).`;
      }
    },
    getMoyenPaiementName(paiement){
      switch (paiement){
        case 'Cash_livraison':
          return 'A la livraison'
        default:
          return 'En ligne'
      }
    },
    analyserMoyensPaiement(moyenPaiements: (string | null)[]): string {
      if (!moyenPaiements || moyenPaiements.length === 0) {
        return "-";
      }

      const filtered = moyenPaiements.filter(val => val !== null) as string[];
      if (filtered.length === 0) {
        return "-";
      }

      const counts = filtered.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = filtered.length;
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const [topMode, topCount] = sorted[0];

      if (topCount === total) {
        return `Le client utilise exclusivement le mode de paiement "${this.getMoyenPaiementName(topMode)}".`;
      } else if (topCount > total / 2) {
        return `Le client privilégie majoritairement le paiement par "${this.getMoyenPaiementName(topMode)}".`;
      } else {
        return `Le client utilise plusieurs moyens de paiement. Mode dominant : "${this.getMoyenPaiementName(topMode)}" (${topCount}/${total}).`;
      }
    },
    analyserDemandeCouverts(demandeCouverts: (boolean | number | null)[]): string {
      if (!demandeCouverts || demandeCouverts.length === 0) {
        return "-";
      }

      const filtered = demandeCouverts.filter(val => val !== null) as (boolean | number)[];
      if (filtered.length === 0) {
        return "-";
      }

      const demandes = filtered.filter(val => val === true || val === 1).length;
      const refus = filtered.filter(val => val === false || val === 0).length;
      const total = filtered.length;

      if (demandes === total) {
        return "Le client demande systématiquement des couverts avec ses commandes.";
      } else if (refus === total) {
        return "Le client ne demande jamais de couverts.";
      } else if (demandes > total / 2) {
        return "Le client demande les couverts de façon majoritaire.";
      } else {
        return "Le client ne demande que rarement des couverts.";
      }
    },
    getTypeOrderName(orderType){
      switch (orderType){
        case 'delivery':
          return 'A livrer'
        default:
          return 'A emporter'
      }
    },
    analyserTypesCommandes(typesCommandes: (string | null)[]): string {
      if (!typesCommandes || typesCommandes.length === 0) {
        return "-";
      }

      const filtered = typesCommandes.filter(val => val !== null);
      if (filtered.length === 0) {
        return "-";
      }

      const counts = filtered.reduce((acc, val) => {
        acc[val!] = (acc[val!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = filtered.length;
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const [topType, topCount] = sorted[0];

      if (topCount > total / 2) {
        return `Le client passe principalement des commandes de type "${this.getTypeOrderName(topType)}" (${topCount}/${total}).`;
      } else {
        return `Le client présente une variété de types de commandes. Type dominant : "${this.getTypeOrderName(topType)}" (${topCount}/${total}).`;
      }
    },
    analyserCommande(remarqueCommande: (string | null)[]): string {
      if (!remarqueCommande || remarqueCommande.length === 0) {
        return "-";
      }
      const filtered = remarqueCommande.filter(val => val !== null);
      if (filtered.length === 0) {
        return "-";
      }
      const counts = filtered.reduce((acc, val) => {
        acc[val!] = (acc[val!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const total = filtered.length;
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const [topType, topCount] = sorted[0];
      if (topCount > total / 2) {
        return `Commande majoritairement "${topType.toLowerCase()}" (${topCount}/${total}).`;
      } else {
        return `Commande variée sans prédominance nette. Type dominant : "${topType.toLowerCase()}" (${topCount}/${total}).`;
      }
    },

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