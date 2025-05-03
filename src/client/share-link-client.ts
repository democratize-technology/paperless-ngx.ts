import { BaseClient } from "./base-client";
import type { ShareLink, ShareLinkRequest, PaginationParams, PaginatedResponse } from "../models";

/**
 * Client for share link operations
 */
export class ShareLinkClient extends BaseClient {
    constructor(baseUrl: string, auth: any) {
        super(baseUrl, auth);
    }

    /**
     * Get a list of share links with optional pagination
     */
    async getShareLinks(params?: PaginationParams): Promise<PaginatedResponse<ShareLink>> {
        const queryString = this.buildQueryString(params);
        return this.request<PaginatedResponse<ShareLink>>("GET", `/api/share_links/${queryString}`);
    }

    /**
     * Get a single share link by ID
     */
    async getShareLink(id: number): Promise<ShareLink> {
        return this.request<ShareLink>("GET", `/api/share_links/${id}/`);
    }

    /**
     * Create a new share link
     */
    async createShareLink(shareLink: ShareLinkRequest): Promise<ShareLink> {
        return this.request<ShareLink>("POST", "/api/share_links/", shareLink);
    }

    /**
     * Delete a share link
     */
    async deleteShareLink(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/share_links/${id}/`);
    }

    /**
     * Update a share link
     */
    async updateShareLink(id: number, shareLink: ShareLinkRequest): Promise<ShareLink> {
        return this.request<ShareLink>("PATCH", `/api/share_links/${id}/`, shareLink);
    }
}
