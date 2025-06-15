// src/styles/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            night: string;
            gold: string;
            [key: string]: string;
        };
        fonts: {
            serif: string;
            sans: string;
        };
        borderRadius: string;
        shadows: {
            glow: string;
            boxShadow: string;
        };
    }
}