<template>
  <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
      style="z-index: 9999;"
  >
    <LoaderComponent />
  </div>
  <div v-else
    class="card mb-25 border-0 rounded-0 bg-white letter-spacing invoice-details-box"
  >
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30">
      <div class="d-lg-flex justify-content-between" v-if="paiementResponse && paiementResponse.orderSelf">
        <div class="text-start">
          <img
            src="@/assets/images/logo_update.svg"
            class="black-logo"
            alt="logo"
            style="width: 140px; height: auto;"
          />
          <img
            src="@/assets/images/logo_update.svg"
            class="white-logo"
            alt="logo"
            style="width: 140px; height: auto;"
          />
          <span
            class="d-block mt-12 mt-md-15 mt-lg-30 fs-md-15 fs-lg-16 fw-medium text-paragraph mb-5 mb-md-8"
          >
            Restaurant
          </span>
          <p v-if="paiementResponse.orderSelf.restaurantID"  class="mb-5 text-muted fs-md-15 fs-md-16 lh-base">
            {{paiementResponse.orderSelf.restaurantID.name ?? ''}} <br /> {{paiementResponse.orderSelf.restaurantID.numeroRue ?? ''}}{{paiementResponse.orderSelf.restaurantID.address ?? ''}}
          </p>
          <span v-if="paiementResponse.orderSelf.restaurantID" class="d-block text-muted fs-md-15 fs-md-16">
            Tel :  {{paiementResponse.orderSelf.restaurantID.phoneNumber ?? ''}}
          </span>
        </div>
        <div class="text-lg-center mt-15 mt-md-20 mt-lg-0">
          <h2
            class="text-black fw-black mb-5 mb-sm-10 mb-lg-20 fs-18 fs-md-20 fs-lg-30"
          >
            Reference
          </h2>
          <span v-if="paiementResponse.orderSelf" class="d-block fs-md-15 fs-md-16 text-muted">
            <span class="me-md-5 d-block d-md-inline-block">
              ref.commande :
              <span class="text-paragraph">#{{paiementResponse.orderSelf.restaurantID.id === RestaurantEnum.RESTO_PENTHAZ ? 'VBP'+ paiementResponse.orderSelf.nif : 'VBM'+ paiementResponse.orderSelf.nif}}</span>
            </span>
            <span class="ms-md-5 d-block d-md-inline-block">
              Date :
              <span class="text-paragraph">{{convertDateCreate(paiementResponse.created_at)}}</span>
            </span>
          </span>
        </div>
        <div v-if="paiementResponse.orderSelf && qrcode" class="text-lg-end mt-15 mt-md-20 mt-lg-0">
          <img :src="qrcode" alt="qr-code" />
        </div>
      </div>
      <div class="invoice-info d-lg-flex justify-content-between">
        <div class="d-flex"  v-if="paiementResponse">
          <div v-if="paiementResponse.orderSelf">
            <span class="d-block text-black fs-md-15 fw-bold mb-12">
             Operation effectuée par:
            </span>
            <span
              class="d-block fs-md-15 fs-lg-16 fw-medium text-paragraph mb-8"
            >
              {{paiementResponse.orderSelf.guest_first_name}} {{paiementResponse.orderSelf.guest_last_name}}
            </span>
            <p  class="mb-5 text-muted fs-md-15 fs-md-16 lh-base">
              Tel :  {{paiementResponse.orderSelf.guest_phone_number}}
            </p>

          </div>
          <div class="ms-10 ms-sm-50 ms-md-100">
            <span class="d-block text-black fs-md-15 fw-bold mb-12">
              Paiement:
            </span>
            <span v-if="paiementResponse &&  paiementResponse.paymentMethod"
              class="d-block fs-md-15 fs-lg-16 fw-medium text-paragraph mb-8"
            >
              {{getMethodePaiementParType(listeMethode,  paiementResponse.paymentMethod)?.libelle ?? '-' }}
            </span>


          </div>
        </div>
        <div class="buttons-list mt-15 mt-md-20 mt-lg-0">
