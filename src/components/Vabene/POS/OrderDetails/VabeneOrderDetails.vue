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
        <div v-if="orderResponse" class="card-head bg-white d-flex align-items-center justify-content-between">
          <div class="d-block">
            <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">
              #{{ orderResponse.nif }}
            </h5>
          </div>
          <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">
            <span v-if="orderResponse.DeliveryPreference === 'immediat'" class="badge text-bg-success fs-13 ms-10" style="margin-left: 70px;" >
            TOUT DE SUITE
           </span>
            <span v-if="orderResponse.DeliveryPreference === 'ulterieur'" class="badge text-bg-warning fs-13" style="margin-left: 70px;">
            Précommande
          </span>
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
                {{ formatInTimeZone(orderResponse.created_at, 'UTC', 'dd/MM/yyyy - HH:mm') }}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between" v-if="orderResponse.DeliveryPreference !== 'immediat'">
              <div
                  class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-time"></i>
                Date de recuperation:
              </div>
              <span class="d-block text-paragraph fs-md-15 fs-lg-16">
                  {{formatInTimeZone(orderResponse.timeOrder, 'UTC', 'dd/MM/yyyy - HH:mm')}}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between" >
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-atm"></i>
                Méthode de paiement:
              </div>
              <span
                  v-if="methodePaiementSelected.length > 0"
                class="d-flex align-items-center text-paragraph fs-md-15 fs-lg-16"
              >
<!--                <img-->
<!--                  :src="methodePaiementSelected[0].icone"-->
<!--                  :alt="methodePaiementSelected[0].libelle"-->
<!--                  class="me-8 "-->
<!--                  style="width: 25px; height: 25px;"-->
<!--                />-->

                {{methodePaiementSelected[0]?.libelle ?? ''}}

              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between"   v-if="orderTypeSelected.length > 0">
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-express-delivery"></i>
                Type de commande:
              </div>
<!--              <span class="d-block text-paragraph fs-md-15 fs-lg-16">-->
<!--                  {{orderTypeSelected[0].libelle}}-->
<!--              </span>-->
              <span  class="d-block badge text-bg-info fs-13">{{orderTypeSelected[0]?.libelle ?? ''}}</span>

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
                Civilité:
              </div>
              <span class="d-block text-paragraph fs-md-15 fs-lg-16">
               {{orderResponse.civilite}}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <div
                  class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-user-1"></i>
                Type de client:
              </div>
              <span class="d-block text-white badge text-bg-danger fs-md-15 fs-lg-16">
               {{orderResponse.typeCustomer === 'customer' ? 'Classique' : 'Entreprise'}}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <div
                  class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-user-1"></i>
                Nom & Prénom:
              </div>
              <span class="d-block text-paragraph fs-md-15 fs-lg-16">
               {{orderResponse.civilite}} {{orderResponse.guest_first_name}} {{orderResponse.guest_last_name}}
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
                 {{orderResponse.guest_phone_number !== null ? '+41' + orderResponse.guest_phone_number : '-'}}
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
              <span @click="displayInvoire" class="d-block text-primary fs-md-15 fs-lg-16 cursor-pointer text-decoration-underline" data-bs-toggle="modal" data-bs-target="#contentModalScrollable_facture">
                {{orderResponse.restaurantID.id === RestaurantEnum.RESTO_PENTHAZ ? 'VBP'+ orderResponse.nif : 'VBM'+ orderResponse.nif}}
              </span>
            </li>

<!--            <li class="d-flex align-items-center justify-content-between">-->
<!--              <div-->
<!--                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"-->
<!--              >-->
<!--                <i class="flaticon-shield"></i>-->
<!--                Recompense Points:-->
<!--              </div>-->
<!--              <span class="d-block text-paragraph fs-md-15 fs-lg-16">0</span>-->
<!--            </li>-->
            <li class="d-flex align-items-center justify-content-between">
              <div
                  class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-bookmark"></i>
                Coupon:
              </div>
              <span v-if="orderResponse.coupon" class="d-block text-paragraph fs-md-15 fs-lg-16">{{orderResponse.coupon}}</span>
              <span v-else class="d-block text-paragraph fs-md-15 fs-lg-16">-</span>

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
                    Quantité
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
                    Ingrédients
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
                    <span

                      class="d-flex align-items-center text-decoration-none text-black fs-md-15 fs-lg-16"
                    >
                      <img
                        :src="orderItems.productID.image_urls[0]"
                        class="me-15"
                        width="44"
                        alt="product"
                      />
                      {{orderItems.productID.name}} {{orderItems.size}}
                    </span>
                  </th>
                  <td class="shadow-none lh-1 fw-medium text-paragraph">
                    x{{orderItems.quantity}}
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
                    >Aucun Ingrédient</span>
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
                Délai de livraison estimé
              </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium" v-if="orderResponse">
                {{orderResponse.timeOrder ? convertDateCreate(orderResponse.timeOrder) : 'TOUT DE SUITE'}}
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

