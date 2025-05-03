import { BaseClient } from "./base-client";
import type { Correspondent, CorrespondentRequest, PaginationParams, PaginatedResponse } from "../models";

/**
 * Client for correspondent-related operations
 */
export class CorrespondentClient extends BaseClient {
    constructor(baseUrl: string, auth: any) {
        super(baseUrl, auth);
    }

    /**
     * Get a list of correspondents with optional pagination
     */
    async getCorrespondents(params?: PaginationParams): Promise<PaginatedResponse<Correspondent>> {
        const queryString = this.buildQueryString(params);
        return this.request<PaginatedResponse<Correspondent>>("GET", `/api/correspondents/${queryString}`);
    }

    /**
     * Get a single correspondent by ID
     */
    async getCorrespondent(id: number): Promise<Correspondent> {
        return this.request<Correspondent>("GET", `/api/correspondents/${id}/`);
    }

    /**
     * Create a new correspondent
     */
    async createCorrespondent(correspondent: CorrespondentRequest): Promise<Correspondent> {
        return this.request<Correspondent>("POST", "/api/correspondents/", correspondent);
    }

    /**
     * Update an existing correspondent
     */
    async updateCorrespondent(id: number, correspondent: Partial<CorrespondentRequest>): Promise<Correspondent> {
        return this.request<Correspondent>("PATCH", `/api/correspondents/${id}/`, correspondent);
    }

    /**
     * Delete a correspondent
     */
    async deleteCorrespondent(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/correspondents/${id}/`);
    }
}