<!--          <button-->
<!--            class="default-btn position-relative transition border-0 fw-medium text-white pt-12 pb-12 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-30 pe-md-30 rounded-1 fs-md-15 fs-lg-16 d-inline-block me-10"-->
<!--            type="button" data-bs-toggle="modal" data-bs-target="#contentModalScrollable_facture"-->
<!--          >-->
<!--            Imprimer <i class="flaticon-printer position-relative ms-5 fs-12"></i>-->
<!--          </button>-->
        </div>
      </div>
      <span class="d-block text-black fs-md-15 fw-bold mb-15 mb-md-20 mb-lg-25">
        Recapitulatif de commande
      </span>
      <div class="table-responsive" v-if="paiementResponse">
        <table class="table text-nowrap align-middle mb-0">
          <thead>
            <tr>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 ps-0"
              >
                #Num
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
              >
                Produit
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
              >
                Quantité
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
              >
                Prix unitaire
              </th>
              <th
                scope="col"
                class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 pe-0"
              >
                Prix total
              </th>
            </tr>
          </thead>
          <tbody v-if="paiementResponse.orderSelf">
            <tr
                v-for="(orderItem, index) in paiementResponse?.orderSelf.orderItems" :key="orderItem.id"
            >
              <td class="shadow-none lh-1 fw-semibold text-black ps-0">{{index + 1}}.</td>
              <td v-if="orderItem.productID" class="shadow-none text-paragraph product-title">
                <h5
                  class="text-black fw-bold fs-14 fs-md-15 fs-md-16 mb-8 mb-md-10"
                >
                  {{orderItem.productID.name}}
                </h5>
                <spand class="d-block">
                  {{cleanAndTruncateHtmlText(orderItem.productID.description)}}
                </spand>
              </td>
              <td class="shadow-none lh-1 fw-medium text-paragraph"> x{{orderItem.quantity}}</td>
              <td class="shadow-none lh-1 fw-medium text-paragraph"> {{orderItem.unit_price}} CHF</td>
              <td class="shadow-none lh-1 fw-medium text-paragraph pe-0">
                {{orderItem.total_price}} CHF
              </td>
            </tr>

          </tbody>
        </table>
      </div>
      <ul class="order-summary-list ps-0 mb-0 list-unstyled" v-if="paiementResponse">
        <li v-if="paiementResponse && paiementResponse.orderSelf" class="d-flex align-items-center justify-content-between">
          <span class="d-block text-paragraph fw-medium"> SOUS-TOTAL </span>
          <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
            {{(paiementResponse.orderSelf.total_price - (paiementResponse.orderSelf.total_price * 2.60/100)).toFixed(2)}} CHF
          </span>
        </li>
        <li class="d-flex align-items-center justify-content-between">
          <span class="d-block text-paragraph fw-medium">
          2.60% TVA
          </span>
          <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
              {{ (paiementResponse.orderSelf.total_price * 2.60 / 100).toFixed(2) }} CHF
          </span>
        </li>
        <li class="d-flex align-items-center justify-content-between">
          <span class="d-block text-paragraph fw-medium"> RABAIS </span>
          <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
            0 CHF
          </span>
        </li>

        <li v-if="paiementResponse && paiementResponse.amount" class="d-flex align-items-center justify-content-between">
          <span class="d-block text-paragraph fw-medium"> TOTAL BRUT </span>
          <span class="d-block text-primary fs-md-15 fs-lg-16 fw-bold">
            {{ paiementResponse.amount }} CHF
          </span>
        </li>
      </ul>
      <span
        class="d-block text-black text-center fs-md-15 fs-lg-16 mt-15 mt-md-25 mt-lg-35 mt-xl-50"
      >
        # Merci de toujours nous faire confiance
        <span class="text-primary fw-bold">VaBene Pizzeria</span> #
      </span>
    </div>
    <div class="modal fade" id="contentModalScrollable_facture" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content" v-if="paiementResponse">
          <div class="modal-header" v-if="paiementResponse.orderSelf">
            <h1 class="modal-title fs-5">Facture de la commande #{{getShortUuid(paiementResponse.orderSelf.id)}}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body  align-items-center justify-content-center" >
            <div class="flex-column items-center justify-content-center">
              <main class="ticket-system" >
                <div class="receipts-wrapper" >
                  <div class="receipts"  id="recu-pdf">
                    <div class="receipt" v-if="paiementResponse.orderSelf">
                      <img src="@/assets/images/logo_update.svg" class="airliner-logo"/>
                      <div class="route" v-if="paiementResponse.orderSelf.restaurantID">
                        <h2><strong>Livraison de pizzas {{paiementResponse.orderSelf.restaurantID.name}}</strong></h2>
                        <h2><strong>{{paiementResponse.orderSelf.restaurantID.id === RestaurantEnum.RESTO_MORGES ? 'Va Bene pizza sàrl Morges' : 'Pizzeria Va Bene SA '}}</strong></h2>
                        <h2><strong>{{paiementResponse.orderSelf.restaurantID.address}}</strong></h2>
                        <h2><strong>{{paiementResponse.orderSelf.restaurantID.codePostalID.numeroPostal}} {{paiementResponse.orderSelf.restaurantID.name}}</strong> </h2>
                        <h2><strong>+4121 {{paiementResponse.orderSelf.restaurantID.phoneNumber}}</strong></h2>
                        <h2><strong>{{paiementResponse.orderSelf.restaurantID.taxe}}</strong></h2>
                      </div>
                      <hr class="dashed-line" />

                      <div class="route" v-if="paiementResponse.orderSelf">
                        <h2><strong>{{paiementResponse.orderSelf.guest_first_name}} {{paiementResponse.orderSelf.guest_last_name}}</strong></h2>
                        <h2><strong>{{paiementResponse.orderSelf.address}} - {{paiementResponse.orderSelf.numberRue}}</strong></h2>
                        <h2><strong>{{paiementResponse.orderSelf.npa ?? ''}} {{paiementResponse.orderSelf.localite ?? ''}}</strong></h2>
                        <h2><strong>{{paiementResponse.orderSelf.guest_phone_number}}</strong></h2>
                        <h2><strong>{{paiementResponse.orderSelf.guest_email}}</strong></h2>
                      </div>