<!--            <li class="d-flex align-items-center justify-content-between" v-if="orderResponse.intructionOrder.cuisson">-->
<!--              <span class="d-block text-paragraph fw-medium"> Type de cuisson </span>-->
<!--              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">-->
<!--                {{orderResponse.intructionOrder.cuisson|| '-'}}-->
<!--              </span>-->
<!--            </li>-->

            <li class="d-flex align-items-center justify-content-between" v-if="orderResponse">
              <span class="d-block text-paragraph fw-medium"> Instruction du client </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                {{orderResponse.SpecialInstructions ?? orderResponse.feature[0]}}
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
          <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">Récapitulatif de la commande</h5>
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

            <!-- Liste des produits -->
            <li
                v-for="(item, index) in orderResponse.orderItems"
                :key="index"
                class="d-flex align-items-center justify-content-between pt-2"
            >

              <span> <img
                  :src="item.productID.image_urls[0]"
                  class="me-15"
                  width="44"
                  alt="product"
              />{{ item.quantity }}x {{ item.productID.name }}{{item.size}}</span>
              <span>{{ item.total_price }} CHF</span>
            </li>

            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-black fw-bolder fw-medium">
                SOUS-TOTAL
              </span>
              <span class="d-block text-black fw-bolder fw-medium">
                {{(orderResponse.total_price + getDiscountValue(orderResponse)) }} CHF
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between" v-if="orderResponse.discountValue != ''">
              <span class="d-block text-primary fw-bolder fw-medium">
                RABAIS
              </span>
              <span class="d-block text-primary fw-bolder fw-medium">
                -{{  getDiscountValue(orderResponse) }} CHF
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-black fw-bolder fw-medium">
               Y COMPRIS TVA (2.60%)
              </span>
              <span class="d-block text-black fw-bolder fw-medium">
               {{(orderResponse.total_price *  2.60/100).toFixed(2)}} CHF
              </span>
            </li>
           
            <li class="d-flex align-items-center justify-content-between" v-if="orderResponse.restMinimumOrder != '0'">
              <span class="d-block text-primary fw-bolder fw-medium">
                FRAIS SUPPLÉMENTAIRES
              </span>
              <span class="d-block text-primary fw-bolder fw-medium">
                {{orderResponse.restMinimumOrder ?? "0" }} CHF
              </span>
            </li>

            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-primary fw-bolder fw-medium">
                TOTAL
              </span>
              <span class="d-block text-primary fw-bolder fw-medium">
               {{orderResponse.total_price}} CHF
              </span>
            </li>



          </ul>
        </div>
      </div>
    </div>
    <div v-if="orderResponse" class="col-lg-4">
      <div
          class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div
            class="card-head bg-white d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0 fw-bold text-black">Adresse de paiement</h5>
        </div>
        <div class="card-body">
          <ul class="order-summary-list ps-0 mb-0 list-unstyled">
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                NPA:
              </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{orderResponse.npa ?? '-'}}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Localité:
              </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{orderResponse.localite ?? '-'}}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Téléphone:
              </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{orderResponse.guest_phone_number ?? '-'}}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Email:
              </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{orderResponse.guest_email ?? '-'}}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Rue:
              </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{orderResponse.rue ?? '-'}}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Nº:
              </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{orderResponse.numberRue ?? '-'}}</strong>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="orderResponse" class="col-lg-4">
      <div
          class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div
            class="card-head bg-white d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0 fw-bold text-black">Adresse de livraison</h5>
        </div>
        <div class="card-body">
          <ul class="order-summary-list ps-0 mb-0 list-unstyled">
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                NPA:
              </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{orderResponse.npa ?? '-'}}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Localité:
              </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{orderResponse.localite ?? '-'}}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Téléphone:
              </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{orderResponse.guest_phone_number ?? '-'}}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Email:
              </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{orderResponse.guest_email ?? '-'}}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Rue:
              </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{orderResponse.rue ?? '-'}}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Nº:
              </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{orderResponse.numberRue ?? '-'}}</strong>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="orderResponse" class="col-lg-4 flex-column">
      <div v-if="orderResponse" >
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
                  <a @click="updateStatusOrder(status, methodePaiementSelected[0]?.type ?? '')" class="dropdown-item" href="#">{{ fetchStatusOrderFr(status)  }}</a>
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

                <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium" v-if="orderResponse.paymentID">
                   <span v-if="orderResponse.paymentID.status === 'pending'" class="badge text-outline-danger">  {{fetchStatusOrderPaiementFr(orderResponse.paymentID.status)}}</span>
              <span v-if="orderResponse.paymentID.status === 'paid'" class="badge text-outline-primary">  {{fetchStatusOrderPaiementFr(orderResponse.paymentID.status)}}</span>
              <span v-if="orderResponse.paymentID.status === 'refunded'" class="badge text-outline-muted">  {{fetchStatusOrderPaiementFr(orderResponse.paymentID.status)}}</span>
              <span v-if="orderResponse.paymentID.status === 'cancelled'" class="badge text-outline-warning">  {{fetchStatusOrderPaiementFr(orderResponse.paymentID.status)}}</span>


              </span>
              </li>


            </ul>
          </div>
        </div>
      </div>
      <div v-if="orderResponse" >
        <div
            class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
        >
          <div
              class="card-head bg-white d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0 fw-bold text-black">Méthode de paiement</h5>

            <div class="dropdown" v-if="listeMethode.length > 0">
              <button v-if="orderResponse.paymentID.paymentMethod === 'pay_click_collect_cash'" class="btn btn-danger btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ fetchMethodePaiementOrderFr(orderResponse.paymentID.paymentMethod) }}
              </button>
              <button v-if="orderResponse.paymentID.paymentMethod === 'pay_click_collect_carte'" class="btn btn-warning btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ fetchMethodePaiementOrderFr(orderResponse.paymentID.paymentMethod) }}
              </button>
              <button v-if="orderResponse.paymentID.paymentMethod === 'pay_delivery_cash'" class="btn btn-success btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ fetchMethodePaiementOrderFr(orderResponse.paymentID.paymentMethod) }}
              </button>
              <button v-if="orderResponse.paymentID.paymentMethod === 'pay_delivery_carte'" class="btn btn-close btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ fetchMethodePaiementOrderFr(orderResponse.paymentID.paymentMethod) }}
              </button>
              <button v-if="orderResponse.paymentID.paymentMethod === 'on_line'" class="btn btn-info btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ fetchMethodePaiementOrderFr(orderResponse.paymentID.paymentMethod) }}
              </button>


              <ul class="dropdown-menu">
                <li v-for="methode in listeMethode" :key="methode.id">
                  <a @click="updateStatusOrder(orderResponse.status, methode.type)" class="dropdown-item" href="#">{{ methode.libelle }}</a>
                </li>
              </ul>
            </div>
          </div>

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
                   QUANTITÉ
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
                      {{ingredient.name}} - {{ingredient.size}}
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
                        <div class="logo-container">
                          <img src="@/assets/images/logo_black.png" class="airliner-logo"/>
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
                            <h2><strong>{{orderTypeSelected[0]?.libelle ?? ''}}</strong></h2>
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
                              <div style="display: flex; justify-content: space-between; font-size: 18px;">
                                <span style=" width: 100%; max-width: 230px;"><strong>{{ item.quantity }}x {{ item.productID.name }} {{item.size}} {{item.optionSpecific}}</strong></span>
                                <span><strong>{{ item.total_price }} CHF</strong></span>
                              </div>

                              <!-- 🧂 Ingrédients -->
                              <ul v-if="item.ingredients && item?.ingredients?.length > 0" style="margin: 2px 0 0 10px; font-size: 18px; color: #555;">
                                <li
                                    v-for="ingredient in item.ingredients"
                                    :key="ingredient.id"
                                    class="text-decoration-none list-unstyled"
                                >
                                  <!-- <strong>x{{ ingredient.quantite }} {{ ingredient.name }} {{extraireCmValeur(ingredient.size, item.productID.categorieID?.id)}}</strong> -->
                                  <strong>x{{ ingredient.quantite }} {{ ingredient.name }} ({{((ingredient.extra_cost_price * ingredient.quantite) + ' CHF')}})</strong>

                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>



                          <hr class="dashed-line" />
                          <div class="product-list">
                            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                              <span><strong>SOUS-TOTAL: </strong></span>
                              <span style="text-align: right;"><strong>{{orderResponse.total_price + getDiscountValue(orderResponse) }} CHF</strong></span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin: 5px 0;" v-if="orderResponse.discountValue != ''">
                              <span><strong>RABAIS: </strong></span>
                              <span style="text-align: right;" v-if="orderResponse.discountValue != ''"><strong>-{{  getDiscountValue(orderResponse) }} CHF</strong></span>
                              <span style="text-align: right;" v-else><strong>0 CHF</strong></span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                              <span><strong>Y COMPRIS TVA (2.60%) </strong></span>
                              <span style="text-align: right;"><strong>{{(orderResponse.total_price * 2.60/100).toFixed(2)}} CHF</strong></span>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; margin: 5px 0;" v-if="orderResponse.restMinimumOrder != '0'">
                              <span><strong>FRAIS SUPPLÉMENTAIRES: </strong></span>
                              <span style="text-align: right;" v-if="orderResponse.restMinimumOrder != '0'"><strong>{{  orderResponse.restMinimumOrder ?? "-" }} CHF</strong></span>
                              <span style="text-align: right;" v-else><strong>0 CHF</strong></span>

                            </div>
                            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                              <span><strong>TOTAL:  </strong></span>
                              <span style="text-align: right;"><strong>{{ orderResponse.total_price }} CHF</strong></span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin: 5px 0;"  v-if="methodePaiementSelected.length > 0">
                              <span>Méthode de paiements :  </span>
                              <span style="text-align: right;">{{ methodePaiementSelected[0]?.libelle ?? '' }}</span>
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
import {Modal} from "bootstrap";
import {RestaurantEnum} from "../../../../enums/restaurant.enum";
import { formatInTimeZone } from "date-fns-tz";
import { CategorieModel } from "@/models/categorie.model";


