<template>
  <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
      style="z-index: 9999;"
  >
    <LoaderComponent />
  </div>

  <div class="row" v-else>
    <div class="col-lg-12 col-xl-12 col-xxl-4">
      <div
        class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div v-if="orderResponse" class="card-head bg-white d-flex align-items-center">
          <i class="flaticon-sterile-box text-primary"></i>
          <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">
           Detail de la commande (ID #{{ getShortUuid(orderResponse.id) }})
          </h5>
        </div>
        <div v-if="orderResponse" class="card-body">
          <ul class="list ps-0 mb-0 list-unstyled">
            <li class="d-flex align-items-center justify-content-between">
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-calendar"></i>
                Créer le:
              </div>
              <span class="d-block text-paragraph fs-md-15 fs-lg-16">
                {{ convertDateCreate(orderResponse.created_at) }}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between" >
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-atm"></i>
                Methode de paiement:
              </div>
              <span
                  v-if="methodePaiementSelected.length > 0"
                class="d-flex align-items-center text-paragraph fs-md-15 fs-lg-16"
              >
                <img
                  :src="methodePaiementSelected[0].icone"
                  :alt="methodePaiementSelected[0].libelle"
                  class="me-8 "
                  style="width: 25px; height: 25px;"
                />
                {{methodePaiementSelected[0].libelle}}

              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between"   v-if="orderTypeSelected.length > 0">
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-express-delivery"></i>
                Type de commande:
              </div>
              <span class="d-block text-paragraph fs-md-15 fs-lg-16">
                  {{orderTypeSelected[0].libelle}}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="orderResponse" class="col-lg-6 col-xl-12 col-xxl-4">
      <div
        class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div class="card-head bg-white d-flex align-items-center">
          <i class="flaticon-user-3 text-success"></i>
          <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">
            Information du Client
          </h5>
        </div>
        <div class="card-body">
          <ul class="list ps-0 mb-0 list-unstyled">
            <li class="d-flex align-items-center justify-content-between">
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-user-1"></i>
                Nom & Prenom:
              </div>
              <span class="d-block text-paragraph fs-md-15 fs-lg-16">
                {{orderResponse.guest_first_name}} {{orderResponse.guest_last_name}}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-envelope"></i>
                Email:
              </div>
              <span class="d-block text-paragraph fs-md-15 fs-lg-16">
                {{orderResponse.guest_email}}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-phone-call"></i>
                Numéro de téléphone
              </div>
              <span class="d-block text-paragraph fs-md-15 fs-lg-16">
                 {{orderResponse.guest_phone_number || '-'}}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="orderResponse" class="col-lg-6 col-xl-12 col-xxl-4">
      <div
        class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div class="card-head bg-white d-flex align-items-center">
          <i class="flaticon-document text-info"></i>
          <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">Facture & Parrainage</h5>
        </div>
        <div class="card-body">
          <ul class="list ps-0 mb-0 list-unstyled">
            <li class="d-flex align-items-center justify-content-between">
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-copy"></i>
                Facture:
              </div>
              <span @click="displayInvoire" class="d-block text-primary fs-md-15 fs-lg-16 cursor-pointer" data-bs-toggle="modal" data-bs-target="#contentModalScrollable_facture">
                #VAB-{{getShortUuid(orderResponse.id)}}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-express-delivery"></i>
                Adresse:
              </div>
              <span class="d-block text-primary fs-md-15 fs-lg-16">
              {{orderResponse.address}}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-shield"></i>
                Recompense Points:
              </div>
              <span class="d-block text-paragraph fs-md-15 fs-lg-16">0</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="orderResponse" class="col-lg-8">
      <div
        class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div class="card-head bg-white d-flex align-items-center">
          <i class="flaticon-sterile-box text-primary"></i>
          <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">
            Liste des produits (ID #{{getShortUuid(orderResponse.id)}})
          </h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table text-nowrap align-middle mb-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 ps-0"
                  >
                    Nom du produit
                  </th>
                  <th
                    scope="col"
                    class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13"
                  >
                    Quantite
                  </th>
                  <th
                    scope="col"
                    class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13"
                  >
                    Prix du produit
                  </th>
                  <th
                    scope="col"
                    class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pe-0"
                  >
                    total

                  </th>
                  <th
                      scope="col"
                      class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pe-0"
                  >

                  </th>

                  <th
                      scope="col"
                      class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pe-0"
                  >
                    Ingredients
                  </th>
                </tr>
              </thead>
              <tbody>
              <tr v-if="isLoading">
                <td colspan="8" class="text-center py-4">
                  <LoaderComponent/>
                </td>
              </tr>
                <tr
                    v-else-if="!isLoading && orderResponse.orderItems.length > 0"
                    v-for="orderItems in orderResponse.orderItems" :key="orderItems.id"
                >
                  <th
                      v-if="orderItems.productID"
                    class="shadow-none fw-medium text-black product-title ps-0"
                  >
                    <router-link
                      to="/product-details"
                      class="d-flex align-items-center text-decoration-none text-black fs-md-15 fs-lg-16"
                    >
                      <img
                        :src="orderItems.productID.image_urls[0]"
                        class="me-15"
                        width="44"
                        alt="product"
                      />
                      {{orderItems.productID.name}}
                    </router-link>
                  </th>
                  <td class="shadow-none lh-1 fw-medium text-paragraph">
                    {{orderItems.quantity}}
                  </td>
                  <td class="shadow-none lh-1 fw-medium text-paragraph">{{orderItems.unit_price}} CHF</td>

                  <td class="shadow-none lh-1 fw-medium text-paragraph pe-0">
                    {{orderItems.total_price}} CHF
                  </td>

                  <td class="shadow-none lh-1 fw-medium text-paragraph pe-0">

                  </td>

                  <td class="shadow-none lh-1 fw-medium text-paragraph">
                    <button  @click="selectedOrderItem(orderItems)" class="text-primary fw-medium text-decoration-underline btn btn-link" type="button" data-bs-toggle="modal" data-bs-target="#contentModalScrollable_ingredient" v-if="orderItems.ingredients.length > 0"
                    >({{ orderItems.ingredients.length }}) Ingredients</button>
                    <span v-else class="text-primary fw-medium text-decoration-underline"
                    >Aucun Ingredient</span>
                  </td>

                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
          class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div
            class="card-head bg-white d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0 fw-bold text-black">Note de la commande</h5>
          <span class="d-block fs-md-15 fs-lg-16 text-muted"
          >Commande ID-
            <span class="text-primary fw-medium text-decoration-underline"
            >#{{getShortUuid(orderResponse.id)}}</span
            ></span
          >
        </div>
        <div class="card-body">
          <ul class="order-summary-list ps-0 mb-0 list-unstyled">

            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Delai de livraison estimé
              </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium" v-if="orderResponse.estimated_delivery_time">
                {{orderResponse.estimated_delivery_time}} minutes
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between" v-if="orderResponse.intructionOrder">
              <span class="d-block text-paragraph fw-medium">
                Demande de couverts
              </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium" v-if="orderResponse.intructionOrder">
                {{orderResponse.intructionOrder.demandeCouverts == true ? 'Oui' : 'Non'}}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between" v-if="orderResponse.intructionOrder.quantityCouverts">
              <span class="d-block text-paragraph fw-medium"> Quantité de couverts </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                {{orderResponse.intructionOrder.quantityCouverts || '-'}}
              </span>
            </li>

            <li class="d-flex align-items-center justify-content-between" v-if="orderResponse.intructionOrder.quantityCouverts">
              <span class="d-block text-paragraph fw-medium"> Doit-on trancher </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                {{orderResponse.intructionOrder.isTrancher == true ? 'Oui' : 'Non'}}
              </span>
            </li>

            <li class="d-flex align-items-center justify-content-between" v-if="orderResponse.intructionOrder.cuisson">
              <span class="d-block text-paragraph fw-medium"> Type de cuisson </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                {{orderResponse.intructionOrder.cuisson|| '-'}}
              </span>
            </li>

          </ul>
        </div>
      </div>

    </div>
    <div class="col-lg-4">
      <div v-if="orderResponse"
        class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div class="card-head bg-white d-flex align-items-center">
          <i class="flaticon-document text-info"></i>
          <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">Recapitulatif de la commande</h5>
        </div>
        <div class="card-body">
          <ul class="order-summary-list ps-0 mb-0 list-unstyled">
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-muted text-uppercase fw-medium fs-13">
                DESCRIPTION
              </span>
              <span class="d-block text-muted text-uppercase fw-medium fs-13">
                PRIX
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Grand Total
              </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                {{orderResponse.total_price}} CHF
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Frais de livraison
              </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
               N/A
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Remise </span>
              <span v-if="orderResponse.coupon" class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                  {{ orderResponse.coupon }}
              </span>
              <span v-else class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                   N/A
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Taxe </span>
              <span v-if="orderResponse.taxe" class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                  {{ orderResponse.taxe }}
              </span>
              <span v-else class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                   N/A
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Montant Total </span>
              <span class="d-block text-primary fs-md-15 fs-lg-16 fw-bold">
                {{orderResponse.total_price}} CHF
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-lg-6 col-xxxl-3">
      <div v-if="orderResponse"
        class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div class="card-head bg-white">
          <h5 class="mb-0 fw-bold text-black">Adresse de paiement</h5>
        </div>
        <div class="card-body">
          <ul class="payment-address-list ps-0 mb-0 list-unstyled">
            <li class="text-paragraph fs-md-15 fs-lg-16 position-relative">
              <span class="fw-semibold text-black">Addresse:</span>
              {{orderResponse.rue}} - {{orderResponse.batiment}}
            </li>
            <li class="text-paragraph fs-md-15 fs-lg-16 position-relative">
              <span class="fw-semibold text-black">Tel:</span>
              {{orderResponse.guest_phone_number || 'Indisponible'}}
            </li>
            <li class="text-paragraph fs-md-15 fs-lg-16 position-relative">
              <span class="fw-semibold text-black">Email:</span>
              {{orderResponse.guest_email}}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="orderResponse" class="col-lg-6 col-xxxl-3">
      <div
        class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div class="card-head bg-white">
          <h5 class="mb-0 fw-bold text-black">Adresse de livraison</h5>
        </div>
        <div class="card-body">
          <ul class="payment-address-list ps-0 mb-0 list-unstyled">
            <li class="text-paragraph fs-md-15 fs-lg-16 position-relative">
              <span class="fw-semibold text-black">Addresse:</span>
              {{orderResponse.rue}} - {{orderResponse.batiment}}
            </li>
            <li class="text-paragraph fs-md-15 fs-lg-16 position-relative">
              <span class="fw-semibold text-black">Tel:</span>
              {{orderResponse.guest_phone_number || 'Indisponible'}}
            </li>
            <li class="text-paragraph fs-md-15 fs-lg-16 position-relative">
              <span class="fw-semibold text-black">Email:</span>
              {{orderResponse.guest_email}}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="orderResponse" class="col-lg-12 col-xxxl-6">
      <div
        class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div
          class="card-head bg-white d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0 fw-bold text-black">Status de la commande</h5>

          <div class="dropdown" v-if="allOrderStatus.length > 0">
            <button v-if="orderResponse.status === 'pending'" class="btn btn-danger btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ fetchStatusOrderFr(orderResponse.status) }}
            </button>
            <button v-if="orderResponse.status === 'processing'" class="btn btn-warning btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ fetchStatusOrderFr(orderResponse.status) }}
            </button>
            <button v-if="orderResponse.status === 'paid'" class="btn btn-success btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ fetchStatusOrderFr(orderResponse.status) }}
            </button>
            <button v-if="orderResponse.status === 'refunded'" class="btn btn-close btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ fetchStatusOrderFr(orderResponse.status) }}
            </button>
            <button v-if="orderResponse.status === 'ready_for_delivery'" class="btn btn-info btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ fetchStatusOrderFr(orderResponse.status) }}
            </button>
            <button v-if="orderResponse.status === 'out_for_delivery'" class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ fetchStatusOrderFr(orderResponse.status) }}
            </button>
            <button v-if="orderResponse.status === 'delivered'" class="btn btn-success btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ fetchStatusOrderFr(orderResponse.status) }}
            </button>
            <button v-if="orderResponse.status === 'cancelled'" class="btn btn-danger btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ fetchStatusOrderFr(orderResponse.status) }}
            </button>

            <ul class="dropdown-menu">
              <li v-for="status in allOrderStatus" :key="status">
                <a @click="updateStatusOrder(status)" class="dropdown-item" href="#">{{ fetchStatusOrderFr(status)  }}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-body">
          <ul class="order-summary-list ps-0 mb-0 list-unstyled">

            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Status de paiement
              </span>

                 <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                   <span v-if="orderResponse.payment_status === 'pending'" class="badge text-outline-danger">  {{fetchStatusOrderPaiementFr(orderResponse.paymentID.status)}}</span>
              <span v-if="orderResponse.payment_status === 'paid'" class="badge text-outline-primary">  {{fetchStatusOrderPaiementFr(orderResponse.paymentID.status)}}</span>
              <span v-if="orderResponse.payment_status === 'refunded'" class="badge text-outline-muted">  {{fetchStatusOrderPaiementFr(orderResponse.paymentID.status)}}</span>
              <span v-if="orderResponse.payment_status === 'cancelled'" class="badge text-outline-warning">  {{fetchStatusOrderPaiementFr(orderResponse.paymentID.status)}}</span>


              </span>
            </li>


          </ul>
        </div>
      </div>
    </div>




    <!-- Modal -->
    <div class="modal fade" id="contentModalScrollable_ingredient" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content flex-column justify-content-center ">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Liste des ingredients</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body flex-row align-items-center justify-content-center">
            <div class="table-responsive">
              <table class="table text-nowrap align-middle mb-0">
                <thead class="bg-success text-white">
                <tr>
                  <th
                      scope="col"
                      class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0 ps-0"
                  >
                    NOM DE L'INGREDIENT
                  </th>
                  <th
                      scope="col"
                      class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
                  >
                    TYPE
                  </th>
                  <th
                      scope="col"
                      class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
                  >
                   QUANTITE
                  </th>
                  <th
                      scope="col"
                      class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
                  >
                    PRIX
                  </th>

                </tr>
                </thead>
                <tbody v-if="orderItemSelected && orderItemSelected.ingredients.length > 0">
                <tr
                    v-for="ingredient in orderItemSelected.ingredients" :key="ingredient.name"
                >
                  <th class="shadow-none lh-1 fw-bold ps-0">
                    <router-link
                        to="/product-details"
                        class="text-decoration-none text-black-emphasis"
                    >
                      {{ingredient.name}}
                    </router-link>
                  </th>
                  <td  class="shadow-none lh-1 fw-medium">
                    <span v-if="ingredient.isDefault" class="badge text-outline-primary">Gratuit</span>
                    <span v-else class="badge text-outline-danger">Payant</span>
                  </td>
                  <td class="shadow-none lh-1 fw-medium text-black-emphasis">
                    <div class="d-flex align-items-center">
                       {{ingredient.quantite}}
                    </div>
                  </td>
                  <td class="shadow-none lh-1 fw-medium text-body-tertiary">
                    {{ingredient.extra_cost_price}} CHF
                  </td>

                </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
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
                      <img src="@/assets/images/LOGO_VABENE.png" class="airliner-logo"/>
                        <div class="route">
                          <h2>Ref</h2>
                          <h2>#{{getShortUuid(orderResponse.id)}}</h2>
                        </div>
                        <div class="details">
                          <div class="item">
                            <span>Nom complet</span>
                            <h3>{{orderResponse.guest_first_name}}</h3>
                            <h3>{{orderResponse.guest_last_name}}</h3>
                          </div>
                          <div class="item">
                            <span>Coût total </span>
                            <h3>{{orderResponse.total_price}} CHF</h3>
                          </div>
                          <div class="item">
                            <span>Fait le</span>
                            <h3>{{convertDateCreate(orderResponse.created_at)}}</h3>
                          </div>
                          <div class="item">
                            <span>Cuisson</span>
                            <h3>{{orderResponse.intructionOrder.cuisson}}</h3>
                          </div>
                          <div class="item">
                            <span>Adresse</span>
                            <h3>{{orderResponse.address}}</h3>
                          </div>
                          <div class="item">
                            <span>Rue & batiment</span>
                            <h3>{{orderResponse.rue}}</h3>
                            <h3>{{orderResponse.batiment}}</h3>

                          </div>
                        </div>
                      </div>
                      <div class="receipt qr-code" v-if="qrcode">
                        <img
                            :src="qrcode" alt="qrcode"
                        />
                        <div class="description">
                          <h2>A livré</h2>
                          <p>à {{orderResponse.rue}} - {{orderResponse.batiment}}</p>
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
import {defineComponent, PropType} from "vue";
import {detailOrder, listeMethodePaiement, updateOrder, listeOrderType, allStatusOrder, allStatusPaiementOrder} from "@/service/api";
import {ApiResponse, PaginatedMethodePaiement, PaginatedOrder, PaginatedOrderType} from "@/models/Apiresponse";
import {UserGeneralKey} from "@/models/user.generalkey";
import {useToast} from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import {OrderModel} from "@/models/order.model";
import {MethodePaiementModel} from "@/models/methodePaiement.model";
import {OrderTypeModel} from "@/models/orderType.model";
import {OrderItemModel} from "@/models/orderItem.model";
import html2pdf from 'html2pdf.js'
import {OrderStatus} from "@/enums/orderStatut.enum";
import {PaymentStatus} from "@/enums/orderPaiementMethode.enum";


