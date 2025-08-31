// src/utils/websocket.js
import ReconnectingWebSocket from 'reconnecting-websocket';

const options = {
    connectionTimeout: 1000,
    maxRetries: 10,
    maxReconnectionDelay: 5000,
    minReconnectionDelay: 1000 + Math.random() * 4000,
};

const socket = new ReconnectingWebSocket('wss://backend.vabenepizza.ch/ws', [], options);

export default socket;
