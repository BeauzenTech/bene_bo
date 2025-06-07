import axios, { AxiosResponse } from "axios";


import { apiConfig } from "@/config/baseUrl";
import {
    ApiResponse, PaginatedCategorie,
    PaginatedFrachises, PaginatedIngredient, PaginatedMethodePaiement,
    PaginatedOrder, PaginatedOrderType, PaginatedPayment, PaginatedProduct,
    PaginatedRestaurant,
    PaginatedUsers
} from "@/models/Apiresponse";
import {UserGeneralKey} from "@/models/user.generalkey";
import {UserModel} from "@/models/user.model";
import {OrderModel} from "@/models/order.model";
import {PaymentModel} from "@/models/payment.model";
import {CategorieModel} from "@/models/categorie.model";
import {IngredientModel} from "@/models/ingredient.model";
import {SellModel} from "@/models/vente.model";
import {PeriodiqueCardReport} from "@/models/periodiqueCardReport.model";
import {ProductModel} from "@/models/product.model";

const apiClient = axios.create({
    baseURL: apiConfig.baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
})


const apiClientFormData = axios.create({
    baseURL: apiConfig.baseURL,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accepts': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
})



// 🔐 Interceptor de requête : Ajoute le token d'authentification
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(UserGeneralKey.USER_TOKEN); // ou un autre système de stockage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClientFormData.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// CRUD USER

// Fonction pour se connecter
export const loginCheck = async (auth): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/login_check', auth);
        return response.data
    } catch (error) {
        console.error("Erreur lors de la tentative de connection.", error);
        throw error;
    }
};

// Fonction pour créer un utilisateur peut importe son role
export const createUser = async (userData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/user', userData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation d'un compte utilisateur", error);
        throw error;
    }
};

export const getUserData = async (): Promise<ApiResponse<UserModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/v1/user/detail`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const listeUser = async (page = 1): Promise<ApiResponse<PaginatedUsers>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/v1/user/all?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

// Fonction pour supprimée un compte utilisateur
export const deleteUser = async (userID: string): Promise<ApiResponse<void>> => {
    try {
        const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/v1/user/delete/${userID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du compte', error);
        throw error;
    }
};

// Fonction pour detail  d'un compte utilisateur
export const detailUser = async (userID: string): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(`/user/detail/${userID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la lecture du compte utilisateur', error);
        throw error;
    }
};

// Fonction pour mettre a jour un compte utilisateur
export const updateUser = async (userID: string, userData): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/user/update/${userID}`, userData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du compte utilisateur.', error);
        throw error;
    }
};

// Fonction pour mettre a jour un compte utilisateur
export const toggleActivationUser = async (userID: string, userData): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/user/activate/${userID}`, userData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du toggle activation du compte utilisateur.', error);
        throw error;
    }
};



// Fonction pour detail  d'un compte utilisateur
export const fetchAllPostalCode = async (): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(`/region/codePostal/all`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recherche des  postalCode', error);
        throw error;
    }
};


// FRANCHISE
export const listefranchises = async (page = 1): Promise<ApiResponse<PaginatedFrachises>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/v1/franchise/filter/existing?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

// Fonction pour créer d'une franchise
export const createFranchise = async (franchiseData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/v1/franchise', franchiseData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation d'une franchise", error);
        throw error;
    }
};

