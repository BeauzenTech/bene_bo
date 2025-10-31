import { createWebHistory, createRouter } from "vue-router";
import { authGuard } from "./guards";
import LoginPage from "../pages/Authentication/LoginPage.vue";

import TimezoneTest from "../components/TimezoneTest.vue";
import VabeneAddUserPage from "@/pages/Vabene/Users/VabeneAddUserPage.vue";
import VaBeneUserListPage from "@/pages/Vabene/Users/VaBeneUserListPage.vue";
import FranchiseListePage from "@/pages/Vabene/Franchise/FranchiseListePage.vue";
import VabeneAddFranchisePage from "@/pages/Vabene/Franchise/VabeneAddFranchisePage.vue";
import VabeneRestaurantListPage from "@/pages/Vabene/Restaurant/VabeneRestaurantListPage.vue";
import VabeneAddRestaurantPage from "@/pages/Vabene/Restaurant/VabeneAddRestaurantPage.vue";
import VabeneOrderListPage from "@/pages/Vabene/Order/VabeneOrderListPage.vue";
import VabeneAddOrderPage from "@/pages/Vabene/Order/VabeneAddOrderPage.vue";
import VabeneOrderDetailsPage from "@/pages/Vabene/Order/VabeneOrderDetailsPage.vue";
import POSMain from "@/components/Vabene/POS/Modern/views/POSMain.vue";
import VabeneTransactionListPage from "@/pages/Vabene/Order/VabeneTransactionListPage.vue";
import VabeneTransactionDetailsPage from "@/pages/Vabene/Order/VabeneTransactionDetailsPage.vue";
import VabeneDashPage from "@/pages/Vabene/Dashboard/VabeneDashPage.vue";
import VaBeneCategorieListPage from "@/pages/Vabene/Categorie/VaBeneCategorieListPage.vue";
import VabeneAddCategoriePage from "@/pages/Vabene/Categorie/VabeneAddCategoriePage.vue";
import VaBeneIngredientListPage from "@/pages/Vabene/Ingredient/VaBeneIngredientListPage.vue";
import VabeneAddIngredientPage from "@/pages/Vabene/Ingredient/VabeneAddIngredientPage.vue";
import VabeneOrderReportSellPage from "@/pages/Vabene/Order/VabeneOrderReportSellPage.vue";
import VaBeneProductListPage from "@/pages/Vabene/Produit/VaBeneProductListPage.vue";
import VabeneAddProductPage from "@/pages/Vabene/Produit/VabeneAddProductPage.vue";
import VaBeneCustomerListPage from "@/pages/Vabene/Customer/VaBeneCustomerListPage.vue";
import VabeneAddCustomerPage from "@/pages/Vabene/Customer/VabeneAddCustomerPage.vue";
import VabeneAddCampagePage from "@/pages/Vabene/Campagne/VabeneAddCampagePage.vue";
import VaBeneCampagneListPage from "@/pages/Vabene/Campagne/VaBeneCampagneListPage.vue";
import VabeneAddNotificationPage from "@/pages/Vabene/Notification/VabeneAddNotificationPage.vue";
import VaBeneNotificationListPage from "@/pages/Vabene/Notification/VaBeneNotificationListPage.vue";
import VabeneInfoFranchisePage from "@/pages/Vabene/Franchise/VabeneInfoFranchisePage.vue";
import MotPasseOubliePage from "@/pages/Authentication/MotPasseOubliePage.vue";
import VabeneAddCouponPage from "@/pages/Vabene/Coupon/VabeneAddCouponPage.vue";
import VaBeneCouponListPage from "@/pages/Vabene/Coupon/VaBeneCouponListPage.vue";
import VabeneIngredientBaseListPage from "@/pages/Vabene/IngredientBase/VabeneIngredientBaseListPage.vue";
import VaBeneProgrammeAffiliationListPage from "@/pages/Vabene/Programme/VaBeneProgrammeAffiliationListPage.vue";
import VabeneAddProgrammePage from "@/pages/Vabene/Programme/VabeneAddProgrammePage.vue";
import VabeneAdminDashPage from "@/pages/Vabene/Dashboard/VabeneAdminDashPage.vue";