export default defineComponent({
  name: "VaBeneOrderDetails",
  props: {
    commandeID: {
      type: String as PropType<string>,
      required: true
    },
  },
  // eslint-disable-next-line no-undef
  components: {LoaderComponent},
  data(){
    return{
      orderResponse: null as OrderModel | null,
      isLoading: false,
      listeMethode: [] as MethodePaiementModel[],
      listeOrderType: [] as OrderTypeModel[],
      methodePaiementSelected: [] as MethodePaiementModel[],
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
    selectedOrderItem(orderItem: OrderItemModel) {
      this.orderItemSelected = orderItem;

    },
    displayInvoire(){
      if(this.orderResponse){
        this.qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${this.orderResponse.id}}`
      }
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    async fetchOrder(orderID) {
      this.isLoading = true;
      try {
        const response = await detailOrder(orderID) as ApiResponse<OrderModel>;
        console.log(response)
        if (response.code === 200) {
          if (response.data) {
            this.orderResponse = response.data;
            console.log('response data: ', this.orderResponse);
            await this.fetchListeMethodePaiement()
            await this.fetchOrderType()

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
    async updateStatusOrder(status) {
    const payload = {
      "statusOrder": status
    }
      try {
        const response = await updateOrder(this.orderResponse?.id, payload) as ApiResponse<OrderModel>;
        console.log(response)
        if (response.code === 200) {
          if (response.data) {
            this.toast.success(response.message);
            this.orderResponse = response.data
            console.log('commande mise a jour: ',  this.orderResponse);
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
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchOrder((this as any).$route.params.commandeID)
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