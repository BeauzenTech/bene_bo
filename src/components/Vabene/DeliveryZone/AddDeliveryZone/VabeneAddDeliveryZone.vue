<template>
  <div class="card mb-25 border-0 rounded-0 bg-white add-user-card">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30 letter-spacing">
      <form @submit.prevent="submitForm">
        <div class="row">
          <!-- Informations de base -->
          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Nom de la zone *
              </label>
              <input
                type="text"
                class="form-control shadow-none rounded-0 text-black"
                placeholder="e.g. Zone Centre-ville"
                v-model="zoneData.name"
                @change="(event) => handleInput(event, 'name')"
                :class="{ 'is-valid': validTextField(zoneData.name) }"
                required
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Montant minimum (CHF) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                class="form-control shadow-none rounded-0 text-black"
                placeholder="e.g. 25.00"
                v-model="zoneData.minimumOrderAmount"
                @change="(event) => handleInput(event, 'minimumOrderAmount')"
                :class="{ 'is-valid': validNumberField(zoneData.minimumOrderAmount) }"
                required
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Frais de livraison (CHF)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                class="form-control shadow-none rounded-0 text-black"
                placeholder="e.g. 5.00 (laisser vide pour gratuit)"
                v-model="zoneData.deliveryFee"
                @change="(event) => handleInput(event, 'deliveryFee')"
              />
            </div>
          </div>

          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Description
              </label>
              <textarea
                class="form-control shadow-none rounded-0 text-black"
                placeholder="Description de la zone"
                v-model="zoneData.description"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Codes postaux -->
          <div class="col-md-12">
            <div class="form-group mb-15 mb-sm-20 mb-md-25">
              <label class="d-block text-black fw-semibold mb-10">
                Codes postaux
              </label>
              
              <!-- Ajout de codes postaux -->
              <div class="row mb-3">
                <div class="col-md-4">
                  <input
                    type="number"
                    class="form-control shadow-none rounded-0 text-black"
                    placeholder="Code postal"
                    v-model="newPostalCode.code"
                    @keyup.enter="addPostalCode"
                  />
                </div>
                <div class="col-md-4">
                  <input
                    type="text"
                    class="form-control shadow-none rounded-0 text-black"
                    placeholder="Localité"
                    v-model="newPostalCode.locality"
                    @keyup.enter="addPostalCode"
                  />
                </div>
                <div class="col-md-4">
                  <button
                    type="button"
                    class="btn btn-primary w-100"
                    @click="addPostalCode"
                    :disabled="!newPostalCode.code || !newPostalCode.locality"
                  >
                    <i class="fas fa-plus me-1"></i>Ajouter
                  </button>
                </div>
              </div>

              <!-- Liste des codes postaux -->
              <div v-if="zoneData.postalCodes.length > 0" class="postal-codes-list">
                <div class="alert alert-info mb-3">
                  <i class="fas fa-info-circle me-2"></i>
                  <strong>{{ zoneData.postalCodes.length }}</strong> code(s) postal(aux) ajouté(s)
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="(postalCode, index) in zoneData.postalCodes"
                    :key="index"
                    class="badge bg-primary d-flex align-items-center"
                  >
                    {{ postalCode.code }} - {{ postalCode.locality }}
                    <button
                      type="button"
                      class="btn-close btn-close-white ms-2"
                      @click="removePostalCode(index)"
                      title="Supprimer ce code postal"
                    ></button>
                  </span>
                </div>
              </div>
              
              <div v-else class="text-muted">
                <i class="fas fa-info-circle me-2"></i>
                Aucun code postal ajouté. Vous pouvez en ajouter après la création de la zone.
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="col-md-12">
            <div class="d-flex align-items-center justify-content-between">
              <LoaderComponent v-if="isLoading" />
              <button
                v-else
                class="default-btn transition border-0 fw-medium text-white pt-10 pb-10 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-35 pe-md-35 rounded-1 fs-md-15 fs-lg-16 bg-success"
                type="submit"
                :disabled="!isFormValid"
                :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
              >
                {{ actionDetected === ActionCrud.EDIT ? 'Mettre à jour' : 'Créer' }} la zone
              </button>
              <button
                type="button"
                @click="goBack"
                class="bg-transparent p-0 border-0 text-danger lh-1 fw-medium"
              >
                <i class="flaticon-delete lh-1 me-1 position-relative top-2"></i>
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
import { defineComponent, PropType } from "vue";
import {
  createDeliveryZone,
  updateDeliveryZone,
  getDeliveryZoneById,
  addPostalCodesToZone,
  getPostalCodesByZone
} from "@/service/api";
import { useToast } from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import { AxiosError } from 'axios';
import { ApiResponse } from "@/models/Apiresponse";
import { ActionCrud } from "@/enums/actionCrud.enum";
import { DeliveryZoneModel, CreateDeliveryZoneRequest, UpdateDeliveryZoneRequest, AddPostalCodeRequest } from "@/models/deliveryZone.model";
import { UserGeneralKey } from "@/models/user.generalkey";

