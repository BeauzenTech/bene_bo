import { io, Socket } from 'socket.io-client';
import { UserRole } from '@/models/user.generalkey';
import { apiConfig } from '@/config/baseUrl';

class SocketService {
  private socket: Socket | null = null;
  private restaurantId: string | null = null;
  private userRole: string | null = null;

  constructor() {
    this.userRole = localStorage.getItem('USER_ROLE');
    this.restaurantId = localStorage.getItem('USER_RESTAURANT_ID');
  }

  connect(): void {
    if (this.socket?.connected) {
      return;
    }
    const wssUrl = apiConfig.wssURL;
    this.socket = io(wssUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    this.setupEventListeners();
  }

  // Configurer les écouteurs d'événements
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connecté au serveur WebSocket');
      console.log('ID du client:', this.socket?.id);
      
      if (this.userRole === UserRole.RESTAURANT && this.restaurantId) {
        this.joinRestaurant(this.restaurantId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erreur de connexion WebSocket:', error);
    });
    this.socket.on('new-order', (data) => {
      console.log('🔔 Nouvelle commande reçue:', data);
      this.handleNewOrder(data);
    });

    this.socket.on('order-status-changed', (data) => {
      console.log('📝 Statut de commande changé:', data);
      this.handleOrderStatusChange(data);
    });

    this.socket.on('new-order-global', (data) => {
      if (this.userRole === UserRole.FRANCHISE) {
        console.log('🌍 Nouvelle commande globale:', data);
        this.handleGlobalOrder(data);
      }
    });
  }

  joinRestaurant(restaurantId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join-restaurant', { restaurantId });
      this.restaurantId = restaurantId;
      console.log(`🏪 Rejoint le restaurant: ${restaurantId}`);
    }
  }

  leaveRestaurant(restaurantId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave-restaurant', { restaurantId });
      console.log(`🚪 Quitté le restaurant: ${restaurantId}`);
    }
  }

  private handleNewOrder(data: any): void {
    // Vérifier si la commande est pour ce restaurant
    if (this.userRole === UserRole.RESTAURANT && this.restaurantId) {
      if (data.order?.restaurantId !== this.restaurantId) {
        console.log('🚫 Commande ignorée - pas pour ce restaurant');
        return; // Ignorer la commande si elle n'est pas pour ce restaurant
      }
    }
    
    console.log('✅ Commande valide pour ce restaurant');
    this.playNotificationSound();
    
    this.showNotification(
      `Nouvelle commande #${data.order?.nif || 'N/A'}`,
      {
        body: `${data.order?.customerName || 'Client'} - ${data.order?.totalPrice || 0} CHF`,
        icon: '/favicon.ico',
        tag: `order-${data.order?.id}`,
        requireInteraction: true
      }
    );

    // Déclencher un événement personnalisé pour que les composants puissent réagir
    window.dispatchEvent(new CustomEvent('new-order-received', { 
      detail: data 
    }));
  }

  // Gérer le changement de statut d'une commande
  private handleOrderStatusChange(data: any): void {
    // Vérifier si le changement concerne ce restaurant
    if (this.userRole === UserRole.RESTAURANT && this.restaurantId) {
      if (data.order?.restaurantId !== this.restaurantId) {
        console.log('🚫 Changement de statut ignoré - pas pour ce restaurant');
        return;
      }
    }
    
    console.log('✅ Changement de statut valide pour ce restaurant');
    // Déclencher un événement personnalisé
    window.dispatchEvent(new CustomEvent('order-status-changed', { 
      detail: data 
    }));
  }

  // Gérer les commandes globales (pour les franchisés)
  private handleGlobalOrder(data: any): void {
    this.playNotificationSound();
    
    this.showNotification(
      `Nouvelle commande - ${data.restaurantName}`,
      {
        body: `Commande #${data.order?.nif} - ${data.order?.totalPrice} CHF`,
        icon: '/favicon.ico',
        tag: `global-order-${data.order?.id}`
      }
    );

    window.dispatchEvent(new CustomEvent('global-order-received', { 
      detail: data 
    }));
  }

  // Jouer un son de notification
  private playNotificationSound(): void {
    try {
      // Créer un son de notification simple
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Impossible de jouer le son de notification:', error);
    }
  }

  // Afficher une notification du navigateur
  private showNotification(title: string, options: NotificationOptions): void {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, options);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, options);
          }
        });
      }
    }
  }

  // Déconnecter le socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Vérifier si connecté
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Obtenir l'ID du socket
  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

// Instance singleton
const socketService = new SocketService();

export default socketService;
