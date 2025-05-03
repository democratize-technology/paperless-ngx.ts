// Export all models
export * from "./models";

// Export all client components
export * from "./client";

import type { PaperlessAuthConfig } from "./models";
import {
    DocumentClient,
    TagClient,
    CorrespondentClient,
    DocumentTypeClient,
    StoragePathClient,
    CustomFieldClient,
    UserClient,
    ShareLinkClient,
    SystemClient,
} from "./client";

/**
 * Main Paperless-ngx client that provides access to all API endpoints
 */
export class PaperlessClient {
    /**
     * Client for document operations
     */
    readonly documents: DocumentClient;

    /**
     * Client for tag operations
     */
    readonly tags: TagClient;

    /**
     * Client for correspondent operations
     */
    readonly correspondents: CorrespondentClient;

    /**
     * Client for document type operations
     */
    readonly documentTypes: DocumentTypeClient;

    /**
     * Client for storage path operations
     */
    readonly storagePaths: StoragePathClient;

    /**
     * Client for custom field operations
     */
    readonly customFields: CustomFieldClient;

    /**
     * Client for user and group operations
     */
    readonly users: UserClient;

    /**
     * Client for share link operations
     */
    readonly shareLinks: ShareLinkClient;

    /**
     * Client for system and search operations
     */
    readonly system: SystemClient;

    /**
     * Create a new Paperless-ngx client
     *
     * @param baseUrl Base URL of the Paperless-ngx API (e.g., "http://localhost:8000")
     * @param auth Authentication configuration or token string
     */
    constructor(baseUrl: string, auth: string | PaperlessAuthConfig) {
        // Initialize all client instances
        this.documents = new DocumentClient(baseUrl, auth);
        this.tags = new TagClient(baseUrl, auth);
        this.correspondents = new CorrespondentClient(baseUrl, auth);
        this.documentTypes = new DocumentTypeClient(baseUrl, auth);
        this.storagePaths = new StoragePathClient(baseUrl, auth);
        this.customFields = new CustomFieldClient(baseUrl, auth);
        this.users = new UserClient(baseUrl, auth);
        this.shareLinks = new ShareLinkClient(baseUrl, auth);
        this.system = new SystemClient(baseUrl, auth);
    }
}