//active or desactive franchise
export const toggleActivationFranchise = async (franchiseID: string, franchiseData): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/franchise/activate/${franchiseID}`, franchiseData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du toggle activation de la frachise.', error);
        throw error;
    }
};

// Fonction pour supprimée une franchise
export const deleteFranchise = async (franchiseID: string): Promise<ApiResponse<void>> => {
    try {
        const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/v1/franchise/delete/${franchiseID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de la franchise', error);
        throw error;
    }
};

export const listeRestaurant = async (page = 1): Promise<ApiResponse<PaginatedRestaurant>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/restaurant/filter/active?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const createRestaurant = async (restaurantData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/v1/restaurant', restaurantData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation d'un restaurant", error);
        throw error;
    }
};

// Fonction pour créer d'une commande
export const createNewOrder = async (orderData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/initial/order', orderData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation d'une commande", error);
        throw error;
    }
};


export const listeOrder = async (page = 1): Promise<ApiResponse<PaginatedOrder>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const userID = localStorage.getItem(UserGeneralKey.USER_ID);
        // https://posme.pharmakilivreservice.com/api/initial/v1/orders/admin?page=1
        const response = await apiClient.get(`/initial/v1/orders/admin/${userID}?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const detailOrder = async (orderID): Promise<ApiResponse<OrderModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {

        // https://posme.pharmakilivreservice.com/api/initial/v1/orders/admin?page=1
        const response = await apiClient.get(`/initial/v1/order/detail/${orderID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const listeMethodePaiement = async (page = 1): Promise<ApiResponse<PaginatedMethodePaiement>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/methode_paiement/filter/active?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const listeOrderType = async (page = 1): Promise<ApiResponse<PaginatedOrderType>> => {
    // eslint-disable-next-line no-useless-catch
    try {

        const response = await apiClient.get(`/orderType/filter/active?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};


export const allStatusOrder = async (): Promise<ApiResponse<string[]>> => {
    // eslint-disable-next-line no-useless-catch
    try {

        const response = await apiClient.get(`/initial/order/status/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const allStatusPaiementOrder = async (): Promise<ApiResponse<string[]>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/initial/order/paiement/status/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const updateOrder = async (orderID, orderData): Promise<ApiResponse<OrderModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.put(`/initial/order/update/${orderID}`, orderData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const listePayment = async (page = 1): Promise<ApiResponse<PaginatedPayment>> => {
    // eslint-disable-next-line no-useless-catch
    try {

        const response = await apiClient.get(`/initial/order/payment/all?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const detailPaiement = async (paymentID): Promise<ApiResponse<PaymentModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/initial/order/paymennt/detail/${paymentID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// Fonction pour créer un utilisateur peut importe son role
export const createCategorie = async (categorieData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/v1/category', categorieData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation de la categorie", error);
        throw error;
    }
};


export const listeCategorie = async (page = 1): Promise<ApiResponse<PaginatedCategorie>> => {
    // eslint-disable-next-line no-useless-catch
    try {

        const response = await apiClient.get(`/category/filter/existing?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const listeCategorieActive = async (page = 1): Promise<ApiResponse<PaginatedCategorie>> => {
    // eslint-disable-next-line no-useless-catch
    try {

        const response = await apiClient.get(`/category/filter/active?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const detailCategorie = async (categorieID): Promise<ApiResponse<CategorieModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/category/detail/${categorieID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fonction pour créer un utilisateur peut importe son role
export const updateCategorie = async (categorieID, categorieData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/category/update/${categorieID}`, categorieData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation de la categorie", error);
        throw error;
    }
};

// Fonction pour supprimée un compte utilisateur
export const deleteCategorie = async (categorieID: string): Promise<ApiResponse<void>> => {
    try {
        const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/v1/category/delete/temporary/${categorieID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de la categorie', error);
        throw error;
    }
};

// Fonction pour mettre a jour un compte utilisateur
export const toggleActivationCategorie = async (categorieID: string, categorieData): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/category/activate/${categorieID}`, categorieData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du toggle activation de la categorie.', error);
        throw error;
    }
};


export const createIngredient = async (ingredientData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/v1/add/ingredient', ingredientData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation de ingredient", error);
        throw error;
    }
};



export const listeIngredient = async (page = 1): Promise<ApiResponse<PaginatedIngredient>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/v1/add/ingredient/filter/all?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const detailIngredient = async (ingredientID): Promise<ApiResponse<IngredientModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/v1/add/ingredient/detail/${ingredientID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateIngredient = async (ingredientID, ingredientData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/add/ingredient/update/${ingredientID}`, ingredientData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise a jour d'ingredient", error);
        throw error;
    }
};

export const deleteIngredient = async (ingredientID: string): Promise<ApiResponse<void>> => {
    try {
        const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/v1/add/ingredient/delete/${ingredientID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression ingredient', error);
        throw error;
    }
};


export const toggleActivationIngredient = async (ingredientID: string, ingredientData): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/add/ingredient/activate/${ingredientID}`, ingredientData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du toggle activation de ingredient.', error);
        throw error;
    }
};

export const createProduct = async (productData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/v1/product', productData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation de produit", error);
        throw error;
    }
};


export const listeProducts = async (page = 1, filter: string, filterData): Promise<ApiResponse<PaginatedProduct>> => {
    // eslint-disable-next-line no-useless-catch
    try {

        const response = await apiClient.post(`/product/filter/${filter}?page=${page}`, filterData);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const updateProduct = async (productID, productData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/product/update/${productID}`, productData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise a jour du produit", error);
        throw error;
    }
};

export const updateVariationProduct = async (productID, varationData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/product/variation/update/${productID}`, varationData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise a jour de la variation produit", error);
        throw error;
    }
};

export const removeVariationProduct = async (productID: string, variationID: string): Promise<ApiResponse<void>> => {
    try {
        const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/v1/product/variation/remove/${productID}/${variationID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de la variation du produit', error);
        throw error;
    }
};




export const toggleActivationProduct = async (productID: string, productData): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/product/activate/${productID}`, productData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du toggle activation de ingredient.', error);
        throw error;
    }
};

export const toggleActivationFeatureProduct = async (productID: string, productData): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/product/state/toggle/${productID}`, productData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du toggle activation de ingredient.', error);
        throw error;
    }
};

export const detailProduct = async (productID): Promise<ApiResponse<ProductModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/product/detail/${productID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteProductTemporary = async (productID: string): Promise<ApiResponse<void>> => {
    try {
        const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/v1/product/delete/temporary/${productID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression ingredient', error);
        throw error;
    }
};

export const reportVenteAdmin = async (): Promise<ApiResponse<SellModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/initial/order/report`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const reportVenteRestaurant = async (restaurantID: string): Promise<ApiResponse<SellModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/initial/order/report/${restaurantID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const reportPeriodiqueCard = async (): Promise<ApiResponse<PeriodiqueCardReport>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/initial/order/periodique_report`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const reportPeriodiqueCardById = async (restaurantID: string): Promise<ApiResponse<PeriodiqueCardReport>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/initial/order/periodique_report/${restaurantID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};







// Upload file
export const uploadFile = async (file: File): Promise<ApiResponse<any>> => {
    try {
        const formData = new FormData();
        formData.append("file", file); // "file" = nom attendu côté backend

        const response: AxiosResponse<ApiResponse<any>> = await apiClientFormData.post('/v1/upload', formData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'upload du fichier", error);
        throw error;
    }
};

// Fonction pour supprimée un compte utilisateur
export const deleteFileUpload = async (public_idData): Promise<ApiResponse<void>> => {
    try {
        const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/v1/upload/delete/${public_idData}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du fichier uploader', error);
        throw error;
    }
};