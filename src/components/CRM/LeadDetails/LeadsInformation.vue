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
      <ul class="info mt-25 ps-0 mb-0 list-unstyled">
        <li class="position-relative">
          <div class="icon text-success rounded-circle text-center">
            <i class="flaticon-mail-inbox-app"></i>
          </div>
          <span class="d-block text-black mb-5 fw-semibold">Email</span>
          <a
            href="#"
            class="d-inline-block fs-md-15 fs-lg-16 text-primary text-decoration-none"
          >
            {{lead.email}}
          </a>
        </li>
        <li class="position-relative">
          <div class="icon text-info rounded-circle text-center">
            <i class="flaticon-telephone-call"></i>
          </div>
          <span class="d-block text-black mb-5 fw-semibold">Téléphone</span>
          <a
            href="tel:+1-321-456-8756"
            class="d-inline-block fs-md-15 fs-lg-16 text-muted text-decoration-none"
          >
            {{lead.phoneNumber}}
          </a>
        </li>
        <li class="position-relative">
          <div class="icon text-primary rounded-circle text-center">
            <i class="flaticon-menu"></i>
          </div>
          <span class="d-block text-black mb-5 fw-semibold">NPA</span>
          <a
            href="#"
            target="_blank"
            class="d-inline-block fs-md-15 fs-lg-16 text-muted text-decoration-none"
          >
            {{lead.npa ?? lead.codePostal}}
          </a>
        </li>
        <li class="position-relative">
          <div class="icon text-primary rounded-circle text-center">
            <i class="flaticon-menu"></i>
          </div>
          <span class="d-block text-black mb-5 fw-semibold">Localité</span>
          <a
              href="#"
              target="_blank"
              class="d-inline-block fs-md-15 fs-lg-16 text-muted text-decoration-none"
          >
            {{lead.localite ?? lead.city}}
          </a>
        </li>

        <li class="position-relative">
          <div class="icon text-warning rounded-circle text-center">
            <i class="flaticon-status"></i>
          </div>
          <span class="d-block text-black mb-5 fw-semibold"> Déjà un compte ? </span>
          <span class="badge text-outline-info">{{lead.user ? 'Oui' : 'Non'}}</span>
        </li>
      </ul>
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