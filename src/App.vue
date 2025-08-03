<template>
  <div :class="{ 'login-background': isLoginPage }">
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
                      <div class="logo-container">
                        <img src="https://res.cloudinary.com/dmxs8btps/image/upload/v1753145633/fmpnkb8e5tgp1nbeiebh.png" class="airliner-logo"/>
                      </div>
                      <div class="route">
                        <h2><strong>Livraison de pizzas {{orderResponse.restaurantID.name}}</strong></h2>
                        <h2><strong>{{orderResponse.restaurantID.id === RestaurantEnum.RESTO_MORGES ? 'Va Bene pizza sàrl Morges' : 'Pizzeria Va Bene SA '}}</strong></h2>
                        <h2><strong>{{orderResponse.restaurantID.address}}</strong></h2>
                        <h2><strong>{{orderResponse.restaurantID.codePostalID.numeroPostal}} {{orderResponse.restaurantID.name}}</strong> </h2>
                        <h2><strong>{{orderResponse.restaurantID.phoneNumber}}</strong></h2>
                        <h2><strong>{{orderResponse.restaurantID.taxe}}</strong></h2>
                      </div>
                      <hr class="dashed-line" />

                      <div class="route">
                        <h2><strong>{{orderResponse.guest_first_name}} {{orderResponse.guest_last_name}}</strong></h2>
                        <h2><strong>{{orderResponse.npa ?? ''}} {{orderResponse.localite ?? ''}}</strong></h2>
                        <h2><strong>{{orderResponse.rue }} - {{orderResponse.numberRue}}</strong></h2>
                        <h2><strong>{{orderResponse.guest_phone_number}}</strong></h2>
                        <h2><strong>{{orderResponse.guest_email}}</strong></h2>
                      </div>

                      <hr class="dashed-line" />

                      <div class="route">
                        <h2 v-if="orderTypeSelected.length > 0"><strong>{{orderTypeSelected[0].libelle}}</strong></h2>
                        <h2><strong>{{orderResponse.DeliveryPreference != 'immediat' ? 'PRÉCOMMANDE' : 'TOUT DE SUITE'}}</strong></h2>
                        <h2 v-if="orderResponse.DeliveryPreference != 'immediat'"><strong>{{convertDateCreate(orderResponse.timeOrder) ?? ''}} </strong></h2>
                        <h2><strong>{{orderResponse.restaurantID.id === RestaurantEnum.RESTO_MORGES ? 'VBM'+ orderResponse.nif : 'VBP'+ orderResponse.nif}}</strong></h2>
                        <!--                            <h2><strong>{{getLast6Digits(orderResponse.customer.id)}}</strong></h2>-->

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
                            style="margin-bottom: 10px; "
                        >
                          <!-- 🏷️ Nom unique de la catégorie -->
                          <div style="font-weight: 600; font-size: 18px; margin-bottom: 8px; text-decoration: underline;">
                            {{ categoryName }}
                          </div>

                          <!-- 🍕 Tous les produits de cette catégorie -->
                          <div
                              v-for="item in items"
                              :key="item.id"
                              style="display: flex; flex-direction: column; margin-bottom: 10px;"
                          >
                            <div style="display: flex; align-items: flex-start; font-size: 15px; line-height: 1.2;">
                              <span style=" flex: 1; margin-right: 3px; overflow-wrap: break-word; max-width: 250px;"><strong>{{ item.quantity }}x {{ item.productID.name }} {{item.size}} {{item.optionSpecific}}</strong></span>
                              <span style="flex: 0 0 auto; text-align: right; white-space: nowrap;"><strong>{{ item.total_price }} CHF</strong></span>
                            </div>

                            <!-- 🧂 Ingrédients -->
                            <ul v-if="item?.ingredients && item.ingredients?.length > 0" style="margin: 2px 0 0 10px; font-size: 18px; color: #555;">
                              <li
                                  v-for="ingredient in item.ingredients"
                                  :key="ingredient.id"
                                  class="text-decoration-none list-unstyled"
                              >
                                <strong>x{{ ingredient.quantite }} {{ ingredient.name }} ({{extraireCmValeur(ingredient.size)}})</strong>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>



                      <hr class="dashed-line" />
                      <div class="product-list">
                        <div style="display: flex; align-items: flex-start; margin: 5px 0;">
                          <span style="flex: 1; margin-right: 3px;"><strong>SOUS-TOTAL: </strong></span>
                          <span style="flex: 0 0 auto; text-align: right;"><strong>{{(orderResponse.total_price - (orderResponse.total_price * 2.60/100)).toFixed(2) }} CHF</strong></span>
                        </div>
                        <div style="display: flex; align-items: flex-start; margin: 5px 0;">
                          <span style="flex: 1; margin-right: 3px;"><strong>2.60% TVA </strong></span>
                          <span style="flex: 0 0 auto; text-align: right;"><strong>{{(orderResponse.total_price * 2.60/100).toFixed(2)}} CHF</strong></span>
                        </div>
                        <div style="display: flex; align-items: flex-start; margin: 5px 0;">
                          <span style="flex: 1; margin-right: 3px;"><strong>RABAIS: </strong></span>
                          <span style="flex: 0 0 auto; text-align: right;" v-if="orderResponse.discountValue != ''"><strong>{{  orderResponse.discountValue ?? "-" }} {{ orderResponse.discountType === 'fixed' ? 'CHF' : '%' }}</strong></span>
                          <span style="flex: 0 0 auto; text-align: right;" v-else><strong>0 CHF</strong></span>
                        </div>
                        <div style="display: flex; margin: 5px 0;">
                          <span style="flex: 1; margin-right: 5px;"><strong>FRAIS SUPP.: </strong></span>
                          <span style="flex-shrink: 0; text-align: right;" v-if="orderResponse.restMinimumOrder != ''"><strong>{{  orderResponse.restMinimumOrder ?? "-" }} CHF</strong></span>
                          <span style="flex-shrink: 0; text-align: right;" v-else><strong>0 CHF</strong></span>
                        </div>
                        <div style="display: flex; align-items: flex-start; margin: 5px 0;">
                          <span style="flex: 1; margin-right: 3px;"><strong>TOTAL BRUT:  </strong></span>
                          <span style="flex: 0 0 auto; text-align: right;"><strong>{{ orderResponse.total_price }} CHF</strong></span>
                        </div>
                        <div style="display: flex; align-items: flex-start; margin: 5px 0;" v-if="methodePaiementSelected.length > 0">
                          <span style="flex: 0 0 auto; margin-right: 3px; ">Paiement par :  </span>
                          <span style="flex: 1; text-align: right; line-height: 1.1;">{{ methodePaiementSelected[0].libelle }}</span>
                        </div>
                      </div>
                      <hr class="dashed-line" />
                      <div class="route">
                        <h2><strong>Trancher: {{orderResponse.intructionOrder.isTrancher ? 'OUI': 'NON'}}</strong></h2>
                        <h2><strong>Couverts: {{orderResponse.intructionOrder.quantityCouverts}}</strong></h2>
                        <h2><strong>{{orderResponse.SpecialInstructions}}</strong></h2>
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
/* eslint-disable */
// @ts-nocheck
import { computed, defineComponent, watchEffect } from "vue";
import stateStore from "./utils/store";

