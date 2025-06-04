<template>

  <div  class="row">
    <div class="col-xxl-8">
      <div
        class="card mb-25 border-0 rounded-0 bg-white checkout-box letter-spacing"
      >
        <div class="card-body">
          <ul
            class="nav nav-tabs bg-white border-0 rounded-0"
            id="myTab"
            role="tablist"
          >
            <li class="nav-item" role="presentation">
              <button
                class="nav-link fs-14 fs-md-15 fs-lg-16 fw-semibold position-relative border-0 rounded-0 d-block w-100 opacity-50"
                :class="{'active opacity-100' : stepForm === 1}"
                id="selected-order-tab"
                data-bs-toggle="tab"
                data-bs-target="#selected-order-tab-pane"
                type="button"
                role="tab"
                aria-controls="selected-order-tab-pane"
                aria-selected="false"
                @click="updateStepForm(1)"

              >
                <i class="flaticon-shopping-cart"></i>
                Panier
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                  class="nav-link fs-14 fs-md-15 fs-lg-16 fw-semibold position-relative border-0 rounded-0 d-block w-100"
                  :class="{'active' : stepForm === 2}"
                  id="shipping-details-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#shipping-details-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="shipping-details-tab-pane"
                  aria-selected="false"
                  @click="updateStepForm(2)"
              >
                <i class="flaticon-express-delivery"></i>
               Client - Livraison
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link fs-14 fs-md-15 fs-lg-16 fw-semibold position-relative border-0 rounded-0 d-block w-100"
                :class="{'active' : stepForm === 3}"
                id="payment-method-tab"
                data-bs-toggle="tab"
                data-bs-target="#payment-method-tab-pane"
                type="button"
                role="tab"
                aria-controls="payment-method-tab-pane"
                aria-selected="false"
                @click="updateStepForm(3)"
              >
                <i class="flaticon-atm"></i>
               Methode de paiement
              </button>
            </li>

          </ul>
          <div
            class="tab-content p-15 p-sm-20 p-md-25 p-lg-30"
            id="myTabContent"
          >
            <div
              class="tab-pane fade show"
              :class="{'active' : stepForm === 1}"
              id="selected-order-tab-pane"
              role="tabpanel"
              tabindex="0"
            >
              <h5 class="mb-15 mb-md-25 fw-bold text-black">
                Selection du produit
              </h5>
              <form>
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <v-select
                          v-model="productSelected"
                          :options="allProducts"
                          label="name"
                          placeholder="Selectionner un produit"

                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <div
                        class="card mb-25 border-0 rounded-0 bg-white shopping-cart-box letter-spacing"
                    >
                      <div class="card-body">
                        <div class="table-responsive">
                          <table class="table text-nowrap align-middle mb-0">
                            <thead>
                            <tr>
                              <th
                                  scope="col"
                                  class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13"
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
                                Prix
                              </th>

                              <th
                                  scope="col"
                                  class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13"
                              >
                                Ingredient
                              </th>
                              <th
                                  scope="col"
                                  class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13"
                              >
                                Montant total
                              </th>
                              <th
                                  scope="col"
                                  class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 text-end"
                              ></th>
                            </tr>
                            </thead>
                            <tbody>
                            <template v-if="newOrderData.paniers.length > 0">
                            <tr
                                v-for="panier in newOrderData.paniers" :key="panier.product_id.id"
                            >
                              <th class="shadow-none fw-medium text-black product-title">
                                <span

                                    class="d-flex align-items-center text-decoration-none text-black fs-md-15 fs-lg-16"
                                >
                                  <img
                                      :src="panier.product_id.image_urls[0]"
                                      class="me-15"
                                      width="44"
                                      alt="product"
                                  />
                                  {{panier.product_id.name}}
                                </span>
                              </th>
                              <td class="shadow-none lh-1">
                                <div class="number-counter" id="number-counter">
                                  <button type="button" @click="decrementQuantity(panier)">
                                    <i class="flaticon-minus"></i>
                                  </button>
                                  <input
                                      type="number"
                                      id="quantity-1"
                                      v-model="panier.quantity"
                                  />
                                  <button type="button" @click="incrementQuantity(panier)">
                                    <i class="flaticon-plus"></i>
                                  </button>
                                </div>
                              </td>
                              <td class="shadow-none lh-1 fw-medium text-paragraph">
                              {{getTotalPrice(panier.specification_id, panier.quantity)}} CHF
                              </td>
                              <td class="shadow-none lh-1 fw-medium text-paragraph">
                                <a @click="addIgredientToPanier(panier)" class="text-primary fw-medium text-decoration-underline cursor-pointer" type="button" data-bs-toggle="modal" data-bs-target="#contentModalScrollable_ingredient">
                                  {{panier.ingredient.length > 0 ? panier.ingredient.length + ' Ingredients' : 'Aucun ingredient'}}
                                </a>
                              </td>
                              <td class="shadow-none lh-1 fw-medium text-paragraph">
                                {{getTotalListeIngredientPrice(panier.ingredient) + getTotalPrice(panier.specification_id, panier.quantity)}} CHF
                              </td>
                              <td class="shadow-none lh-1">
                                <button
                                    type="button"
                                    class="bg-transparent p-0 border-0 text-paragraph fs-15 fs-md-16 fs-lg-18"
                                    @click="removePanier(panier.product_id)"
                                >
                                  <i class="ph-duotone ph-trash"></i>
                                </button>
                              </td>
                            </tr>
                            </template>
                            <tr v-else>
                              <EmptyTable
                                  message="Aucun produit ajouter au panier pour le moment"
                                  :colspan="8"
                                  textClass="text-muted"
                              />
                            </tr>


                            </tbody>
                          </table>
                        </div>
                        <div>
                          <div class="col-md-12">
                            <div class="form-group mb-15 mb-sm-20 mb-md-25">
                              <label class="d-block text-black fw-semibold mb-10">
                                Type de commande
                              </label>
                              <v-select
                                  v-model="orderTypeSelected"
                                  :options="listeOrderType"
                                  label="libelle"
                                  placeholder="Selectionner type de commande"

                              />
                            </div>
                          </div>
                          <div class="col-md-12">
                            <div class="form-group mb-15 mb-sm-20 mb-md-25">
                              <label class="d-block text-black fw-semibold mb-10">
                                Cuisson
                              </label>
                              <v-select
                                  v-model="orderCuissonTypeSelected"
                                  :options="listeTypeCuisson"
                                  label=""
                                  placeholder="Selectionner type de cuisson"

                              />
                            </div>
                          </div>
                          <div class="col-md-12">
                            <div class="form-check form-switch form-group mb-15 mb-sm-20 mb-md-25">
                              <input class="form-check-input shadow-none me-8" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="orderDemandeCouvert">
                              <label class="form-check-label fw-medium" for="flexSwitchCheckDefault">Demande de couverts</label>
                            </div>
                          </div>
                          <div class="col-md-12" v-if="orderDemandeCouvert">
                            <div class="form-group mb-15 mb-sm-20 mb-md-25">
                              <label class="d-block text-black fw-semibold mb-10">
                               Quantité de couverts
                              </label>
                              <input
                                  type="number"
                                  class="form-control shadow-none rounded-0 text-black"
                                  placeholder="1"
                                  v-model="orderQuantityCouvert"
                              />
                            </div>
                          </div>

                          <div class="col-md-12">
                            <div class="form-check form-switch form-group mb-15 mb-sm-20 mb-md-25">
                              <input class="form-check-input shadow-none me-8" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="orderTrancher">
                              <label class="form-check-label fw-medium" for="flexSwitchCheckDefault">Trancher</label>
                            </div>
                          </div>

                          <div class="col-md-12">
                            <div class="form-group mb-15 mb-sm-20 mb-md-25">
                              <label class="d-block text-black fw-semibold mb-10">
                                Heure de recuperation
                              </label>
                              <input
                                  type="time"
                                  class="form-control shadow-none rounded-0 text-black"
                                  placeholder="1"
                                  v-model="orderHourRecuperation"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <div class="text-end">
                <button
                    class="default-btn transition border-0 fw-medium text-white pt-11 pb-11 ps-25 pe-25 pt-md-12 pb-md-12 ps-md-35 pe-md-35 rounded-1 fs-md-15 fs-lg-16 bg-success"
                    :disabled="newOrderData.paniers.length == 0 && orderTypeSelected === null"
                    :class="{ 'opacity-50 cursor-not-allowed': newOrderData.paniers.length == 0 && orderTypeSelected === null  }"
                    @click="nextStep"
                >
                  Suivant
                </button>
              </div>
            </div>
            <div
                class="tab-pane fade show"
                :class="{'active' : stepForm === 2}"
                id="shipping-details-tab-pane"
                role="tabpanel"
                tabindex="0"
            >
              <h5 class="mb-15 mb-md-25 fw-bold text-black">
                Informations du client
              </h5>
              <form>
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <v-select
                          v-model="newOrderData.civilite"
                          :options="allCivites"
                          label=""
                          placeholder="Civilité"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                       Prenom
                      </label>
                      <input
                          type="text"
                          class="form-control shadow-none rounded-0 text-black"
                          placeholder="e.g. Jane"
                          v-model="newOrderData.guest_first_name"
                          @change="(event) => handleInput(event, 'guest_first_name')"
                          :class="{ 'is-valid': validTextField(newOrderData.guest_first_name) }"
                          required
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                       Nom
                      </label>
                      <input
                          type="text"
                          class="form-control shadow-none rounded-0 text-black"
                          placeholder="e.g. Ronan"
                          v-model="newOrderData.guest_last_name"
                          @change="(event) => handleInput(event, 'guest_last_name')"
                          :class="{ 'is-valid': validTextField(newOrderData.guest_last_name) }"
                          required
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        Email
                      </label>
                      <input
                          type="email"
                          class="form-control shadow-none rounded-0 text-black"
                          placeholder="e.g. jane3602@gmail.com"
                          v-model="newOrderData.guest_email"
                          @change="(event) => handleInput(event, 'guest_email')"
                          :class="{ 'is-valid': validTextField(newOrderData.guest_email) }"
                          required
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        Numéro téléphone
                      </label>
                      <input
                          type="text"
                          class="form-control shadow-none rounded-0 text-black"
                          placeholder="e.g. +1-829-3456"
                          v-model="newOrderData.guest_phone_number"
                          @change="(event) => handleInput(event, 'guest_phone_number')"
                          :class="{ 'is-valid': validTextField(newOrderData.guest_phone_number) }"
                          required
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        Ville
                      </label>
                      <v-select
                          v-model="villeSelected"
                          :options="allPostalCode"
                          label="ville"
                          :reduce="postal => postal.ville"
                          placeholder="Penthaz"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        Adresse de livraison
                      </label>
                      <input
                          type="text"
                          class="form-control shadow-none rounded-0 text-black"
                          placeholder="e.g. au 24eme penth"
                          v-model="newOrderData.addressLivraison"
                          @change="(event) => handleInput(event, 'addressLivraison')"
                          :class="{ 'is-valid': validTextField(newOrderData.addressLivraison) }"
                          required
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                       Rue
                      </label>
                      <input
                          type="text"
                          class="form-control shadow-none rounded-0 text-black"
                          placeholder="e.g. au 24eme"
                          v-model="newOrderData.rue"
                          @change="(event) => handleInput(event, 'rue')"
                          :class="{ 'is-valid': validTextField(newOrderData.rue) }"
                          required
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        Batiment
                      </label>
                      <input
                          type="text"
                          class="form-control shadow-none rounded-0 text-black"
                          placeholder="e.g. au 24eme"
                          v-model="newOrderData.batiment"
                          @change="(event) => handleInput(event, 'batiment')"
                          :class="{ 'is-valid': validTextField(newOrderData.batiment) }"
                          required
                      />
                    </div>
                  </div>

                </div>
              </form>
              <div class="d-sm-flex align-items-center justify-content-between">
                <span
                    @click="previousStep"
                    class="d-inline-block mb-12 mb-sm-0 fs-14 fs-md-15 fs-lg-16 fw-medium text-decoration-none cursor-pointer"
                >
                  <i
                      class="flaticon-left-arrow lh-1 me-5 position-relative top-2"
                  ></i>
                  Retour
                </span>
                <button
                    class="default-btn transition border-0 fw-medium text-white pt-11 pb-11 ps-25 pe-25 pt-md-12 pb-md-12 ps-md-35 pe-md-35 rounded-1 fs-md-15 fs-lg-16 bg-success"
                    :disabled="!isFormValid"
                    :class="{'opacity-50 cursor-not-allowed': !isFormValid }"
                    @click="nextStep"
                >
                  Enregistrer & Suivant
                  <i
                      class="flaticon-right-arrow position-relative ms-5 top-2"
                  ></i>
                </button>
              </div>
            </div>
            <div
              class="tab-pane fade show"
              :class="{'active' : stepForm === 3}"
              id="payment-method-tab-pane"
              role="tabpanel"
              tabindex="0"
            >
              <h5 class="mb-15 mb-md-25 fw-bold text-black">
                Methode de paiement
              </h5>
              <div class="accordion" id="paymentAccordion">
                <div class="accordion-item rounded-0" v-if="methodePaiementDefault">
                  <button
                    class="accordion-button text-black fs-14 fs-md-15 fs-lg-16 fw-semibold shadow-none border-0 rounded-0 bg-white d-flex align-items-center justify-content-between"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#paymentCollapseOne"
                    aria-expanded="true"
                    aria-controls="paymentCollapseOne"
                  >
                    <span class="dot"></span>
                    {{methodePaiementDefault.libelle}}
                    <div class="payment-types">
                      <img
                        :src="methodePaiementDefault.icone"
                        width="50px"
                        height="auto"
                        alt="mastercard"
                      />

                    </div>
                  </button>
                  <div
                    id="paymentCollapseOne"
                    class="accordion-collapse collapse show"
                    data-bs-parent="#paymentAccordion"
                  >

                  </div>
                </div>

              </div>
              <div
                class="mt-15 mt-sm-20 mt-md-25 d-sm-flex align-items-center justify-content-between"
              >
                <button
                  type="button"
                  class="d-inline-block fs-14 fs-md-15 fs-lg-16 fw-medium text-decoration-none bg-transparent p-0 border-0 text-primary mb-12 mb-sm-0"
                  @click="previousStep"
                >
                  <i
                    class="flaticon-left-arrow lh-1 me-5 position-relative top-2"
                  ></i>
                  Retour
                </button>
                <LoaderComponent
                    v-if="isLoading"
                />
                <button v-else
                  class="default-btn transition border-0 fw-medium text-white pt-11 pb-11 ps-25 pe-25 pt-md-12 pb-md-12 ps-md-35 pe-md-35 rounded-1 fs-md-15 fs-lg-16 bg-success"
                  :disabled="newOrderData.paniers.length === 0 && !isFormValid"
                  :class="{ 'opacity-50 cursor-not-allowed': newOrderData.paniers.length === 0 && !isFormValid }"

                  @click="createNewOrder"
                >
                 Commander maintenant
                  <i
                    class="flaticon-right-arrow position-relative ms-5 top-2"
                  ></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="col-xxl-4">
      <div
        class="card mb-25 border-0 rounded-0 bg-white order-summary-box letter-spacing"
      >
        <div class="card-head bg-white d-flex align-items-center">
          <i class="flaticon-document text-info"></i>
          <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">
           Recapitulatif<span class="text-paragraph"> ({{newOrderData.paniers.length}} produit(s))</span>
          </h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table text-nowrap align-middle mb-0">
              <tbody>
              <template v-if="newOrderData.paniers.length > 0">
                <tr
                    v-for="panier in newOrderData.paniers" :key="panier.product_id.id"
                >
                  <th
                    class="shadow-none fw-medium text-black product-title ps-0"
                  >
                    <span
                      class="d-flex align-items-center text-decoration-none text-black fs-md-15 fs-lg-16"
                    >
                      <img
                        :src="panier.product_id.image_urls[0]"
                        class="me-15"
                        width="44"
                        alt="product"
                      />
                      <span
                        >{{panier.product_id.name}}
                        <span class="fs-12 fw-medium text-muted">x{{panier.quantity}}</span></span
                      >
                    </span>
                  </th>
                  <td
                    class="shadow-none lh-1 fw-medium text-paragraph text-end pe-0"
                  >
                    {{getTotalListeIngredientPrice(panier.ingredient) + getTotalPrice(panier.specification_id, panier.quantity)}} CHF
                  </td>
                </tr>

              </template>

              </tbody>
            </table>
          </div>
          <ul class="order-summary-list ps-0 mb-0 list-unstyled">
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                Total
              </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
               {{getTotalPriceForAllPanier}} CHF
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
              <span class="d-block text-paragraph fw-medium">
                TVA
              </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                CHE - 372.776.093 TVA
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Total </span>
              <span class="d-block text-primary fs-md-15 fs-lg-16 fw-bold">
                {{getTotalPriceForAllPanier}} CHF
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="contentModalScrollable_productSize" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content flex-column justify-content-center  ">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Choisissez la taille</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body flex-row align-items-center justify-content-center d-flex justify-content-center align-items-center">
            <div class="flex-column d-flex justify-content-center align-items-center">
              <div class="table-responsive">
                <table class="table text-nowrap align-middle mb-0">
                  <thead class="bg-success text-white">
                  <tr>
                    <th
                        scope="col"
                        class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
                    >
                      TAILLE
                    </th>
                    <th
                        scope="col"
                        class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
                    >
                      PRIX
                    </th>

                    <th
                        scope="col"
                        class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
                    >
                      ACTION
                    </th>

                  </tr>
                  </thead>
                  <tbody v-if="productSelected && productSelected.productSizes.length > 0">
                  <tr
                      v-for="productSize in productSelected.productSizes" :key="productSize.id"
                  >
                    <th class="shadow-none lh-1 fw-bold ps-0">
                    <span
                        class="text-decoration-none text-black-emphasis"
                    >
                      {{productSize.size}}
                    </span>
                    </th>
                    <td  class="shadow-none lh-1 fw-medium">
                      <span class="badge text-outline-danger">{{productSize.price}} CHF</span>
                    </td>

                    <td class="shadow-none lh-1 fw-medium text-body-tertiary">
                      <button @click="addPanier(productSelected, productSize)"
                              class="btn btn-danger btn-sm " type="button"
                             data-bs-dismiss="modal" aria-label="Close"
                      >
                        Choisir
                      </button>
                    </td>

                  </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="contentModalScrollable_ingredient" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content flex-column justify-content-center  ">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Selectionner les ingredients supplémentaire</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="flex-column">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group mb-15 mb-sm-20 mb-md-25">
                    <v-select
                        v-model="ingredientSelected"
                        :options="allIngredient"
                        label="name"
                        placeholder="Selectionner un ingredient"

                    />
                  </div>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table text-nowrap align-middle mb-0">
                  <thead class="bg-success text-white">
                  <tr>
                    <th
                        scope="col"
                        class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0"
                    >
                      NOM
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
                  <tbody v-if="panierSelected && panierSelected.ingredient.length > 0">
                  <tr
                      v-for="ingredient in panierSelected?.ingredient" :key="ingredient.id"
                  >
                    <th class="shadow-none lh-1 fw-bold ps-0">
                    <span
                        class="text-decoration-none text-black-emphasis"
                    >
                      <img
                          :src="ingredient.imageUrl"
                          class="me-15"
                          width="44"
                          alt=""
                      />
                      {{ingredient.name}}
                    </span>
                    </th>
                    <td  class="shadow-none lh-1 fw-medium">
                      <span class="badge text-outline-danger">{{ingredient.type ?? '-'}}</span>
                    </td>

                    <td class="shadow-none lh-1">
                      <div class="number-counter" id="number-counter">
                        <button type="button" @click="decrementQuantityIngredient(panierSelected, ingredient)">
                          <i class="flaticon-minus"></i>
                        </button>
                        <input
                            type="number"
                            id="quantity-1"
                            v-model="ingredient.quantite"
                            min="1"
                            max="100"
                        />
                        <button type="button" @click="incrementQuantityIngredient(panierSelected, ingredient)">
                          <i class="flaticon-plus"></i>
                        </button>
                      </div>
                    </td>

                    <td  class="shadow-none lh-1 fw-medium">
                      <span class="badge text-outline-danger">{{getTotalIngredientPrice(ingredient) ?? '-'}} CHF</span>
                    </td>


                    <td class="shadow-none lh-1 fw-medium text-body-tertiary">
                      <button @click="removeIngredientFromCart(panierSelected, ingredient)"
                              class="btn btn-danger btn-sm " type="button"

                      >
                        Retirer
                      </button>
                    </td>

                  </tr>
                  </tbody>
                  <tbody v-else>
                  <tr>
                    <EmptyTable
                        message="Aucun ingredient ajouter pour le moment"
                        :colspan="8"
                        textClass="text-muted"
                    />
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="d-flex justify-content-center align-items-center mt-8">
                <button @click="seeValue" class="btn btn-primary btn-sm" type="button"
                        data-bs-dismiss="modal" aria-label="Close">
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>




  </div>
