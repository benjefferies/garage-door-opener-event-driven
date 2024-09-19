declare namespace NodeJS {
    interface ProcessEnv {
        PUSHER_APP_ID: string;
        PUSHER_APP_SECRET: string;
        NEXT_PUBLIC_PUSHER_APP_KEY: string;
        NEXT_PUBLIC_PUSHER_APP_CLUSTER: string;
        PASSAGE_APP_ID: string;
        PASSAGE_API_KEY: string;
    }
}
