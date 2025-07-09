<template>
  <div :class="{'login-background': isLoginPage}">
    <MainHeader v-if="!isLoginPage" />
    <MainSidebar v-if="!isLoginPage" />
    <div class="main-content d-flex flex-column transition overflow-hidden">
      <router-view />
<!--      <MainFooter v-if="!isLoginPage" />-->
    </div>

    <div class="modal fade" id="contentModalScrollable_facture" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content" v-if="orderResponse">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Facture de la commande #{{getShortUuid(orderResponse.id)}}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body flex-row align-items-center justify-content-center" >
            <div class="flex-column items-center justify-content-center">
              <main class="ticket-system" >
                <div class="receipts-wrapper" >
                  <div class="receipts"  id="recu-pdf">
                    <div class="receipt">
                      <img src="https://vabenepizza.ch/imgs/logo.svg" class="airliner-logo"/>
                      <div class="route">
                        <h2><strong>Livraison de pizzas {{orderResponse.restaurantID.name}}</strong></h2>
                        <h2><strong>{{orderResponse.restaurantID.id === RestaurantEnum.RESTO_MORGES ? 'Va Bene pizza sàrl Morges' : 'Pizzeria Va Bene SA '}}</strong></h2>
                        <h2><strong>{{orderResponse.restaurantID.address}}</strong></h2>
                        <h2><strong>{{orderResponse.restaurantID.codePostalID.numeroPostal}} {{orderResponse.restaurantID.name}}</strong> </h2>
                        <h2><strong>+4121 {{orderResponse.restaurantID.phoneNumber}}</strong></h2>
                        <h2><strong>{{orderResponse.restaurantID.taxe}}</strong></h2>
                      </div>
                      <hr class="dashed-line" />

                      <div class="route">
                        <h2><strong>{{orderResponse.guest_first_name}} {{orderResponse.guest_last_name}}</strong></h2>
                        <h2><strong>{{orderResponse.address}} - {{orderResponse.numberRue}}</strong></h2>
                        <h2><strong>{{orderResponse.npa ?? ''}} {{orderResponse.localite ?? ''}}</strong></h2>
                        <h2><strong>{{orderResponse.guest_phone_number}}</strong></h2>
                        <h2><strong>{{orderResponse.guest_email}}</strong></h2>
                      </div>

                      <hr class="dashed-line" />

                      <div class="route" v-if="orderTypeSelected && orderTypeSelected.length > 0">
                        <h2><strong>{{orderTypeSelected[0].libelle ?? ''}}</strong></h2>
                        <h2><strong>{{convertDateCreate(orderResponse.created_at)}}</strong></h2>
                        <h2><strong>{{orderResponse.DeliveryPreference != 'immediat' ? 'PRÉCOMMANDE' : 'TOUT DE SUITE'}}</strong></h2>
                        <h2><strong>{{convertDateCreate(orderResponse.timeOrder) ?? ''}} </strong></h2>
                        <h2><strong>{{orderResponse.restaurantID.id === RestaurantEnum.RESTO_MORGES ? 'VBM'+ orderResponse.reference : 'VBP'+ orderResponse.reference}}</strong></h2>
                        <h2><strong>{{getLast6Digits(orderResponse.customer.id)}}</strong></h2>

                      </div>
                      <hr class="dashed-line" />
                      <!--                          <div class="product-list">-->
                      <!--                            <div v-for="item in orderResponse.orderItems" :key="item.id" style="display: flex; justify-content: space-between; margin: 5px 0;">-->
                      <!--                              <span><strong>{{item.quantity}}x {{ item.productID.name }}</strong></span>-->
                      <!--                              <span><strong>{{ item.total_price }} CHF</strong></span>-->
                      <!--                            </div>-->
                      <!--                          </div>-->
                      <div class="product-ticket" v-if="orderResponse">
                        <div
                            v-for="(items, categoryName) in groupedByCategory"
                            :key="categoryName"
                            class="category-section"
                            style="margin-bottom: 10px;"
                        >
                          <!-- 🏷️ Nom unique de la catégorie -->
                          <div style="font-weight: 600; font-size: 12px; margin-bottom: 8px;">
                            {{ categoryName }}
                          </div>

                          <!-- 🍕 Tous les produits de cette catégorie -->
                          <div
                              v-for="item in items"
                              :key="item.id"
                              style="display: flex; flex-direction: column; margin-bottom: 10px;"
                          >
                            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                              <span><strong>{{ item.quantity }}x {{ item.productID.name }}</strong></span>
                              <span><strong>{{ item.total_price }} CHF</strong></span>
                            </div>

                            <!-- 🧂 Ingrédients -->
                            <ul v-if="item.ingredients && item.ingredients.length" style="margin: 2px 0 0 10px; font-size: 9px; color: #555;">
                              <li
                                  v-for="ingredient in item.ingredients"
                                  :key="ingredient.id"
                                  class="text-decoration-none list-unstyled"
                              >
                                <strong>x{{ ingredient.quantite }} {{ ingredient.name }} ({{ingredient.size}})</strong>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>



                      <hr class="dashed-line" />
                      <div class="product-list">
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                          <span><strong>SOUS-TOTAL: </strong></span>
                          <span><strong>{{(orderResponse.total_price - (orderResponse.total_price * 2.60/100)).toFixed(2) }} CHF</strong></span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                          <span><strong>2.60% TVA </strong></span>
                          <span><strong>{{(orderResponse.total_price * 2.60/100).toFixed(2)}} CHF</strong></span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                          <span><strong>RABAIS: </strong></span>
                          <span><strong>0 CHF</strong></span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                          <span><strong>TOTAL BRUT:  </strong></span>
                          <span><strong>{{ orderResponse.total_price }} CHF</strong></span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;" v-if="methodePaiementSelected && methodePaiementSelected.length > 0">
                          <span>Méthode de paiements :  </span>
                          <span>{{ methodePaiementSelected[0].libelle ?? '' }}</span>
                        </div>
                      </div>
                      <hr class="dashed-line" />
                      <div class="route">
                        <h2><strong>{{orderResponse.feature[0]}}</strong></h2>
                        <h2><strong>Trancher: {{orderResponse.intructionOrder.isTrancher ? 'OUI': 'NON'}}</strong></h2>
                        <h2><strong>Couverts: {{orderResponse.intructionOrder.quantityCouverts}}</strong></h2>

                      </div>

                      <!--                        <div class="barcode-footer">-->
                      <!--                          <img-->
                      <!--                              :src="`https://quickchart.io/barcode?type=code128&text=${orderResponse.reference}`"-->
                      <!--                              alt="Code-barres de la facture"-->
                      <!--                              class="barcode-image"-->
                      <!--                          />-->
                      <!--                        </div>-->
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="previewPDF" type="button" class="btn btn-primary">Imprimer maintenant</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import stateStore from "./utils/store";


