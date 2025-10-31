<template>
  <BreadCrumb PageTitle="Liste des coupons" />
  <VabeneCouponList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneCouponList from "@/components/Vabene/Coupon/CouponList/VabeneCouponList.vue";
export default defineComponent({
  name: "VabeneCouponListPage",
  components: {
    BreadCrumb,
    VabeneCouponList,
  },
});
</script>