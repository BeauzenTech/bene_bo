<template>
  <div
    class="card mb-25 border-0 rounded-0 bg-white letter-spacing lead-info-box"
  >
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30" v-if="lead">
      <div class="profile-info d-sm-flex align-items-center">
        <img
            v-if="lead.user && lead.user.profil_picture"
            :src="lead.user.profil_picture"
            class="rounded w-90 h-90"
            alt="user"
        />
        <img
            v-else
          src="@/assets/images/user/avatar.png"

          class="rounded w-90 h-90"
          alt="user"
        />
        <div class="title mt-12 mt-sm-0">
          <h5 class="fs-md-15 fw-medium mb-8">{{lead.civilite ?? '-'}}</h5>
          <span class=" d-block fs-md-15 fs-lg-16 text-dark-emphasis mb-8">
            {{lead.firstName}} {{lead.lastName}}
          </span>
          <span class="d-block fw-bold badge text-outline-success">  {{lead.type === 'customer' ? 'Client' : 'Entreprise'}} </span>
        </div>
      </div>
      <div
        class="border-top mt-15 mb-15 mt-sm-20 mb-sm-20 mt-md-25 mb-md-25 mt-lg-30 mb-lg-30"
      ></div>
      <div class="d-flex align-items-center justify-content-between">
        <h5 class="fw-medium text-black-emphasis mb-0">Information générale</h5>
<!--        <router-link-->
<!--          to="/lead-details"-->
<!--          class="d-inline-block text-decoration-none lh-1 text-muted fw-medium"-->
<!--        >-->
<!--          <i-->
<!--            class="ph-duotone ph-pencil text-black position-relative top-1 fs-16 me-1"-->
<!--          ></i>-->
<!--          Edit-->
<!--        </router-link>-->
      </div>
      <div class="row mb-2 mt-4" v-if="lead">
  <div class="col-sm-4 fw-bold">Pays</div>
  <div v-if="lead.user" class="col-sm-8">{{ lead.user.country ?? '-' }}</div>
</div>
<div class="row mb-2 mt-4" v-if="lead">
  <div class="col-sm-4 fw-bold">NPA</div>
  <div v-if="lead.user" class="col-sm-8">{{ lead.user.postal_code ?? '-' }}</div>
</div>
<div class="row mb-2 mt-4" v-if="lead">
  <div class="col-sm-4 fw-bold">Localité</div>
  <div v-if="lead.user" class="col-sm-8">{{ lead.user.city ?? '-' }}</div>
</div>
<div class="row mb-2 mt-4" v-if="lead">
  <div class="col-sm-4 fw-bold">Téléphone</div>
  <div v-if="lead.user" class="col-sm-8">{{ lead.user.phone_number != null  ? '+41'+lead.user.phone_number : '-' }}</div>
</div>
<div class="row mb-2 mt-4" v-if="lead">
  <div class="col-sm-4 fw-bold">Prénom</div>
  <div  v-if="lead.user" class="col-sm-8">{{ lead.user.first_name ?? '-' }}</div>
</div>
<div class="row mb-2 mt-4" v-if="lead">
  <div class="col-sm-4 fw-bold">Nom</div>
  <div v-if="lead.user" class="col-sm-8">{{ lead.user.last_name ?? '-' }}</div>
</div>
<div class="row mb-2 mt-4" v-if="lead">
  <div class="col-sm-4 fw-bold">Date de naissance</div>
  <div v-if="lead.user" class="col-sm-8">{{ lead.user.date_of_birth ?? '-' }}</div>
</div>
<div class="row mb-2 mt-4" v-if="lead">
  <div class="col-sm-4 fw-bold">Email</div>
  <div v-if="lead.user" class="col-sm-8">{{ lead.user.email ?? '-' }}</div>
</div>

    
    </div>
  </div>
</template>

<script>
export default {
  name: "LeadsInformation",
  props: {
    lead: {
      type: Object,
      required: true,
    },
  },
};
</script>