import MainHeader from "./components/Layouts/MainHeader.vue";
import MainSidebar from "./components/Layouts/MainSidebar.vue";
import { useRoute } from "vue-router";
import {requestForToken, onMessageListener, requestNotificationPermission} from "./firebase";
import {useToast} from "vue-toastification";
import notificationSound from "@/assets/sounds/notification.wav";
import {UserGeneralKey} from "@/models/user.generalkey";
import socket from '@/utils/websocket';
import {detailOrder, listeMethodePaiement, listeOrderType, printTicketLocally} from "@/service/api";
import {ApiResponse, PaginatedMethodePaiement, PaginatedOrderType} from "@/models/Apiresponse";
import {OrderModel} from "@/models/order.model";
import {MethodePaiementModel} from "@/models/methodePaiement.model";
import {OrderTypeModel} from "@/models/orderType.model";
import {OrderItemModel} from "@/models/orderItem.model";
import html2pdf from "html2pdf.js";
import {OrderStatus} from "@/enums/orderStatut.enum";
import {PaymentStatus} from "@/enums/orderPaiementMethode.enum";
import {RestaurantEnum} from "./enums/restaurant.enum";

export default defineComponent({
  name: "App",
  computed: {
    groupedByCategory() {
      const grouped: Record<string, any[]> = {};

      if(this.orderResponse){
        for (const item of this.orderResponse.orderItems) {
          const categoryName = item.productID?.categorieID?.name || "Sans catégorie";

          if (!grouped[categoryName]) {
            grouped[categoryName] = [];
          }

          grouped[categoryName].push(item);
        }
      }
      return grouped;
    },
    RestaurantEnum() {
      return RestaurantEnum
    }
  },
  components: {
    MainHeader,
    MainSidebar,

  },
  data() {
    return {
      restaurantId: localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID),
      orderResponse: null as OrderModel | null,
      listeMethode: [] as MethodePaiementModel[],
      listeOrderType: [] as OrderTypeModel[],
      methodePaiementSelected: [] as MethodePaiementModel[],
      orderTypeSelected: [] as OrderTypeModel[],
      orderItemSelected: null as OrderItemModel | null,
      qrcode: null as string | null,
      allOrderStatus: [] as string[],
      allPaiementOrderStatus: [] as string[],
      messages: []
    };
  },
  methods:{
    clearData(){
          this.orderResponse = null
          this.listeMethode= []
          this.listeOrderType = []
          this.methodePaiementSelected = []
          this.orderTypeSelected = []
          this.orderItemSelected = null
          this.allOrderStatus = []
          this.allPaiementOrderStatus = []
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    getMethodePaiementParType(
        liste: MethodePaiementModel[],
        type: string
    ): MethodePaiementModel[] {
      console.log(liste)
      console.log(type)
      return liste.filter(methode =>
          methode.type === type
      );
    },
    getOrderTypeParType(
        liste: OrderTypeModel[],
        type: string
    ): OrderTypeModel[] {
      return liste.filter(orderType =>
          orderType.type === type
      );
    },
    fetchStatusOrderFr(status: string){
      switch (status) {
        case OrderStatus.PENDING:
          return 'En attente';
        case OrderStatus.PROCESSING:
          return 'En cours de traitement';
        case OrderStatus.READY_FOR_DELIVERY:
          return 'Près pour livraison';
        case OrderStatus.OUT_FOR_DELIVERY:
          return 'En cours de livraison';
        case OrderStatus.DELIVERED:
          return 'Livré';
        default:
          return 'Annulé';
      }
    },
    fetchStatusOrderPaiementFr(status: string){
      switch (status) {
        case PaymentStatus.PENDING:
          return 'En attente de paiement';
        case PaymentStatus.PAID:
          return 'Payé';
        case PaymentStatus.REFUNDED:
          return 'A rembourser';
        default:
          return 'Annulé';
      }
    },
    fetStatusPiamentFr(status: string){
      return this.allPaiementOrderStatus.find(orderStatus =>
          orderStatus === status
      );
    },
    getLast6Digits(uuid: string): string {
      const parts = uuid.split('-');
      const lastPart = parts[parts.length - 1];
      // On garde uniquement les chiffres
      const digitsOnly = lastPart.replace(/\D/g, '');
      return digitsOnly.slice(-6);
    },
    previewPDF() {
      const element = document.getElementById('recu-pdf');
      if (this.orderResponse && element) {
        const style = document.createElement('style');
        // Appliquer largeur ticket
        element.style.width = '102mm';
        element.style.margin = '0 auto';
        // Injecter les styles avec un scope sur #recu-pdf uniquement
        style.textContent = `
      #recu-pdf * {
  box-sizing: border-box;
  font-family: 'Ubuntu', sans-serif;
  color: #1c1c1c;
}
#recu-pdf {
  max-width: 450px;
  padding: 25px 30px;
  margin-top: 50%;
}

#recu-pdf .top {
  display: flex;
  align-items: center;
  flex-direction: column;
}
#recu-pdf .top .title {
  font-weight: normal;
  font-size: 1.6em;
  text-align: left;
  margin-left: 20px;
  margin-bottom: 50px;
  color: #fff;
}
#recu-pdf .top .printer {
  width: 90%;
  height: 20px;
  border: 5px solid #fff;
  border-radius: 10px;
  box-shadow: 1px 3px 3px 0 rgba(0, 0, 0, 0.2);
}

#recu-pdf .receipts-wrapper {
  overflow: hidden;
  margin-top: -10px;
  padding-bottom: 10px;
}

#recu-pdf .receipts {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  transform: translateY(-510px);

  animation-duration: 2.5s;
  animation-delay: 500ms;
  animation-name: print;
  animation-fill-mode: forwards;
}

#recu-pdf .receipt {
  padding: 25px 30px;
  text-align: left;
  min-height: 200px;
  width: 88%;
  background-color: #fff;
  border-radius: 10px 10px 20px 20px;
  box-shadow: 1px 3px 8px 3px rgba(0, 0, 0, 0.2);
}

#recu-pdf .airliner-logo {
  max-width: 70px;
}

#recu-pdf .route {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  margin: 5px 0;
}

.dashed-line {
  border: none;
  border-top: 2px dashed #333; /* couleur personnalisable */
  margin: 1rem 0;
  width: 100%;
}




#recu-pdf .plane-icon {
  width: 30px;
  height: 30px;
  transform: rotate(90deg);
}

#recu-pdf .route h2 {
  font-weight: 100;
  font-size: 12px;
  margin: 0;
}

#recu-pdf .details {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

#recu-pdf .details .item {
  display: flex;
  flex-direction: column;
  min-width: 70px;
}

#recu-pdf .details .item span {
  font-size: .8em;
  color: rgba(28, 28, 28, .7);
  font-weight: 500;
}

#recu-pdf .details .item h3 {
  font-size: 18px !important;
  margin-top: 0;
  margin-bottom: 0;
}

#recu-pdf .receipt.qr-code {
  height: 110px;
  min-height: unset;
  position: relative;
  border-radius: 20px 20px 10px 10px;
  display: flex;
  align-items: center;
}

#recu-pdf .receipt.qr-code::before {
  content: '';
  background: linear-gradient(to right, #fff 50%, #3a8d35 50%);
  background-size: 22px 4px, 100% 4px;
  height: 4px;
  width: 90%;
  display: block;
  left: 0;
  right: 0;
  top: -1px;
  position: absolute;
  margin: auto;
}

#recu-pdf .qr {
  width: 70px;
  height: 70px;
}

#recu-pdf .description {
  margin-left: 20px;
}

#recu-pdf .description h2 {
  margin: 0 0 5px 0;
  font-weight: 500;
}

#recu-pdf .description p {
  margin: 0;
  font-weight: 400;
}

#recu-pdf.product-list {
  margin-top: 10px;
  font-family: 'Arial', sans-serif;
}

#recu-pdf.product-list h2 {
  font-size: 10px;
  margin-bottom: 5px;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 2px;
}

#recu-pdf.product-list div {
  padding: 1px 0;
  border-bottom: 1px dashed #ddd;
}

#recu-pdf.product-list span {
  font-size: 10px;
  line-height: 1.2;
  display: inline-block;
}

#recu-pdf.product-list span:first-child {
  font-weight: bold;
  color: #333;
}

#recu-pdf.product-list span:last-child {
  font-weight: 500;
  color: #007bff;
}
#recu-pdf.barcode-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1px dashed #ccc;
}

#recu-pdf.barcode-image {
  height: 60px;
  margin-bottom: 6px;
}

#recu-pdf.barcode-label {
  font-size: 13px;
  color: #444;
  font-style: italic;
}


      @keyframes print {
        0% { transform: translateY(-510px); }
        35% { transform: translateY(-395px); }
        70% { transform: translateY(-140px); }
        100% { transform: translateY(0); }
      }
    `;

        document.head.appendChild(style);

        setTimeout(() => {
          const opt = {
            margin: 1,
            filename: `Facture_${this.getShortUuid(this.orderResponse!.id)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true
            },
            jsPDF: { unit: 'mm', format: [102, 200], orientation: 'portrait' }  // 102mm largeur, 200mm hauteur (à ajuster)

          };

          html2pdf()
              .set(opt)
              .from(element)
              .toPdf()
              .get('pdf')
              .then(pdf => {
                const blob = pdf.output('blob');
                const url = URL.createObjectURL(blob);
                const file = new File([blob], "ticket.pdf", { type: "application/pdf" });
                this.launchPrint(file)
               // window.open(url, '_blank');
                // Remet à la taille normale après génération si besoin
                element.style.width = '';
                element.style.margin = '';
              })
              .finally(() => {
                document.head.removeChild(style);
              });
        }, 500);
      }
    },

    getShortUuid(uuid: string): string {
      return uuid.split('-')[0];
    },
    async fetchListeMethodePaiement(page = 1) {
      // this.isLoading = true;
      try {
        const response = await listeMethodePaiement(page) as ApiResponse<PaginatedMethodePaiement>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items && this.orderResponse) {
            this.listeMethode = response.data.items;
            this.methodePaiementSelected = this.getMethodePaiementParType(response.data.items, this.orderResponse.paymentID.paymentMethod)
            console.log('liste des methodes: ', this.listeMethode);
            console.log('paiement methode: ', this.orderResponse.paymentID.paymentMethod);
            console.log('methode Paiement selected: ', this.methodePaiementSelected);
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des methodes de paiement");
        console.error(error);
      } finally {
        // this.isLoading = false;
      }
    },
    async fetchOrderType(page = 1) {
      // this.isLoading = true;
      try {
        const response = await listeOrderType(page) as ApiResponse<PaginatedOrderType>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items && this.orderResponse) {
            this.listeOrderType = response.data.items;
            console.log('data orderType retrieve: ', this.listeOrderType)
            console.log('orderType: ', this.orderResponse.order_type);
            this.orderTypeSelected = this.getOrderTypeParType(response.data.items, this.orderResponse.order_type)
            console.log('orderType selected: ', this.orderTypeSelected);
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des types de commandes");
        console.error(error);
      } finally {
        // this.isLoading = false;
      }
    },
    async fetchOrder(orderID) {
      try {
        const response = await detailOrder(orderID) as ApiResponse<OrderModel>;
        console.log(response)
        if (response.code === 200) {
          if (response.data) {
            this.orderResponse = response.data;
            console.log('response data: ', this.orderResponse);
            if(this.orderResponse){
              await this.fetchListeMethodePaiement()
              await this.fetchOrderType()
              this.previewPDF()
            }

          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des commandes");
        console.error(error);
      }
    },
    async launchPrint(pdfFile: File) {
      try {
        const response = await printTicketLocally(pdfFile);
        if (response.status === 200 && response.data.success) {
          this.toast.success("🎉 Ticket imprimé avec succès");
        } else {
          this.toast.error(response.data.error || "Erreur d'impression.");
        }
      } catch (error) {
        this.toast.error("Erreur lors de l'impression du ticket.");
        console.error(error);
      }
    }
  },
  async mounted() {
    document.body.classList.add("bg-body-secondary");
    const token = await requestNotificationPermission();
    if (token) {
      console.log("Token Firebase sauvegardé :", token);
    }


    //Écoute les notifications reçues
    onMessageListener().then(payload => {
      console.log("Notification reçue en foreground :", payload);
      const notification = payload.notification;
      const data = payload.data || {};
      const title = notification?.title || "Pas de titre";
      const body = notification?.body || "Pas de message";
      console.log("Titre :", title);
      console.log("Message :", body);
      console.log("Données :", data);
      // ✅ Lecture du son si interaction utilisateur préalable
      const audio = new Audio(notificationSound);
      audio.play().catch((err) => {
        console.warn("🔇 Son bloqué :", err);
      });
      // ✅ Utilisation de la toast (si installée dans `this`)
      if (this?.toast?.info) {
        this.toast.info(body);
      } else {
        console.log("ℹ️ Toast info :", body);
      }


    });


    socket.addEventListener('open', () => {
      console.log('WebSocket connecté 🎉');
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      console.log('Message reçu :', data);
      // ✅ Lecture du son si interaction utilisateur préalable
      const audio = new Audio(notificationSound);
      audio.play().catch((err) => {
        console.warn("🔇 Son bloqué :", err);
      });

      if(data.type && data.type === 'NOUVELLE_COMMANDE'){
        this.clearData()
         if(data.restaurant_id && data.restaurant_id == this.restaurantId && data.order_id){
           const order_id = data.order_id;
           console.log(this.restaurantId);
           console.log('ok');
           this.fetchOrder(order_id)
         }
      }



    });

    socket.addEventListener('close', () => {
      console.log('WebSocket fermé ❌');
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket erreur ⚠️', error);
    });
  },

  setup() {
    const toast = useToast();

    const route = useRoute();
    const isLoginPage = computed(() => route.name === "LoginPage" || route.name === "MotPasseOubliePage");
    const stateStoreInstance = stateStore;
    watchEffect(() => {
      if (stateStoreInstance.open) {
        document.body.classList.remove("sidebar-show");
        document.body.classList.add("sidebar-hide");
        console.log("show");
      } else {
        document.body.classList.remove("sidebar-hide");
        document.body.classList.add("sidebar-show");

        console.log("hide");
      }
    });
    return {
      isLoginPage,
      toast
    };
  },
});
</script>

<style>

.login-background {
  background-image: url('@/assets/images/hero-bg.jpg') ; /* Remplacez par le chemin de votre image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.login-background::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Couleur sombre avec opacité */
}

* {
  box-sizing: border-box;
}
html, body {
  height: 100%;
  margin: 0;
}
#recu-pdf * {
  box-sizing: border-box;
  font-family: 'Ubuntu', sans-serif;
  color: #1c1c1c;
}
#recu-pdf {
  max-width: 450px;
  padding: 25px 30px;
  margin-top: 50%;
}

#recu-pdf .top {
  display: flex;
  align-items: center;
  flex-direction: column;
}
#recu-pdf .top .title {
  font-weight: normal;
  font-size: 1.6em;
  text-align: left;
  margin-left: 20px;
  margin-bottom: 50px;
  color: #fff;
}
#recu-pdf .top .printer {
  width: 90%;
  height: 20px;
  border: 5px solid #fff;
  border-radius: 10px;
  box-shadow: 1px 3px 3px 0 rgba(0, 0, 0, 0.2);
}

#recu-pdf .receipts-wrapper {
  overflow: hidden;
  margin-top: -10px;
  padding-bottom: 10px;
}

#recu-pdf .receipts {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  transform: translateY(-510px);

  animation-duration: 2.5s;
  animation-delay: 500ms;
  animation-name: print;
  animation-fill-mode: forwards;
}

#recu-pdf .receipt {
  padding: 25px 30px;
  text-align: left;
  min-height: 200px;
  width: 88%;
  background-color: #fff;
  border-radius: 10px 10px 20px 20px;
  box-shadow: 1px 3px 8px 3px rgba(0, 0, 0, 0.2);
}

#recu-pdf .airliner-logo {
  max-width: 120px;
  position: relative;
  left: 30%;
  margin-bottom: 20px;
}

#recu-pdf .route {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  margin: 5px 0;
}

.dashed-line {
  border: none;
  border-top: 2px dashed #333; /* couleur personnalisable */
  margin: 1rem 0;
  width: 100%;
}




#recu-pdf .plane-icon {
  width: 30px;
  height: 30px;
  transform: rotate(90deg);
}

#recu-pdf .route h2 {
  font-weight: 100;
  font-size: 12px;
  margin: 0;
}

#recu-pdf .details {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

#recu-pdf .details .item {
  display: flex;
  flex-direction: column;
  min-width: 70px;
}

#recu-pdf .details .item span {
  font-size: .8em;
  color: rgba(28, 28, 28, .7);
  font-weight: 500;
}

#recu-pdf .details .item h3 {
  font-size: 18px !important;
  margin-top: 0;
  margin-bottom: 0;
}

#recu-pdf .receipt.qr-code {
  height: 110px;
  min-height: unset;
  position: relative;
  border-radius: 20px 20px 10px 10px;
  display: flex;
  align-items: center;
}

#recu-pdf .receipt.qr-code::before {
  content: '';
  background: linear-gradient(to right, #fff 50%, #3a8d35 50%);
  background-size: 22px 4px, 100% 4px;
  height: 4px;
  width: 90%;
  display: block;
  left: 0;
  right: 0;
  top: -1px;
  position: absolute;
  margin: auto;
}

#recu-pdf .qr {
  width: 70px;
  height: 70px;
}

#recu-pdf .description {
  margin-left: 20px;
}

#recu-pdf .description h2 {
  margin: 0 0 5px 0;
  font-weight: 500;
}

#recu-pdf .description p {
  margin: 0;
  font-weight: 400;
}

#recu-pdf.product-list {
  margin-top: 10px;
  font-family: 'Arial', sans-serif;
}

#recu-pdf.product-list h2 {
  font-size: 10px;
  margin-bottom: 5px;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 2px;
}

#recu-pdf.product-list div {
  padding: 1px 0;
  border-bottom: 1px dashed #ddd;
}

#recu-pdf.product-list span {
  font-size: 10px;
  line-height: 1.2;
  display: inline-block;
}

#recu-pdf.product-list span:first-child {
  font-weight: bold;
  color: #333;
}

#recu-pdf.product-list span:last-child {
  font-weight: 500;
  color: #007bff;
}
#recu-pdf.barcode-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1px dashed #ccc;
}

#recu-pdf.barcode-image {
  height: 60px;
  margin-bottom: 6px;
}

#recu-pdf.barcode-label {
  font-size: 13px;
  color: #444;
  font-style: italic;
}


@keyframes print {
  0% { transform: translateY(-510px); }
  35% { transform: translateY(-395px); }
  70% { transform: translateY(-140px); }
  100% { transform: translateY(0); }
}

.modal-dialog-scrollable .modal-body {
  overflow-y: auto;
  display: flex;
}
</style>