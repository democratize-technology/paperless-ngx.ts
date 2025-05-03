import { BaseClient } from "./base-client";
import type { Tag, TagRequest, PaginationParams, PaginatedResponse } from "../models";

/**
 * Client for tag-related operations
 */
export class TagClient extends BaseClient {
    constructor(baseUrl: string, auth: any) {
        super(baseUrl, auth);
    }

    /**
     * Get a list of tags with optional pagination
     */
    async getTags(params?: PaginationParams): Promise<PaginatedResponse<Tag>> {
        const queryString = this.buildQueryString(params);
        return this.request<PaginatedResponse<Tag>>("GET", `/api/tags/${queryString}`);
    }

    /**
     * Get a single tag by ID
     */
    async getTag(id: number): Promise<Tag> {
        return this.request<Tag>("GET", `/api/tags/${id}/`);
    }

    /**
     * Create a new tag
     */
    async createTag(tag: TagRequest): Promise<Tag> {
        return this.request<Tag>("POST", "/api/tags/", tag);
    }

    /**
     * Update an existing tag
     */
    async updateTag(id: number, tag: Partial<TagRequest>): Promise<Tag> {
        return this.request<Tag>("PATCH", `/api/tags/${id}/`, tag);
    }

    /**
     * Delete a tag
     */
    async deleteTag(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/tags/${id}/`);
    }
}
