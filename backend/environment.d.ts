declare namespace NodeJS {
    interface ProcessEnv {
        PUSHER_APP_ID: string;
        PUSHER_APP_KEY: string;
        PUSHER_APP_SECRET: string;
        PUSHER_APP_CLUSTER: string;
        SENDGRID_API_KEY: string;
        TO_EMAIL: string;
        FROM_EMAIL: string;
        GPIO_OUT: string;
        GPIO_IN: string;
    }
}
