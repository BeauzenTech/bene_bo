<template>
  <BreadCrumb v-if="action === 'add'" PageTitle="Créer un coupon" />
  <BreadCrumb v-else PageTitle="Detail du coupon" />
  <VabeneAddCoupon :action="action ?? 'add'" :couponID="couponID ?? ''"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddCoupon from "@/components/Vabene/Coupon/AddCoupon/VabeneAddCoupon.vue";
export default defineComponent({
  name: "VabeneAddCouponPage",
  components: {
    BreadCrumb,
    VabeneAddCoupon,
  },

  data() {
    return {
      action: null as string | null,
      couponID: null as string | null,
    };
  },
  mounted() {
    this.action = this.$route.params.action as string;
    this.couponID = this.$route.params.couponID as string;
  },
});
</script>