export default defineComponent({
  name: "VaBeneOrderDetails",
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
      methodePaiementSelected: [] as MethodePaiementModel[],
      listeOrderType: [] as OrderTypeModel[],
      orderTypeSelected: [] as OrderTypeModel[],
      orderItemSelected: null as OrderItemModel | null,
      qrcode: null as string | null,
      allOrderStatus: [] as string[],
      allPaiementOrderStatus: [] as string[]
    }
  },

  methods: {
    getDiscountValue(order: OrderModel): number {
      let discountValue = 0;
      if(order.discountValue !== '' && order.discountType == 'fixed'){
        discountValue = Number(order.discountValue);
      }
      else if(order.discountValue !== '' && order.discountType == 'percentage'){
        discountValue = Number(order.total_price) - (Number(order.total_price) * (Number(order.discountValue)/100));
      }
      
      return discountValue;
    },
        extraireParenthese(texte: string): string {
      // L'expression régulière cherche des parenthèses qui contiennent au moins un caractère
      // (un chiffre, un espace, une lettre, etc.).
      const regexAvecContenu = /\([^)]+\)/;
      
      const match = texte.match(regexAvecContenu);

      // Si une correspondance est trouvée, on retourne la chaîne entière (par exemple "(28 cm)").
      if (match) {
        return "("+match[0]+")";
      }
      
      // Si les parenthèses sont vides ou n'existent pas, on retourne une chaîne vide.
      return "";
    },
    extraireCmValeur(texte: string, categorie: CategorieModel): string | null {
      if(categorie.id === 'fd4a2c4e-49ef-48a5-9937-6f3a51122f9e'){
        return ""
      }
      else{
        const match = texte.match(/\b\d+cm\b/);
        return match ? this.extraireParenthese(match[0]) : null;
      }
     
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

        // Sauvegarder les styles originaux pour les restaurer plus tard (bonne pratique)
        const originalElementWidth = element.style.width;
        const originalElementMargin = element.style.margin;
        const originalElementTransform = element.style.transform; // Capture la transformation d'animation
        // Capturez aussi les styles spécifiques des enfants qui pourraient être animés/déplacés
        const receiptsElement = element.querySelector('.receipts') as HTMLElement;
        let originalReceiptsTransform = '';
        let originalReceiptsMarginTop = '';
        if (receiptsElement) {
          originalReceiptsTransform = receiptsElement.style.transform;
          originalReceiptsMarginTop = receiptsElement.style.marginTop;
        }


        // Appliquer les styles spécifiques pour la génération de PDF
        // IMPORTANT: Définir la largeur sur l'élément principal. Supprimer toute max-width ou largeur interne en conflit.
        element.style.width = '115mm'; // Largeur physique cible du ticket
        element.style.margin = '0'; // Pas de marge auto pour le PDF, il doit remplir la largeur de la page
        element.style.transform = 'none'; // Désactiver toute trxansformation de translation des animations
        if (receiptsElement) {
          receiptsElement.style.transform = 'none'; // Désactiver les animations sur .receipts
          receiptsElement.style.marginTop = '0'; // S'assurer qu'aucune marge supérieure ne pousse le contenu
        }


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
        padding: 25px 15px; /* Padding réduit pour un ajustement plus serré sur un ticket, ajuster au besoin */
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
        font-size: 18px; /* Assurer la cohérence */
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

        // Un petit délai pour s'assurer que les styles sont appliqués avant la capture
        setTimeout(() => {
          // Calculer la hauteur du contenu pour le format jsPDF si vous voulez une hauteur dynamique
          // Vous pourriez avoir besoin de rendre l'élément hors écran d'abord pour obtenir sa vraie hauteur.
          // Pour l'instant, utilisons une hauteur fixe suffisamment grande.
          // Une hauteur typique pour un A4 est de 297mm. Si votre ticket peut être très long,
          // une hauteur de 500mm ou plus pourrait être nécessaire, et jsPDF paginera si elle est dépassée.
          // Si vous voulez une SEULE et très longue page, définissez une très grande hauteur.
          const contentHeight = 280 + ((this.orderResponse?.orderItems.length ?? 1 )  * 50)
          const desiredHeight = Math.max(200, contentHeight + 20); // Minimum 200mm, ou hauteur du contenu + un peu de marge

          const opt = {
            margin: [5, 0, 5, 0], // Marges (Haut, Gauche, Bas, Droite) en mm (ex: 5mm de chaque côté)
            filename: `Facture_${this.getShortUuid(this.orderResponse!.id)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2, // Augmentez la résolution pour une meilleure qualité
              useCORS: true,
              // Définir explicitement la largeur pour correspondre à la largeur du PDF afin d'éviter les problèmes de mise à l'échelle
              width: element.offsetWidth, // Utiliser la largeur rendue de l'élément
              windowWidth: element.offsetWidth, // Important pour une mise à l'échelle cohérente
            },
            // IMPORTANT: Ajuster la hauteur ici.
            // Si contentHeight est disponible et précis, utilisez-le. Sinon, utilisez une hauteur fixe généreuse.
            jsPDF: { unit: 'mm', format: [102, desiredHeight], orientation: 'portrait' }
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
              })
              .finally(() => {
                // Nettoyer les styles injectés
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
        }, 100); // Réduit le setTimeout pour une génération PDF plus rapide après l'application des styles
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
        this.qrcode = `https://barcode.orcascan.com/?type=code128&data=${this.orderResponse.reference}}`
        const modalEl = document.getElementById('contentModalScrollable_facture')
        if (modalEl) {
          const modal = new Modal(modalEl)
          modal.show()
        }
      }
    },
    convertDateCreate(date: string): string {
      return UserGeneralKey.formatDateToFrenchLocale(date);
    },
    formatInTimeZone,
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
    async updateStatusOrder(status, methode) {
    const payload = {
      "statusOrder": status,
      "payment_method": methode
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
          setTimeout(() =>  {
            window.location.reload()
          }, 2000);
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
    fetchMethodePaiementOrderFr(methode: string){
      const dt = this.getMethodePaiementParType(this.listeMethode, methode);
      if(dt.length > 0){
        return dt[0]?.libelle ?? ''
      }
      return ''
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
    this.displayInvoire()
    document.addEventListener('hidden.bs.modal', function (event) {
      document.body.classList.remove('modal-open'); // au cas où
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(el => el.remove());
    });
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
  padding: 25px 15px;
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