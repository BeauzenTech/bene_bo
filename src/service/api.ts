import axios, { AxiosResponse } from "axios";


import { apiConfig } from "@/config/baseUrl";
import {
    ApiResponse, PaginatedCampagne, PaginatedCategorie, PaginatedCoupon, PaginatedCustomer,
    PaginatedFrachises, PaginatedIngredient, PaginatedMethodePaiement, PaginatedNotification,
    PaginatedOrder, PaginatedOrderType, PaginatedPayment, PaginatedProduct, PaginatedProgramme,
    PaginatedRestaurant, PaginatedRestaurantCategory, PaginatedRestaurantProduct, PaginatedCategories, CategoriesApiResponse, CategoriesApiFullResponse,
    PaginatedUsers
} from "@/models/Apiresponse";
import {UserGeneralKey, UserRole} from "@/models/user.generalkey";
import {UserModel} from "@/models/user.model";
import {OrderModel} from "@/models/order.model";
import {PaymentModel} from "@/models/payment.model";
import {CategorieModel} from "@/models/categorie.model";
import {IngredientModel} from "@/models/ingredient.model";
import {SellModel} from "@/models/vente.model";
import {PeriodiqueCardReport} from "@/models/periodiqueCardReport.model";
import {ProductModel} from "@/models/product.model";
import {CampagneModel} from "@/models/campagne.model";
import {NotificationModel} from "@/models/notification.model";
import {CustomerModel} from "@/models/customer.model";
import {TopProductSellModel} from "@/models/TopProductSell.model";
import {AverageReportModel} from "@/models/averageReport.model";
import {FranchiseModel} from "@/models/franchise.model";
import {RestaurantModel} from "@/models/restaurant.model";
import {RatioModel} from "@/models/ratio.model";
import {ProgrammeModel} from "@/models/programme.model";
import {ImpressionModel} from "@/models/impression.model";
import {CouponModel} from "@/models/coupon.model";
import { CreateIngredientBaseRequest, IngredientBaseModel, UpdateIngredientBaseRequest } from "@/models/ingredientBase.model";

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


const apiTicketLocalFormData = axios.create({
    baseURL: apiConfig.localURL,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accepts': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
})

// okkkk

// 🔐 Interceptor de requête : Ajoute le token d'authentification
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
        if (token && token !== 'undefined' && token !== 'null') {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 🔐 Interceptor de réponse : Gère l'expiration des tokens
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Vérifie si l'erreur est due à un token expiré (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            console.warn('🔐 Token expiré détecté, déconnexion automatique...');
            
            // Déconnecte l'utilisateur
            UserGeneralKey.logout();
            
            // Redirige vers la page de login
            window.location.href = '/';
            
            return Promise.reject(new Error('Token expiré - Redirection vers la page de connexion'));
        }
        
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

// 🔐 Interceptor de réponse pour FormData : Gère l'expiration des tokens
apiClientFormData.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Vérifie si l'erreur est due à un token expiré (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            console.warn('🔐 Token expiré détecté, déconnexion automatique...');
            
            // Déconnecte l'utilisateur
            UserGeneralKey.logout();
            
            // Redirige vers la page de login
            window.location.href = '/';
            
            return Promise.reject(new Error('Token expiré - Redirection vers la page de connexion'));
        }
        
        return Promise.reject(error);
    }
);


// CRUD USER

