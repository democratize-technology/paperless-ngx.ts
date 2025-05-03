import { BaseClient } from "./base-client";
import type { CustomField, CustomFieldRequest, PaginationParams, PaginatedResponse } from "../models";

/**
 * Client for custom field operations
 */
export class CustomFieldClient extends BaseClient {
    constructor(baseUrl: string, auth: any) {
        super(baseUrl, auth);
    }

    /**
     * Get a list of custom fields with optional pagination
     */
    async getCustomFields(params?: PaginationParams): Promise<PaginatedResponse<CustomField>> {
        const queryString = this.buildQueryString(params);
        return this.request<PaginatedResponse<CustomField>>("GET", `/api/custom_fields/${queryString}`);
    }

    /**
     * Get a single custom field by ID
     */
    async getCustomField(id: number): Promise<CustomField> {
        return this.request<CustomField>("GET", `/api/custom_fields/${id}/`);
    }

    /**
     * Create a new custom field
     */
    async createCustomField(customField: CustomFieldRequest): Promise<CustomField> {
        return this.request<CustomField>("POST", "/api/custom_fields/", customField);
    }

    /**
     * Update an existing custom field
     */
    async updateCustomField(id: number, customField: Partial<CustomFieldRequest>): Promise<CustomField> {
        return this.request<CustomField>("PATCH", `/api/custom_fields/${id}/`, customField);
    }

    /**
     * Delete a custom field
     */
    async deleteCustomField(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/custom_fields/${id}/`);
    }
}