</template>

<script lang="ts">
import LoaderComponent from "@/components/Loading/Loader.vue";
import {
  createNewOrder,
  fetchAllPostalCode,
  listeIngredient,
  listeMethodePaiement,
  listeOrderType,
  listeProducts
} from "@/service/api";
import {useToast} from "vue-toastification";
import {CartModel} from "@/models/cart.model";
import {InstructionOrderModel} from "@/models/intructionOrder.model";
import {NewOrderModel} from "@/models/newOrder.model";
import {
  ApiResponse,
  PaginatedIngredient,
  PaginatedMethodePaiement,
  PaginatedOrderType,
  PaginatedProduct
} from "@/models/Apiresponse";
import {IngredientModel} from "@/models/ingredient.model";
import {ProductModel} from "@/models/product.model";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import {Modal} from 'bootstrap';
import {defineComponent} from "vue";
import {ProductSizesModel} from "@/models/productSizes.model";
import {OrderTypeModel} from "@/models/orderType.model";
import {CodepostalModel} from "@/models/codepostal.model";
import {MethodePaiementModel} from "@/models/methodePaiement.model";
import {OrderModel} from "@/models/order.model";

export default defineComponent({
  name: "VabeneAddOrder",
  components: {
    EmptyTable,
    LoaderComponent
    // ImageUpload,
  },
  data(){
    return{
      productSelected: null as ProductModel | null,
      previousProductSelected: null as ProductModel | null,
      productQuantity: "1" as string | "1",
      productResponse: null as ApiResponse<PaginatedProduct> | null,
      originalProducts: [] as ProductModel[],
      currentPage: 1 ,
      searchQuery: '', // Ajout du champ de recherche
      newOrderData: {
        paniers : [] as CartModel[],
        userID: '',
        guest_first_name: '',
        guest_last_name: '',
        civilite: '',
        guest_email: '',
        guest_phone_number: '',
        order_type: '',
        payment_method: '',
        ville: '',
        addressLivraison: '',
        batiment: 'Suisse',
        rue: '',
        intructionOrder: [] as InstructionOrderModel[],
      },
      isLoading: false,
      ingredientResponse: null as ApiResponse<PaginatedIngredient> | null,
      originalIngredients: [] as IngredientModel[], // Stockage des utilisateurs originaux
      searchIngredientQuery: '', // Ajout du champ de recherche
      ingredientSelected: null as IngredientModel | null,
      panierSelected: null as CartModel | null,
      listeOrderType: [] as OrderTypeModel[],
      orderTypeSelected: null as OrderTypeModel | null,
      orderCuissonTypeSelected: 'Normal' as string | 'Normal',
      listeTypeCuisson: ["Normal", "Saignant", "À point", "Bien cuit"] as string[],
      orderDemandeCouvert: false as boolean,
      orderQuantityCouvert: 1 as number,
      orderTrancher: false as boolean,
      orderHourRecuperation: '' as string | '',
      stepForm: 1 as number | number,
      allCivites: ["Monsieur", "Madame"],
      allPostalCode: [] as CodepostalModel[],
      listeMethode: [] as MethodePaiementModel[],
      methodePaiementDefault: null as MethodePaiementModel | null,
      villeSelected: null as  string | null,
      simplyPanier: []
    }
  },
  methods: {
    getMethodePaiementParType(
        liste: MethodePaiementModel[],
        type: string
    ): MethodePaiementModel | undefined{
      console.log(liste)
      console.log(type)
      return liste.find(methode => methode.type === type);
    },
    async fetchListeMethodePaiement(page = 1) {
      // this.isLoading = true;
      try {
        const response = await listeMethodePaiement(page) as ApiResponse<PaginatedMethodePaiement>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            this.listeMethode = response.data.items;
            this.methodePaiementDefault = this.getMethodePaiementParType(this.listeMethode, "Cash_livraison") as MethodePaiementModel
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
    updateStepForm(value: number){
      this.stepForm = value
    },
    async fetchPostalCode() {
      this.isLoading = true;
      try {
        const response = await fetchAllPostalCode();
        console.log(response);
        if (response.code === 200) {
          const postals = response.data as CodepostalModel[];
          this.allPostalCode = [...postals].sort((a, b) => {
            return a.ville.localeCompare(b.ville);
          })
        } else {
          this.toast.error(response.message)
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    nextStep(){
      if(this.stepForm === 1 && this.newOrderData.intructionOrder.length === 0 && this.orderTypeSelected){
        const newInstructionOrder: InstructionOrderModel = {
          demandeCouverts: this.orderDemandeCouvert,
          quantityCouverts: `${this.orderQuantityCouvert}`,
          delaiRecuperation: this.orderHourRecuperation,
          isTrancher: this.orderTrancher,
          cuisson: this.orderTypeSelected.type
        }
        this.newOrderData.intructionOrder.push(newInstructionOrder)
      }
      this.stepForm += 1
    },
    previousStep(){
      if(this.stepForm > 1){
        this.stepForm -= 1
      }
    },
    seeValue(){
      console.log("potential payload: ", this.newOrderData)
    },
    addIgredientToPanier(panier: CartModel){
      if(!panier) return;
      this.panierSelected = panier
    },
    incrementQuantity(panier: CartModel) {
      panier.quantity += 1;
    },
    decrementQuantity(panier: CartModel) {
      if (panier.quantity > 1) {
        panier.quantity -= 1;
      }
    },
    addPanier(productSelected: ProductModel, size: ProductSizesModel) {
      if (!productSelected || !size) return;

      const quantity = parseInt(this.productQuantity);
      if (isNaN(quantity) || quantity <= 0) {
        this.toast.error("Quantité invalide.");
        return;
      }

      const panier: CartModel = {
        product_id: productSelected,
        specification_id: size,
        quantity: quantity,
        ingredient: [] // Tu peux ajouter les ingrédients ici si nécessaire
      };

      const ps = {
        product_id: productSelected.id,
        specification_id: size.id,
        quantity: quantity,
        ingredient: []
      }

      this.newOrderData.paniers.push(panier);
      (this.simplyPanier as any[]).push(ps);
      // Optionnel : réinitialiser la sélection après ajout
      this.productSelected = null;
      this.previousProductSelected = null;
      this.productQuantity = "1";

    },
    removePanier(productToRemove: ProductModel) {
      if (!productToRemove) return;
      const index = this.newOrderData.paniers.findIndex(
          panier => panier.product_id.id === productToRemove.id
      );

      const indexSimply = this.simplyPanier.findIndex(
          (panier) => (panier as any).product_id === productToRemove.id
      );


      if (index !== -1) {
        this.newOrderData.paniers.splice(index, 1);
        this.simplyPanier.slice(indexSimply, 1)
        console.log("Produit supprimé du panier.")
      } else {
        console.log("Ce produit n'est pas dans le panier.")
      }
    },
    incrementQuantityIngredient(panier: CartModel, ingredient: IngredientModel) {
      const cart = this.newOrderData.paniers.find(pan => pan.product_id.id === panier.product_id.id);
      const simplyCart = (this.simplyPanier as any[]).find((pan) => pan.product_id.id === panier.product_id.id)

      if (cart && simplyCart) {
        const ingredientFinded = cart.ingredient.find(ing => ing.id === ingredient.id);
        const ingredientSimplyFinded = simplyCart.ingredient.find(ing => ing.id === ingredient.id);

        if (ingredientFinded && ingredientSimplyFinded) {
          // Incrémente la quantité actuelle
          ingredientFinded.quantite = (ingredientFinded.quantite || 1) + 1;
          ingredientSimplyFinded.quantite = (ingredientFinded.quantite || 1) + 1;
        } else {
          // Ajoute l'ingrédient avec une quantité de 1 s'il n'existe pas encore
          ingredient.quantite = 1;
          simplyCart.ingredient.push(ingredientSimplyFinded);
          cart.ingredient.push(ingredient);
        }
        console.log("Ingredient added: ", ingredientSimplyFinded)
      } else {
        console.warn(`Aucun panier trouvé avec le product_id: ${panier.product_id.id}`);
      }

    },
    decrementQuantityIngredient(panier: CartModel, ingredient: IngredientModel) {
      let  index = ingredient.quantite
      if (index> 1) {
        index -= 1;
      }
      const cart = this.newOrderData.paniers.find(pan => pan.product_id.id === panier.product_id.id);
      const simplyCart = (this.simplyPanier as any[]).find(pan => pan.product_id === panier.product_id.id);
      if(cart && simplyCart){
        // Vérifie si l'ingrédient n'existe pas déjà (optionnel)
        const exists = cart.ingredient.some(ing => ing.id === ingredient.id);
        const existSimplyCart = simplyCart.ingredient.some(ing => ing.id === ingredient.id);
        const ingredientFinded = cart.ingredient.find(ing => ing.id === ingredient.id)
        const symplyIngredientFinded = simplyCart.ingredient.find(ing => ing.id === ingredient.id)
        if (!exists && existSimplyCart) {
          ingredient.quantite = index
          cart.ingredient.push(ingredient);
          simplyCart.ingredient.push(ingredient)
        }
        else{
          if(ingredientFinded){
            ingredientFinded.quantite = index
            symplyIngredientFinded.quantite = index
          }
        }
        console.log("Ingredient added: ", symplyIngredientFinded)

      }
      else{
        console.warn(`Aucun panier trouvé avec le product_id: ${panier.product_id.id}`);
      }

    },
    removeIngredientFromCart(panier: CartModel, ingredient: IngredientModel) {
      const cart = this.newOrderData.paniers.find(p => p.product_id.id === panier.product_id.id);
      const simplyCart = (this.simplyPanier as any[]).find(pan => pan.product_id === panier.product_id.id);

      if (cart && simplyCart) {
        cart.ingredient = cart.ingredient.filter(ing => ing.id !== ingredient.id);
        simplyCart.ingredient = simplyCart.ingredient.filter(ing => ing.id !== ingredient.id);
      }
    },
    clearData(){
      this.newOrderData = {} as NewOrderModel
    },
    goBack() {
      this.$router.back()
    },
    async createNewOrder() {
      this.isLoading = true;
      const payload = {
        "paniers": this.simplyPanier,
        "userID": "",
        "guest_first_name": this.newOrderData.guest_first_name,
        "guest_last_name": this.newOrderData.guest_last_name,
        "civilite": this.newOrderData.civilite,
        "guest_email": this.newOrderData.guest_email,
        "guest_phone_number": this.newOrderData.guest_phone_number,
        "order_type": this.newOrderData.order_type,
        "payment_method": "Cash_livraison",
        "addressLivraison": `${this.newOrderData.ville} - ${this.newOrderData.addressLivraison}`,
        "batiment": this.newOrderData.batiment,
        "rue": this.newOrderData.rue,
        "intructionOrder": this.newOrderData.intructionOrder
      }
      console.log("payload create order: ", payload)
      try {
        const response = await createNewOrder(payload);
        console.log(response);
        if (response.code === 201) {
          const order = response.data as OrderModel;
          this.toast.success(response.message)
          this.$router.push({
            name: "VabeneOrderDetailsPage",
            params: { commandeID: order.id }
          });

        } else {
          this.toast.error(response.message)
        }
      } catch (error) {
        this.toast.error(error)
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchIngredients(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeIngredient(page) as ApiResponse<PaginatedIngredient>;
        console.log(response)
        if (response.code === 200) {
          this.ingredientResponse = response;
          if (response.data?.items) {
            this.originalIngredients = response.data.items;
          }
          if (response.data && response.data.pagination) {
            this.currentPage = response.data.pagination.current_page;
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchProduct(page = 1, filter: string) {
      const payload = {
        "codePostal": "",
        "categorieID": ""
      }
      this.isLoading = true;
      try {
        const response = await listeProducts(page, filter, payload) as ApiResponse<PaginatedProduct>;
        console.log(response)
        if (response.code === 200) {
          this.productResponse = response;
          if (response.data?.items) {
            this.originalProducts = response.data.items;
          }
          if (response.data && response.data.pagination) {
            this.currentPage = response.data.pagination.current_page;
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    handleInput(event, type) {
      console.log("Valeur en temps réel :", event.target.value);
      const valueText = event.target.value;
      switch (type){
        case 'guest_first_name':
          this.newOrderData.guest_first_name = valueText
          this.validTextField(valueText)
          break
        case 'guest_last_name':
          this.newOrderData.guest_last_name = valueText
          this.validTextField(valueText)
          break
        case 'guest_email':
          this.newOrderData.guest_email = valueText
          this.validEmail(valueText)
          break

        case 'guest_phone_number':
          this.newOrderData.guest_phone_number = valueText
          this.validTextField(valueText)
          break

        case 'addressLivraison':
          this.newOrderData.addressLivraison = valueText
          this.validTextField(valueText)
          break

        case 'rue':
          this.newOrderData.rue = valueText
          this.validTextField(valueText)
          break

        case 'batiment':
          this.newOrderData.batiment = valueText
          this.validTextField(valueText)
          break


      }
    },
    validEmail(email) {
      if(email){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim())
      }
    },
    validPassword(password){
      if (password){
        return password.trim().length > 0
      }
    },
    validTextField(text){
      if (text){
        return text.trim().length > 0
      }
    },
    async fetchOrderType(page = 1) {
      // this.isLoading = true;
      try {
        const response = await listeOrderType(page) as ApiResponse<PaginatedOrderType>;
        console.log(response)
        if (response.code === 200) {
          if (response.data?.items) {
            this.listeOrderType = response.data.items;
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

  },
  computed: {
    allIngredient(): IngredientModel[] {
      const ingredients = this.ingredientResponse?.data?.items || this.originalIngredients;
      if (!this.searchIngredientQuery) return ingredients;

      const query = this.searchIngredientQuery.toLowerCase();
      return ingredients.filter(ingredient => {
        return (
            (ingredient.name?.toLowerCase().includes(query))
        );
      });
    },
    getTotalPriceForAllPanier(){
      let totalPrice = 0
      if(this.newOrderData.paniers.length > 0){
        for(let i = 0; i < this.newOrderData.paniers.length; i++){
          totalPrice += this.getTotalListeIngredientPrice(this.newOrderData.paniers[i].ingredient) + this.getTotalPrice(this.newOrderData.paniers[i].specification_id, this.newOrderData.paniers[i].quantity)
        }
        return totalPrice
      }
      return 0
    },
    getTotalPrice() {
      return (product: ProductSizesModel, quantity: number) => {
        const prix = parseFloat(product.price)
        const total = prix * quantity
        return Math.round(total * 100) / 100;
      }
    },
    getTotalListeIngredientPrice() {
      return (ingredients: IngredientModel[]) => {
        if (!ingredients || ingredients.length === 0) return 0;

        const total = ingredients.reduce((acc, ingredient) => {
          const prix = ingredient.extra_cost_price || 0;
          const quantite = ingredient.quantite || 0;
          return acc + (prix * quantite);
        }, 0);

        // Arrondi au centième
        return Math.round(total * 100) / 100;
      };
    },
    getTotalIngredientPrice() {
      return (ingredient: IngredientModel) => {
        if (!ingredient.quantite || !ingredient.extra_cost_price) return 0;

        const prix = ingredient.extra_cost_price;
        const quantity = ingredient.quantite;
        const total = prix * quantity;

        // Arrondi au centième
        return Math.round(total * 100) / 100;
      };
    },
    allProducts(): ProductModel[] {
      const products = this.productResponse?.data?.items || this.originalProducts;
      // On copie et on trie la liste
      const sortedProducts = [...products].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      if (!this.searchQuery) return sortedProducts;
      const query = this.searchQuery.toLowerCase();
      // Filtrer après le tri
      return sortedProducts.filter(product =>
          product.name?.toLowerCase().includes(query)
      );
    },
    isFormValid() {
      return (
          this.validEmail(this.newOrderData.guest_email) &&
          this.validTextField(this.newOrderData.guest_first_name) &&
          this.validTextField(this.newOrderData.guest_last_name) &&
          this.validTextField(this.newOrderData.guest_phone_number) &&
          this.validTextField(this.newOrderData.addressLivraison) &&
          this.validTextField(this.newOrderData.rue) &&
          this.validTextField(this.newOrderData.batiment)
      );
    }
  },
  watch: {
    orderTypeSelected(this: any, newVal){
      if (!newVal) return
      const newValue = newVal as OrderTypeModel
      this.newOrderData.order_type = newValue.type
    },
    villeSelected(this: any, newVal) {
      if (!newVal) return
      this.newOrderData.ville = newVal
    },
    productSelected(this: any, newVal) {
      if (!newVal || this.previousProductSelected?.name === newVal.name) return
      this.previousProductSelected = newVal
      const modalEl = document.getElementById('contentModalScrollable_productSize')
      if (modalEl) {
        const modal = new Modal(modalEl)
        modal.show()
      }
    },
    ingredientSelected(this: any, newVal) {
      if (!newVal) return
      this.ingredientSelected = newVal
      const cart = this.newOrderData.paniers.find(pan => pan.product_id.id === this.panierSelected.product_id.id);
      const simplyCart = (this.simplyPanier as any[]).find(pan => pan.product_id === this.panierSelected.product_id.id);
      if(simplyCart && this.ingredientSelected){
        // Vérifie si l'ingrédient n'existe pas déjà (optionnel)
        const exists = simplyCart.ingredient.some(ing => ing.id === this.ingredientSelected?.id);
        if (!exists) {
          const ing = {
            "name": this.ingredientSelected.name,
            "extra_cost_price": this.ingredientSelected.extra_cost_price,
            "isDefault": false,
            "quantite": this.ingredientSelected.quantite ?? 1
          }
          simplyCart.ingredient.push(ing);
          console.log("Ingredient added: ", this.simplyCart)
        }
        else{
          console.warn(`Ce ingredient existe deja dans ce panier: ${this.ingredientSelected?.name}`);
        }
      }
      if(cart && this.ingredientSelected){
        // Vérifie si l'ingrédient n'existe pas déjà (optionnel)
        const exists = cart.ingredient.some(ing => ing.id === this.ingredientSelected?.id);
        if (!exists) {
          const ing = {
            "name": this.ingredientSelected.name,
            "extra_cost_price": this.ingredientSelected.extra_cost_price,
            "isDefault": false,
            "quantite": this.ingredientSelected.quantite ?? 1
          }
          cart.ingredient.push(ing);
          this.ingredientSelected = null
        }
        else{
          console.warn(`Ce ingredient existe deja dans ce panier: ${this.ingredientSelected?.name}`);
        }
      }
      else{
        console.warn(`Aucun panier trouvé avec le product_id: ${this.panierSelected.product_id.id}`);
      }
    }
  },
  setup: () => {
    const toast = useToast();

    return { toast };
  },
  mounted() {
    this.fetchProduct(1, "active");
    this.fetchIngredients(1)
    this.fetchOrderType(1)
    this.fetchPostalCode()
    this.fetchListeMethodePaiement(1)
  }
});
</script>