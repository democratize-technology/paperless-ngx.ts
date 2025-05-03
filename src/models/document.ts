import { MatchingAlgorithm } from "./common";

// Represents a note associated with a document
export interface Note {
    id: number; // Read-only
    note: string; // Content of the note
    created: string; // ISO 8601 date-time string
    user: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
    }; // Read-only
}

// Request for creating a note
export interface NoteRequest {
    note: string;
    created?: string; // ISO 8601 date-time string, optional
}

// Custom field value for a document
export interface CustomFieldInstance {
    field: number; // Custom field ID
    value: string | number | boolean | Date | Record<string, any> | null;
}

export interface CustomFieldInstanceRequest {
    field: number; // Custom field ID
    value: string | number | boolean | Record<string, any> | null;
}

// Represents a document in Paperless-ngx
export interface Document {
    id: number; // Read-only
    correspondent: number | null; // Correspondent ID or null
    document_type: number | null; // Document type ID or null
    storage_path: number | null; // Storage path ID or null
    title: string;
    content: string; // The raw, text-only data of the document. This field is primarily used for searching.
    tags: number[]; // List of tag IDs
    created: string; // ISO 8601 date-time string
    created_date?: string; // Optional; YYYY-MM-DD format
    modified: string; // Read-only; ISO 8601 date-time string
    added: string; // Read-only; ISO 8601 date-time string
    deleted_at?: string | null; // Optional deletion timestamp
    archive_serial_number?: number | null; // Integer, not string
    original_file_name: string | null; // Read-only
    archived_file_name: string | null; // Read-only
    owner: number | null;
    permissions?: {
        view?: {
            users?: number[];
            groups?: number[];
        };
        change?: {
            users?: number[];
            groups?: number[];
        };
    }; // Read-only
    user_can_change?: boolean; // Read-only
    is_shared_by_requester?: boolean; // Read-only
    notes: Note[]; // Read-only
    custom_fields: CustomFieldInstance[];
    page_count: number | null; // Read-only
    mime_type?: string; // Read-only
}

// For writing to the API
export interface DocumentRequest {
    correspondent?: number | null;
    document_type?: number | null;
    storage_path?: number | null;
    title?: string;
    content?: string;
    tags?: number[];
    created?: string;
    created_date?: string;
    deleted_at?: string | null;
    archive_serial_number?: number | null;
    owner?: number | null;
    set_permissions?: {
        view?: {
            users?: number[];
            groups?: number[];
        };
        change?: {
            users?: number[];
            groups?: number[];
        };
    }; // Write-only
    custom_fields?: CustomFieldInstanceRequest[];
    remove_inbox_tags?: boolean; // Write-only
}

// Query parameters for document endpoints
export interface DocumentQueryParams {
    page?: number;
    page_size?: number;
    ordering?: string;
    search?: string;
    title__icontains?: string;
    content__icontains?: string;
    tags__id?: number;
    tags__id__all?: number;
    correspondent__id?: number;
    document_type__id?: number;
    storage_path__id?: number;
    added__date__gt?: string;
    added__date__lt?: string;
    created__date__gt?: string;
    created__date__lt?: string;
    modified__date__gt?: string;
    modified__date__lt?: string;
    is_in_inbox?: boolean;
    [key: string]: any; // Allow for all the other filter params
}

// Document metadata
export interface DocumentMetadata {
    original_checksum: string;
    original_size: number;
    original_mime_type: string;
    media_filename: string;
    has_archive_version: boolean;
    original_metadata: Record<string, any>;
    archive_checksum: string;
    archive_media_filename: string;
    original_filename: string;
    archive_size: number;
    archive_metadata: Record<string, any>;
    lang: string;
}

// Document suggestions
export interface Suggestions {
    correspondents: number[];
    tags: number[];
    document_types: number[];
    storage_paths: number[];
    dates: string[];
}

// Selection data
export interface SelectionData {
    selected_correspondents: { id: number; document_count: number }[];
    selected_tags: { id: number; document_count: number }[];
    selected_document_types: { id: number; document_count: number }[];
    selected_storage_paths: { id: number; document_count: number }[];
    selected_custom_fields: { id: number; document_count: number }[];
}

// Bulk operations
export interface BulkDownloadOptions {
    content?: "archive" | "originals" | "both";
    compression?: "none" | "deflated" | "bzip2" | "lzma";
    follow_formatting?: boolean;
}

export enum BulkEditMethod {
    SET_CORRESPONDENT = "set_correspondent",
    SET_DOCUMENT_TYPE = "set_document_type",
    SET_STORAGE_PATH = "set_storage_path",
    ADD_TAG = "add_tag",
    REMOVE_TAG = "remove_tag",
    MODIFY_TAGS = "modify_tags",
    MODIFY_CUSTOM_FIELDS = "modify_custom_fields",
    DELETE = "delete",
    REPROCESS = "reprocess",
    SET_PERMISSIONS = "set_permissions",
    ROTATE = "rotate",
    MERGE = "merge",
    SPLIT = "split",
    DELETE_PAGES = "delete_pages",
}

export interface BulkEditRequest {
    documents: number[];
    method: BulkEditMethod;
    parameters: Record<string, any>;
}

export interface BulkEditResult {
    result: string;
}

// Upload document metadata
export interface UploadDocumentMetadata {
    title?: string;
    correspondent?: number;
    document_type?: number;
    storage_path?: number;
    tags?: number[];
    created?: string;
    archive_serial_number?: number;
    custom_fields?: { [id: number]: string };
}
