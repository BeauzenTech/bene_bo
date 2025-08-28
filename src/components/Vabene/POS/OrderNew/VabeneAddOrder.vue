<template>

  <div class="row">
    <div class="col-xxl-8">
      <div class="card mb-25 border-0 rounded-0 bg-white checkout-box letter-spacing">
        <div class="card-body">
          <ul class="nav nav-tabs bg-white border-0 rounded-0" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link fs-14 fs-md-15 fs-lg-16 fw-semibold position-relative border-0 rounded-0 d-block w-100 opacity-50"
                :class="{ 'active opacity-100': stepForm === 1 }" id="selected-order-tab" data-bs-toggle="tab"
                data-bs-target="#selected-order-tab-pane" type="button" role="tab"
                aria-controls="selected-order-tab-pane" aria-selected="false" @click="updateStepForm(1)">
                <i class="flaticon-shopping-cart"></i>
                Panier
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link fs-14 fs-md-15 fs-lg-16 fw-semibold position-relative border-0 rounded-0 d-block w-100 opacity-50"
                :class="{ 'active opacity-100': stepForm === 2 }" id="selected-order-tab" data-bs-toggle="tab"
                data-bs-target="#selected-order-tab-pane" type="button" role="tab"
                aria-controls="selected-order-tab-pane" aria-selected="false" @click="updateStepForm(2)">
                <i class="flaticon-user-3"></i>
                Information générale
              </button>
            </li>


          </ul>
          <div class="tab-content p-15 p-sm-20 p-md-25 p-lg-30" id="myTabContent">
            <div class="tab-pane fade show" :class="{ 'active': stepForm === 1 }" id="selected-order-tab-pane"
              role="tabpanel" tabindex="0">
              <form v-if="stepForm === 1">
                <div>
                  <div class="row" v-if="newOrderData.paniers.length > 0">
                    <div class="col-12">
                      <div class="card mb-25 border-0 rounded-0 bg-white order-summary-box letter-spacing">

                        <div class="card-body">
                          <div class="table-responsive">
                            <table class="table text-nowrap align-middle mb-0">
                              <thead>
                                <tr>
                                  <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13">
                                    Nom du produit
                                  </th>
                                  <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13">
                                    Quantité
                                  </th>
                                  <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13">
                                    Prix
                                  </th>

                                  <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13">
                                    Ingredient
                                  </th>
                                  <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13">
                                    Montant total
                                  </th>
                                  <th scope="col"
                                    class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 text-end"></th>
                                </tr>
                              </thead>
                              <tbody>
                                <template v-if="newOrderData.paniers.length > 0">
                                  <tr v-for="panier in newOrderData.paniers" :key="panier.product_id.id">
                                    <th class="shadow-none fw-medium text-black product-title">
                                      <span
                                        class="d-flex align-items-center text-decoration-none text-black fs-md-15 fs-lg-16">
                                        <img :src="panier.product_id.image_urls[0]" class="me-15" width="44"
                                          alt="product" />
                                        {{ panier.product_id.name }}
                                      </span>
                                    </th>
                                    <td class="shadow-none lh-1">
                                      <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                                        <button type="button" id="decrementBtn"
                                          class="px-2 text-success text-decoration-none border-0"
                                          @click="decrementQuantity(panier)">
                                          -
                                        </button>

                                        <span class="text-success fs-15 mx-2">{{ panier.quantity }}</span>

                                        <button type="button" id="incrementBtn"
                                          class="px-2 text-success text-decoration-none border-0"
                                          @click="incrementQuantity(panier)">
                                          +
                                        </button>
                                      </div>
                                    </td>
                                    <td class="shadow-none lh-1 fw-medium text-paragraph">
                                      {{ getTotalPrice(panier.specification_id, panier.quantity) }} CHF
                                    </td>
                                    <td class="shadow-none lh-1 fw-medium text-paragraph">
                                      <button @click="addIgredientToPanier(panier)"
                                        class="btn btn-success text-white fw-medium " type="button"
                                        data-bs-toggle="modal" data-bs-target="#contentModalScrollable_ingredient">
                                        {{ panier.ingredient.length > 0 ? panier.ingredient.length + ' Ingrédients' :
                                        'Ajouter un ingrédient'}}
                                      </button>
                                    </td>
                                    <td class="shadow-none lh-1 fw-medium text-paragraph">
                                      {{ getTotalListeIngredientPrice(panier.ingredient) +
                                        getTotalPrice(panier.specification_id, panier.quantity)}} CHF
                                    </td>
                                    <td class="shadow-none lh-1">
                                      <button type="button"
                                        class="bg-transparent p-0 border-0 text-paragraph fs-15 fs-md-16 fs-lg-18"
                                        @click="removePanier(panier.product_id)">
                                        <i class="ph-duotone ph-trash"></i>
                                      </button>
                                    </td>
                                  </tr>
                                </template>
                                <tr v-else>
                                  <EmptyTable message="Aucun produit ajouter au panier pour le moment" :colspan="8"
                                    textClass="text-muted" />
                                </tr>


                              </tbody>
                            </table>
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group  position-relative transition">
                      <v-select v-model="categorieSelected" :options="originalCategories" label="name"
                        :reduce="categorie => categorie.id" placeholder="Filtrer par categorie" />
                    </div>
                  </div>
                  <div class="col-md-8">
                    <div class="border border-1 border-gray-200 rounded-0 bg-white checkout-box">
                      <input v-model="searchQuery" type="text"
                        class="form-control shadow-none text-black rounded-0 border-0"
                        placeholder="Rechercher un produit" @input="currentPage = 1" />
                    </div>
                  </div>

                </div>
                <loader-component v-if="isLoading" class="mt-50" />
                <div v-else class="col-lg-12" v-for="(groupe, index) in produitsParTrois" :key="index">
                  <div class="row">
                    <div class="col-lg-3" v-for="(produit, i) in groupe" :key="i">
                      <!-- ✅ Ta carte produit ici -->
                      <div class="card mb-25 border-0 rounded-0 bg-white single-product-box">
                        <div
                          class="card-body p-0 letter-spacing flex justify-content-center items-center align-items-center">
                          <div class="image position-relative">
                            <a href="#" class="d-block">
                              <img :src="produit.image_urls[0]" alt="product" />
                            </a>

                          </div>
                          <div class="content p-20">
                            <h4 class="text-center mb-10 fw-semibold fs-16 fs-lg-18">
                              <a href="#" class="text-decoration-none text-black">
                                {{ produit.name }}
                              </a>
                            </h4>

                            <div class="mt-10 text-center mb-10 fw-semibold fs-16 fs-lg-18">
                              <span class="text-primary text-center fw-bold fs-md-15 fs-lg-16">Existe en
                                {{ produit.productSizes.length }}
                                taille(s)</span>
                            </div>
                            <button type="button"
                              class="add-to-cart-btn text-center d-block mt-15 fw-medium transition w-100 rounded-1 position-relative"
                              @click="chooseProduct(produit)">
                              Choisir
                              <i class="flaticon-shopping-cart-2 transition"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

            </div>
            <div class="tab-pane fade show" :class="{ 'active': stepForm === 2 }" id="shipping-details-tab-pane"
              role="tabpanel" tabindex="0">
              <form>
                <div class="row">
                  <div class="col-12">
                    <div class="card mb-25 border-0 rounded-0 bg-white order-summary-box letter-spacing">
                      <div class="card-body">
                        <h5 class="mb-15 mb-md-25 fw-bold text-black">
                          Instructions de commande
                        </h5>
                        <div>
                          <div class="col-md-12">
                            <div class="form-group mb-15 mb-sm-20 mb-md-25">
                              <label class="d-block text-black fw-semibold mb-10">
                                Type de commande *
                              </label>
                              <v-select v-model="orderTypeSelected" :options="listeOrderType" label="libelle"
                                placeholder="Selectionner type de commande" required />
                            </div>
                          </div>
                          <div class="col-md-12">
                            <div class="form-group mb-15 mb-sm-20 mb-md-25">
                              <label class="d-block text-black fw-semibold mb-10">
                                Quand souhaiteriez-vous votre commande ? *
                              </label>
                              <v-select v-model="whenOrderSelected" :options="whenOrder" label="libelle"
                                placeholder="" />
                            </div>
                          </div>
                          <div class="row" v-if="whenOrderSelected === 'Date et heure souhaitées'">
                            <div class="col-md-6">
                              <div class="form-group mb-15 mb-sm-20 mb-md-25">
                                <label class="d-block text-black fw-semibold mb-10">
                                  Date
                                </label>
                                <v-select v-model="dateRecuperation" :options="getDatesArray" label="libelle"
                                  placeholder="" />
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="form-group mb-15 mb-sm-20 mb-md-25">
                                <label class="d-block text-black fw-semibold mb-10">
                                  Heure
                                </label>
                                <v-select v-model="orderHourRecuperation" :options="availableTimes" label="time"
                                  :reduce="time => time" />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-12">
                            <div class="form-group mb-15 mb-sm-20 mb-md-25">
                              <label class="d-block text-black fw-semibold mb-10">
                                À quoi devons-nous faire attention ? *
                              </label>
                              <div data-mdb-input-init class="form-outline">
                                <textarea v-model="remarqueOrder" placeholder="" class="form-control"
                                  id="textAreaExample3" rows="2"
                                  @change="(event) => handleInput(event, 'remarqueOrder')"
                                  :class="{ 'is-valid': validTextField(remarqueOrder) }" required />

                              </div>
                            </div>
                          </div>





                          <!--                          <div class="col-md-12">-->
                          <!--                            <div class="form-group mb-15 mb-sm-20 mb-md-25">-->
                          <!--                              <label class="d-block text-black fw-semibold mb-10">-->
                          <!--                                Cuisson-->
                          <!--                              </label>-->
                          <!--                              <v-select-->
                          <!--                                  v-model="orderCuissonTypeSelected"-->
                          <!--                                  :options="listeTypeCuisson"-->
                          <!--                                  label=""-->
                          <!--                                  placeholder="Selectionner type de cuisson"-->

                          <!--                              />-->
                          <!--                            </div>-->
                          <!--                          </div>-->
                          <div class="col-md-12">
                            <div class="form-check form-switch form-group mb-15 mb-sm-20 mb-md-25">
                              <input class="form-check-input shadow-none me-8" type="checkbox" role="switch"
                                id="flexSwitchCheckDefault" v-model="orderDemandeCouvert">
                              <label class="form-check-label fw-medium" for="flexSwitchCheckDefault">Demande de
                                couverts</label>
                            </div>
                          </div>
                          <div class="col-md-12" v-if="orderDemandeCouvert">
                            <div class="form-group mb-15 mb-sm-20 mb-md-25">
                              <label class="d-block text-black fw-semibold mb-10">
                                Quantité de couverts
                              </label>
                              <input type="number" class="form-control shadow-none rounded-0 text-black" placeholder="1"
                                v-model="orderQuantityCouvert" />
                            </div>
                          </div>
                          <div class="col-md-12">
                            <div class="form-check form-switch form-group mb-15 mb-sm-20 mb-md-25">
                              <input class="form-check-input shadow-none me-8" type="checkbox" role="switch"
                                id="flexSwitchCheckDefault" v-model="orderTrancher">
                              <label class="form-check-label fw-medium" for="flexSwitchCheckDefault">Trancher</label>
                            </div>
                          </div>


                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                <div class="row">
                  <h5 class="mb-15 mb-md-25 fw-bold text-black">
                    Information du client
                  </h5>
                  <div class="col-md-12">
                    <div class="form-check form-switch form-group mb-15 mb-sm-20 mb-md-25">
                      <input class="form-check-input shadow-none me-8" type="checkbox" role="switch"
                        id="flexSwitchCheckDefault" v-model="useCustomerGenericInfos">
                      <label class="form-check-label fw-medium" for="flexSwitchCheckDefault">Utiliser les informattions
                        du client
                        {{ restaurantID === RestaurantEnum.RESTO_PENTHAZ ? 'Penthaz' : 'Morges' }}</label>
                    </div>
                  </div>
                  <div v-if="!useCustomerGenericInfos" class="row">
                    <div class="col-md-12">
                      <div class="form-group mb-15 mb-sm-20 mb-md-25">
                        <label class="d-block text-black fw-semibold mb-10">
                          Civilité
                        </label>
                        <v-select v-model="newOrderData.civilite" :options="allCivites" label=""
                          placeholder="Civilité" />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group mb-15 mb-sm-20 mb-md-25">
                        <label class="d-block text-black fw-semibold mb-10">
                          Nom
                        </label>
                        <input type="text" class="form-control shadow-none rounded-0 text-black"
                          placeholder="e.g. Ronan" v-model="newOrderData.guest_last_name"
                          @change="(event) => handleInput(event, 'guest_last_name')"
                          :class="{ 'is-valid': validTextField(newOrderData.guest_last_name) }" required />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group mb-15 mb-sm-20 mb-md-25">
                        <label class="d-block text-black fw-semibold mb-10">
                          Prenom
                        </label>
                        <input type="text" class="form-control shadow-none rounded-0 text-black" placeholder="e.g. Jane"
                          v-model="newOrderData.guest_first_name"
                          @change="(event) => handleInput(event, 'guest_first_name')"
                          :class="{ 'is-valid': validTextField(newOrderData.guest_first_name) }" required />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group mb-15 mb-sm-20 mb-md-25">
                        <label class="d-block text-black fw-semibold mb-10">
                          Email
                        </label>
                        <input type="email" class="form-control shadow-none rounded-0 text-black"
                          placeholder="e.g. jane3602@gmail.com" v-model="newOrderData.guest_email"
                          @change="(event) => handleInput(event, 'guest_email')"
                          :class="{ 'is-valid': validTextField(newOrderData.guest_email) }" required />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group mb-15 mb-sm-20 mb-md-25">
                        <label class="d-block text-black fw-semibold mb-10">
                          Numéro téléphone
                        </label>
                        <input type="text" class="form-control shadow-none rounded-0 text-black"
                          placeholder="e.g. +1-829-3456" v-model="newOrderData.guest_phone_number"
                          @change="(event) => handleInput(event, 'guest_phone_number')"
                          :class="{ 'is-valid': validTextField(newOrderData.guest_phone_number) }" required />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <h5 class="mb-15 mb-md-25 fw-bold text-black">
                    Votre adresse de livraison
                  </h5>
                  <div class="col-md-12">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        Organisation *
                      </label>
                      <v-select v-model="organisationTypeSelected" :options="allTypeOrganisation" label="" />
                    </div>
                  </div>
                  <div class="col-md-6" v-if="organisationTypeSelected === 'Société'">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        Société
                      </label>
                      <input type="text" class="form-control shadow-none rounded-0 text-black" placeholder="e.g."
                        v-model="societySelected" :class="{ 'is-valid': validTextField(societySelected) }" required />
                    </div>
                  </div>
                  <div class="col-md-6" v-if="organisationTypeSelected === 'Société'">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        Département
                      </label>
                      <input type="text" class="form-control shadow-none rounded-0 text-black" placeholder="e.g. "
                        v-model="departementSelected" :class="{ 'is-valid': validTextField(departementSelected) }"
                        required />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        NPA *
                      </label>
                      <v-select v-model="NPASelected" :options="allPostalCode" label="numeroPostal"
                        :reduce="postal => postal.numeroPostal" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        Localité
                      </label>
                      <v-select v-model="localitySelected" :options="allPostalCode" label="ville"
                        :reduce="postal => postal.ville" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        Rue *
                      </label>
                      <input type="text" class="form-control shadow-none rounded-0 text-black"
                        placeholder="e.g. au 24eme" v-model="rueSelected"
                        @change="(event) => handleInput(event, 'rueSelected')"
                        :class="{ 'is-valid': validTextField(rueSelected) }" required />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        N *
                      </label>
                      <input type="text" class="form-control shadow-none rounded-0 text-black"
                        placeholder="e.g. au 24eme" v-model="numberRueSelected"
                        @change="(event) => handleInput(event, 'numberRueSelected')"
                        :class="{ 'is-valid': validTextField(numberRueSelected) }" required />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <h5 class="mb-15 mb-md-25 fw-bold text-black">
                    Méthode de paiement *
                  </h5>
                  <div class="col-md-12">
                    <div class="form-group mb-15 mb-sm-20 mb-md-25">
                      <label class="d-block text-black fw-semibold mb-10">
                        Choisir la méthode de paiement
                      </label>
                      <v-select v-model="methodePaiementDefault" :options="listeMethode" label="libelle"
                        :reduce="methode => methode.type" />
                    </div>
                  </div>

                </div>
              </form>
              <div class="d-sm-flex align-items-end justify-content-end">

                <LoaderComponent v-if="isLoading" />

                <button v-else type="button"
                  class="default-btn transition border-0 fw-medium text-white pt-11 pb-11 ps-25 pe-25 pt-md-12 pb-md-12 ps-md-35 pe-md-35 rounded-1 fs-md-15 fs-lg-16 bg-success"
                  @click="submitOrder" :disabled="!isFormValid"
                  :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }">
                  Valider la commande
                  <i class="flaticon-right-arrow position-relative ms-5 top-2"></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="col-xxl-4">


      <!--      RECAPITULATIF-->
      <div class="card mb-25 border-0 rounded-0 bg-white order-summary-box letter-spacing">
        <div class="card-head bg-white d-flex align-items-center">
          <i class="flaticon-document text-info"></i>
          <h5 class="mb-0 fw-bold text-black ms-10 ms-md-15">
            Recapitulatif<span class="text-paragraph"> ({{ newOrderData.paniers.length }} produit(s))</span>
          </h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table text-nowrap align-middle mb-0">
              <tbody>
                <template v-if="newOrderData.paniers.length > 0">
                  <tr v-for="panier in newOrderData.paniers" :key="panier.product_id.id">
                    <th class="shadow-none fw-medium text-black product-title ps-0">
                      <span class="d-flex align-items-center text-decoration-none text-black fs-md-15 fs-lg-16">
                        <img :src="panier.product_id.image_urls[0]" class="me-15" width="44" alt="product" />
                        <span>{{ panier.product_id.name }}
                          <span class="fs-12 fw-medium text-muted">x{{ panier.quantity }}</span></span>
                      </span>
                    </th>
                    <td class="shadow-none lh-1 fw-medium text-paragraph text-end pe-0">
                      {{ getTotalListeIngredientPrice(panier.ingredient) + getTotalPrice(panier.specification_id,
                      panier.quantity)}} CHF
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
                {{ getTotalPriceForAllPanier }} CHF
              </span>
            </li>

            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Remise </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                0 CHF
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium">
                TVA
              </span>
              <span class="d-block text-black fs-md-15 fs-lg-16 fw-medium">
                2.6%
              </span>
            </li>
            <li class="d-flex align-items-center justify-content-between">
              <span class="d-block text-paragraph fw-medium"> Total </span>
              <span class="d-block text-primary fs-md-15 fs-lg-16 fw-bold">
                {{ getTotalPriceForAllPanier }} CHF
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
          <div
            class="modal-body flex-row align-items-center justify-content-center d-flex justify-content-center align-items-center">
            <div class="flex-column d-flex justify-content-center align-items-center">
              <div class="table-responsive">
                <table class="table text-nowrap align-middle mb-0">
                  <thead class="bg-success text-white">
                    <tr>
                      <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                        IMAGE
                      </th>
                      <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                        TAILLE
                      </th>
                      <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                        PRIX
                      </th>

                      <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                        ACTION
                      </th>

                    </tr>
                  </thead>
                  <tbody v-if="productSelected && productSelected.productSizes.length > 0">
                    <tr v-for="(productSize) in productSelected.productSizes" :key="productSize.id">
                      <th class="shadow-none lh-1 fw-bold ps-0">
                        <span class="text-decoration-none text-black-emphasis">
                          <img :src="productSelected.image_urls[0]" class="me-15" width="80" alt="product" />
                        </span>
                      </th>
                      <th class="shadow-none lh-1 fw-bold ps-0">
                        <span class="text-decoration-none text-black-emphasis">
                          {{ productSize.size }}
                        </span>
                      </th>
                      <td class="shadow-none lh-1 fw-medium">
                        <span class="badge text-outline-danger">{{ productSize.price }} CHF</span>
                      </td>

                      <td class="shadow-none lh-1 fw-medium text-body-tertiary">
                        <button @click="addPanier(productSelected, productSize)" class="btn btn-danger btn-sm "
                          type="button" data-bs-dismiss="modal" aria-label="Close">
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
                    <v-select v-model="ingredientSelected" :options="allIngredient" label="name"
                      placeholder="Selectionner un ingredient" />
                  </div>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table text-nowrap align-middle mb-0">
                  <thead class="bg-success text-white">
                    <tr>
                      <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                        NOM
                      </th>
                      <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                        TYPE
                      </th>

                      <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                        QUANTITÉ
                      </th>

                      <th scope="col" class="text-uppercase fw-medium shadow-none text-body-tertiary fs-13 pt-0">
                        PRIX
                      </th>



                    </tr>
                  </thead>
                  <tbody v-if="panierSelected && panierSelected.ingredient.length > 0">
                    <tr v-for="ingredient in panierSelected?.ingredient" :key="ingredient.id">
                      <th class="shadow-none lh-1 fw-bold ps-0">
                        <span class="text-decoration-none text-black-emphasis">
                          <img :src="ingredient.imageUrl" class="me-15" width="44" alt="" />
                          {{ ingredient.name }}
                        </span>
                      </th>
                      <td class="shadow-none lh-1 fw-medium">
                        <span class="badge text-outline-danger">{{ ingredient.type ?? '-' }}</span>
                      </td>

                      <td class="shadow-none lh-1">
                        <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                          <button type="button" id="decrementBtn"
                            class="px-2 text-success text-decoration-none border-0"
                            @click="decrementQuantityIngredient(panierSelected, ingredient)">
                            -
                          </button>

                          <span class="text-success fs-15 mx-2">{{ ingredient.quantite }}</span>

                          <button type="button" id="incrementBtn"
                            class="px-2 text-success text-decoration-none border-0"
                            @click="incrementQuantityIngredient(panierSelected, ingredient)">
                            +
                          </button>
                        </div>


                      </td>

                      <td class="shadow-none lh-1 fw-medium">
                        <span class="badge text-outline-danger">{{ getTotalIngredientPrice(ingredient) ?? '-' }}
                          CHF</span>
                      </td>


                      <td class="shadow-none lh-1 fw-medium text-body-tertiary">
                        <button @click="removeIngredientFromCart(panierSelected, ingredient)"
                          class="btn btn-danger btn-sm " type="button">
                          Retirer
                        </button>
                      </td>

                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <EmptyTable message="Aucun ingrédient ajouter pour le moment" :colspan="8"
                        textClass="text-muted" />
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="d-flex justify-content-center align-items-center mt-8">
                <button @click="seeValue" class="btn btn-primary btn-sm" type="button" data-bs-dismiss="modal"
                  aria-label="Close">
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
  createNewOrder, detailRestaurant, detailUser,
  fetchAllPostalCode, listeCategorieActive,
  listeIngredient,
  listeMethodePaiement,
  listeOrderType,
  listeProducts, listeRestaurantProduct
} from "@/service/api";
import { useToast } from "vue-toastification";
import { CartModel } from "@/models/cart.model";
import { InstructionOrderModel } from "@/models/intructionOrder.model";
import { NewOrderModel } from "@/models/newOrder.model";
import {
  ApiResponse, PaginatedCategorie,
  PaginatedIngredient,
  PaginatedMethodePaiement,
  PaginatedOrderType,
  PaginatedProduct, PaginatedRestaurantProduct
} from "@/models/Apiresponse";
import { IngredientModel } from "@/models/ingredient.model";
import { ProductModel } from "@/models/product.model";
import EmptyTable from "@/components/Vabene/EmptyTable/EmptyTable.vue";
import { Modal } from 'bootstrap';
import { defineComponent } from "vue";
import { ProductSizesModel } from "@/models/productSizes.model";
import { OrderTypeModel } from "@/models/orderType.model";
import { CodepostalModel } from "@/models/codepostal.model";
import { MethodePaiementModel } from "@/models/methodePaiement.model";
import { OrderModel } from "@/models/order.model";
import { CategorieModel } from "@/models/categorie.model";
import { UserGeneralKey, UserRole } from "@/models/user.generalkey";
import { RestaurantProductModel } from "@/models/RestaurantProduct.model";
import { ProductSizeEnum } from "@/enums/productSize.enum";
import { IngredientSizeEnum } from "@/enums/ingredientSize.enum";
import { IngredientSizeModel } from "@/models/ingredientSize.model";
import { UserModel } from "@/models/user.model";
import { RestaurantModel } from "@/models/restaurant.model";
import { RestaurantEnum } from "@/enums/restaurant.enum";
import { ClientEnum } from "@/enums/client.enum";
import { AxiosError } from "axios";

