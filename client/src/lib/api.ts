export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function fetchFromBackend(path: string, options: RequestInit = {}, getToken?: () => Promise<string | null>) {
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

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Handle error responses FIRST, regardless of content type
    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorDetail = "";

        try {
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                errorDetail = data.error || data.message || JSON.stringify(data);
            } else {
                errorDetail = await response.text();
            }
        } catch {
            errorDetail = "Could not read error response";
        }

        console.error(`Backend error (${response.status}) on ${options.method || "GET"} ${path}:`, errorDetail.substring(0, 300));

        // Provide actionable, status-code-specific error messages
        const statusMessages: Record<number, string> = {
            400: `Bad request to ${path}. ${errorDetail}`,
            401: "Authentication failed. Please sign in again.",
            403: "Access denied. You may not have permission for this action.",
            404: `Endpoint not found: ${path}. The backend may not be running or the URL is incorrect.`,
            405: `Method not allowed (${options.method || "GET"} ${path}). The backend server rejected this request type. Please check your NEXT_PUBLIC_BACKEND_URL configuration — it may be pointing to the wrong server.`,
            429: "Too many requests. Please wait a moment and try again.",
            500: `Server error on ${path}. ${errorDetail}`,
            502: "Backend server is unreachable (Bad Gateway). It may be starting up or down.",
            503: "Backend service is temporarily unavailable. It may be sleeping or restarting.",
        };

        const friendlyMessage = statusMessages[response.status]
            || `Server returned error ${response.status} on ${path}. ${errorDetail}`;

        throw new Error(friendlyMessage);
    }

    return response;
}
