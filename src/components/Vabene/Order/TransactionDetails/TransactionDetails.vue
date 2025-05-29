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
      <div class="d-lg-flex justify-content-between">
        <div class="text-start">
          <img
            src="@/assets/images/LOGO_VABENE.png"
            class="black-logo"
            alt="logo"
            style="width: 140px; height: auto;"
          />
          <img
            src="@/assets/images/LOGO_VABENE.png"
            class="white-logo"
            alt="logo"
            style="width: 140px; height: auto;"
          />
          <span
            class="d-block mt-12 mt-md-15 mt-lg-30 fs-md-15 fs-lg-16 fw-medium text-paragraph mb-5 mb-md-8"
          >
            Restaurant
          </span>
          <p v-if="paiementResponse" class="mb-5 text-muted fs-md-15 fs-md-16 lh-base">
            {{paiementResponse.orderSelf.restaurantID.name}} <br /> {{paiementResponse.orderSelf.restaurantID.numeroRue}}{{paiementResponse.orderSelf.restaurantID.address}}
          </p>
          <span v-if="paiementResponse" class="d-block text-muted fs-md-15 fs-md-16">
            Tel :  {{paiementResponse.orderSelf.restaurantID.phoneNumber}}
          </span>
        </div>
        <div class="text-lg-center mt-15 mt-md-20 mt-lg-0">
          <h2
            class="text-black fw-black mb-5 mb-sm-10 mb-lg-20 fs-18 fs-md-20 fs-lg-30"
          >
            Reference
          </h2>
          <span v-if="paiementResponse" class="d-block fs-md-15 fs-md-16 text-muted">
            <span class="me-md-5 d-block d-md-inline-block">
              ref.commande :
              <span class="text-paragraph">#{{getShortUuid(paiementResponse.orderSelf.id)}}</span>
            </span>
            <span class="ms-md-5 d-block d-md-inline-block">
              Date :
              <span class="text-paragraph">{{convertDateCreate(paiementResponse.created_at)}}</span>
            </span>
          </span>
        </div>
        <div v-if="qrcode" class="text-lg-end mt-15 mt-md-20 mt-lg-0">
          <img :src="qrcode" alt="qr-code" />
        </div>
      </div>
      <div class="invoice-info d-lg-flex justify-content-between">
        <div class="d-flex">
          <div>
            <span class="d-block text-black fs-md-15 fw-bold mb-12">
             Operation effectuée par:
            </span>
            <span v-if="paiementResponse"
              class="d-block fs-md-15 fs-lg-16 fw-medium text-paragraph mb-8"
            >
              {{paiementResponse.userID.last_name}} {{paiementResponse.userID.first_name}}
            </span>
            <p v-if="paiementResponse" class="mb-5 text-muted fs-md-15 fs-md-16 lh-base">
              Tel :  {{paiementResponse.orderSelf.guest_phone_number ?? paiementResponse.userID.phone_number}}
            </p>

          </div>
          <div class="ms-10 ms-sm-50 ms-md-100">
            <span class="d-block text-black fs-md-15 fw-bold mb-12">
              Paiement:
            </span>
            <span v-if="paiementResponse"
              class="d-block fs-md-15 fs-lg-16 fw-medium text-paragraph mb-8"
            >
              {{getMethodePaiementParType(listeMethode,  paiementResponse.paymentMethod)?.libelle ?? '-' }}
            </span>


          </div>
        </div>
        <div class="buttons-list mt-15 mt-md-20 mt-lg-0">
          <button
            class="default-btn position-relative transition border-0 fw-medium text-white pt-12 pb-12 ps-25 pe-25 pt-md-11 pb-md-11 ps-md-30 pe-md-30 rounded-1 fs-md-15 fs-lg-16 d-inline-block me-10"
            type="button" data-bs-toggle="modal" data-bs-target="#contentModalScrollable_facture"
          >
            Imprimer <i class="flaticon-printer position-relative ms-5 fs-12"></i>
          </button>
        </div>
      </div>
      <span class="d-block text-black fs-md-15 fw-bold mb-15 mb-md-20 mb-lg-25">
        Recapitulatif de commande
      </span>
      <div class="table-responsive">
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
          <tbody>
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
                  {{orderItem.productID.description}}
                </spand>
              </td>
              <td class="shadow-none lh-1 fw-medium text-paragraph"> {{orderItem.quantity}}</td>
              <td class="shadow-none lh-1 fw-medium text-paragraph"> {{orderItem.unit_price}} CHF</td>
              <td class="shadow-none lh-1 fw-medium text-paragraph pe-0">
                {{orderItem.total_price}} CHF
              </td>
            </tr>

          </tbody>
        </table>
      </div>
      <ul class="order-summary-list ps-0 mb-0 list-unstyled">
        <li v-if="paiementResponse" class="d-flex align-items-center justify-content-between">
          <span class="d-block text-paragraph fw-medium"> Total commandé </span>
          <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
            {{paiementResponse.orderSelf.total_price}} CHF
          </span>
        </li>
        <li class="d-flex align-items-center justify-content-between">
          <span class="d-block text-paragraph fw-medium">
            Frais de livraison
          </span>
          <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
            + 0 CHF
          </span>
        </li>
        <li class="d-flex align-items-center justify-content-between">
          <span class="d-block text-paragraph fw-medium"> Remise </span>
          <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
            - 0 CHF
          </span>
        </li>
        <li class="d-flex align-items-center justify-content-between">
          <span class="d-block text-paragraph fw-medium"> Tax </span>
          <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
            + 0 CHF
          </span>
        </li>
        <li v-if="paiementResponse" class="d-flex align-items-center justify-content-between">
          <span class="d-block text-paragraph fw-medium"> Total a payer </span>
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
          <div class="modal-header">
            <h1 class="modal-title fs-5">Facture de la commande #{{getShortUuid(paiementResponse.orderSelf.id)}}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body flex-row align-items-center justify-content-center" >
            <div class="flex-column items-center justify-content-center">
              <main class="ticket-system" >
                <div class="receipts-wrapper" >
                  <div class="receipts"  id="recu-pdf">
                    <div class="receipt">
                      <img src="@/assets/images/LOGO_VABENE.png" class="airliner-logo"/>
                      <div class="route">
                        <h2>Ref</h2>
                        <h2>#{{getShortUuid(paiementResponse.orderSelf.id)}}</h2>
                      </div>
                      <div class="details">
                        <div class="item">
                          <span>Nom complet</span>
                          <h3>{{paiementResponse.orderSelf.guest_first_name}}</h3>
                          <h3>{{paiementResponse.orderSelf.guest_last_name}}</h3>
                        </div>
                        <div class="item">
                          <span>Coût total </span>
                          <h3>{{paiementResponse.orderSelf.total_price}} CHF</h3>
                        </div>
                        <div class="item">
                          <span>Fait le</span>
                          <h3>{{convertDateCreate(paiementResponse.orderSelf.created_at)}}</h3>
                        </div>

                        <div class="item">
                          <span>Adresse</span>
                          <h3>{{paiementResponse.orderSelf.address}}</h3>
                        </div>
                        <div class="item">
                          <span>Rue & batiment</span>
                          <h3>{{paiementResponse.orderSelf.rue}}</h3>
                          <h3>{{paiementResponse.orderSelf.batiment}}</h3>

                        </div>
                      </div>
                    </div>
                    <div class="receipt qr-code" v-if="qrcode">
                      <img
                          :src="qrcode" alt="qrcode"
                      />
                      <div class="description">
                        <h2>A livré</h2>
                        <p>à {{paiementResponse.orderSelf.rue}} - {{paiementResponse.orderSelf.batiment}}</p>
                      </div>
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