const routes = [
  {
    path: "/home",
    name: "VabeneDashPage",
    component: VabeneDashPage,
  },
  {
    path: "/admin-dashboard",
    name: "VabeneAdminDashPage",
    component: VabeneAdminDashPage,
  },
  {
    path: "/password-oublie",
    name: "MotPasseOubliePage",
    component: MotPasseOubliePage,
  },
  {
    path: "/reset-password",
    name: "ResetPasswordPage",
    component: () => import("@/pages/Authentication/ResetPasswordPage.vue"),
  },

  //
  {
    path: "/affiliation-programmes",
    name: "VaBeneProgrammeAffiliationListPage",
    component: VaBeneProgrammeAffiliationListPage,
  },
  {
    path: "/ajout-programme/:action/:categorieID?",
    name: "VabeneAddProgrammePage",
    component: VabeneAddProgrammePage,
    props: (route) => ({
      action: String(route.params.action),
      categorieID: route.params.categorieID
        ? String(route.params.categorieID)
        : undefined,
    }),
  },

  // CRUD USER
  {
    path: "/utilisateur-list",
    name: "VaBeneUserListPage",
    component: VaBeneUserListPage,
  },
  {
    path: "/ajout-utilisateur/:action/:userID?",
    name: "VabeneAddUserPage",
    component: VabeneAddUserPage,
    props: (route) => ({
      action: String(route.params.action),
      userID: route.params.userID ? String(route.params.userID) : undefined,
    }),
  },

  // CRUD FRANCHISE
  {
    path: "/franchise-list",
    name: "FranchiseListePage",
    component: FranchiseListePage,
  },
  {
    path: "/ajout-franchise/:action/:franchiseID?",
    name: "VabeneAddFranchisePage",
    component: VabeneAddFranchisePage,
    props: (route) => ({
      action: String(route.params.action),
      franchiseID: route.params.franchiseID
        ? String(route.params.franchiseID)
        : undefined,
    }),
  },
  {
    path: "/infofranchise/:franchiseID?",
    name: "VabeneInfoFranchisePage",
    component: VabeneInfoFranchisePage,
    props: (route) => ({
      franchiseID: route.params.franchiseID
        ? String(route.params.franchiseID)
        : undefined,
    }),
  },

  // CRUD RESTAURANT
  {
    path: "/restaurant-list",
    name: "VabeneRestaurantListPage",
    component: VabeneRestaurantListPage,
  },
  {
    path: "/ajout-restaurant/:action/:restaurantID?",
    name: "VabeneAddRestaurantPage",
    component: VabeneAddRestaurantPage,
    props: (route) => ({
      action: String(route.params.action),
      restaurantID: route.params.restaurantID
        ? String(route.params.restaurantID)
        : undefined,
    }),
  },

  {
    path: "/delivery-zones",
    name: "VabeneDeliveryZoneListPage",
    component: () =>
      import("@/pages/Vabene/DeliveryZone/VabeneDeliveryZoneListPage.vue"),
  },
  {
    path: "/delivery-zones/add",
    name: "VabeneAddDeliveryZonePage",
    component: () =>
      import("@/pages/Vabene/DeliveryZone/VabeneAddDeliveryZonePage.vue"),
  },
  {
    path: "/delivery-zones/edit/:zoneID",
    name: "VabeneEditDeliveryZonePage",
    component: () =>
      import("@/pages/Vabene/DeliveryZone/VabeneAddDeliveryZonePage.vue"),
  },
  {
    path: "/delivery-zones/:zoneId/postal-codes",
    name: "VabenePostalCodesPage",
    component: () =>
      import("@/pages/Vabene/DeliveryZone/VabenePostalCodesPage.vue"),
  },

  // HORAIRES D'OUVERTURE
  {
    path: "/opening-hours",
    name: "VabeneOpeningHoursPage",
    component: () =>
      import("@/pages/Vabene/OpeningHours/VabeneOpeningHoursPage.vue"),
  },
  {
    path: "/opening-hours/add",
    name: "VabeneAddOpeningHoursPage",
    component: () =>
      import("@/pages/Vabene/OpeningHours/VabeneAddOpeningHoursPage.vue"),
  },
  {
    path: "/opening-hours/edit",
    name: "VabeneEditOpeningHoursPage",
    component: () =>
      import("@/pages/Vabene/OpeningHours/VabeneAddOpeningHoursPage.vue"),
  },

  // CRUD ORDER
  {
    path: "/order-list",
    name: "VabeneOrderListPage",
    component: VabeneOrderListPage,
  },
  {
    path: "/ajout-commande",
    name: "VabeneAddOrderPage",
    component: VabeneAddOrderPage,
  },
  {
    path: "/pos",
    name: "POSModern",
    component: POSMain,
  },
  {
    path: "/rapport-vente",
    name: "VabeneOrderReportSellPage",
    component: VabeneOrderReportSellPage,
  },
  {
    path: "/detail-commande/:commandeID",
    name: "VabeneOrderDetailsPage",
    component: VabeneOrderDetailsPage,
    props: (route) => ({
      commandeID: String(route.params.commandeID),
    }),
  },

  // TRANSACTION LIST
  {
    path: "/transaction-list",
    name: "VabeneTransactionListPage",
    component: VabeneTransactionListPage,
  },
  {
    path: "/detail-transaction/:transactionID",
    name: "VabeneTransactionDetailsPage",
    component: VabeneTransactionDetailsPage,
    props: (route) => ({
      transactionID: String(route.params.transactionID),
    }),
  },

  // CRUD CATEGORIE
  {
    path: "/categorie-list",
    name: "VaBeneCategorieListPage",
    component: VaBeneCategorieListPage,
  },
  {
    path: "/ajout-categorie/:action/:categorieID?",
    name: "VabeneAddCategoriePage",
    component: VabeneAddCategoriePage,
    props: (route) => ({
      action: String(route.params.action),
      categorieID: route.params.categorieID
        ? String(route.params.categorieID)
        : undefined,
    }),
  },

  // CRUD INGREDIENT
  {
    path: "/ingredient-list",
    name: "VaBeneIngredientListPage",
    component: VaBeneIngredientListPage,
  },
  {
    path: "/ajout-ingredient/:action/:ingredientID?",
    name: "VabeneAddIngredientPage",
    component: VabeneAddIngredientPage,
    props: (route) => ({
      action: String(route.params.action),
      ingredientID: route.params.ingredientID
        ? String(route.params.ingredientID)
        : undefined,
    }),
  },
  {
    path: "/product-list",
    name: "VaBeneProductListPage",
    component: VaBeneProductListPage,
  },
  {
    path: "/ajout-product/:action/:productID?",
    name: "VabeneAddProductPage",
    component: VabeneAddProductPage,
    props: (route) => ({
      action: String(route.params.action),
      productID: route.params.productID
        ? String(route.params.productID)
        : undefined,
    }),
  },

  {
    path: "/customer-list",
    name: "VaBeneCustomerListPage",
    component: VaBeneCustomerListPage,
  },
  {
    path: "/customer/:action/:customerID?",
    name: "VabeneAddCustomerPage",
    component: VabeneAddCustomerPage,
    props: (route) => ({
      action: String(route.params.action),
      customerID: route.params.customerID
        ? String(route.params.customerID)
        : undefined,
    }),
  },

  {
    path: "/campagne-list",
    name: "VaBeneCampagneListPage",
    component: VaBeneCampagneListPage,
  },
  {
    path: "/ajout-campagne/:action/:campagneID?",
    name: "VabeneAddCampagePage",
    component: VabeneAddCampagePage,
    props: (route) => ({
      action: String(route.params.action),
      campagneID: route.params.campagneID
        ? String(route.params.campagneID)
        : undefined,
    }),
  },

  {
    path: "/notifications-sending",
    name: "VabeneNotificationListPage",
    component: VaBeneNotificationListPage,
  },
  {
    path: "/ajout-notification/:action/:notificationID?",
    name: "VabeneAddNotificationPage",
    component: VabeneAddNotificationPage,
    props: (route) => ({
      action: String(route.params.action),
      notificationID: route.params.notificationID
        ? String(route.params.notificationID)
        : undefined,
    }),
  },

  {
    path: "/list-coupon",
    name: "VaBeneCouponListPage",
    component: VaBeneCouponListPage,
  },
  {
    path: "/ajout-coupon/:action/:couponID?",
    name: "VabeneAddCouponPage",
    component: VabeneAddCouponPage,
    props: (route) => ({
      action: String(route.params.action),
      couponID: route.params.couponID
        ? String(route.params.couponID)
        : undefined,
    }),
  },

  // Routes pour les ingrédients de base
  {
    path: "/ingredient-base-list",
    name: "VabeneIngredientBaseListPage",
    component: VabeneIngredientBaseListPage,
  },

  {
    path: "/",
    name: "LoginPage",
    component: LoginPage,
  },
  // {
  //   path: "/forgot-password",
  //   name: "ForgotPasswordPage",
  //   component: ForgotPasswordPage,
  // },
  // {
  //   path: "/reset-password",
  //   name: "ResetPasswordPage",
  //   component: ResetPasswordPage,
  // },
  // {
  //   path: "/email-confirmation",
  //   name: "EmailConfirmationPage",
  //   component: EmailConfirmationPage,
  // },
  // {
  //   path: "/users-list",
  //   name: "UsersListPage",
  //   component: UsersListPage,
  // },
  // {
  //   path: "/add-user",
  //   name: "AddUserPage",
  //   component: AddUserPage,
  // },
  // {
  //   path: "/pricing",
  //   name: "PricingPage",
  //   component: PricingPage,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  linkExactActiveClass: "active",
  routes: routes,
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

// 🔐 Applique le guard d'authentification à toutes les routes
router.beforeEach(authGuard);

export default router;
