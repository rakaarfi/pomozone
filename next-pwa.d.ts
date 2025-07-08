// next-pwa.d.ts
declare module 'next-pwa' {
    import { NextConfig } from 'next';

    interface NextPWAConfig {
        dest?: string;
        register?: boolean;
        skipWaiting?: boolean;
        disable?: boolean;
        [key: string]: any;
    }

    function withPWA(config: NextPWAConfig): (nextConfig: NextConfig) => NextConfig;

    export = withPWA;
}