export default defineComponent({
  name: "TransactionDetails",
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
        max-width: 385px;
        padding: 25px 30px;
        margin: auto;
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
        max-width: 110px;
      }

      #recu-pdf .route {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 30px 0;
      }

      #recu-pdf .plane-icon {
        width: 30px;
        height: 30px;
        transform: rotate(90deg);
      }

      #recu-pdf .route h2 {
        font-weight: 300;
        font-size: 22px;
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
body {
  @import url('https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700');
  font-family: 'Ubuntu', sans-serif;
  background-color: #3a8d35;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #1c1c1c;
  display: flex;
  justify-content: center;
}


.ticket-system {
  max-width: 385px;
  .top {
    display: flex;
    align-items: center;
    flex-direction: column;
    .title {
      font-weight: normal;
      font-size: 1.6em;
      text-align: left;
      margin-left: 20px;
      margin-bottom: 50px;
      color: #fff;
    }
    .printer {
      width: 90%;
      height: 20px;
      border: 5px solid #fff;
      border-radius: 10px;
      box-shadow: 1px 3px 3px 0px rgba(0, 0, 0, 0.2);
    }
  }

  .receipts-wrapper {
    overflow: hidden;
    margin-top: -10px;
    padding-bottom: 10px;
  }

  .receipts {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    transform: translateY(-510px);

    animation-duration: 2.5s;
    animation-delay: 500ms;
    animation-name: print;
    animation-fill-mode: forwards;


    .receipt {
      padding: 25px 30px;
      text-align: left;
      min-height: 200px;
      width: 88%;
      background-color: #fff;
      border-radius: 10px 10px 20px 20px;
      box-shadow: 1px 3px 8px 3px rgba(0, 0, 0, 0.2);

      .airliner-logo {
        max-width: 110px;
      }

      .route {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 30px 0;

        .plane-icon {
          width: 30px;
          height: 30px;
          transform: rotate(90deg);
        }
        h2 {
          font-weight: 300;

          font-size: 22px;
          margin: 0;
        }
      }

      .details {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .item {
          display: flex;
          flex-direction: column;
          min-width: 70px;

          span {
            font-size: .8em;
            color: rgba(28, 28, 28, .7);
            font-weight: 500;
          }
          h3 {
            font-size: 18px !important;
            margin-top: 0px;
            margin-bottom: 0px;
          }
        }
      }

      &.qr-code {
        height: 110px;
        min-height: unset;
        position: relative;
        border-radius: 20px 20px 10px 10px;
        display: flex;
        align-items: center;

        &::before {
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

        .qr {
          width: 70px;
          height: 70px;
        }

        .description {
          margin-left: 20px;

          h2 {
            margin: 0 0 5px 0;
            font-weight: 500;
          }
          p {
            margin: 0;
            font-weight: 400;
          }
        }
      }
    }
  }
}

@keyframes print {
  0% {
    transform: translateY(-510px)
  }
  35% {
    transform: translateY(-395px);
  }
  70% {
    transform: translateY(-140px);
  }
  100% {
    transform: translateY(0);
  }
}

.modal-dialog-scrollable .modal-body {
  overflow-y: auto;
  display: flex;
}
</style>