declare namespace NodeJS {
    interface ProcessEnv {
        PUSHER_APP_ID: string;
        PUSHER_APP_KEY: string;
        PUSHER_APP_SECRET: string;
        PUSHER_APP_CLUSTER: string;
        NEXT_PUBLIC_PUSHER_APP_KEY: string;
        NEXT_PUBLIC_PUSHER_APP_CLUSTER: string;
    }
}