import MainHeader from "./components/Layouts/MainHeader.vue";
import MainSidebar from "./components/Layouts/MainSidebar.vue";
import { useRoute } from "vue-router";
import { isSupported } from "firebase/messaging";
import {
  requestForToken,
  onMessageListener,
  requestNotificationPermission,
} from "./firebase";
import { useToast } from "vue-toastification";
import notificationSound from "@/assets/sounds/notification.wav";
import { UserGeneralKey } from "@/models/user.generalkey";
import socket from "@/utils/websocket";
import {
  detailOrder,
  listeMethodePaiement,
  listeOrderType,
  printTicketLocally,
} from "@/service/api";
import {
  ApiResponse,
  PaginatedMethodePaiement,
  PaginatedOrderType,
} from "@/models/Apiresponse";
import { OrderModel } from "@/models/order.model";
import { MethodePaiementModel } from "@/models/methodePaiement.model";
import { OrderTypeModel } from "@/models/orderType.model";
import { OrderItemModel } from "@/models/orderItem.model";
import html2pdf from "html2pdf.js";
import { OrderStatus } from "@/enums/orderStatut.enum";
import { PaymentStatus } from "@/enums/orderPaiementMethode.enum";
import { RestaurantEnum } from "./enums/restaurant.enum";

export default defineComponent({
  name: "App",
  computed: {
    groupedByCategory(): Record<string, any[]> {
      const grouped: Record<string, any[]> = {};

      if (this.orderResponse) {
        for (const item of this.orderResponse.orderItems) {
          const categoryName =
              item.productID?.categorieID?.name || "Sans catégorie";

          if (!grouped[categoryName]) {
            grouped[categoryName] = [];
          }

          grouped[categoryName].push(item);
        }
      }
      return grouped;
    },
    RestaurantEnum() {
      return RestaurantEnum;
    },
  },
  components: {
    MainHeader,
    MainSidebar,
  },
  data() {
    return {
      restaurantId: localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID) as
          | string
          | null,
      orderResponse: null as OrderModel | null,
      listeMethode: [] as MethodePaiementModel[],
      listeOrderType: [] as OrderTypeModel[],
      methodePaiementSelected: [] as MethodePaiementModel[],
      orderTypeSelected: [] as OrderTypeModel[],
      orderItemSelected: null as OrderItemModel | null,
      qrcode: null as string | null,
      allOrderStatus: [] as string[],
      allPaiementOrderStatus: [] as string[],
      messages: [] as any[],
    };
  },
  methods: {
    clearData(): void {
      this.orderResponse = null;
      (this as any).listeMethode = [];
      (this as any).listeOrderType = [];
      (this as any).methodePaiementSelected = [];
      (this as any).orderTypeSelected = [];
      (this as any).orderItemSelected = null;
      (this as any).allOrderStatus = [];
      (this as any).allPaiementOrderStatus = [];
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    extraireCmValeur(texte: string): string | null {
      const match = texte.match(/\b\d+cm\b/);
      return match ? match[0] : null;
    },
    getMethodePaiementParType(
        liste: MethodePaiementModel[],
        type: string
    ): MethodePaiementModel[] {
      console.log(liste);
      console.log(type);
      return liste.filter((methode) => methode.type === type);
    },
    getOrderTypeParType(
        liste: OrderTypeModel[],
        type: string
    ): OrderTypeModel[] {
      return liste.filter((orderType) => orderType.type === type);
    },
    fetchStatusOrderFr(status: string): string {
      switch (status) {
        case OrderStatus.PENDING:
          return "En attente";
        case OrderStatus.PROCESSING:
          return "En cours de traitement";
        case OrderStatus.READY_FOR_DELIVERY:
          return "Près pour livraison";
        case OrderStatus.OUT_FOR_DELIVERY:
          return "En cours de livraison";
        case OrderStatus.DELIVERED:
          return "Livré";
        default:
          return "Annulé";
      }
    },
    fetchStatusOrderPaiementFr(status: string): string {
      switch (status) {
        case PaymentStatus.PENDING:
          return "En attente de paiement";
        case PaymentStatus.PAID:
          return "Payé";
        case PaymentStatus.REFUNDED:
          return "A rembourser";
        default:
          return "Annulé";
      }
    },
    fetStatusPiamentFr(status: string): string | undefined {
      return (this as any).allPaiementOrderStatus.find(
          (orderStatus: string) => orderStatus === status
      );
    },
    getLast6Digits(uuid: string): string {
      const parts = uuid.split("-");
      const lastPart = parts[parts.length - 1];
      // On garde uniquement les chiffres
      const digitsOnly = lastPart.replace(/\D/g, "");
      return digitsOnly.slice(-6);
    },
    previewPDF(): void {
      const element = document.getElementById("recu-pdf");
      if ((this as any).orderResponse && element) {
        const style = document.createElement("style");

        const originalElementWidth = element.style.width;
        const originalElementMargin = element.style.margin;
        const originalElementTransform = element.style.transform; // Capture la transformation d'animation

        const receiptsElement = element.querySelector('.receipts') as HTMLElement;
        let originalReceiptsTransform = '';
        let originalReceiptsMarginTop = '';
        if (receiptsElement) {
          originalReceiptsTransform = receiptsElement.style.transform;
          originalReceiptsMarginTop = receiptsElement.style.marginTop;
        }

        // Appliquer largeur ticket
        element.style.width = '72mm'
        element.style.margin = "0";
        element.style.transform = 'none'; // Désactiver toute trxansformation de translation des animations
        if (receiptsElement) {
          receiptsElement.style.transform = 'none'; // Désactiver les animations sur .receipts
          receiptsElement.style.marginTop = '0'; // S'assurer qu'aucune marge supérieure ne pousse le contenu
        }
        // Injecter les styles avec un scope sur #recu-pdf uniquement
        style.textContent = `
      #recu-pdf {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        font-family: 'Ubuntu', sans-serif;
        color: #1c1c1c;
        padding: 0; /* Réinitialiser le padding pour éviter les problèmes de double padding */
      }

      #recu-pdf * {
        box-sizing: border-box;
      }

      #recu-pdf .receipts-wrapper {
        overflow: hidden;
        margin-top: 0; /* Réinitialiser ceci également, cela faisait partie de l'animation */
        padding-bottom: 0; /* Réinitialiser ou ajuster au besoin */
      }

      #recu-pdf .receipts {
        width: 100%; /* Le faire prendre toute la largeur de #recu-pdf (102mm) */
        display: flex;
        align-items: center; /* Centrer horizontalement pour les éléments enfants */
        flex-direction: column;
        transform: none; /* Désactiver la transformation d'animation pour le PDF */
        animation: none; /* Désactiver l'animation pour le PDF */
      }

      #recu-pdf .receipt {
        padding: 18px 7px; /* Padding réduit pour un ajustement plus serré sur un ticket, ajuster au besoin */
        text-align: left;
        min-height: 200px; /* Garder min-height ou ajuster */
        width: 100%; /* Faire en sorte que le contenu réel du ticket prenne 100% de la largeur de #recu-pdf (102mm) */
        background-color: #fff;
        border-radius: 10px 10px 20px 20px;
        box-shadow: none; /* Supprimer l'ombre portée pour un PDF plus propre, sauf si spécifiquement désiré */
      }
 /* NOUVEAUX STYLES FLEXBOX POUR LE CONTENEUR DU LOGO */
#recu-pdf .logo-container {
  width: 100%;
  margin-bottom: 20px; /* Espace sous le logo, ajustez si besoin */
  /* optionnel: background-color: #f0f0f0; pour voir les limites du conteneur si vous déboguez */
}

#recu-pdf .airliner-logo {
  width: 100%;
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
        border-top: 2px dashed #333;
        margin: 1rem 0;
        width: 100%;
      }

      #recu-pdf .route h2 {
        font-weight: 100;
        font-size: 18px; /* Taille de police légèrement plus petite pour le ticket */
        margin: 0;
        line-height: 1.3; /* Ajuster la hauteur de ligne pour une meilleure lisibilité */
      }

      #recu-pdf .product-ticket {
        width: 100%;
      }

      #recu-pdf .category-section {
        margin-bottom: 8px; /* Marge ajustée */
      }

      #recu-pdf .product-ticket .category-section div {
         font-size: 18px; /* Taille de police cohérente pour les lignes de produits */
      }

      #recu-pdf .product-ticket ul {
        margin: 2px 0 0 5px; /* Ajustement de la marge de la liste d'ingrédients */
        font-size: 18px; /* Taille de police plus petite pour les ingrédients */
        color: #555;
      }

      #recu-pdf .product-ticket ul li {
         line-height: 1.2;
      }

      #recu-pdf .product-list div {
        font-size: 18px; /* Taille de police pour les lignes du résumé */
        padding: 2px 0;
      }
      #recu-pdf .product-list span {
        font-size: 15px; /* Assurer la cohérence */
      }

      #recu-pdf .barcode-footer {
        text-align: center;
        margin-top: 15px; /* Marge réduite */
        padding-top: 10px;
        border-top: 1px dashed #ccc;
      }

      #recu-pdf .barcode-image {
        height: 50px; /* Code-barres légèrement plus petit */
        margin-bottom: 5px;
      }

      #recu-pdf .barcode-label {
        font-size: 18px; /* Étiquette du code-barres plus petite */
      }

      /* Supprimer tous les styles liés à l'animation pour le PDF */
      @keyframes print {
          from { transform: none; }
          to { transform: none; }
      }
    `;

        document.head.appendChild(style);

        setTimeout(() => {
          const contentHeight = this.getHeightTicket() + ((this.orderResponse?.orderItems.length ?? 1 )  * 5)
          console.log("contentHeight: ", contentHeight);
          const desiredHeight = Math.max(this.getHeightTicket(), contentHeight + 35); // Minimum 200mm, ou hauteur du contenu + un peu de marge
          console.log("desiredHeight: ", desiredHeight);
          const opt = {
            margin: [2, 1, 2, 1],
            filename: `Facture_${this.getShortUuid(
                this.orderResponse!.id
            )}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
            },
            jsPDF: { unit: 'mm', format: [80, desiredHeight], orientation: 'portrait' } // <-- Exemple pour 80mm de papier
          };


          html2pdf()
              .set(opt)
              .from(element)
              .toPdf()
              .get("pdf")
              .then((pdf) => {
                const blob = pdf.output("blob");
                const url = URL.createObjectURL(blob);
                const file = new File([blob], "ticket.pdf", {
                  type: "application/pdf",
                });
                // window.open(url, '_blank');
                this.launchPrint(file);
               
                element.style.width = "";
                element.style.margin = "";
              })
              .catch((error) => {
                console.error("Erreur lors de la génération du PDF:", error);
                (this as any).toast.error("Erreur lors de la génération du PDF");
              })
              .finally(() => {
                document.head.removeChild(style);
                // Restaurer les styles originaux de l'élément
                element.style.width = originalElementWidth;
                element.style.margin = originalElementMargin;
                element.style.transform = originalElementTransform;
                if (receiptsElement) {
                  receiptsElement.style.transform = originalReceiptsTransform;
                  receiptsElement.style.marginTop = originalReceiptsMarginTop;
                }
              });
        }, 100);
      }
    },
   
    getHeightTicket(): number {
      return 235 + (this.orderResponse?.SpecialInstructions != null ? 30 : 0 ) + this.getHeightTicketWithIngredients()
    },
    getHeightTicketWithIngredients(): number {
      let baseHeight = 0
      if (this.orderResponse?.orderItems && this.orderResponse.orderItems.length > 0) {
        this.orderResponse.orderItems.forEach(item => {
          if (item.ingredients && item.ingredients.length > 0) {
            baseHeight += (item.ingredients.length * 5)
          }
        })
      }
      return baseHeight
    },

    getShortUuid(uuid: string): string {
      return uuid.split("-")[0];
    },
    async fetchListeMethodePaiement(page = 1): Promise<void> {
      // this.isLoading = true;
      try {
        const response = (await listeMethodePaiement(
            page
        )) as ApiResponse<PaginatedMethodePaiement>;
        console.log(response);
        if (response.code === 200) {
          if (response.data?.items && this.orderResponse) {
            this.listeMethode = response.data.items;
            this.methodePaiementSelected = this.getMethodePaiementParType(
                response.data.items,
                this.orderResponse.paymentID.paymentMethod
            );
            console.log("liste des methodes: ", this.listeMethode);
            console.log(
                "paiement methode: ",
                this.orderResponse.paymentID.paymentMethod
            );
            console.log(
                "methode Paiement selected: ",
                this.methodePaiementSelected
            );
          }
        } else {
          (this as any).toast.error(response.message);
        }
      } catch (error) {
        (this as any).toast.error(
            "Erreur lors du chargement des methodes de paiement"
        );
        console.error(error);
      } finally {
        // this.isLoading = false;
      }
    },
    async fetchOrderType(page = 1): Promise<void> {
      // this.isLoading = true;
      try {
        const response = (await listeOrderType(
            page
        )) as ApiResponse<PaginatedOrderType>;
        console.log(response);
        if (response.code === 200) {
          if (response.data?.items && this.orderResponse) {
            this.listeOrderType = response.data.items;
            console.log("data orderType retrieve: ", this.listeOrderType);
            console.log("orderType: ", this.orderResponse.order_type);
            this.orderTypeSelected = this.getOrderTypeParType(
                response.data.items,
                this.orderResponse.order_type
            );
            console.log("orderType selected: ", this.orderTypeSelected);
          }
        } else {
          (this as any).toast.error(response.message);
        }
      } catch (error) {
        (this as any).toast.error(
            "Erreur lors du chargement des types de commandes"
        );
        console.error(error);
      } finally {
        // this.isLoading = false;
      }
    },
    async fetchOrder(orderID: string): Promise<void> {
      try {
        const response = (await detailOrder(
            orderID
        )) as ApiResponse<OrderModel>;
        console.log(response);
        if (response.code === 200) {
          if (response.data) {
            this.orderResponse = response.data;
            console.log("response data: ", this.orderResponse);
            if (this.orderResponse) {
              await this.fetchListeMethodePaiement();
              await this.fetchOrderType();
              this.previewPDF();
            }
          }
        } else {
          (this as any).toast.error(response.message);
        }
      } catch (error) {
        (this as any).toast.error("Erreur lors du chargement des commandes");
        console.error(error);
      }
    },
    async launchPrint(pdfFile: File): Promise<void> {
      console.log("impression launch");
      try {
        await printTicketLocally(pdfFile);
        (this as any).toast.success("🎉 Ticket imprimé avec succès");
      } catch (error) {
        (this as any).toast.error("Erreur lors de l'impression du ticket.");
        console.error(error);
      }
    },
  },
  async mounted() {
    document.body.classList.add("bg-body-secondary");
    isSupported().then(async (supported) => {
      if (supported) {
        /*  // Initialize messaging
         const token = await requestNotificationPermission();
         if (token) {
           console.log("Token Firebase sauvegardé :", token);
         }

         //Écoute les notifications reçues
         onMessageListener().then((payload) => {
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
           if ((this as any)?.toast?.info) {
             (this as any).toast.info(body);
           } else {
             console.log("ℹ️ Toast info :", body);
           }
         }); */
      } else {
        // Show fallback or error message
      }
    });

    socket.addEventListener("open", () => {
      console.log("WebSocket connecté 🎉");
    });

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      console.log("Message reçu :", data);
      // ✅ Lecture du son si interaction utilisateur préalable
      const audio = new Audio(notificationSound);
      audio.play().catch((err) => {
        console.warn("🔇 Son bloqué :", err);
      });

      if (data.type && data.type === "NOUVELLE_COMMANDE") {
        this.clearData();
        if (
            data.restaurant_id &&
            data.restaurant_id == this.restaurantId &&
            data.order_id
        ) {
          const order_id = data.order_id;
          console.log(this.restaurantId);
          console.log("ok");
          this.fetchOrder(order_id);
        }
      }
    });

    socket.addEventListener("close", () => {
      console.log("WebSocket fermé ❌");
    });

    socket.addEventListener("error", (error) => {
      console.error("WebSocket erreur ⚠️", error);
    });
  },

  setup() {
    const toast = useToast();

    const route = useRoute();
    const isLoginPage = computed(
        () => route.name === "LoginPage" || route.name === "MotPasseOubliePage"
    );
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
      toast,
    };
  },
});
</script>

<style>
.login-background {
  background-image: url("@/assets/images/hero-bg.jpg");
  /* Remplacez par le chemin de votre image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.login-background::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  /* Couleur sombre avec opacité */
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
  max-width: 650px;
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
  font-size: 1.9em;
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
  padding: 25px 5px;
  text-align: left;
  min-height: 200px;
  width: 88%;
  background-color: #fff;
  border-radius: 10px 10px 20px 20px;
  box-shadow: 1px 3px 8px 3px rgba(0, 0, 0, 0.2);
}

/* NOUVEAUX STYLES FLEXBOX POUR LE CONTENEUR DU LOGO */
#recu-pdf .logo-container {
  max-width: 150px;
  margin-bottom: 20px; /* Espace sous le logo, ajustez si besoin */
  /* optionnel: background-color: #f0f0f0; pour voir les limites du conteneur si vous déboguez */
}

#recu-pdf .airliner-logo {
  max-width: 190px;
  position: relative;
  left: 50%;
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
  font-size: 18px;
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
  font-size: 1.9em;
  color: rgba(28, 28, 28, .7);
  font-weight: 500;
}

#recu-pdf .details .item h3 {
  font-size: 20px !important;
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
  font-size: 18px;
  margin-bottom: 5px;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 2px;
}

#recu-pdf.product-list div {
  padding: 1px 0;
  border-bottom: 1px dashed #ddd;
}

#recu-pdf.product-list span {
  font-size: 18px;
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
  font-size: 18px;
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