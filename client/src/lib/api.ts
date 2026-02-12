const LOCAL_BACKEND_URL = "http://localhost:3001";
const PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.trim() || "";

function resolveBackendUrl() {
    // In production browser runtime, avoid silently using localhost.
    if (PUBLIC_BACKEND_URL) return PUBLIC_BACKEND_URL.replace(/\/$/, "");
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") return "";
    return LOCAL_BACKEND_URL;
}

export const BACKEND_URL = resolveBackendUrl();

export async function fetchFromBackend(path: string, options: RequestInit = {}, getToken?: () => Promise<string | null>) {
    if (!BACKEND_URL) {
        throw new Error("Backend URL is missing in production. Set NEXT_PUBLIC_BACKEND_URL.");
    }

    const url = `${BACKEND_URL}${path}`;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (getToken) {
        const token = await getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    try {
        return await fetch(url, {
            ...options,
            headers,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Backend request failed (${url}): ${message}`);
    }
}
