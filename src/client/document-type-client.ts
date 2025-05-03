import { BaseClient } from "./base-client";
import type { DocumentType, DocumentTypeRequest, PaginationParams, PaginatedResponse } from "../models";

/**
 * Client for document type operations
 */
export class DocumentTypeClient extends BaseClient {
    constructor(baseUrl: string, auth: any) {
        super(baseUrl, auth);
    }

    /**
     * Get a list of document types with optional pagination
     */
    async getDocumentTypes(params?: PaginationParams): Promise<PaginatedResponse<DocumentType>> {
        const queryString = this.buildQueryString(params);
        return this.request<PaginatedResponse<DocumentType>>("GET", `/api/document_types/${queryString}`);
    }

    /**
     * Get a single document type by ID
     */
    async getDocumentType(id: number): Promise<DocumentType> {
        return this.request<DocumentType>("GET", `/api/document_types/${id}/`);
    }

    /**
     * Create a new document type
     */
    async createDocumentType(documentType: DocumentTypeRequest): Promise<DocumentType> {
        return this.request<DocumentType>("POST", "/api/document_types/", documentType);
    }

    /**
     * Update an existing document type
     */
    async updateDocumentType(id: number, documentType: Partial<DocumentTypeRequest>): Promise<DocumentType> {
        return this.request<DocumentType>("PATCH", `/api/document_types/${id}/`, documentType);
    }

    /**
     * Delete a document type
     */
    async deleteDocumentType(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/document_types/${id}/`);
    }
}
