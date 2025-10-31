<template>
  <div
    v-if="isLoading"
    class="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
    style="z-index: 9999"
  >
    <LoaderComponent />
  </div>

  <div class="row" v-else>
    <div class="col-lg-12 col-xl-12 col-xxl-4">
      <div
        class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div
          v-if="orderResponse"
          class="card-head bg-white d-flex align-items-center justify-content-between"
        >
          <div class="d-block">
            <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">
              {{ orderResponse.transactionReference }}
            </h5>
          </div>
          <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">
            <span
              v-if="orderResponse.DeliveryPreference === 'immediat'"
              class="badge text-bg-success fs-13 ms-10"
              style="margin-left: 70px"
            >
              TOUT DE SUITE
            </span>
            <span
              v-if="orderResponse.DeliveryPreference === 'ulterieur'"
              class="badge text-bg-warning fs-13"
              style="margin-left: 70px"
            >
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
                {{
                  formatInTimeZone(
                    orderResponse.created_at,
                    "UTC",
                    "dd/MM/yyyy - HH:mm"
                  )
                }}
              </span>
            </li>
            <li
              class="d-flex align-items-center justify-content-between"
              v-if="
                orderResponse.DeliveryPreference !== 'immediat' &&
                orderResponse.timeOrder
              "
            >
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-time"></i>
                Date de recuperation:
              </div>
              <span class="d-block text-paragraph fs-md-15 fs-lg-16">
                {{
                  orderResponse.timeOrder &&
                  isValidDate(orderResponse.timeOrder)
                    ? formatInTimeZone(
                        orderResponse.timeOrder,
                        "UTC",
                        "dd/MM/yyyy - HH:mm"
                      )
                    : "Non spécifiée"
                }}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-atm"></i>
                Méthode de paiement:
              </div>
              <span
                v-if="orderResponse.payment?.method"
                class="d-flex align-items-center text-paragraph fs-md-15 fs-lg-16"
              >
                <!--                <img-->
                <!--                  :src="methodePaiementSelected[0].icone"-->
                <!--                  :alt="methodePaiementSelected[0].libelle"-->
                <!--                  class="me-8 "-->
                <!--                  style="width: 25px; height: 25px;"-->
                <!--                />-->

                {{ translatePaymentMethod(orderResponse.payment?.method) }}
              </span>
            </li>
            <li
              class="d-flex align-items-center justify-content-between"
              v-if="orderResponse?.order_type"
            >
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-express-delivery"></i>
                Type de commande:
              </div>
              <!--              <span class="d-block text-paragraph fs-md-15 fs-lg-16">-->
              <!--                  {{orderTypeSelected[0].libelle}}-->
              <!--              </span>-->
              <span class="d-block badge text-bg-info fs-13">
                {{ translateOrderType(orderResponse.order_type) }}
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
                Civilité:
              </div>
              <span class="d-block text-paragraph fs-md-15 fs-lg-16">
                {{ orderResponse.civilite }}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-user-1"></i>
                Type de client:
              </div>
              <span
                class="d-block text-white badge text-bg-danger fs-md-15 fs-lg-16"
              >
                {{
                  orderResponse.typeCustomer === "customer"
                    ? "Entreprise"
                    : "Classique"
                }}
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
                {{ orderResponse.civilite || "" }}
                {{
                  orderResponse.customer?.first_name ||
                  orderResponse.guest_first_name ||
                  ""
                }}
                {{
                  orderResponse.customer?.last_name ||
                  orderResponse.guest_last_name ||
                  ""
                }}
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <div
                class="title text-black fs-md-15 fs-lg-16 fw-semibold position-relative"
              >
                <i class="flaticon-envelope"></i>
                Email:
              </div>
              <span
                v-if="
                  !orderResponse?.customer?.email?.includes('guest_') &&
                  !orderResponse?.guest_email?.includes('guest_')
                "
                class="d-block text-paragraph fs-md-15 fs-lg-16"
              >
                {{ orderResponse.customer?.email || orderResponse.guest_email }}
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
                {{
                  orderResponse.customer?.phone ||
                  orderResponse.guest_phone_number
                    ? "+41" +
                      (orderResponse.customer?.phone ||
                        orderResponse.guest_phone_number)
                    : "-"
                }}
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
          <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">
            Facture & Parrainage
          </h5>
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
              <span
                @click="displayInvoire"
                class="d-block text-primary fs-md-15 fs-lg-16 cursor-pointer text-decoration-underline"
                data-bs-toggle="modal"
                data-bs-target="#contentModalScrollable_facture"
              >
                {{ orderResponse.transactionReference }}
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
              <span
                v-if="orderResponse.coupon"
                class="d-block text-paragraph fs-md-15 fs-lg-16"
                >{{ orderResponse.coupon }}</span
              >
              <span v-else class="d-block text-paragraph fs-md-15 fs-lg-16"
                >-</span
              >
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
            Liste des produits (ID #{{ getShortUuid(orderResponse.id) }})
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
                  ></th>

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
                    <LoaderComponent />
                  </td>
                </tr>
                <template
                  v-else-if="
                    !isLoading && orderItemsWithNewStructure.length > 0
                  "
                >
                  <template
                    v-for="(
                      categoryItem, categoryIndex
                    ) in orderItemsWithNewStructure"
                    :key="categoryIndex"
                  >
                    <tr>
                      <td
                        colspan="6"
                        class="text-center fw-bold text-primary py-2"
                      >
                        {{ categoryItem?.category || "Sans catégorie" }}
                      </td>
                    </tr>
                    <tr
                      v-for="(
                        product, productIndex
                      ) in categoryItem?.products || []"
                      :key="`${categoryIndex}-${productIndex}`"
                    >
                      <th
                        class="shadow-none fw-medium text-black product-title ps-0"
                      >
                        <span
                          class="d-flex align-items-center text-decoration-none text-black fs-md-15 fs-lg-16"
                        >
                          <img
                            :src="getProductImage('')"
                            class="me-15"
                            width="44"
                            alt="product"
                          />
                          {{ product?.name || "Produit inconnu" }}
                        </span>
                      </th>
                      <td class="shadow-none lh-1 fw-medium text-paragraph">
                        x{{ product?.quantity || 0 }}
                      </td>
                      <td class="shadow-none lh-1 fw-medium text-paragraph">
                        {{ product?.price || 0 }} CHF
                      </td>

                      <td
                        class="shadow-none lh-1 fw-medium text-paragraph pe-0"
                      >
                        {{ (product?.price || 0) * (product?.quantity || 0) }}
                        CHF
                      </td>

                      <td
                        class="shadow-none lh-1 fw-medium text-paragraph pe-0"
                      ></td>

                      <td class="shadow-none lh-1 fw-medium text-paragraph">
                        <button
                          @click="selectedOrderItem(product)"
                          class="text-primary fw-medium text-decoration-underline btn btn-link"
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#contentModalScrollable_ingredient"
                          v-if="product?.ingredient?.length > 0"
                        >
                          ({{ product?.ingredient?.length || 0 }}) Ingredients
                        </button>
                        <span
                          v-else
                          class="text-primary fw-medium text-decoration-underline"
                          >Aucun Ingrédient</span
                        >
                      </td>
                    </tr>
                  </template>
                </template>
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
              >#{{ getShortUuid(orderResponse.id) }}</span
            ></span
          >
        </div>
        <div class="card-body">
          <ul class="order-summary-list ps-0 mb-0 list-unstyled">
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Délai de livraison estimé
              </span>
              <span
                class="d-block text-black fs-md-15 fs-lg-16 fw-medium"
                v-if="orderResponse"
              >
                {{
                  orderResponse.timeOrder &&
                  isValidDate(orderResponse.timeOrder)
                    ? new Date(orderResponse.timeOrder).toLocaleString(
                        "fr-FR",
                        {
                          timeZone: "Europe/Zurich",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "TOUT DE SUITE"
                }}
              </span>
            </li>
            <li
              class="d-flex align-items-center justify-content-between"
              v-if="orderResponse.intructionOrder"
            >
              <span class="d-block text-paragraph fw-medium">
                Demande de couverts
              </span>
              <span
                class="d-block text-black fs-md-15 fs-lg-16 fw-medium"
                v-if="orderResponse.intructionOrder"
              >
                {{
                  orderResponse.intructionOrder.demandeCouverts == true
                    ? "Oui"
                    : "Non"
                }}
              </span>
            </li>
            <li
              class="d-flex align-items-center justify-content-between"
              v-if="
                orderResponse.intructionOrder &&
                orderResponse.intructionOrder.quantityCouverts
              "
            >
              <span class="d-block text-paragraph fw-medium">
                Quantité de couverts
              </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                {{ orderResponse.intructionOrder.quantityCouverts || "-" }}
              </span>
            </li>

            <li
              class="d-flex align-items-center justify-content-between"
              v-if="
                orderResponse.intructionOrder &&
                orderResponse.intructionOrder.quantityCouverts
              "
            >
              <span class="d-block text-paragraph fw-medium">
                Doit-on trancher
              </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                {{
                  orderResponse.intructionOrder.isTrancher == true
                    ? "Oui"
                    : "Non"
                }}
              </span>
            </li>

            <!--            <li class="d-flex align-items-center justify-content-between" v-if="orderResponse.intructionOrder.cuisson">-->
            <!--              <span class="d-block text-paragraph fw-medium"> Type de cuisson </span>-->
            <!--              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">-->
            <!--                {{orderResponse.intructionOrder.cuisson|| '-'}}-->
            <!--              </span>-->
            <!--            </li>-->

            <li
              class="d-flex align-items-center justify-content-between"
              v-if="orderResponse"
            >
              <span class="d-block text-paragraph fw-medium">
                Instruction du client
              </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                {{
                  orderResponse.SpecialInstructions ??
                  (orderResponse.feature && orderResponse.feature[0]) ??
                  "-"
                }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-lg-4">
      <div
        v-if="orderResponse"
        class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
      >
        <div class="card-head bg-white d-flex align-items-center">
          <i class="flaticon-document text-info"></i>
          <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">
            Récapitulatif de la commande
          </h5>
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
            <template
              v-for="(
                categoryItem, categoryIndex
              ) in orderItemsWithNewStructure"
              :key="categoryIndex"
            >
              <li
                class="d-flex align-items-center justify-content-between pt-2 fw-bold text-primary"
              >
                <span>{{ categoryItem?.category || "Sans catégorie" }}</span>
              </li>
              <li
                v-for="(product, productIndex) in categoryItem?.products || []"
                :key="`${categoryIndex}-${productIndex}`"
                class="d-flex align-items-center justify-content-between pt-2"
              >
                <span>
                  <img
                    :src="getProductImage('')"
                    class="me-15"
                    width="44"
                    alt="product"
                  />{{ product?.quantity || 0 }}x
                  {{ product?.name || "Produit inconnu" }}
                </span>
                <span
                  >{{
                    (product?.price || 0) * (product?.quantity || 0)
                  }}
                  CHF</span
                >
              </li>
            </template>

            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-black fw-bolder fw-medium">
                SOUS-TOTAL
              </span>
              <span class="d-block text-black fw-bolder fw-medium">
                {{ getSubtotalPrice(orderResponse) }} CHF
              </span>
            </li>
            <li
              class="d-flex align-items-center justify-content-between"
              v-if="orderResponse.discountValue != '0'"
            >
              <span class="d-block text-primary fw-bolder fw-medium">
                RABAIS
              </span>
              <span class="d-block text-primary fw-bolder fw-medium">
                -{{ getDiscountValue(orderResponse) }} CHF
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-black fw-bolder fw-medium">
                Y COMPRIS TVA (2.60%)
              </span>
              <span class="d-block text-black fw-bolder fw-medium">
                {{ (parseFloat(orderResponse.total) * 0.026).toFixed(2) }} CHF
              </span>
            </li>

            <li
              class="d-flex align-items-center justify-content-between"
              v-if="orderResponse.restMinimumOrder != '0'"
            >
              <span class="d-block text-primary fw-bolder fw-medium">
                FRAIS SUPPLÉMENTAIRES
              </span>
              <span class="d-block text-primary fw-bolder fw-medium">
                {{ orderResponse.restMinimumOrder ?? "0" }} CHF
              </span>
            </li>

            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-primary fw-bolder fw-medium">
                TOTAL
              </span>
              <span class="d-block text-primary fw-bolder fw-medium">
                {{ orderResponse.total }} CHF
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
              <span class="d-block text-paragraph fw-medium"> NPA: </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{
                  orderResponse.delivery?.postal_code || "-"
                }}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Localité: </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{ orderResponse.delivery?.locality || "-" }}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Téléphone: </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{
                  orderResponse.customer?.phone ||
                  orderResponse.guest_phone_number ||
                  "-"
                }}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Email: </span>
              <span
                v-if="!orderResponse?.guest_email?.includes('guest_')"
                class="d-block text-paragraph fw-medium"
              >
                <strong>{{
                  orderResponse.customer?.email ||
                  orderResponse.guest_email ||
                  "-"
                }}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Rue: </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{ orderResponse.delivery?.rue || "-" }}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Nº: </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{ orderResponse.delivery?.numberRue || "-" }}</strong>
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
              <span class="d-block text-paragraph fw-medium"> NPA: </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{
                  orderResponse?.delivery?.postal_code || "-"
                }}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Localité: </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{ orderResponse?.delivery?.locality || "-" }}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Téléphone: </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{
                  orderResponse.customer?.phone ||
                  orderResponse.guest_phone_number ||
                  "-"
                }}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Email: </span>
              <span
                v-if="!orderResponse?.guest_email?.includes('guest_')"
                class="d-block text-paragraph fw-medium"
              >
                <strong>{{
                  orderResponse.customer?.email ||
                  orderResponse.guest_email ||
                  "-"
                }}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Rue: </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{ orderResponse?.delivery?.rue || "-" }}</strong>
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Nº: </span>
              <span class="d-block text-paragraph fw-medium">
                <strong>{{ orderResponse?.delivery?.numberRue || "-" }}</strong>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="orderResponse" class="col-lg-4 flex-column">
      <div v-if="orderResponse">
        <div
          class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
        >
          <div
            class="card-head bg-white d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0 fw-bold text-black">Status de la commande</h5>

            <div class="dropdown" v-if="allOrderStatus.length > 0">
              <button
                v-if="orderResponse.status === 'pending'"
                class="btn btn-danger btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ fetchStatusOrderFr(orderResponse.status) }}
              </button>
              <button
                v-if="orderResponse.status === 'processing'"
                class="btn btn-warning btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ fetchStatusOrderFr(orderResponse.status) }}
              </button>
              <button
                v-if="orderResponse.status === 'paid'"
                class="btn btn-success btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ fetchStatusOrderFr(orderResponse.status) }}
              </button>
              <button
                v-if="orderResponse.status === 'refunded'"
                class="btn btn-close btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ fetchStatusOrderFr(orderResponse.status) }}
              </button>
              <button
                v-if="orderResponse.status === 'ready_for_delivery'"
                class="btn btn-info btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ fetchStatusOrderFr(orderResponse.status) }}
              </button>
              <button
                v-if="orderResponse.status === 'out_for_delivery'"
                class="btn btn-secondary btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ fetchStatusOrderFr(orderResponse.status) }}
              </button>
              <button
                v-if="orderResponse.status === 'delivered'"
                class="btn btn-success btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ fetchStatusOrderFr(orderResponse.status) }}
              </button>
              <button
                v-if="orderResponse.status === 'cancelled'"
                class="btn btn-danger btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ fetchStatusOrderFr(orderResponse.status) }}
              </button>

              <ul class="dropdown-menu">
                <li v-for="status in allOrderStatus" :key="status">
                  <a
                    @click="
                      updateStatusOrder(
                        status,
                        methodePaiementSelected[0]?.type ?? ''
                      )
                    "
                    class="dropdown-item"
                    href="#"
                    >{{ fetchStatusOrderFr(status) }}</a
                  >
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

                <span
                  class="d-block text-black fs-md-15 fs-lg-16 fw-medium"
                  v-if="orderResponse.payment"
                >
                  <span
                    v-if="orderResponse.payment?.status === 'pending'"
                    class="badge text-outline-danger"
                  >
                    {{
                      fetchStatusOrderPaiementFr(orderResponse.payment?.status)
                    }}</span
                  >
                  <span
                    v-if="orderResponse.payment?.status === 'paid'"
                    class="badge text-outline-primary"
                  >
                    {{
                      fetchStatusOrderPaiementFr(orderResponse.payment?.status)
                    }}</span
                  >
                  <span
                    v-if="orderResponse.payment?.status === 'refunded'"
                    class="badge text-outline-muted"
                  >
                    {{
                      fetchStatusOrderPaiementFr(orderResponse.payment?.status)
                    }}</span
                  >
                  <span
                    v-if="orderResponse.payment?.status === 'cancelled'"
                    class="badge text-outline-warning"
                  >
                    {{
                      fetchStatusOrderPaiementFr(orderResponse.payment?.status)
                    }}</span
                  >
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="orderResponse">
        <div
          class="card mb-25 border-0 rounded-0 bg-white order-details-box letter-spacing"
        >
          <div
            class="card-head bg-white d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0 fw-bold text-black">Méthode de paiement</h5>

            <button
              class="btn btn-sm"
              :class="
                backgroundColorPaymentMethod(orderResponse.payment?.method)
              "
              type="button"
              aria-expanded="false"
            >
              {{ translatePaymentMethod(orderResponse.payment?.method) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div
    class="modal fade"
    id="contentModalScrollable_ingredient"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content flex-column justify-content-center">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Liste des ingredients</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div
          class="modal-body flex-row align-items-center justify-content-center"
        >
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
              <tbody
                v-if="
                  orderItemSelected &&
                  (orderItemSelected.ingredients?.length > 0 ||
                    orderItemSelected.ingredient?.length > 0)
                "
              >
                <tr
                  v-for="ingredient in orderItemSelected.ingredients ||
                  orderItemSelected.ingredient"
                  :key="ingredient.name"
                >
                  <th class="shadow-none lh-1 fw-bold ps-0">
                    <router-link
                      to="/product-details"
                      class="text-decoration-none text-black-emphasis"
                    >
                      {{ ingredient.name }} - {{ ingredient.size }}
                    </router-link>
                  </th>
                  <td class="shadow-none lh-1 fw-medium">
                    <span
                      v-if="ingredient.isDefault"
                      class="badge text-outline-primary"
                      >Gratuit</span
                    >
                    <span v-else class="badge text-outline-danger">Payant</span>
                  </td>
                  <td class="shadow-none lh-1 fw-medium text-black-emphasis">
                    <div class="d-flex align-items-center">
                      {{ ingredient.quantite }}
                    </div>
                  </td>
                  <td class="shadow-none lh-1 fw-medium text-body-tertiary">
                    {{ ingredient.extra_cost_price }} CHF
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="contentModalScrollable_facture"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content" v-if="orderResponse">
        <div class="modal-header">
          <h1 class="modal-title fs-5">
            Facture de la commande #{{ getShortUuid(orderResponse.id) }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div
          class="modal-body flex-row align-items-center justify-content-center"
        >
          <!-- Affichage du PDF depuis l'URL -->
          <div v-if="pdfUrl" class="w-100 h-100">
            <iframe
              :src="pdfUrl"
              width="100%"
              height="600px"
              style="border: none"
              title="Facture PDF"
            ></iframe>
          </div>

          <!-- Affichage du PDF généré localement -->
          <div v-else class="flex-column items-center justify-content-center">
            <main class="ticket-system">
              <div class="receipts-wrapper">
                <div class="receipts" id="recu-pdf">
                  <div class="receipt">
                    <div class="logo-container">
                      <img
                        src="@/assets/images/logo_black.png"
                        class="airliner-logo"
                      />
                    </div>
                    <div class="order-date">
                      Effectuée le
                      {{
                        formatInTimeZone(
                          orderResponse.created_at,
                          "UTC",
                          "dd/MM/yyyy - HH:mm"
                        )
                      }}
                      <template
                        v-if="
                          orderResponse.order_type === 'delivery' &&
                          orderResponse.timeOrder &&
                          isValidDate(orderResponse.timeOrder)
                        "
                      >
                        <br />Livraison avant le
                        {{
                          formatInTimeZone(
                            orderResponse.timeOrder,
                            "UTC",
                            "dd/MM/yyyy - HH:mm"
                          )
                        }}
                      </template>
                      <template
                        v-else-if="
                          orderResponse.order_type === 'click_collect' &&
                          orderResponse.timeOrder &&
                          isValidDate(orderResponse.timeOrder)
                        "
                      >
                        <br />À emporter avant le
                        {{
                          formatInTimeZone(
                            orderResponse.timeOrder,
                            "UTC",
                            "dd/MM/yyyy - HH:mm"
                          )
                        }}
                      </template>
                    </div>
                    <div class="command-type-bar">
                      <table class="command-type-table">
                        <tr>
                          <td class="left-cell">
                            <span class="order-reference">
                              {{
                                orderResponse.restaurantID?.id ===
                                RestaurantEnum.RESTO_MORGES
                                  ? "VBM" + orderResponse.nif
                                  : "VBP" + orderResponse.nif
                              }}
                            </span>
                          </td>
                          <td class="right-cell">
                            <span class="command-type">
                              {{
                                orderResponse.order_type === "delivery"
                                  ? "LIVRAISON"
                                  : orderResponse.order_type === "click_collect"
                                  ? "À EMPORTER"
                                  : "SUR PLACE"
                              }}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div class="client-section">
                      <div class="client-info">
                        <span class="client-name"
                          ><strong
                            >{{
                              orderResponse.customer?.first_name ||
                              orderResponse.guest_first_name
                            }}
                            {{
                              orderResponse.customer?.last_name ||
                              orderResponse.guest_last_name
                            }}</strong
                          ></span
                        >
                        <span class="client-phone"
                          ><strong>{{
                            orderResponse.customer?.phone ||
                            orderResponse.guest_phone_number
                          }}</strong></span
                        >
                        <span
                          v-if="
                            !orderResponse?.customer?.email?.includes(
                              'guest_'
                            ) && !orderResponse?.guest_email?.includes('guest_')
                          "
                          class="client-email"
                          ><strong>{{
                            orderResponse?.customer?.email ||
                            orderResponse?.guest_email
                          }}</strong></span
                        >
                      </div>
                    </div>

                    <hr class="dashed-line" />

                    <div class="product-ticket" v-if="orderResponse">
                      <div
                        v-for="(items, categoryName) in groupedByCategory"
                        :key="categoryName"
                        class="category-section"
                        style="margin-bottom: 10px"
                      >
                        <!-- 🏷️ Nom unique de la catégorie -->
                        <div
                          style="
                            font-weight: 600;
                            font-size: 18px;
                            margin-bottom: 8px;
                            text-decoration: underline;
                            justify-self: center;
                          "
                        >
                          {{ categoryName }}
                        </div>

                        <!-- 🍕 Tous les produits de cette catégorie -->
                        <div
                          v-for="item in items"
                          :key="item.id"
                          class="product-item"
                        >
                          <div class="product-details">
                            <div class="product-name">
                              {{ item.quantity }}x
                              {{ item.product?.name || "Produit" }}
                              {{ item.size || "" }}
                              <span v-if="item.optionSpecific">{{
                                item.optionSpecific
                              }}</span>
                            </div>
                            <div class="product-price">
                              {{ item.total_price }} CHF
                            </div>
                          </div>

                          <!-- 🧂 Ingrédients -->
                          <ul
                            v-if="
                              (item.ingredients &&
                                item?.ingredients?.length > 0) ||
                              (item.ingredient && item?.ingredient?.length > 0)
                            "
                            class="ingredients-list"
                          >
                            <li
                              v-for="ingredient in item.ingredients ||
                              item.ingredient"
                              :key="ingredient.id"
                            >
                              x{{ ingredient.quantite || ingredient.quantity }}
                              {{ ingredient.name }} (+{{
                                (
                                  (ingredient.extra_cost_price || 0) *
                                  (ingredient.quantite ||
                                    ingredient.quantity ||
                                    1)
                                ).toFixed(2)
                              }}
                              CHF)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <hr class="dashed-line" />
                    <div class="price-summary">
                      <div class="price-row">
                        <span><strong>Sous-Total</strong></span>
                        <span class="price-value"
                          >{{ getSubtotalPrice(orderResponse) }} CHF</span
                        >
                      </div>
                      <div
                        class="price-row"
                        v-if="orderResponse.discountValue != '0'"
                      >
                        <span><strong>(Rabais)</strong></span>
                        <span class="price-value"
                          >-{{ getDiscountValue(orderResponse) }} CHF</span
                        >
                      </div>
                      <div
                        class="price-row"
                        v-if="
                          orderResponse.divers != '0' ||
                          orderResponse.divers != null
                        "
                      >
                        <span><strong>(Frais supplémentaire)</strong></span>
                        <span class="price-value"
                          >{{ orderResponse.divers }} CHF</span
                        >
                      </div>
                      <div class="price-row">
                        <span><strong>y compris T.V.A (2.6%)</strong></span>
                        <span class="price-value"
                          >{{
                            (parseFloat(orderResponse.total) * 0.026).toFixed(2)
                          }}
                          CHF</span
                        >
                      </div>
                      <div class="price-row total-row">
                        <span><strong>Total</strong></span>
                        <span class="price-value"
                          >{{ orderResponse.total }} CHF</span
                        >
                      </div>
                    </div>

                    <hr class="dashed-line" />
                    <div
                      class="payment-method"
                      v-if="methodePaiementSelected.length > 0"
                    >
                      <div class="price-row">
                        <strong>Méthode de paiement :</strong>
                        <span>{{
                          (orderResponse.payment?.method ||
                            methodePaiementSelected[0]?.libelle) ??
                          ""
                        }}</span>
                      </div>
                    </div>
                    <div class="route">
                      <div>
                        <strong
                          >Trancher:
                          {{
                            orderResponse.intructionOrder?.isTrancher
                              ? "OUI"
                              : "NON"
                          }}</strong
                        >
                      </div>
                      <div>
                        <strong
                          >Couverts:
                          {{
                            orderResponse.intructionOrder?.quantityCouverts ||
                            "-"
                          }}</strong
                        >
                      </div>
                      <div
                        class="instruction-row"
                        v-if="
                          orderResponse.SpecialInstructions ||
                          orderResponse.feature
                        "
                      >
                        <div><strong>(Commentaire :)</strong></div>
                        <div>
                          <strong>{{
                            orderResponse.SpecialInstructions ||
                            orderResponse.feature?.[0] ||
                            "-"
                          }}</strong>
                        </div>
                      </div>
                    </div>

                    <div class="ticket-footer">
                      <span
                        >{{
                          orderResponse.restaurantID?.id ===
                          RestaurantEnum.RESTO_MORGES
                            ? "Va Bene pizza sàrl Morges"
                            : "Pizzeria Va Bene SA "
                        }}
                      </span>
                      <span
                        >{{ orderResponse.restaurantID?.address || "-" }}
                      </span>
                      <span
                        >{{
                          orderResponse.restaurantID?.codePostalID
                            ?.numeroPostal || "-"
                        }}
                        {{ orderResponse.restaurantID?.name || "-" }}
                      </span>
                      <span
                        >{{ orderResponse.restaurantID?.phoneNumber || "-" }}
                      </span>
                      <span>
                        {{ orderResponse.restaurantID?.taxe || "-" }}
                      </span>
                      <span>www.vabenepizza.ch</span>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div class="modal-footer">
          <button
            v-if="pdfUrl"
            @click="printPDFFromUrl"
            type="button"
            class="btn btn-primary"
          >
            Imprimer maintenant
          </button>
          <button
            v-else
            @click="previewPDF"
            type="button"
            class="btn btn-primary"
          >
            Imprimer maintenant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import {
  detailOrder,
  listeMethodePaiement,
  updateOrder,
  listeOrderType,
  allStatusOrder,
  allStatusPaiementOrder,
} from "@/service/api";
import {
  ApiResponse,
  PaginatedMethodePaiement,
  PaginatedOrder,
  PaginatedOrderType,
} from "@/models/Apiresponse";
import { UserGeneralKey } from "@/models/user.generalkey";
import { useToast } from "vue-toastification";
import LoaderComponent from "@/components/Loading/Loader.vue";
import { OrderModel } from "@/models/order.model";
import { MethodePaiementModel } from "@/models/methodePaiement.model";
import { OrderTypeModel } from "@/models/orderType.model";
import { OrderItemModel } from "@/models/orderItem.model";
import html2pdf from "html2pdf.js";
import { OrderStatus } from "@/enums/orderStatut.enum";
import { PaymentStatus } from "@/enums/orderPaiementMethode.enum";
import { Modal } from "bootstrap";
import { RestaurantEnum } from "../../../../enums/restaurant.enum";
import { formatInTimeZone } from "date-fns-tz";
import { CategorieModel } from "@/models/categorie.model";

export default defineComponent({
  name: "VaBeneOrderDetails",
  computed: {
    groupedByCategory() {
      const grouped: Record<string, any[]> = {};

      if (this.orderResponse) {
        for (const categoryItem of this.orderResponse.items as any) {
          const categoryName =
            (categoryItem as any).category || "Sans catégorie";

          if (!grouped[categoryName]) {
            grouped[categoryName] = [];
          }

          // Ajouter tous les produits de cette catégorie
          grouped[categoryName].push(...(categoryItem as any).products);
        }
      }
      return grouped;
    },
    RestaurantEnum() {
      return RestaurantEnum;
    },
    // Propriété calculée pour les items avec la nouvelle structure
    orderItemsWithNewStructure() {
      const items = ((this as any).orderResponse?.items as any) || [];
      // S'assurer que chaque item a une structure valide
      return items.filter(
        (item: any) => item && typeof item === "object" && item.products
      );
    },
    // Propriété calculée pour obtenir l'URL du PDF
    pdfUrl() {
      return ((this as any).orderResponse as any)?.pdfUrl || null;
    },
  },
  props: {
    commandeID: {
      type: String as PropType<string>,
      required: true,
    },
  },
  // eslint-disable-next-line no-undef
  components: { LoaderComponent },
  data() {
    return {
      orderResponse: null as OrderModel | null,
      isLoading: false,
      listeMethode: [] as MethodePaiementModel[],
      methodePaiementSelected: [] as MethodePaiementModel[],
      listeOrderType: [] as OrderTypeModel[],
      orderTypeSelected: [] as OrderTypeModel[],
      orderItemSelected: null as any,
      qrcode: null as string | null,
      allOrderStatus: [] as string[],
      allPaiementOrderStatus: [] as string[],
    };
  },

  methods: {
    isValidDate(dateString: string): boolean {
      if (!dateString) return false;
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    },
    getSubtotalPrice(order: OrderModel): number {
      const prices = (order.items as any).reduce(
        (total: number, categoryItem: any) => {
          const categoryTotal = (categoryItem as any).products.reduce(
            (categorySum: number, product: any) =>
              categorySum + (product as any).price * (product as any).quantity,
            0
          );
          return total + categoryTotal;
        },
        0
      );
      return prices;
    },
    getDiscountValue(order: OrderModel): number {
      let discountValue = 0;
      if (order.discountValue !== "" && order.discountType == "fixed") {
        discountValue = Number(order.discountValue);
      } else if (
        order.discountValue !== "" &&
        order.discountType == "percentage"
      ) {
        discountValue = Number(order.total) - Number(order.total) * (26 / 100);
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
        return "(" + match[0] + ")";
      }

      // Si les parenthèses sont vides ou n'existent pas, on retourne une chaîne vide.
      return "";
    },
    extraireCmValeur(texte: string, categorie: CategorieModel): string | null {
      if (categorie.id === "fd4a2c4e-49ef-48a5-9937-6f3a51122f9e") {
        return "";
      } else {
        const match = texte.match(/\b\d+cm\b/);
        return match ? this.extraireParenthese(match[0]) : null;
      }
    },
    getLast6Digits(uuid: string): string {
      const parts = uuid.split("-");
      const lastPart = parts[parts.length - 1];
      // On garde uniquement les chiffres
      const digitsOnly = lastPart.replace(/\D/g, "");
      return digitsOnly.slice(-6);
    },
    printPDFFromUrl() {
      if (this.orderResponse && (this.orderResponse as any).pdfUrl) {
        // Ouvrir le PDF dans un nouvel onglet pour l'impression
        window.open((this.orderResponse as any).pdfUrl, "_blank");
      }
    },
    previewPDF() {
      const element = document.getElementById("recu-pdf");
      if (this.orderResponse && element) {
        const style = document.createElement("style");

        // Sauvegarder les styles originaux pour les restaurer plus tard (bonne pratique)
        const originalElementWidth = element.style.width;
        const originalElementMargin = element.style.margin;
        const originalElementTransform = element.style.transform; // Capture la transformation d'animation
        // Capturez aussi les styles spécifiques des enfants qui pourraient être animés/déplacés
        const receiptsElement = element.querySelector(
          ".receipts"
        ) as HTMLElement;
        let originalReceiptsTransform = "";
        let originalReceiptsMarginTop = "";
        if (receiptsElement) {
          originalReceiptsTransform = receiptsElement.style.transform;
          originalReceiptsMarginTop = receiptsElement.style.marginTop;
        }

        // Appliquer les styles spécifiques pour la génération de PDF
        // IMPORTANT: Définir la largeur sur l'élément principal. Supprimer toute max-width ou largeur interne en conflit.
        element.style.width = "115mm"; // Largeur physique cible du ticket
        element.style.margin = "0"; // Pas de marge auto pour le PDF, il doit remplir la largeur de la page
        element.style.transform = "none"; // Désactiver toute trxansformation de translation des animations
        if (receiptsElement) {
          receiptsElement.style.transform = "none"; // Désactiver les animations sur .receipts
          receiptsElement.style.marginTop = "0"; // S'assurer qu'aucune marge supérieure ne pousse le contenu
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
        box-sizing: border-box; /* S'assurer que padding et border sont inclus dans les dimensions */
        overflow: visible; /* Permettre au contenu de déborder pour une mesure précise */
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
          // Calculer la hauteur réelle du contenu pour couper aux limites exactes
          const receiptElement = element.querySelector(
            ".receipt"
          ) as HTMLElement;
          let actualHeight = 200; // Hauteur minimale par défaut

          if (receiptElement) {
            // Obtenir les dimensions réelles du contenu
            const rect = receiptElement.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(receiptElement);

            // Calculer la hauteur totale incluant padding et border
            const paddingTop = parseFloat(computedStyle.paddingTop);
            const paddingBottom = parseFloat(computedStyle.paddingBottom);
            const borderTop = parseFloat(computedStyle.borderTopWidth);
            const borderBottom = parseFloat(computedStyle.borderBottomWidth);

            // Calculer la hauteur réelle en incluant tous les éléments enfants
            let totalHeight = rect.height;

            // Ajouter la hauteur des éléments qui pourraient déborder
            const children = receiptElement.children;
            for (let i = 0; i < children.length; i++) {
              const child = children[i] as HTMLElement;
              const childRect = child.getBoundingClientRect();
              const childStyle = window.getComputedStyle(child);
              const childMarginBottom = parseFloat(childStyle.marginBottom);
              totalHeight = Math.max(
                totalHeight,
                childRect.bottom - rect.top + childMarginBottom
              );
            }

            // Convertir les pixels en mm (1 inch = 25.4mm, 1 inch = 96px)
            const pixelsToMm = 25.4 / 96;
            const contentHeightInMm =
              (totalHeight +
                paddingTop +
                paddingBottom +
                borderTop +
                borderBottom) *
              pixelsToMm;

            // Ajouter une petite marge pour éviter que le contenu soit coupé
            actualHeight = Math.max(200, contentHeightInMm + 5);
          }

          const opt = {
            margin: [2, 0, 2, 0], // Marges réduites (Haut, Gauche, Bas, Droite) en mm pour un découpage plus précis
            filename: `Facture_${this.getShortUuid(
              this.orderResponse!.id
            )}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2, // Augmentez la résolution pour une meilleure qualité
              useCORS: true,
              // Définir explicitement la largeur pour correspondre à la largeur du PDF afin d'éviter les problèmes de mise à l'échelle
              width: element.offsetWidth, // Utiliser la largeur rendue de l'élément
              windowWidth: element.offsetWidth, // Important pour une mise à l'échelle cohérente
              height: receiptElement ? receiptElement.offsetHeight : undefined, // Utiliser la hauteur réelle du contenu
              scrollX: 0, // Éviter les problèmes de scroll
              scrollY: 0, // Éviter les problèmes de scroll
            },
            // Utiliser la hauteur calculée dynamiquement pour couper aux limites exactes
            jsPDF: {
              unit: "mm",
              format: [102, actualHeight],
              orientation: "portrait",
            },
          };

          html2pdf()
            .set(opt)
            .from(element)
            .toPdf()
            .get("pdf")
            .then((pdf) => {
              const blob = pdf.output("blob");
              const url = URL.createObjectURL(blob);
              window.open(url, "_blank");
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
      return uuid.split("-")[0];
    },
    getProductImage(productImage: string): string {
      try {
        const images = JSON.parse(productImage);
        return images[0] || "";
      } catch (error) {
        return "";
      }
    },
    selectedOrderItem(orderItem: any) {
      this.orderItemSelected = orderItem;
    },
    displayInvoire() {
      if (this.orderResponse) {
        // Si un PDF URL est disponible, l'afficher dans la modale
        const pdfUrl = (this.orderResponse as any).pdfUrl;
        if (pdfUrl) {
          // Afficher la modale avec le PDF
          const modalEl = document.getElementById(
            "contentModalScrollable_facture"
          );
          if (modalEl) {
            const modal = new Modal(modalEl);
            modal.show();
          }
          return;
        }

        // Sinon, afficher la modale avec le PDF généré localement
        this.qrcode = `https://barcode.orcascan.com/?type=code128&data=${this.orderResponse.reference}}`;
        const modalEl = document.getElementById(
          "contentModalScrollable_facture"
        );
        if (modalEl) {
          const modal = new Modal(modalEl);
          modal.show();
        }
      }
    },
    convertDateCreate(date: string): string {
      // S'assurer que l'heure suisse est toujours affichée
      const dateObj = new Date(date);

      // Options pour le formatage avec fuseau horaire suisse
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // format 24h
        timeZone: "Europe/Zurich", // Heure suisse
      };

      return dateObj.toLocaleString("fr-FR", options);
    },
    formatInTimeZone,
    async fetchOrder(orderID) {
      this.isLoading = true;
      try {
        const response = (await detailOrder(
          orderID
        )) as ApiResponse<OrderModel>;
        if (response.code === 200) {
          if (response.data) {
            this.orderResponse = response.data;
            // await this.fetchListeMethodePaiement();
            // await this.fetchOrderType();
            this.displayInvoire();
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
        const response = (await listeMethodePaiement(
          page
        )) as ApiResponse<PaginatedMethodePaiement>;
        if (response.code === 200) {
          if (response.data?.items && this.orderResponse) {
            this.listeMethode = response.data.items;
            this.methodePaiementSelected = this.getMethodePaiementParType(
              response.data.items,
              this.orderResponse.payment.method
            );
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
        const response = (await listeOrderType(
          page
        )) as ApiResponse<PaginatedOrderType>;
        if (response.code === 200) {
          if (response.data?.items && this.orderResponse) {
            this.listeOrderType = response.data.items;
            this.orderTypeSelected = this.getOrderTypeParType(
              response.data.items,
              this.orderResponse.order_type
            );
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

    // async fetchAllStatusOrder() {
    //   try {
    //     const response = (await allStatusOrder()) as ApiResponse<string[]>;
    //     if (response.code === 200) {
    //       if (response.data) {
    //         this.allOrderStatus = response.data;
    //       }
    //     } else {
    //       this.toast.error(response.message);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
    async fetchAllPaiementStatusOrder() {
      try {
        const response = (await allStatusPaiementOrder()) as ApiResponse<
          string[]
        >;
        if (response.code === 200) {
          if (response.data) {
            this.allPaiementOrderStatus = response.data;
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
        statusOrder: status,
        payment_method: methode,
      };
      try {
        const response = (await updateOrder(
          this.orderResponse?.id,
          payload
        )) as ApiResponse<OrderModel>;
        if (response.code === 200) {
          if (response.data) {
            this.toast.success(response.message);
            this.orderResponse = response.data;
          }
          setTimeout(() => {
            window.location.reload();
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
      return liste.filter((methode) => methode.type === type);
    },
    getOrderTypeParType(
      liste: OrderTypeModel[],
      type: string
    ): OrderTypeModel[] {
      return liste.filter((orderType) => orderType.type === type);
    },
    fetchStatusOrderFr(status: string) {
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

    translatePaymentMethod(paymentMethod: string): string {
      const translations = {
        pay_click_collect_cash: "Paiement en espèces",
        pay_click_collect_carte: "Paiement par carte",
        pay_delivery_cash: "Paiement en espèces à la livraison",
        pay_delivery_carte: "Paiement par carte à la livraison",
        on_line: "Paiement en ligne",
      };

      return translations[paymentMethod] ?? "";
    },

    backgroundColorPaymentMethod(paymentMethod: string): string {
      const translations = {
        pay_click_collect_cash: "bg-danger",
        pay_click_collect_carte: "bg-warning",
        pay_delivery_cash: "bg-success",
        pay_delivery_carte: "bg-secondary",
        on_line: "bg-info",
      };
      return translations[paymentMethod] ?? "bg-secondary";
    },

    translateOrderType(orderType: string): string {
      const translations = {
        delivery: "A Livrer",
        click_collect: "A emporter",
        dine_in: "Sur place",
      };
      return translations[orderType] || "Non spécifié";
    },
    fetchStatusOrderPaiementFr(status: string) {
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
    fetStatusPiamentFr(status: string) {
      return this.allPaiementOrderStatus.find(
        (orderStatus) => orderStatus === status
      );
    },
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.fetchOrder((this as any).$route.params.commandeID);
    // this.fetchAllStatusOrder();
    // this.fetchAllPaiementStatusOrder();
    this.displayInvoire();

    // Nettoyer les modals existants au montage
    document.body.classList.remove("modal-open");
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((el) => el.remove());

    // Ajouter l'event listener pour nettoyer les modals
    const modalCleanupHandler = (event: Event) => {
      document.body.classList.remove("modal-open");
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((el) => el.remove());
    };
    document.addEventListener("hidden.bs.modal", modalCleanupHandler);

    // Stocker la référence pour pouvoir la supprimer plus tard
    (this as any).modalCleanupHandler = modalCleanupHandler;
  },
  beforeUnmount() {
    // Supprimer l'event listener pour éviter les fuites mémoire
    if ((this as any).modalCleanupHandler) {
      document.removeEventListener(
        "hidden.bs.modal",
        (this as any).modalCleanupHandler
      );
    }
    // Nettoyer les modals avant de quitter
    document.body.classList.remove("modal-open");
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((el) => el.remove());
  },
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}
html,
body {
  height: 100%;
  margin: 0;
}
#recu-pdf * {
  font-family: "Ubuntu", sans-serif;
  color: #1c1c1c;
}
#recu-pdf {
  max-width: 650px;
  padding: 25px 30px 0 30px; /* Supprimer le padding en bas */
  margin-top: 83%;
  margin-bottom: 0; /* Supprimer toute marge en bas */
}

#recu-pdf .order-date {
  justify-self: center;
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
  padding-bottom: 0; /* Supprimer le padding en bas pour correspondre au PDF */
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
  width: 100%;
  background-color: #fff;
  box-sizing: border-box; /* S'assurer que padding et border sont inclus dans les dimensions */
  overflow: visible; /* Permettre au contenu de déborder pour une mesure précise */
  margin-bottom: 0; /* Supprimer toute marge en bas */
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

#recu-pdf .route:last-child {
  margin-bottom: 0; /* Supprimer la marge du dernier élément */
}

.dashed-line {
  border: none;
  border-top: 2px dashed #333; /* couleur personnalisable */
  margin: 1rem 0;
  width: 100%;
}

.dashed-line:last-child {
  margin-bottom: 0; /* Supprimer la marge de la dernière ligne pointillée */
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
  color: rgba(28, 28, 28, 0.7);
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
  content: "";
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
  margin-bottom: 0; /* Supprimer la marge en bas */
  font-family: "Arial", sans-serif;
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

#recu-pdf.product-list div:last-child {
  border-bottom: none; /* Supprimer la bordure du dernier élément */
  margin-bottom: 0; /* Supprimer la marge du dernier élément */
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
  0% {
    transform: translateY(-510px);
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

/* Styles pour la barre de type de commande */
#recu-pdf .command-type-bar {
  margin: 10px 0;
}

#recu-pdf .command-type-table {
  width: 100%;
  border-collapse: collapse;
  background: #e5e5e5;
}

#recu-pdf .command-type-table td {
  padding: 8px 12px;
}

#recu-pdf .left-cell {
  text-align: left;
  width: 60%;
}

#recu-pdf .right-cell {
  color: white;
  text-align: center;
  width: 40%;
  font-weight: bold;
}

#recu-pdf .order-reference {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

#recu-pdf .command-type {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Styles pour la section client */
#recu-pdf .client-section {
  margin: 15px 0;
  padding: 10px;
  border-radius: 5px;
}

#recu-pdf .client-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

#recu-pdf .client-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

#recu-pdf .client-phone {
  font-size: 16px;
  color: #666;
}

#recu-pdf .client-email {
  font-size: 16px;
  color: #666;
}

/* Styles pour les catégories de produits */
#recu-pdf .category-section {
  margin-bottom: 15px;
}

#recu-pdf .category-section > div:first-child {
  background-color: inherit;
  color: #000000;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Styles pour les produits */
#recu-pdf .product-item {
  margin-bottom: 10px;
  padding: 5px 0;
}

#recu-pdf .product-details {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 5px;
}

#recu-pdf .product-name {
  flex: 1;
  font-size: 16px;
  font-weight: bold;
}

#recu-pdf .product-price {
  font-size: 16px;
  font-weight: bold;
  color: #dc3545;
}

/* Styles pour les ingrédients */
#recu-pdf .ingredients-list {
  margin: 5px 0 0 15px;
  padding: 0;
  list-style: none;
}

#recu-pdf .ingredients-list li {
  font-size: 14px;
  color: #dc3545;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
}

#recu-pdf .ingredients-list li::before {
  content: "•";
  color: #dc3545;
  font-weight: bold;
  margin-right: 5px;
}

/* Styles pour le résumé des prix */
#recu-pdf .price-summary {
  margin-top: 15px;
}

#recu-pdf .price-row {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  padding: 3px 0;
}

#recu-pdf .price-row.total-row {
  border-top: 2px solid #333;
  padding-top: 8px;
  margin-top: 10px;
  font-weight: bold;
  font-size: 18px;
}

#recu-pdf .price-row.total-row .price-value {
  color: #dc3545;
  font-weight: bold;
}

/* Styles pour les instructions */
#recu-pdf .instruction-row {
  margin: 10px 0;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

#recu-pdf .instruction-row div:first-child {
  font-weight: bold;
  margin-bottom: 5px;
}

/* Styles pour le footer du ticket */
#recu-pdf .ticket-footer {
  margin-top: 20px;
  padding-top: 15px;
  text-align: center;
}

#recu-pdf .ticket-footer span {
  display: block;
  margin: 3px 0;
  font-size: 14px;
  color: #666;
}
</style>
