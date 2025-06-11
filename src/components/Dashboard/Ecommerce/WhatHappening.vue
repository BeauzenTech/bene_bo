<template>
  <div class="card bg-success mb-25 border-0 rounded-0 welcome-box">
    <div class="card-body pe-15 pe-sm-20 pe-md-0 pb-0 pt-15 pt-sm-20">
      <div class="row align-items-center">
        <div class="col-lg-6 col-md-6">
          <div class="title position-relative">
            <h3 class="fw-semibold mb-8">
              Salut, <span class="fw-bold">{{fullName}}!</span>
            </h3>
            <span class="d-block text-black-emphasis fs-md-15 fs-lg-16">
              Voici ce qui se passe dans votre restaurant aujourd'hui
            </span>
          </div>
          <ul class="ps-0 mb-20">
            <li
              class="d-inline-block text-uppercase fw-medium fs-13 text-black-emphasis position-relative"
            >
               VENTES CETTE SEMAINE
              <span class="d-block fw-black lh-1 text-black mt-5 mt-md-10">
                {{orderAmount}} CHF
              </span>
            </li>

          </ul>
        </div>
        <div class="col-lg-6 col-md-6 text-center mt-15 mt-md-0">
          <img
            src="@/assets/images/Resto_new.png"
            alt="welcome-image"
            style="width: 190px; height: auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {ProductModel} from "@/models/product.model";
import {UserGeneralKey} from "@/models/user.generalkey";

export default defineComponent({
  name: "WhatHappening",
  props: {
    orderAmount: {
      type: String as PropType<string>,
      required: true
    },
  },
  data() {
    return {
      fullName: '' as string
    };
  },
  mounted() {
    this.fullName = localStorage.getItem(UserGeneralKey.USER_FIRST_NAME) + ' ' + localStorage.getItem(UserGeneralKey.USER_FIRST_NAME);
  }
});
</script>