// Fonction pour se connecter
export const loginCheck = async (auth): Promise<ApiResponse<any>> =>{
    try {
        // Pour la connexion, on n'utilise pas apiClient car il n'y a pas encore de token
        const response: AxiosResponse<ApiResponse<any>> = await axios.post(`${apiConfig.baseURL}/login_check`, auth, {
            headers: {
                'Content-Type': 'application/json',
                'Accepts': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        return response.data
    } catch (error) {
        console.error("Erreur lors de la tentative de connection.", error);
        throw error;
    }
};

// Fonction pour se connecter
export const resetPasswordStepOne = async (email): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/user/reset_password', email);
        return response.data
    } catch (error) {
        console.error("Erreur lors de la reinitialisation de password.", error);
        throw error;
    }
};

// Fonction pour se connecter
export const resetPasswordStepTwo = async (resetData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put('/user/reset_password/update', resetData);
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
        const response = await apiClient.get(`/v1/user/all/gestion?page=${page}`);
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
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(`/v1/user/detail/${userID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la lecture du compte utilisateur', error);
        throw error;
    }
};

// Fonction pour mettre a jour un compte utilisateur
export const updateUser = async (userID: string, userData): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/user/update/${userID}`, userData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du compte utilisateur.', error);
        throw error;
    }
};

export const updateUserPassword = async (userID: string, userData): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/user/password/${userID}`, userData);
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
        const restaurantId = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID);
        if (!restaurantId) {
            throw new Error('Restaurant ID non trouvé dans le localStorage');
        }
        
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(`/v1/delivery/restaurant/${restaurantId}/postal-codes`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recherche des codes postaux', error);
        throw error;
    }
};

// Fonction pour récupérer les adresses d'un utilisateur
export const getUserAddresses = async (userID: string): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(`/v1/user/adresseLocal/${userID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des adresses utilisateur', error);
        throw error;
    }
};

// Fonction pour appliquer un coupon
export const applyCoupon = async (couponData: {
    coupon: string;
    email: string;
    amount: string;
}): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/coupon/order/apply', couponData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'application du coupon', error);
        throw error;
    }
};

// Fonction pour récupérer les détails du restaurant
export const getRestaurantDetails = async (restaurantID: string): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(`/restaurant/detail/${restaurantID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du restaurant', error);
        throw error;
    }
};

// Fonction pour récupérer tous les codes postaux
export const getAllPostalCodes = async (): Promise<ApiResponse<any>> => {
    try {
        const restaurantId = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID);
        if (!restaurantId) {
            throw new Error('Restaurant ID non trouvé dans le localStorage');
        }
        
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(`/v1/delivery/restaurant/${restaurantId}/postal-codes`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des codes postaux', error);
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

export const detailFranchise = async (franchiseID): Promise<ApiResponse<FranchiseModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/v1/franchise/detail/${franchiseID}`);
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

// Fonction pour créer d'une franchise
export const updateFranchise = async (franchiseID: string,franchiseData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/franchise/update/${franchiseID}`, franchiseData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise a jour de la franchise", error);
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
        const response = await apiClient.get(`/restaurant/filter/existing?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};


export const detailRestaurant = async (restaurantID): Promise<ApiResponse<RestaurantModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/restaurant/detail/${restaurantID}`);
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
export const updateRestaurant = async (restaurantID: string, restaurantData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/restaurant/update/${restaurantID}`, restaurantData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise a jour de la franchise", error);
        throw error;
    }
};

// Fonction pour mettre a jour un compte utilisateur
export const toggleRestaurant = async (restaurantID: string, restaurantData): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/restaurant/activate/${restaurantID}`, restaurantData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du toggle activation du compte utilisateur.', error);
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

// Fonction pour supprimée un compte utilisateur
export const deleteRestaurant = async (restaurantID: string): Promise<ApiResponse<void>> => {
    try {
        const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/v1/restaurant/delete/${restaurantID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du compte', error);
        throw error;
    }
};

// Fonction pour créer d'une commande
export const createNewOrder = async (orderData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/initial/order', []);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation d'une commande", error);
        throw error;
    }
};

// Créer une commande POS simplifiée pour click_collect (sur place)
export const createPOSOrder = async (orderData: any): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/v1/orders', orderData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création d'une commande POS", error);
        throw error;
    }
};

// Récupérer la liste des clients pour un restaurant
export const getCustomers = async (page = 1, restaurantID: string): Promise<ApiResponse<any>> => {
    try {
        // L'interceptor ajoute automatiquement le header Authorization
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(
            `/v1/customer/all/0/all`
        );
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des clients", error);
        throw error;
    }
};

export const listeOrder = async (
    page: number = 1, 
    limit: number = 10, 
    search?: string, 
    status?: string
): Promise<ApiResponse<PaginatedOrder>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID);
        const role = localStorage.getItem(UserGeneralKey.USER_ROLE)
        const id = role === UserRole.FRANCHISE ? 'all' : restaurantID
        
        // Construire les paramètres de requête
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });
        
        if (search) {
            params.append('search', search);
        }
        
        if (status) {
            params.append('status', status);
        }
        
        const response = await apiClient.get(`/v1/restaurants/${id}/orders?${params.toString()}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data
        );
    } catch (error) {
        throw error;
    }
};


