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

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response;
    }

    if (!response.ok) {
        const text = await response.text();
        console.error(`Backend error (${response.status}):`, text.substring(0, 200));
        throw new Error(`Server returned an error (${response.status}). Building... Please wait or check configuration.`);
    }

    return response;
}
