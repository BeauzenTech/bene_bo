interface NotificationPayload {
    notification?: {
        title?: string;
        body?: string;
    };
    data?: {
        sound?: string;
        orderId?: string;
        type?: string;
        [key: string]: string | undefined;
    };
}