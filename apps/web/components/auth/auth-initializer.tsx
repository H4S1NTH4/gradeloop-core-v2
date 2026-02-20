"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";

// --- JWT Decoder (shared or duplicated for simplicity here) ---
function parseJwt(token: string) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export function AuthInitializer() {
    const { accessToken, refresh, setLoading } = useAuthStore();
    const hasInitialized = useRef(false);

    // Initial Refresh
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const initAuth = async () => {
            await refresh();
            setLoading(false);
        };
        initAuth();
    }, [refresh, setLoading]);

    // Auto-refresh timer
    useEffect(() => {
        if (!accessToken) return;

        const decoded = parseJwt(accessToken);
        if (!decoded || !decoded.exp) return;

        const expiryTime = decoded.exp * 1000;
        const currentTime = Date.now();
        const delay = expiryTime - currentTime - 60000; // Refresh 1 minute before expiry

        if (delay <= 0) {
            refresh();
            return;
        }

        const timer = setTimeout(() => {
            refresh();
        }, delay);

        return () => clearTimeout(timer);
    }, [accessToken, refresh]);

    return null; // This component doesn't render anything
}