export const listeOrderByAdmin = async (
    page: number = 1, 
    limit: number = 10, 
    restaurantID: string,
    search?: string, 
    status?: string
): Promise<ApiResponse<PaginatedOrder>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        
        // Construire les paramètres de requête
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });
        
        if (search) {
            params.append('search', search);
        }
        
        if (status) {
            params.append('status', status);
        }
        
        const response = await apiClient.get(`/v1/restaurants/${restaurantID}/orders?${params.toString()}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data
        );
    } catch (error) {
        throw error;
    }
};


export const detailOrder = async (orderID): Promise<ApiResponse<OrderModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {

        // https://posme.pharmakilivreservice.com/api/initial/v1/orders/admin?page=1
        const response = await apiClient.get(`/v1/orders/${orderID}`);
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

export const listePayment = async (
    page = 1, 
    limit = '20', 
    search?: string, 
    status?: string, 
    paymentMethod?: string, 
    isArchived?: boolean
): Promise<ApiResponse<PaginatedPayment>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit);
        
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (paymentMethod) params.append('paymentMethod', paymentMethod);
        if (isArchived !== undefined) params.append('isArchived', isArchived.toString());

        const response = await apiClient.get(`/v1/transactions?${params.toString()}`);
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
        const response = await apiClient.get(`/v1/transactions/${paymentID}`);
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


export const listeCategorie = async (page = 1, usePagination: string): Promise<ApiResponse<PaginatedCategorie>> => {
    // eslint-disable-next-line no-useless-catch
    try {

        const response = await apiClient.get(`/category/filter/existing/${usePagination}?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

// Nouvelle fonction pour récupérer toutes les catégories via l'endpoint v1/category/all
export const getAllCategories = async (
    page?: number, 
    limit?: number, 
    search?: string
): Promise<ApiResponse<{ data: CategorieModel[], pagination: any }>> => {
    try {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (search) params.append('search', search);

        const url = `/v1/category/all?${params.toString()}`;
        
        const response = await apiClient.get(url);
        
        const result = new ApiResponse(
            response.data.code,
            response.data.message,
            {
                data: response.data.data,
                pagination: response.data.pagination
            }
        );
        
        return result;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des catégories", error);
        throw error;
    }
};

// Nouvelle fonction pour récupérer les produits par catégorie via l'endpoint v1/product/category/:categoryId
export const getProductsByCategory = async (
    categoryId: string,
    page?: number,
    limit?: number
): Promise<ApiResponse<{ data: ProductModel[], pagination: any }>> => {
    try {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());

        const url = `/v1/product/category/${categoryId}?${params.toString()}`;
        
        const response = await apiClient.get(url);
        
        const result = new ApiResponse(
            response.data.code,
            response.data.message,
            {
                data: response.data.data,
                pagination: response.data.pagination
            }
        );
        
        return result;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des produits par catégorie", error);
        throw error;
    }
};


export const addRestaurantCategorie = async (categorieID: string): Promise<ApiResponse<any>> =>{
    try {
        const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID);
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/restaurant/categorie/addcategorie_restaurant/${restaurantID}/${categorieID}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout de restaurant de la categorie", error);
        throw error;
    }
};

