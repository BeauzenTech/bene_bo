<template>
  <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
      style="z-index: 9999;"
  >
    <LoaderComponent />
  </div>
  <div v-else
    class="card mb-25 border-0 rounded-0 bg-white letter-spacing lead-info-box"
  >
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30" v-if="franchiseResponse">
      <div class="profile-info d-sm-flex align-items-center">
        <img
          :src="franchiseResponse.logo"
          width="60px"
          height="auto"
          class="rounded"
          alt="user"
          id="logo_franchise"
        />

      </div>
      <div
        class="border-top mt-15 mb-15 mt-sm-20 mb-sm-20 mt-md-25 mb-md-25 mt-lg-30 mb-lg-30"
      ></div>
      <div class="d-flex align-items-center justify-content-between">
        <div class="col">
          <div class="title mt-12 mt-sm-0 mb-4">
            <h5 class="text-black fw-medium mb-8">{{franchiseResponse.name}}</h5>
            <span class="d-block fs-md-15 fs-lg-16 text-dark-emphasis mb-8 w-75">
            {{franchiseResponse.description}}
          </span>
          </div>
          <div class="row">
            <h5 class="fw-medium text-black-emphasis mb-0"></h5>

          </div>
        </div>
        <a
            href="#"
            @click="gotoEditFranchise(franchiseResponse)"
            class="d-inline-block text-decoration-none lh-1 text-muted fw-medium"
        >
          <i
              class="ph-duotone ph-pencil text-black position-relative top-1 fs-16 me-1"
          ></i>
          Modifier
        </a>

      </div>
      <ul class="info mt-25 ps-0 mb-0 list-unstyled">
        <li class="position-relative">
          <div class="icon text-success rounded-circle text-center">
            <i class="flaticon-mail-inbox-app"></i>
          </div>
          <span class="d-block text-black mb-5 fw-semibold">Email</span>
          <a
            href="mailto:johnathon23@gmail.com"
            class="d-inline-block fs-md-15 fs-lg-16 text-primary text-decoration-none"
          >
            {{ franchiseResponse.email }}
          </a>
        </li>
        <li class="position-relative">
          <div class="icon text-info rounded-circle text-center">
            <i class="flaticon-telephone-call"></i>
          </div>
          <span class="d-block text-black mb-5 fw-semibold">Numéro téléphone</span>
          <a
            href="tel:+1-321-456-8756"
            class="d-inline-block fs-md-15 fs-lg-16 text-muted text-decoration-none"
          >
            {{ franchiseResponse.phoneNumber }}
          </a>
        </li>
        <li class="position-relative">
          <div class="icon text-primary rounded-circle text-center">
            <i class="flaticon-gps"></i>
          </div>
          <span class="d-block text-black mb-5 fw-semibold"> Adresse</span>
          <a
            href="#"
            target="_blank"
            class="d-inline-block fs-md-15 fs-lg-16 text-muted text-decoration-none"
          >
            {{ franchiseResponse.postalCode }} - {{ franchiseResponse.address }}
          </a>
        </li>
        <li class="position-relative">
          <div class="icon text-success rounded-circle text-center">
            <i class="flaticon-home"></i>
          </div>
          <span class="d-block text-black mb-5 fw-semibold">
            Restaurants
          </span>
          <span class="d-inline-block fs-md-15 fs-lg-16 text-muted">
            {{allRestaurantByFranchise.length}} Restaurants
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {FranchiseModel} from "@/models/franchise.model";
import {UserGeneralKey} from "@/models/user.generalkey";
import {detailFranchise} from "@/service/api";
import {ApiResponse} from "@/models/Apiresponse";
import {defineComponent} from "vue";
import LoaderComponent from "@/components/Loading/Loader.vue";
import {ActionCrud} from "@/enums/actionCrud.enum";
import {RestaurantModel} from "@/models/restaurant.model";
import {IngredientModel} from "@/models/ingredient.model";
import {FranchiseEnum} from "@/enums/restaurant.enum";


export default defineComponent({
  name: "ProfileContent",
  components: {LoaderComponent},
  data(){
    return{
      franchiseResponse: null as FranchiseModel | null,
      isLoading: false,
      allRestaurantByFranchise: [] as RestaurantModel[]
    }
  },
  methods: {
    gotoEditFranchise(franchise){
      this.$router.push({
        name: "VabeneAddFranchisePage",
        params: { action: ActionCrud.EDIT, franchiseID: franchise.id }
      });
    },
    gotoUpdate(){
      this.$router.push("/ajout-franchise");
    },
    async fetchFranchises() {
      this.isLoading = true;

      try {
        const response = await detailFranchise(FranchiseEnum.id) as ApiResponse<FranchiseModel>;
        console.log(response)
        if (response.code === 200) {
          this.franchiseResponse = response.data as FranchiseModel;
          for (let i = 0; i < this.franchiseResponse.restaurants.length; i++) {
            if(!this.franchiseResponse.restaurants[i].isDeleted){
              this.allRestaurantByFranchise.push(this.franchiseResponse.restaurants[i] as RestaurantModel);
            }
          }



        } else {
          console.log(response.message)
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted(){
    this.fetchFranchises();
  }
})
</script>

<style scoped>
img#logo_franchise{
  width: 250px !important;
  height: auto !important;
}

</style>