<!--                      okkkk-->

                      <hr class="dashed-line" />

                      <div class="route" v-if="paiementResponse.orderSelf">
                        <h2><strong>{{orderTypeSelected[0].libelle}}</strong></h2>
                        <h2><strong>{{convertDateCreate(paiementResponse.orderSelf.created_at)}}</strong></h2>
                        <h2><strong>{{paiementResponse.orderSelf.DeliveryPreference != 'immediat' ? 'PRÉCOMMANDE' : 'TOUT DE SUITE'}}</strong></h2>
                        <h2><strong>{{convertDateCreate(paiementResponse.orderSelf.timeOrder) ?? ''}} </strong></h2>
                        <h2><strong>{{paiementResponse.orderSelf.restaurantID.id === RestaurantEnum.RESTO_MORGES ? 'VBM'+ paiementResponse.orderSelf.nif : 'VBP'+ paiementResponse.orderSelf.nif}}</strong></h2>
                        <h2><strong>{{getLast6Digits(paiementResponse.orderSelf.customer.id)}}</strong></h2>

                      </div>
                      <hr class="dashed-line" />

                      <div class="product-ticket" v-if="paiementResponse.orderSelf">
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
                              :key="item?.id || 'unknown-item'"
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
                      <div class="product-list" v-if="paiementResponse.orderSelf">
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                          <span><strong>SOUS-TOTAL: </strong></span>
                          <span><strong>{{(paiementResponse.orderSelf.total_price - (paiementResponse.orderSelf.total_price * 2.60/100)).toFixed(2) }} CHF</strong></span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                          <span><strong>2.60% TVA </strong></span>
                          <span><strong>{{(paiementResponse.orderSelf.total_price * 2.60/100).toFixed(2)}} CHF</strong></span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                          <span><strong>RABAIS: </strong></span>
                          <span><strong>0 CHF</strong></span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                          <span><strong>TOTAL BRUT:  </strong></span>
                          <span><strong>{{ paiementResponse.orderSelf.total_price }} CHF</strong></span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                          <span>Méthode de paiements :  </span>
                          <span v-if="methodePaiementSelected">{{ methodePaiementSelected.libelle }}</span>
                        </div>
                      </div>
                      <hr class="dashed-line" />
                      <div class="route" v-if="paiementResponse.orderSelf">
                        <h2 v-if="paiementResponse.orderSelf.feature"><strong>{{paiementResponse.orderSelf.feature[0]}}</strong></h2>
                        <h2><strong>Trancher: {{paiementResponse.orderSelf.intructionOrder.isTrancher ? 'OUI': 'NON'}}</strong></h2>
                        <h2><strong>Couverts: {{paiementResponse.orderSelf.intructionOrder.quantityCouverts}}</strong></h2>

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
import LoaderComponent from "@/components/Loading/Loader.vue";
import {OrderModel} from "@/models/order.model";
import {MethodePaiementModel} from "@/models/methodePaiement.model";
import {OrderTypeModel} from "@/models/orderType.model";
import {OrderItemModel} from "@/models/orderItem.model";
import html2pdf from "html2pdf.js";
import {UserGeneralKey} from "@/models/user.generalkey";
import {RestaurantEnum} from "../../../../enums/restaurant.enum";