export default defineComponent({
  name: "VabeneAddDeliveryZone",
  components: {
    LoaderComponent
  },
  props: {
    action: {
      type: String as PropType<string>,
      required: true
    },
    zoneID: {
      type: String as PropType<string>,
      required: false
    },
    restaurantId: {
      type: String as PropType<string>,
      required: false
    },
  },
  data(){
    return{
      zoneData: {
        name: '',
        minimumOrderAmount: 0,
        deliveryFee: 0,
        description: '',
        postalCodes: [] as AddPostalCodeRequest[]
      },
      newPostalCode: {
        code: null as number | null,
        locality: ''
      },
      isLoading: false,
      actionDetected: null as string | null,
      zoneResponse: null as DeliveryZoneModel | null,
    }
  },
  methods: {
    handleInput(event: Event, fieldName: string) {
      const target = event.target as HTMLInputElement;
      console.log(`Champ ${fieldName} modifié:`, target.value);
    },
    validTextField(text: string): boolean {
      return Boolean(text && text.trim().length > 0);
    },
    validNumberField(value: number): boolean {
      return value !== null && value !== undefined && value >= 0;
    },
    addPostalCode() {
      if (this.newPostalCode.code && this.newPostalCode.locality) {
        // Vérifier si le code postal n'existe pas déjà
        const existingCode = this.zoneData.postalCodes.find(
          pc => pc.code === this.newPostalCode.code
        );
        
        if (existingCode) {
          this.toast.warning("Ce code postal a déjà été ajouté");
          return;
        }
        
        this.zoneData.postalCodes.push({
          code: this.newPostalCode.code,
          locality: this.newPostalCode.locality
        });
        
        this.newPostalCode = { code: null, locality: '' };
        this.toast.success("Code postal ajouté avec succès");
      } else {
        this.toast.warning("Veuillez remplir tous les champs");
      }
    },
    removePostalCode(index: number) {
      const removedCode = this.zoneData.postalCodes[index];
      this.zoneData.postalCodes.splice(index, 1);
      this.toast.info(`Code postal ${removedCode.code} supprimé`);
    },
    goBack() {
      this.$router.back();
    },
    async submitForm() {
      this.isLoading = true;
      
      try {
        const restaurantId = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID);
        if (!restaurantId) {
          this.toast.error("ID du restaurant non trouvé");
          return;
        }

        if (this.actionDetected === ActionCrud.EDIT) {
          // Mise à jour
          const updateData: UpdateDeliveryZoneRequest = {
            name: this.zoneData.name,
            minimumOrderAmount: this.zoneData.minimumOrderAmount,
            deliveryFee: this.zoneData.deliveryFee || 0,
            description: this.zoneData.description
          };
          
          const response = await updateDeliveryZone(this.zoneID!, updateData);
          
          if (response.code === 200 || response.code === 201) {
            this.toast.success(response.message);
            this.$router.push('/delivery-zones');
          } else {
            this.toast.error(response.message);
          }
        } else {
          // Création - utiliser le restaurantId passé en paramètre ou celui du localStorage
          const targetRestaurantId = this.restaurantId || restaurantId;
          if (!targetRestaurantId) {
            this.toast.error("ID du restaurant non trouvé");
            return;
          }
          
          const createData: CreateDeliveryZoneRequest = {
            name: this.zoneData.name,
            minimumOrderAmount: this.zoneData.minimumOrderAmount,
            deliveryFee: this.zoneData.deliveryFee || 0,
            description: this.zoneData.description
          };
          
          const response = await createDeliveryZone(targetRestaurantId, createData);
          
          if (response.code === 200 || response.code === 201) {
            // Ajouter les codes postaux si il y en a
            if (this.zoneData.postalCodes.length > 0) {
              await addPostalCodesToZone(response.data.id, this.zoneData.postalCodes);
            }
            
            this.toast.success(response.message);
            this.$router.push('/delivery-zones');
          } else {
            this.toast.error(response.message);
          }
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
    async fetchZoneDetails(zoneID: string) {
      console.log('fetchZoneDetails appelé avec zoneID:', zoneID);
      this.isLoading = true;
      try {
        const response = await getDeliveryZoneById(zoneID) as ApiResponse<DeliveryZoneModel>;
        console.log('Réponse API zone:', response);
        
        if (response.code === 200 && response.data) {
          this.zoneResponse = response.data;
          this.zoneData.name = this.zoneResponse.name;
          this.zoneData.minimumOrderAmount = this.zoneResponse.minimumOrderAmount;
          this.zoneData.deliveryFee = this.zoneResponse.deliveryFee || 0;
          this.zoneData.description = this.zoneResponse.description || '';
          
          console.log('Données de zone préremplies:', this.zoneData);
          
          // Charger les codes postaux
          const postalCodesResponse = await getPostalCodesByZone(zoneID);
          console.log('Réponse API codes postaux:', postalCodesResponse);
          
          if (postalCodesResponse.code === 200 && postalCodesResponse.data) {
            this.zoneData.postalCodes = postalCodesResponse.data.map(pc => ({
              code: pc.code,
              locality: pc.locality
            }));
            console.log('Codes postaux préremplis:', this.zoneData.postalCodes);
          }
        } else {
          console.error('Erreur API zone:', response.message);
          this.toast.error(response.message);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la zone:', error);
        this.toast.error("Erreur lors du chargement de la zone");
      } finally {
        this.isLoading = false;
      }
    }
  },
  computed: {
    ActionCrud() {
      return ActionCrud
    },
    isFormValid() {
      return (
        this.validTextField(this.zoneData.name) &&
        this.validNumberField(this.zoneData.minimumOrderAmount)
      );
    }
  },
  watch: {
    // Watcher pour réagir aux changements de zoneID
    zoneID: {
      handler(newZoneID) {
        if (newZoneID && this.actionDetected === ActionCrud.EDIT) {
          this.fetchZoneDetails(newZoneID);
        }
      },
      immediate: true
    },
    // Watcher pour réagir aux changements d'action
    action: {
      handler(newAction) {
        this.actionDetected = newAction === 'Modifier' ? ActionCrud.EDIT : ActionCrud.ADD;
        if (this.actionDetected === ActionCrud.EDIT && this.zoneID) {
          this.fetchZoneDetails(this.zoneID);
        }
      },
      immediate: true
    }
  },
  setup: () => {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    // Les watchers s'occupent de la logique d'initialisation
    console.log('VabeneAddDeliveryZone mounted:', {
      action: this.action,
      zoneID: this.zoneID,
      restaurantId: this.restaurantId
    });
  }
});
</script>

<style scoped>
.postal-codes-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 1rem;
  background-color: #f8f9fa;
}

.badge {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  margin: 0.25rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-close {
  font-size: 0.75rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.btn-close:hover {
  opacity: 1;
}

.alert {
  border-radius: 0.375rem;
  border: none;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0b5ed7;
  border-color: #0a58ca;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
