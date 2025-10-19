<template>
  <div class="card mb-25 border-0 rounded-0 bg-white letter-spacing">
    <div class="card-head box-shadow bg-white d-lg-flex align-items-center justify-content-between p-15 p-sm-20 p-md-25">
      <div class="d-flex align-items-center">
        <button
            @click="goBack"
            class="btn btn-outline-secondary me-3"
            type="button"
        >
          <i class="fas fa-arrow-left me-2"></i>
          Retour
        </button>
        <div>
          <h5 class="mb-0">
            <i class="flaticon-location me-2"></i>
            Codes postaux - {{ zoneName }}
          </h5>
          <small class="text-muted">Zone de livraison</small>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <button
            @click="refreshPostalCodes"
            class="btn btn-outline-primary me-2"
            type="button"
            :disabled="isLoading"
        >
          <i class="fas fa-sync-alt me-2" :class="{ 'fa-spin': isLoading }"></i>
          Actualiser
        </button>
      </div>
    </div>
    
    <div class="card-body p-15 p-sm-20 p-md-25">
      <div v-if="isLoading" class="text-center py-4">
        <LoaderComponent/>
        <p class="mt-2 text-muted">Chargement des codes postaux...</p>
      </div>
      
      <div v-else-if="postalCodes.length === 0" class="text-center py-5">
        <i class="flaticon-location text-muted" style="font-size: 4rem;"></i>
        <h6 class="mt-3 text-muted">Aucun code postal associé</h6>
        <p class="text-muted">Cette zone ne contient aucun code postal pour le moment.</p>
      </div>
      
      <div v-else>
        
        <div class="table-responsive">
          <table class="table text-nowrap align-middle mb-0">
            <thead>
              <tr>
                <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 ps-0">
                  CODE POSTAL
                </th>
                <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                  LOCALITÉ
                </th>
                <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                  STATUS
                </th>
                <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                  CRÉÉ LE
                </th>
                <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 text-end pe-0">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="postalCode in postalCodes" :key="postalCode.id">
                <th class="shadow-none lh-1 fw-medium text-black-emphasis title ps-0">
                  <span class="badge bg-primary fs-6">{{ postalCode.code }}</span>
                </th>
                <td class="shadow-none lh-1 fw-medium text-black-emphasis">
                  {{ postalCode.locality }}
                </td>
                <td>
                  <span :class="postalCode.isActive ? 'badge bg-success' : 'badge bg-secondary'">
                    {{ postalCode.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="shadow-none lh-1 fw-medium text-muted">
                  {{ convertDateCreate(postalCode.createdAt) }}
                </td>
                <td class="shadow-none lh-1 fw-medium text-body-tertiary text-end pe-0">
                  <div class="dropdown">
                    <button
                        class="dropdown-toggle lh-1 bg-transparent border-0 shadow-none p-0 transition"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                      <i class="flaticon-dots"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <a
                            class="dropdown-item d-flex align-items-center"
                            href="javascript:void(0);"
                            @click="editPostalCode(postalCode)"
                        >
                          <i class="flaticon-pen lh-1 me-8 position-relative top-1"></i>
                          Modifier
                        </a>
                      </li>
                      <li>
                        <a
                            class="dropdown-item d-flex align-items-center"
                            href="javascript:void(0);"
                            @click="togglePostalCodeStatus(postalCode)"
                        >
                          <i :class="postalCode.isActive ? 'flaticon-eye-slash' : 'flaticon-eye'" class="lh-1 me-8 position-relative top-1"></i>
                          {{ postalCode.isActive ? 'Désactiver' : 'Activer' }}
                        </a>
                      </li>
                      <li>
                        <a
                            class="dropdown-item d-flex align-items-center text-danger"
                            href="javascript:void(0);"
                            @click="deletePostalCode(postalCode)"
                        >
                          <i class="flaticon-delete lh-1 me-8 position-relative top-1"></i>
                          Supprimer
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getPostalCodesByZone, updatePostalCodeInZone, deletePostalCodeFromZone } from "@/service/api";
import { UserGeneralKey } from "@/models/user.generalkey";
import { useToast } from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";

export default defineComponent({
  name: "VabenePostalCodesList",
  components: { LoaderComponent },
  props: {
    zoneId: {
      type: String,
      required: true
    },
    zoneName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      postalCodes: [] as any[],
      isLoading: false
    }
  },
  methods: {
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    async fetchPostalCodes() {
      this.isLoading = true;
      try {
        console.log('Chargement des codes postaux pour la zone:', this.zoneId);
        const response = await getPostalCodesByZone(this.zoneId) as any;
        console.log('Réponse API codes postaux:', response);
        
        if (response.code === 200) {
          this.postalCodes = response.data || [];
          console.log('Codes postaux chargés:', this.postalCodes.length);
        } else {
          this.toast.error(response.message || "Erreur lors du chargement des codes postaux");
          this.postalCodes = [];
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des codes postaux");
        console.error(error);
        this.postalCodes = [];
      } finally {
        this.isLoading = false;
      }
    },
    async refreshPostalCodes() {
      await this.fetchPostalCodes();
    },
    goBack() {
      this.$router.go(-1);
    },
    editPostalCode(postalCode: any) {
      // TODO: Implémenter l'édition des codes postaux
      this.toast.info("Fonctionnalité d'édition à implémenter");
    },
    async togglePostalCodeStatus(postalCode: any) {
      try {
        const newStatus = !postalCode.isActive;
        const response = await updatePostalCodeInZone(this.zoneId, postalCode.code, {
          isActive: newStatus
        }) as any;
        
        if (response.code === 200 || response.code === 201) {
          postalCode.isActive = newStatus;
          this.toast.success(response.message || "Statut mis à jour avec succès");
        } else {
          this.toast.error(response.message || "Erreur lors de la mise à jour");
        }
      } catch (error) {
        this.toast.error("Erreur lors de la mise à jour du statut");
        console.error(error);
      }
    },
    async deletePostalCode(postalCode: any) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer le code postal ${postalCode.code} ?`)) {
        try {
          const response = await deletePostalCodeFromZone(this.zoneId, postalCode.code) as any;
          
          if (response.code === 200 || response.code === 201) {
            this.toast.success(response.message || "Code postal supprimé avec succès");
            await this.fetchPostalCodes(); // Recharger la liste
          } else {
            this.toast.error(response.message || "Erreur lors de la suppression");
          }
        } catch (error) {
          this.toast.error("Erreur lors de la suppression du code postal");
          console.error(error);
        }
      }
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchPostalCodes();
  }
});
</script>

<style scoped>
.badge {
  font-size: 0.875rem;
}

.table th {
  border-top: none;
}

.dropdown-toggle::after {
  display: none;
}
</style>
