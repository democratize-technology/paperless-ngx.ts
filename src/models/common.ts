// Common types used across the library

// Pagination parameters for list endpoints
export interface PaginationParams {
    page?: number;
    page_size?: number;
}

// Base response for paginated endpoints
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
    all?: number[]; // Sometimes returned
}

// Authentication configuration
export type PaperlessAuthConfig =
    | { type: "token"; token: string }
    | { type: "basic"; username: string; password: string }
    | { type: "cookie"; sessionId: string };

// Custom API error class
export class PaperlessApiError extends Error {
    status: number;
    statusText: string;
    body: any;

    constructor(status: number, statusText: string, body?: any) {
        super(`API Error: ${status} ${statusText}`);
        this.status = status;
        this.statusText = statusText;
        this.body = body;
        this.name = "PaperlessApiError";
    }
}

// Common enums
export enum MatchingAlgorithm {
    NONE = 0,
    ANY_WORD = 1,
    ALL_WORDS = 2,
    EXACT_MATCH = 3,
    REGULAR_EXPRESSION = 4,
    FUZZY_WORD = 5,
    AUTOMATIC = 6,
}

export enum FileVersion {
    ARCHIVE = "archive",
    ORIGINAL = "original",
}

export enum DataType {
    STRING = "string",
    URL = "url",
    DATE = "date",
    BOOLEAN = "boolean",
    INTEGER = "integer",
    FLOAT = "float",
    MONETARY = "monetary",
    DOCUMENTLINK = "documentlink",
    SELECT = "select",
}
