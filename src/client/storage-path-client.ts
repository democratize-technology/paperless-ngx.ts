import { BaseClient } from "./base-client";
import type { StoragePath, StoragePathRequest, PaginationParams, PaginatedResponse } from "../models";

/**
 * Client for storage path operations
 */
export class StoragePathClient extends BaseClient {
    constructor(baseUrl: string, auth: any) {
        super(baseUrl, auth);
    }

    /**
     * Get a list of storage paths with optional pagination
     */
    async getStoragePaths(params?: PaginationParams): Promise<PaginatedResponse<StoragePath>> {
        const queryString = this.buildQueryString(params);
        return this.request<PaginatedResponse<StoragePath>>("GET", `/api/storage_paths/${queryString}`);
    }

    /**
     * Get a single storage path by ID
     */
    async getStoragePath(id: number): Promise<StoragePath> {
        return this.request<StoragePath>("GET", `/api/storage_paths/${id}/`);
    }

    /**
     * Create a new storage path
     */
    async createStoragePath(storagePath: StoragePathRequest): Promise<StoragePath> {
        return this.request<StoragePath>("POST", "/api/storage_paths/", storagePath);
    }

    /**
     * Update an existing storage path
     */
    async updateStoragePath(id: number, storagePath: Partial<StoragePathRequest>): Promise<StoragePath> {
        return this.request<StoragePath>("PATCH", `/api/storage_paths/${id}/`, storagePath);
    }

    /**
     * Delete a storage path
     */
    async deleteStoragePath(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/storage_paths/${id}/`);
    }
}
