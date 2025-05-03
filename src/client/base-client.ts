import { type PaperlessAuthConfig, PaperlessApiError } from "../models";

/**
 * Base client class with common request handling
 */
export class BaseClient {
    protected readonly baseUrl: string;
    protected readonly auth: PaperlessAuthConfig;

    constructor(baseUrl: string, auth: string | PaperlessAuthConfig) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

        // Support legacy constructor that just took a token
        if (typeof auth === "string") {
            this.auth = { type: "token", token: auth };
        } else {
            this.auth = auth;
        }
    }

    /**
     * Get the appropriate authentication header based on the auth type
     */
    protected getAuthHeader(): Record<string, string> {
        switch (this.auth.type) {
            case "token":
                return { Authorization: `Token ${this.auth.token}` };
            case "basic":
                const credentials = btoa(`${this.auth.username}:${this.auth.password}`);
                return { Authorization: `Basic ${credentials}` };
            case "cookie":
                return { Cookie: `sessionid=${this.auth.sessionId}` };
        }
    }

    /**
     * Make a request to the Paperless API
     */
    protected async request<T>(method: string, path: string, body?: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers: {
                ...this.getAuthHeader(),
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
            credentials: this.auth.type === "cookie" ? "include" : "same-origin",
        });

        if (!response.ok) {
            let errorBody;
            try {
                errorBody = await response.json();
            } catch (e) {
                // Failed to parse JSON error response
            }

            throw new PaperlessApiError(response.status, response.statusText, errorBody);
        }

        // Some endpoints return an empty response for DELETE operations
        if (method === "DELETE" && response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    /**
     * Helper to build query params
     */
    protected buildQueryString(params?: Record<string, any>): string {
        if (!params) return "";

        const queryParams = new URLSearchParams(
            Object.entries(params)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => [key, String(value)])
        ).toString();

        return queryParams ? `?${queryParams}` : "";
    }
}