export const listeRestaurantCategorie = async (
    page = 1, 
    usePagination: string, 
    search?: string
): Promise<CategoriesApiFullResponse> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const limit = usePagination === '1' ? '10' : '1000'; // Si pagination activée, limite à 10, sinon 1000
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const response = await apiClient.get(`/v1/category/all?page=${page}&limit=${limit}${searchParam}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const toggleActivationCategorieRestaurant = async (categorieID: string): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/restaurant/categorie/toggle/${categorieID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du toggle activation de la categorie.', error);
        throw error;
    }
};


export const deleteRestaurantCategorie = async (restaurantCategorieID: string): Promise<ApiResponse<void>> => {
    try {
        const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID);
        const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/v1/restaurant/categorie/remove/${restaurantID}/${restaurantCategorieID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de la categorie', error);
        throw error;
    }
};

export const listeRestaurantProduct = async (page = 1, usePagination: string, categoryId?: string): Promise<ApiResponse<PaginatedRestaurantProduct>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID);

        const path = [
            `/restaurant/products/${restaurantID}/0/${usePagination}`,
            categoryId
        ]
            .filter(Boolean)
            .join('/');

        const url = `${path}?page=${page}`;
        const response = await apiClient.get(url);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const toggleActivationProductRestaurant = async (productID: string): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/restaurant/product/toggle/${productID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du toggle activation du produit.', error);
        throw error;
    }
};



export const listeCategorieActive = async (page = 1, usePagination: string): Promise<ApiResponse<PaginatedCategorie>> => {
    // eslint-disable-next-line no-useless-catch
    try {

        const response = await apiClient.get(`/category/filter/active/${usePagination}?page=${page}`);
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



export const listeIngredient = async (page = 1, usePagination: string): Promise<ApiResponse<PaginatedIngredient>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/v1/ingredient/all`);
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