import {
  allStatusOrder,
  allStatusPaiementOrder,
  detailOrder,
  listeMethodePaiement,
  listeOrderType,
  updateOrder,
  detailPaiement
} from "@/service/api";
import {ApiResponse, PaginatedMethodePaiement, PaginatedOrderType} from "@/models/Apiresponse";
import {OrderStatus} from "@/enums/orderStatut.enum";
import {PaymentStatus} from "@/enums/orderPaiementMethode.enum";
import {useToast} from "vue-toastification";
import {PaymentModel} from "@/models/payment.model";
import {defineComponent} from "vue";

document.addEventListener('hidden.bs.modal', function (event) {
  document.body.classList.remove('modal-open'); // au cas où
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(el => el.remove());
});


export default defineComponent({
  name: "TransactionDetails",
  computed: {
    groupedByCategory() {
      const grouped: Record<string, any[]> = {};

      if(this.paiementResponse){
        for (const item of this.paiementResponse.orderSelf.orderItems) {
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
  components: {LoaderComponent},
  data(){
    return{
      paiementResponse: null as PaymentModel | null,
      isLoading: false,
      listeMethode: [] as MethodePaiementModel[],
      listeOrderType: [] as OrderTypeModel[],
      methodePaiementSelected: null as MethodePaiementModel | null,
      orderTypeSelected: [] as OrderTypeModel[],
      orderItemSelected: null as OrderItemModel | null,
      qrcode: null as string | null,
      allOrderStatus: [] as string[],
      allPaiementOrderStatus: [] as string[]
    }
  },

  methods: {
    getLast6Digits(uuid: string): string {
      const parts = uuid.split('-');
      const lastPart = parts[parts.length - 1];
      // On garde uniquement les chiffres
      const digitsOnly = lastPart.replace(/\D/g, '');
      return digitsOnly.slice(-6);
    },
    cleanAndTruncateHtmlText(html: string): string {
      // Supprimer les balises HTML
      const textOnly = html.replace(/<[^>]*>/g, '').trim();
      // Tronquer et ajouter "..." si nécessaire
      if (textOnly.length <= 100) {
        return textOnly;
      }
      return textOnly.substring(0, 100).trim() + '...';
    },
    previewPDF() {
      const element = document.getElementById('recu-pdf');

      if (this.paiementResponse && element) {
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
  width: 110%;
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
            filename: `Facture_${this.getShortUuid(this.paiementResponse!.orderSelf!.id)}.pdf`,
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
                window.open(url, '_blank');
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

    displayInvoire(){
      if(this.paiementResponse){
        this.qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${this.paiementResponse.orderSelf.id}}`
      }
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    async fetchPaiement(paymentID) {
      this.isLoading = true;
      try {
        const response = await detailPaiement(paymentID) as ApiResponse<PaymentModel>;
        console.log(response)
        if (response.code === 200) {
          if (response.data) {
            this.paiementResponse = response.data;
            console.log('response data: ', this.paiementResponse);
            await this.fetchListeMethodePaiement()
            await this.fetchOrderType()
            this.displayInvoire()
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des commandes");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchListeMethodePaiement(page = 1) {
      // this.isLoading = true;
      try {
        const response = await listeMethodePaiement(page) as ApiResponse<PaginatedMethodePaiement>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items && this.paiementResponse) {
            this.listeMethode = response.data.items;
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
          if (response.data?.items && this.paiementResponse) {
            this.listeOrderType = response.data.items;

            this.orderTypeSelected = this.getOrderTypeParType(response.data.items, this.paiementResponse.orderSelf.order_type)
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

    async fetchAllStatusOrder() {

      try {
        const response = await allStatusOrder() as ApiResponse<string[]>;
        console.log(response)
        if (response.code === 200) {
          if (response.data) {

            this.allOrderStatus = response.data
            console.log('all orders status: ', this.allOrderStatus);
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async fetchAllPaiementStatusOrder() {

      try {
        const response = await allStatusPaiementOrder() as ApiResponse<string[]>;
        console.log(response)
        if (response.code === 200) {
          if (response.data) {
            this.allPaiementOrderStatus = response.data
            console.log('all orders Paiement status: ', this.allPaiementOrderStatus);
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    },


    getMethodePaiementParType(
        liste: MethodePaiementModel[],
        type: string
    ): MethodePaiementModel | undefined {
      console.log(liste)
      console.log(type)
      return liste.find(methode => methode.type === type);
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
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchPaiement((this as any).$route.params.transactionID)
    this.fetchAllStatusOrder()
    this.fetchAllPaiementStatusOrder()
  },

})
</script>
<style scoped>

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
  width: 110%;
  background-color: #fff;
  border-radius: 10px 10px 20px 20px;
  box-shadow: 1px 3px 8px 3px rgba(0, 0, 0, 0.2);
  margin-top: 20%;
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