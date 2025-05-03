import { BaseClient } from "./base-client";
import type {
    Document,
    DocumentRequest,
    DocumentQueryParams,
    PaginatedResponse,
    DocumentMetadata,
    Note,
    Suggestions,
    SelectionData,
    BulkDownloadOptions,
    BulkEditRequest,
    BulkEditResult,
    UploadDocumentMetadata,
} from "../models";

/**
 * Client for document-related operations
 */
export class DocumentClient extends BaseClient {
    constructor(baseUrl: string, auth: any) {
        super(baseUrl, auth);
    }

    /**
     * Get a list of documents with optional filtering
     */
    async getDocuments(params?: DocumentQueryParams): Promise<PaginatedResponse<Document>> {
        const queryString = this.buildQueryString(params);
        return this.request<PaginatedResponse<Document>>("GET", `/api/documents/${queryString}`);
    }

    /**
     * Get a single document by ID
     */
    async getDocument(id: number): Promise<Document> {
        return this.request<Document>("GET", `/api/documents/${id}/`);
    }

    /**
     * Create a new document
     */
    async createDocument(document: DocumentRequest): Promise<Document> {
        return this.request<Document>("POST", "/api/documents/", document);
    }

    /**
     * Update an existing document
     */
    async updateDocument(id: number, document: DocumentRequest): Promise<Document> {
        return this.request<Document>("PATCH", `/api/documents/${id}/`, document);
    }

    /**
     * Delete a document
     */
    async deleteDocument(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/documents/${id}/`);
    }

    /**
     * Download a document file
     */
    async downloadDocument(id: number, original: boolean = false): Promise<Blob> {
        const queryParams = original ? "?original=true" : "";
        try {
            const response = await fetch(`${this.baseUrl}/api/documents/${id}/download/${queryParams}`, {
                method: "GET",
                headers: {
                    ...this.getAuthHeader(),
                },
            });

            if (!response.ok) {
                throw new Error(`Download failed: ${response.status} ${response.statusText}`);
            }

            return response.blob();
        } catch (error) {
            if (error instanceof Error && error.message.includes("Download failed")) {
                throw error;
            }
            throw new Error(`Download failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get a document preview
     */
    async getDocumentPreview(id: number): Promise<Blob> {
        try {
            const response = await fetch(`${this.baseUrl}/api/documents/${id}/preview/`, {
                method: "GET",
                headers: {
                    ...this.getAuthHeader(),
                },
            });

            if (!response.ok) {
                throw new Error(`Preview failed: ${response.status} ${response.statusText}`);
            }

            return response.blob();
        } catch (error) {
            if (error instanceof Error && error.message.includes("Preview failed")) {
                throw error;
            }
            throw new Error(`Preview failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get a document thumbnail
     */
    async getDocumentThumbnail(id: number): Promise<Blob> {
        try {
            const response = await fetch(`${this.baseUrl}/api/documents/${id}/thumb/`, {
                method: "GET",
                headers: {
                    ...this.getAuthHeader(),
                },
            });

            if (!response.ok) {
                throw new Error(`Thumbnail failed: ${response.status} ${response.statusText}`);
            }

            return response.blob();
        } catch (error) {
            if (error instanceof Error && error.message.includes("Thumbnail failed")) {
                throw error;
            }
            throw new Error(`Thumbnail failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get document metadata
     */
    async getDocumentMetadata(id: number): Promise<DocumentMetadata> {
        return this.request<DocumentMetadata>("GET", `/api/documents/${id}/metadata/`);
    }

    /**
     * Get document notes
     */
    async getDocumentNotes(id: number): Promise<Note[]> {
        return this.request<Note[]>("GET", `/api/documents/${id}/notes/`);
    }

    /**
     * Add a note to a document
     */
    async addDocumentNote(id: number, note: string): Promise<Note[]> {
        return this.request<Note[]>("POST", `/api/documents/${id}/notes/`, { note });
    }

    /**
     * Delete a note from a document
     */
    async deleteDocumentNote(id: number, noteId: number): Promise<Note[]> {
        return this.request<Note[]>("DELETE", `/api/documents/${id}/notes/`, { id: noteId });
    }

    /**
     * Get document suggestions
     */
    async getDocumentSuggestions(id: number): Promise<Suggestions> {
        return this.request<Suggestions>("GET", `/api/documents/${id}/suggestions/`);
    }

    /**
     * Bulk download documents
     */
    async bulkDownloadDocuments(documents: number[], options?: BulkDownloadOptions): Promise<Blob> {
        try {
            const response = await fetch(`${this.baseUrl}/api/documents/bulk_download/`, {
                method: "POST",
                headers: {
                    ...this.getAuthHeader(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documents,
                    content: options?.content || "archive",
                    compression: options?.compression || "none",
                    follow_formatting: options?.follow_formatting || false,
                }),
            });

            if (!response.ok) {
                throw new Error(`Bulk download failed: ${response.status} ${response.statusText}`);
            }

            return response.blob();
        } catch (error) {
            if (error instanceof Error && error.message.includes("Bulk download failed")) {
                throw error;
            }
            throw new Error(`Bulk download failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Bulk edit documents
     */
    async bulkEditDocuments(request: BulkEditRequest): Promise<BulkEditResult> {
        return this.request<BulkEditResult>("POST", "/api/documents/bulk_edit/", request);
    }

    /**
     * Get selection data for a set of documents
     */
    async getSelectionData(documents: number[]): Promise<SelectionData> {
        return this.request<SelectionData>("POST", "/api/documents/selection_data/", { documents });
    }

    /**
     * Upload a document
     */
    async uploadDocument(file: File, metadata?: UploadDocumentMetadata): Promise<string> {
        const formData = new FormData();
        formData.append("document", file);

        if (metadata) {
            if (metadata.title) formData.append("title", metadata.title);
            if (metadata.correspondent) formData.append("correspondent", metadata.correspondent.toString());
            if (metadata.document_type) formData.append("document_type", metadata.document_type.toString());
            if (metadata.storage_path) formData.append("storage_path", metadata.storage_path.toString());
            if (metadata.created) formData.append("created", metadata.created);
            if (metadata.archive_serial_number)
                formData.append("archive_serial_number", metadata.archive_serial_number.toString());

            if (metadata.tags && metadata.tags.length > 0) {
                metadata.tags.forEach((tag) => {
                    formData.append("tags", tag.toString());
                });
            }

            if (metadata.custom_fields) {
                Object.entries(metadata.custom_fields).forEach(([id, value]) => {
                    formData.append(`custom_fields[${id}]`, value);
                });
            }
        }

        // Mark as from web UI
        formData.append("from_webui", "true");

        try {
            const response = await fetch(`${this.baseUrl}/api/documents/post_document/`, {
                method: "POST",
                headers: {
                    ...this.getAuthHeader(),
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }

            return response.text();
        } catch (error) {
            if (error instanceof Error && error.message.includes("Upload failed")) {
                throw error;
            }
            throw new Error(`Upload failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