export const updateVariationIngredient = async (ingredientID, varationData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/add/ingredient/variation/update/${ingredientID}`, varationData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise a jour de la variation ingredient", error);
        throw error;
    }
};

export const deleteIngredientVariation = async (ingredientID: string, variationID: string): Promise<ApiResponse<void>> => {
    try {
        const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/v1/add/ingredient/variation/delete/${ingredientID}/${variationID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de variation ingredient', error);
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


export const listeProducts = async (page = 1, usePagination: string , filter: string, filterData): Promise<ApiResponse<PaginatedProduct>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.post(`/product/filter/${filter}/${usePagination}?page=${page}`, filterData);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
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



export const deleteProductTemporary = async (productID: string): Promise<ApiResponse<void>> => {
    try {
        const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/v1/product/delete/temporary/${productID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression ingredient', error);
        throw error;
    }
};

export const reportVenteAdmin = async (restaurantID?: string): Promise<ApiResponse<SellModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const url = [
            `/statistics/restaurant`,
            restaurantID,
        ]
            .filter(Boolean) // retire les undefined
            .join('/');
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const reportVenteRestaurant = async (restaurantID?: string): Promise<ApiResponse<SellModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/statistics/restaurant/${restaurantID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const reportRestaurants = async (restaurantID?: string): Promise<ApiResponse<SellModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/statistics/restaurants`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const salesReportRestaurants = async (): Promise<ApiResponse<SellModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/statistics/sales-report`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const reportPeriodiqueCard = async (
    restaurantID?: string,
    filters?: {
        paymentMethod?: string;
        orderType?: string;
        startDate?: string;
        endDate?: string;
    }
): Promise<ApiResponse<PeriodiqueCardReport>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const url = [
            `/periodique_report`,
            restaurantID,
        ]
            .filter(Boolean) // retire les undefined
            .join('/');
        
        // Utiliser des filtres par défaut si aucun filtre n'est fourni
        const defaultFilters = {
            paymentMethod: 'all',
            orderType: 'all',
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 jours en arrière
            endDate: new Date().toISOString().split('T')[0] // aujourd'hui
        };
        
        const finalFilters = filters || defaultFilters;
        
        // Construire les paramètres de requête
        const queryParams = new URLSearchParams();
        if (finalFilters.paymentMethod && finalFilters.paymentMethod !== 'all') {
            queryParams.append('paymentMethod', finalFilters.paymentMethod);
        }
        if (finalFilters.orderType && finalFilters.orderType !== 'all') {
            queryParams.append('orderType', finalFilters.orderType);
        }
        if (finalFilters.startDate) {
            queryParams.append('startDate', finalFilters.startDate);
        }
        if (finalFilters.endDate) {
            queryParams.append('endDate', finalFilters.endDate);
        }
        
        const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
        const response = await apiClient.get(fullUrl);
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


// CAMPAGNE

export const createCampagne = async (campagneData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/v1/campaigns', campagneData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation de campagne", error);
        throw error;
    }
};

export const listeCampagne = async (page = 1, limit = 10, search = ''): Promise<ApiResponse<PaginatedCampagne>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (search) params.append('search', search);

        const response = await apiClient.get(`/v1/campaigns?${params.toString()}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const detailCampagne = async (campgneID): Promise<ApiResponse<CampagneModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/v1/campaigns/${campgneID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// NOTIFICATION


export const createNotification = async (notificationData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/v1/push-notifications', notificationData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation de notification", error);
        throw error;
    }
};

export const listeNotification = async (page = 1, limit = 10, search = '', status = ''): Promise<ApiResponse<PaginatedNotification>> => {
    // eslint-disable-next-line no-useless-catch
    try {

        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (status) params.append('status', status);

        const response = await apiClient.get(`/v1/push-notifications?${params.toString()}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

// COUPON


export const createCoupon = async (couponData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/coupons', couponData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation du coupon", error);
        throw error;
    }
};

export const disableCoupon = async (code, couponData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/coupon/order/disable/${code}`, couponData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la desactivation du coupon", error);
        throw error;
    }
};

export const detailCoupon = async (couponID): Promise<ApiResponse<CouponModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/coupons/details/${couponID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCoupon = async (couponId, couponData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.patch(`/coupons/update/${couponId}`, couponData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation de la categorie", error);
        throw error;
    }
};


export const listeCoupon = async (page = 1): Promise<ApiResponse<PaginatedCoupon>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/coupons?page=${page}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const deleteCoupon = async (couponID: string): Promise<ApiResponse<void>> => {
    try {
        const response: AxiosResponse<ApiResponse<void>> = await apiClient.delete(`/coupons/${couponID}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du coupon', error);
        throw error;
    }
};

export const listeProgramme = async (page = 1): Promise<ApiResponse<PaginatedProgramme>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/v1/programme/all`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const detailProgramme = async (programmeID): Promise<ApiResponse<ProgrammeModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/v1/programme/${programmeID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const updateProgramme = async (programmeID, programmeData): Promise<ApiResponse<any>> =>{
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/programme/${programmeID}`, programmeData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la creation de la categorie", error);
        throw error;
    }
};

export const toggleActivationProgramme = async (programmeData): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/v1/programme/active`, programmeData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du toggle activation du programme.', error);
        throw error;
    }
};

export const detailNotification = async (notificationID): Promise<ApiResponse<NotificationModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/v1/push-notifications/${notificationID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getAllCustomers = async (
    page?: number,
    limit?: number,
    search?: string
): Promise<ApiResponse<{ data: CustomerModel[], pagination: any }>> => {
    try {

        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (search) params.append('search', search);

        const url = `/v1/customers/all?${params.toString()}`;

        const response = await apiClient.get(url);

        const result = new ApiResponse(
            response.data.code,
            response.data.message,
            {
                data: response.data.data,
                pagination: response.data.pagination
            }
        );

        return result;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des clients", error);
        throw error;
    }
};

export const detailCustomer = async (customerID): Promise<ApiResponse<CustomerModel>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await apiClient.get(`/v1/user/detail/${customerID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const printTicketLocally = async (
    pdfFile: File
): Promise<AxiosResponse<any>> => {
    try {
        const formData = new FormData();
        formData.append("fichier", pdfFile); // Clé "fichier" comme dans le curl

        // Using with fetch
        const response = (await fetch("http://localhost:8080/print.php", {
            method: "POST",
            body: formData,
        })) as unknown as AxiosResponse<any>;

        /* const response = await apiTicketLocalFormData.post("/print.php", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }); */

        return response;
    } catch (error) {
        console.error("Erreur lors de l'envoi du PDF", error);
        throw error;
    }
};

export const topProductReportSell = async (categoryID, restaurantID): Promise<ApiResponse<TopProductSellModel[]>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const url = [
            `/v1/report_sale/products`,
            categoryID,
            restaurantID
        ]
            .filter(Boolean) // retire les undefined
            .join('/');
        const response = await apiClient.get(url);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

/* eslint-disable */
export const getAdvancedSalesReport = async (
    restaurantId: string,
    startDate: string,
    endDate: string,
    orderType: string,
    paymentMethod: string,
    deliveryType: string,
): Promise<ApiResponse<any>> => {
    try {
        // Nettoyer les dates en remplaçant les espaces par des tirets et en supprimant les secondes
        const cleanStartDate = startDate.replace(/\s/g, '-').replace(/:\d{2}$/, '');
        const cleanEndDate = endDate.replace(/\s/g, '-').replace(/:\d{2}$/, '');
        
        const url = `/v1/report_sale/${restaurantId}/${cleanStartDate}/${cleanEndDate}/${orderType}/${paymentMethod}/${deliveryType}`;
        const response = await apiClient.get(url);

        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const tauxCommandeCategorie = async (
    categoryID: string,
    startDate: string,
    endDate: string,
    restaurantID: string,
    paymentMethode: string,
    orderType: string,
): Promise<ApiResponse<RatioModel>> => {
    try {
        // Nettoyer les dates en remplaçant les espaces par des tirets et en supprimant les secondes
        const cleanStartDate = startDate.replace(/\s/g, '-').replace(/:\d{2}$/, '');
        const cleanEndDate = endDate.replace(/\s/g, '-').replace(/:\d{2}$/, '');
        
        const url = `/v1/report_sale/tauxcommande/${categoryID}/${cleanStartDate}/${cleanEndDate}/${restaurantID}/${paymentMethode}/${orderType}`;
        const response = await apiClient.get(url);

        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};


/* eslint-disable */
export const nombreCommandeParProduct = async (
    productID: string,
    startDate: string,
    endDate: string,
    restaurantID: string,
    paymentMethode: string,
    orderType: string,
): Promise<ApiResponse<RatioModel>> => {


    try {
        const url = `/v1/report_sale/nombrecommande/${productID}/${startDate}/${endDate}/${restaurantID}/${paymentMethode}/${orderType}`;
        const response = await apiClient.get(url);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const averageReportSell = async (productID: string, restaurantID?: string): Promise<ApiResponse<AverageReportModel[]>> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const url = [
            `/v1/report_sale/average/${productID}`,
            restaurantID
        ]
            .filter(Boolean) // retire les undefined
            .join('/');
        const response = await apiClient.get(url);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
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

export const calculateMinimumAmount = async (codePostal: string,localite: string, restaurantId: string): Promise<ApiResponse<any>> => {
    try {
        const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(`/v1/zone/calculate-minimum-amount?codePostal=${codePostal}&localite=${localite}&restaurantId=${restaurantId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du calcul du minimum de commande', error);
        throw error;
    }
};

// ==================== INGRÉDIENTS DE BASE ====================

/* eslint-disable */
export const listeIngredientBase = async (
    page: number = 1,
    limit: number = 10,
    search?: string
): Promise<ApiResponse<IngredientBaseModel[]>> => {
    try {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (search) params.append('search', search);
        const url = `/v1/ingredient-base/all?${params.toString()}`;
        const response = await apiClient.get(url);

        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const detailIngredientBase = async (
    ingredientBaseID: string
): Promise<ApiResponse<IngredientBaseModel>> => {
    try {
        const url = `/v1/ingredient-base/${ingredientBaseID}`;
        const response = await apiClient.get(url);

        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const createIngredientBase = async (
    payload: CreateIngredientBaseRequest
): Promise<ApiResponse<IngredientBaseModel>> => {
    try {
        const url = `/v1/ingredient-base`;
        const response = await apiClient.post(url, payload);

        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const updateIngredientBase = async (
    ingredientBaseID: string,
    payload: UpdateIngredientBaseRequest
): Promise<ApiResponse<IngredientBaseModel>> => {
    try {
        const url = `/v1/ingredient-base/${ingredientBaseID}`;
        const response = await apiClient.put(url, payload);

        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

export const deleteIngredientBase = async (
    ingredientBaseID: string
): Promise<ApiResponse<void>> => {
    try {
        const url = `/v1/ingredient-base/${ingredientBaseID}`;
        const response = await apiClient.delete(url);

        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        throw error;
    }
};

// Nouvelle fonction pour récupérer tous les ingrédients via l'endpoint v1/ingredient/all
export const getAllIngredients = async (
    page?: number,
    limit?: number,
    search?: string,
    type?: string
): Promise<ApiResponse<{ data: any[], pagination: any }>> => {
    try {

        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (type) params.append('type', type);

        const url = `/v1/ingredient/all?${params.toString()}`;

        const response = await apiClient.get(url);

        const result = new ApiResponse(
            response.data.code,
            response.data.message,
            {
                data: response.data.data,
                pagination: response.data.pagination
            }
        );

        return result;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des ingrédients", error);
        throw error;
    }
};

// ==================== ZONES DE LIVRAISON ====================

// Récupérer les zones de livraison d'un restaurant
export const getDeliveryZonesByRestaurant = async (
    restaurantId: string
): Promise<ApiResponse<any[]>> => {
    try {
        const response = await apiClient.get(`/v1/delivery/restaurant/${restaurantId}/zones`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des zones de livraison", error);
        throw error;
    }
};

// Récupérer une zone de livraison par ID
export const getDeliveryZoneById = async (
    zoneId: string
): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get(`/v1/delivery/zone/${zoneId}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de la zone de livraison", error);
        throw error;
    }
};

// Créer une zone de livraison
export const createDeliveryZone = async (
    restaurantId: string,
    zoneData: {
        name: string;
        minimumOrderAmount: number;
        deliveryFee?: number;
        description?: string;
    }
): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.post(`/v1/delivery/zone/${restaurantId}`, zoneData);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la création de la zone de livraison", error);
        throw error;
    }
};

// Mettre à jour une zone de livraison
export const updateDeliveryZone = async (
    zoneId: string,
    updateData: {
        name?: string;
        minimumOrderAmount?: number;
        deliveryFee?: number;
        description?: string;
        isActive?: boolean;
    }
): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.put(`/v1/delivery/zone/${zoneId}`, updateData);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour de la zone de livraison", error);
        throw error;
    }
};

// Supprimer une zone de livraison
export const deleteDeliveryZone = async (
    zoneId: string
): Promise<ApiResponse<void>> => {
    try {
        const response = await apiClient.delete(`/v1/delivery/zone/${zoneId}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de la zone de livraison", error);
        throw error;
    }
};

// Ajouter des codes postaux à une zone
export const addPostalCodesToZone = async (
    zoneId: string,
    postalCodes: { code: number; locality: string }[]
): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.post(`/v1/delivery/zone/${zoneId}/postal-codes`, postalCodes);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout des codes postaux", error);
        throw error;
    }
};

// Récupérer les codes postaux d'une zone
export const getPostalCodesByZone = async (
    zoneId: string
): Promise<ApiResponse<any[]>> => {
    try {
        const response = await apiClient.get(`/v1/delivery/zone/${zoneId}/postal-codes`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des codes postaux", error);
        throw error;
    }
};

// Supprimer un code postal d'une zone
export const deletePostalCodeFromZone = async (
    zoneId: string,
    postalCode: string
): Promise<ApiResponse<void>> => {
    try {
        const response = await apiClient.delete(`/v1/delivery/zone/${zoneId}/postal-codes/${postalCode}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la suppression du code postal", error);
        throw error;
    }
};

// Modifier un code postal d'une zone
export const updatePostalCodeInZone = async (
    zoneId: string,
    postalCode: string,
    updateData: {
        locality?: string;
        isActive?: boolean;
    }
): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.put(`/v1/delivery/zone/${zoneId}/postal-codes/${postalCode}`, updateData);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la modification du code postal", error);
        throw error;
    }
};

// Récupérer tous les codes postaux d'un restaurant
export const getRestaurantPostalCodes = async (
    restaurantId: string
): Promise<ApiResponse<any[]>> => {
    try {
        const response = await apiClient.get(`/v1/delivery/restaurant/${restaurantId}/postal-codes`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des codes postaux du restaurant", error);
        throw error;
    }
};

// ==================== HORAIRES D'OUVERTURE ====================

// Récupérer les jours d'ouverture d'un restaurant
export const getOpeningDaysByRestaurant = async (
    restaurantId: string
): Promise<ApiResponse<any[]>> => {
    try {
        const response = await apiClient.get(`/v1/opening-days/restaurant/${restaurantId}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des jours d'ouverture", error);
        throw error;
    }
};

// Créer ou mettre à jour les jours d'ouverture en masse
export const createBulkOpeningDays = async (
    restaurantId: string,
    days: Array<{
        dayOfWeek: string;
        status: 'open' | 'closed' | 'partial';
        description?: string;
    }>
): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.post(`/v1/opening-days/bulk`, {
            restaurantId,
            days
        });
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la création des jours d'ouverture", error);
        throw error;
    }
};

// Supprimer un jour d'ouverture
export const deleteOpeningDay = async (
    dayId: string
): Promise<ApiResponse<void>> => {
    try {
        const response = await apiClient.delete(`/v1/opening-days/${dayId}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la suppression du jour d'ouverture", error);
        throw error;
    }
};

// Récupérer les horaires d'ouverture d'un restaurant (formaté)
export const getOpeningHoursByRestaurant = async (
    restaurantId: string
): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get(`/v1/opening-hours/restaurant/${restaurantId}/formatted`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des horaires d'ouverture", error);
        throw error;
    }
};

// Créer ou mettre à jour les horaires d'ouverture en masse
export const createBulkOpeningHours = async (
    restaurantId: string,
    schedules: Array<{
        dayOfWeek: string;
        scheduleType: 'opening' | 'break';
        startTime: string;
        endTime: string;
        description?: string;
    }>
): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.post(`/v1/opening-hours/bulk`, {
            restaurantId,
            schedules
        });
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la création des horaires d'ouverture", error);
        throw error;
    }
};

// Récupérer les horaires d'ouverture d'un restaurant (détaillés)
export const getDetailedOpeningHours = async (
    restaurantId: string
): Promise<ApiResponse<any[]>> => {
    try {
        const response = await apiClient.get(`/v1/opening-hours/restaurant/${restaurantId}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des horaires détaillés", error);
        throw error;
    }
};

// Supprimer un horaire d'ouverture
export const deleteOpeningHour = async (
    hourId: string
): Promise<ApiResponse<void>> => {
    try {
        const response = await apiClient.delete(`/v1/opening-hours/${hourId}`);
        return new ApiResponse(
            response.data.code,
            response.data.message,
            response.data.data
        );
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de l'horaire", error);
        throw error;
    }
};