export default defineComponent({
  name: "VabeneAddOrder",
  components: {
    EmptyTable,
    LoaderComponent
    // ImageUpload,
  },
  data() {
    return {
      customerRestauranInfo: null as UserModel | null,
      dateRecuperation: '',
      orderHourRecuperation: '',
      availableTimes: [] as string[],
      error: '',
      productSelected: null as ProductModel | null,
      previousProductSelected: null as ProductModel | null,
      productQuantity: "1" as string | "1",
      productResponse: null as ApiResponse<PaginatedProduct> | null,
      originalProducts: [] as ProductModel[],
      originalCategories: [] as CategorieModel[], // Stockage des utilisateurs originaux
      categorieSelected: null as CategorieModel | null,
      userRole: localStorage.getItem(UserGeneralKey.USER_ROLE),
      restaurantID: localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID),
      productRestaurantResponse: null as ApiResponse<PaginatedRestaurantProduct> | null,
      originalRestaurantProducts: [] as RestaurantProductModel[],
      currentPage: 1,
      searchQuery: '', // Ajout du champ de recherche
      whenOrder: ['Dès que possible', 'Date et heure souhaitées'],
      whenOrderSelected: 'Dès que possible',
      remarqueOrder: '',
      newOrderData: {
        paniers: [] as CartModel[],
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
      useCustomerGenericInfos: false as boolean,
      orderQuantityCouvert: 1 as number,
      orderTrancher: false as boolean,
      stepForm: 1 as number | number,
      allCivites: ["M.", "Mme", "Autre"],
      allTypeOrganisation: ["Privé", "Société"],
      societySelected: '',
      departementSelected: '',
      allPostalCode: [] as CodepostalModel[],
      listeMethode: [] as MethodePaiementModel[],
      methodePaiementDefault: null as MethodePaiementModel | null,
      NPASelected: null as string | null,
      localitySelected: null as string | null,
      organisationTypeSelected: null as string | null,
      rueSelected: null as string | null,
      numberRueSelected: null as string | null,
      simplyPanier: []
    }
  },
  methods: {
    extraireDate(input: string): string {
      // On supprime tout ce qui suit la date, y compris le séparateur " - "
      return input.split(" - ")[0];
    },
    getWhenOrderType() {
      switch (this.whenOrderSelected) {
        case 'Dès que possible':
          return 'immediat'
        default:
          return 'ulterieur'

      }
    },
    getCivilite() {
      switch (this.newOrderData.civilite) {
        case "M.":
          return "Monsieur"
        case "Mme":
          return "Madame"
        default:
          return "Autre"
      }
    },
    generateTimeSlots() {
      const intervals = [
        { start: "11:00", end: "14:00" },
        { start: "18:00", end: "22:00" },
      ];

      const pad = n => n.toString().padStart(2, '0');
      const toMinutes = t => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };
      const toTime = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

      this.availableTimes = [];

      for (const { start, end } of intervals) {
        let current = toMinutes(start);
        const max = toMinutes(end);
        while (current <= max) {
          this.availableTimes.push(toTime(current) as string);
          current += 15;
        }
      }
    },
    chooseProduct(product: ProductModel) {
      this.productSelected = product;
    },
    chunkArray<ProductModel>(arr: ProductModel[], size: number): ProductModel[][] {
      const chunks: ProductModel[][] = []
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size))
      }
      return chunks
    },
    async fetchCategories(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeCategorieActive(page, "0") as ApiResponse<PaginatedCategorie>;
        if (response.code === 200) {
          if (response.data?.items) {
            this.originalCategories = response.data.items;
            this.categorieSelected = this.originalCategories[0];
            if (this.userRole === UserRole.FRANCHISE) {
              await this.fetchProduct(1, "existing", this.categorieSelected.id);
            }
            else {
              await this.fetchRestaurantProduct(1, this.categorieSelected.id)
            }
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      }
    },
    async fetchProduct(page = 1, filter: string, categorieID?: string) {
      const payload = {
        "categorieID": categorieID
      }
      this.isLoading = true;
      try {
        const response = await listeProducts(page, "0", filter, payload) as ApiResponse<PaginatedProduct>;
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
    async fetchRestaurantProduct(page = 1, categoryId: string) {
      this.isLoading = true;
      try {
        const response = await listeRestaurantProduct(page, "0", categoryId as string) as ApiResponse<PaginatedRestaurantProduct>;
        if (response.code === 200) {
          this.productRestaurantResponse = response;
          if (response.data?.items) {
            this.originalRestaurantProducts = response.data.items;
            for (let i = 0; i < response.data.items.length; i++) {
              this.originalProducts.push(response.data.items[i].product)
            }
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
    getMethodePaiementParType(
      liste: MethodePaiementModel[],
      type: string
    ): MethodePaiementModel | undefined {
      return liste.find(methode => methode.type === type);
    },
    async fetchListeMethodePaiement(page = 1) {
      // this.isLoading = true;
      try {
        const response = await listeMethodePaiement(page) as ApiResponse<PaginatedMethodePaiement>;
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
    updateStepForm(value: number) {
      this.stepForm = value
    },
    async fetchPostalCode() {
      this.isLoading = true;
      try {
        const response = await fetchAllPostalCode();
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


    seeValue() {
      //("potential payload: ", this.newOrderData)
    },
    addIgredientToPanier(panier: CartModel) {
      if (!panier) return;
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
      } 
    },
    incrementQuantityIngredient(panier: CartModel, ingredient: IngredientModel) {

      const cart = this.newOrderData.paniers.find(pan => pan.product_id.id === panier.product_id.id);
      const simplyCart = (this.simplyPanier as any[]).find(pan => pan.product_id === panier.product_id.id);
  

      if (cart && simplyCart) {

        const ingredientFinded = cart.ingredient.find(ing => ing.name === ingredient.name);
        const ingredientSimplyFinded = simplyCart.ingredient.find(ing => ing.name === ingredient.name);



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
      } else {
        this.toast.warning(`Aucun panier trouvé avec le product_id: ${panier.product_id.id}`);
      }

    },
    decrementQuantityIngredient(panier: CartModel, ingredient: IngredientModel) {
      let index = ingredient.quantite
      if (index > 1) {
        index -= 1;
      }
      const cart = this.newOrderData.paniers.find(pan => pan.product_id.id === panier.product_id.id);
      const simplyCart = (this.simplyPanier as any[]).find(pan => pan.product_id === panier.product_id.id);
      if (cart && simplyCart) {
        // Vérifie si l'ingrédient n'existe pas déjà (optionnel)
        const exists = cart.ingredient.some(ing => ing.name === ingredient.name);
        const existSimplyCart = simplyCart.ingredient.some(ing => ing.name === ingredient.name);
        const ingredientFinded = cart.ingredient.find(ing => ing.name === ingredient.name)
        const symplyIngredientFinded = simplyCart.ingredient.find(ing => ing.name === ingredient.name)
        if (!exists && existSimplyCart) {
          ingredient.quantite = index
          cart.ingredient.push(ingredient);
          simplyCart.ingredient.push(ingredient)
        }
        else {
          if (ingredientFinded) {
            ingredientFinded.quantite = index
            symplyIngredientFinded.quantite = index
          }
        }

      }
      else {
        this.toast.warning(`Aucun panier trouvé avec le product_id: ${panier.product_id.id}`);
      }

    },
    removeIngredientFromCart(panier: CartModel, ingredient: IngredientModel) {
      const cart = this.newOrderData.paniers.find(p => p.product_id.id === panier.product_id.id);
      const simplyCart = (this.simplyPanier as any[]).find(pan => pan.product_id === panier.product_id.id);

      if (cart && simplyCart) {
        cart.ingredient = cart.ingredient.filter(ing => ing.name !== ingredient.name);
        simplyCart.ingredient = simplyCart.ingredient.filter(ing => ing.name !== ingredient.name);
      }
    },
    clearData() {
      this.newOrderData = {} as NewOrderModel
    },
    goBack() {
      this.$router.back()
    },
    submitOrder() {
      this.createNewOrder()
    },
    async createNewOrder() {
      this.isLoading = true;
      if (this.newOrderData.intructionOrder.length === 0) {
        const newInstructionOrder: InstructionOrderModel = {
          demandeCouverts: this.orderDemandeCouvert,
          quantityCouverts: `${this.orderQuantityCouvert}`,
          delaiRecuperation: this.getWhenOrderType() === 'ulterieur' ? `${this.extraireDate(this.dateRecuperation)} ${this.orderHourRecuperation}` : this.getWhenOrderType(),
          isTrancher: this.orderTrancher,
          cuisson: "Normal"
        }
        this.newOrderData.intructionOrder.push(newInstructionOrder)
      }
      const payload = {
        "deliveryLocality": this.localitySelected,
        "promotions": "0",
        "newsletter": "0",
        "order_type": this.orderTypeSelected?.type,
        "coupon": "",
        "codePostal": this.NPASelected,
        "restaurantID": this.restaurantID,
        "paniers": this.simplyPanier,
        "userID": this.useCustomerGenericInfos ? this.customerRestauranInfo?.id : "",
        "guest_first_name": this.useCustomerGenericInfos ? this.customerRestauranInfo?.first_name : this.newOrderData.guest_first_name,
        "guest_last_name": this.useCustomerGenericInfos ? this.customerRestauranInfo?.last_name : this.newOrderData.guest_last_name,
        "guest_email": this.useCustomerGenericInfos ? this.customerRestauranInfo?.email : this.newOrderData.guest_email,
        "guest_phone_number": this.useCustomerGenericInfos ? this.customerRestauranInfo?.phone_number : this.newOrderData.guest_phone_number,
        "payment_method": this.methodePaiementDefault?.type,
        "addressLivraison": `${this.localitySelected}, ${this.rueSelected} - ${this.numberRueSelected}`,
        "batiment": this.numberRueSelected,
        "rue": this.rueSelected,
        "civilite": this.getCivilite(),
        "intructionOrder": this.newOrderData.intructionOrder,
        "feature": [this.remarqueOrder],
        "numberRue": this.numberRueSelected,
        "deliveryPreference": this.getWhenOrderType(),
        "SpecialInstructions": this.remarqueOrder,
        "timeOrder": this.getWhenOrderType() === 'ulterieur' ? `${this.extraireDate(this.dateRecuperation)} ${this.orderHourRecuperation}` : '',
        "typeCustomer": this.organisationTypeSelected === 'Société' ? 'organisation' : 'customer',
      }
      try {
        const response = await createNewOrder(payload);
        if (response.code === 201) {
          const order = response.data as OrderModel;
          this.toast.success(response.message)
          // this.$router.push({
          //   name: "VabeneOrderDetailsPage",
          //   params: { commandeID: order.id }
          // });

        } else {
          this.toast.error(response.message)
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
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    },
    async fetchIngredients(page = 1) {
      this.isLoading = true;
      try {
        const response = await listeIngredient(1, '1') as ApiResponse<PaginatedIngredient>;
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
    handleInput(event, type) {
      const valueText = event.target.value;
      switch (type) {
        case 'remarqueOrder':
          this.remarqueOrder = valueText
          this.validTextField(valueText)
          break
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
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim())
      }
    },
    validPassword(password) {
      if (password) {
        return password.trim().length > 0
      }
    },
    validTextField(text) {
      if (text) {
        return text.trim().length > 0
      }
    },
    getOrderTypeParType(
      liste: OrderTypeModel[],
      type: string
    ): OrderTypeModel | undefined {
      return liste.find(methode => methode.type === type);
    },
    async fetchOrderType(page = 1) {
      // this.isLoading = true;
      try {
        const response = await listeOrderType(page) as ApiResponse<PaginatedOrderType>;
        if (response.code === 200) {
          if (response.data?.items) {
            this.listeOrderType = response.data.items;
            this.orderTypeSelected = this.getOrderTypeParType(this.listeOrderType, 'dine_in') as OrderTypeModel
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
    async fetchDetailUser() {
      const userID = this.restaurantID === RestaurantEnum.RESTO_MORGES ? ClientEnum.CLIENT_MORGES : ClientEnum.CLIENT_PENTHAZ
      try {
        const response = await detailUser(userID) as ApiResponse<UserModel>;
        if (response.code === 200) {
          if (response.data) {
            this.customerRestauranInfo = response.data
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des informations clients");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    getCodePostalByNumero(
      liste: CodepostalModel[],
      numeroPostal: string
    ): CodepostalModel | undefined {
      return liste.find(postal => postal.numeroPostal === numeroPostal);
    },
    getCodePostalByVille(
      liste: CodepostalModel[],
      city: string
    ): CodepostalModel | undefined {
      return liste.find(postal => postal.numeroPostal === city);
    },
    async fetchDetailRestaurant() {
      try {
        const response = await detailRestaurant(this.restaurantID) as ApiResponse<RestaurantModel>;
        if (response.code === 200) {
          if (response.data) {
            const dt = response.data
            this.NPASelected = dt.codePostalID.numeroPostal
            this.localitySelected = dt.codePostalID.ville
            this.rueSelected = dt.numeroRue
            this.numberRueSelected = dt.address
          }
        } else {
          this.toast.error(response.message);
        }
      } catch (error) {
        this.toast.error("Erreur lors du chargement des categories");
        console.error(error);
      }
    },



  },
  computed: {
    RestaurantEnum() {
      return RestaurantEnum
    },
    getDatesArray(): string[] {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const formatDate = (date: Date): string => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      return [
        `${formatDate(today)} - aujourd'hui`,
        `${formatDate(tomorrow)} - demain`
      ];
    },
    produitsParTrois(): ProductModel[][] {
      return this.chunkArray(this.allProducts, 4)
    },
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
    getTotalPriceForAllPanier() {
      let totalPrice = 0
      if (this.newOrderData.paniers.length > 0) {
        for (let i = 0; i < this.newOrderData.paniers.length; i++) {
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
        this.simplyPanier.length > 0 &&
        this.validTextField(this.remarqueOrder) &&
        this.validTextField(this.rueSelected) &&
        this.validTextField(this.numberRueSelected)
      );
    }
  },
  watch: {
    useCustomerGenericInfos(newVal, oldVal) {
      if (typeof newVal === 'boolean' && newVal !== oldVal && newVal) {
        this.newOrderData.guest_first_name = this.customerRestauranInfo?.first_name as string
        this.newOrderData.guest_last_name = this.customerRestauranInfo?.last_name as string
        this.newOrderData.guest_phone_number = this.customerRestauranInfo?.phone_number as string
        this.newOrderData.guest_email = this.customerRestauranInfo?.email as string
      }
    },
    // NPASelected(newVal, oldVal){
    //   if (typeof newVal === 'string' && newVal !== oldVal) {
    //     const NPA = this.getCodePostalByNumero(this.allPostalCode, newVal) ?? null;
    //     this.localitySelected = NPA?.ville ?? ''
    //   }
    // },
    // localitySelected(newVal, oldVal){
    //   if (typeof newVal === 'string' && newVal !== oldVal) {
    //     const locality = this.getCodePostalByNumero(this.allPostalCode, newVal) ?? null;
    //     this.NPASelected = locality?.numeroPostal ?? ''
    //   }
    // },
    categorieSelected(newVal, oldVal) {
      if (typeof newVal === 'string' && newVal !== oldVal) {
        this.categorieSelected = this.originalCategories.find(c => c.id === newVal) ?? null;
        if (this.userRole === UserRole.FRANCHISE) {
          this.fetchProduct(1, "existing", newVal); // ou newVal.id selon le besoin
        }
        else {
          this.fetchRestaurantProduct(1, newVal);
        }

      }
    },
    orderTypeSelected(this: any, newVal) {
      if (!newVal) return
      this.orderTypeSelected = newVal as OrderTypeModel
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
      if (simplyCart && this.ingredientSelected) {
        // Vérifie si l'ingrédient n'existe pas déjà (optionnel)
        const exists = simplyCart.ingredient.some(ing => ing.id === this.ingredientSelected?.id);
        const smallSizeIngredient = this.ingredientSelected.ingredientSizes.find(ing => ing.size === IngredientSizeEnum.PETITE) as IngredientSizeModel;
        const mediumSizeIngredient = this.ingredientSelected.ingredientSizes.find(ing => ing.size === IngredientSizeEnum.NORMAL);
        const bigSizeIngredient = this.ingredientSelected.ingredientSizes.find(ing => ing.size === IngredientSizeEnum.GRANDE);
        let ing = {};
        if (!exists) {
          switch (this.panierSelected.specification_id.size) {
            case ProductSizeEnum.PETITE:
              ing = {
                "name": this.ingredientSelected.name + " " + smallSizeIngredient.size,
                "size": IngredientSizeEnum.PETITE,
                "extra_cost_price": smallSizeIngredient.price,
                "isDefault": false,
                "quantite": this.ingredientSelected.quantite ?? 1
              }
              break
            case ProductSizeEnum.NORMAL:
              ing = {
                "name": this.ingredientSelected.name + " " + mediumSizeIngredient.size,
                "size": IngredientSizeEnum.NORMAL,
                "extra_cost_price": mediumSizeIngredient.price,
                "isDefault": false,
                "quantite": this.ingredientSelected.quantite ?? 1
              }
              break
            default:
              ing = {
                "name": this.ingredientSelected.name + " " + bigSizeIngredient.size,
                "size": IngredientSizeEnum.GRANDE,
                "extra_cost_price": bigSizeIngredient.price,
                "isDefault": false,
                "quantite": this.ingredientSelected.quantite ?? 1
              }
              break
          }
          simplyCart.ingredient.push(ing);
        }
        else {
          this.toast.warning(`Ce ingredient existe deja dans ce panier: ${this.ingredientSelected?.name}`);
        }
      }
      if (cart && this.ingredientSelected) {
        // Vérifie si l'ingrédient n'existe pas déjà (optionnel)
        const exists = cart.ingredient.some(ing => ing.id === this.ingredientSelected?.id);
        const smallSizeIngredient = this.ingredientSelected.ingredientSizes.find(ing => ing.size === IngredientSizeEnum.PETITE) as IngredientSizeModel;
        const mediumSizeIngredient = this.ingredientSelected.ingredientSizes.find(ing => ing.size === IngredientSizeEnum.NORMAL);
        const bigSizeIngredient = this.ingredientSelected.ingredientSizes.find(ing => ing.size === IngredientSizeEnum.GRANDE);
        let ing = {};
        if (!exists) {
          switch (this.panierSelected.specification_id.size) {
            case ProductSizeEnum.PETITE:
              ing = {
                "name": this.ingredientSelected.name + " " + smallSizeIngredient.size,
                "size": IngredientSizeEnum.PETITE,
                "extra_cost_price": smallSizeIngredient.price,
                "isDefault": false,
                "quantite": this.ingredientSelected.quantite ?? 1
              }
              break
            case ProductSizeEnum.NORMAL:
              ing = {
                "name": this.ingredientSelected.name + " " + mediumSizeIngredient.size,
                "size": IngredientSizeEnum.NORMAL,
                "extra_cost_price": mediumSizeIngredient.price,
                "isDefault": false,
                "quantite": this.ingredientSelected.quantite ?? 1
              }
              break
            default:
              ing = {
                "name": this.ingredientSelected.name + " " + bigSizeIngredient.size,
                "size": IngredientSizeEnum.GRANDE,
                "extra_cost_price": bigSizeIngredient.price,
                "isDefault": false,
                "quantite": this.ingredientSelected.quantite ?? 1
              }
              break
          }
          cart.ingredient.push(ing);
          this.ingredientSelected = null
        }
        else {
          console.warn(`Ce ingredient existe deja dans ce panier: ${this.ingredientSelected?.name}`);
        }
      }
      else {
        console.warn(`Aucun panier trouvé avec le product_id: ${this.panierSelected.product_id.id}`);
      }
    }
  },
  created() {
    this.generateTimeSlots();
  },
  setup: () => {
    const toast = useToast();

    return { toast };
  },
  mounted() {
    this.fetchCategories(1)
    this.fetchIngredients(1)
    this.fetchOrderType(1)
    this.fetchPostalCode()
    this.fetchListeMethodePaiement(1)
    this.fetchDetailUser()
    this.fetchDetailRestaurant()

  }
});
</script>