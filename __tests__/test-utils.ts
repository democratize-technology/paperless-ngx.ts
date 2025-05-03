import type { PaperlessAuthConfig } from "../src/models";

// Test constants
export const TEST_BASE_URL = "http://localhost:8000";
export const TEST_TOKEN = "test-token";
export const TEST_AUTH_CONFIG: PaperlessAuthConfig = { type: "token", token: TEST_TOKEN };

// Helper to create a mock pagination response
export function createMockPaginationResponse<T>(items: T[], count = items.length, next = null, previous = null) {
    return {
        count,
        next,
        previous,
        results: items,
    };
}

// Mock document data
export const mockDocument = {
    id: 1,
    correspondent: 2,
    document_type: 3,
    storage_path: 4,
    title: "Test Document",
    content: "This is a test document",
    tags: [1, 2],
    created: "2023-01-01T00:00:00Z",
    modified: "2023-01-02T00:00:00Z",
    added: "2023-01-01T00:00:00Z",
    original_file_name: "test.pdf",
    archived_file_name: "test_archived.pdf",
    owner: 1,
    page_count: 5,
    notes: [],
    custom_fields: [],
    mime_type: "application/pdf",
};

// Mock tag data
export const mockTag = {
    id: 1,
    name: "Test Tag",
    color: "#FF0000",
    is_inbox_tag: false,
    match: "",
    matching_algorithm: 0,
    is_insensitive: true,
    owner: 1,
    user_can_change: true,
};

// Mock correspondent data
export const mockCorrespondent = {
    id: 1,
    name: "Test Correspondent",
    match: "",
    matching_algorithm: 0,
    is_insensitive: true,
    owner: 1,
    user_can_change: true,
};

// Mock document type data
export const mockDocumentType = {
    id: 1,
    name: "Test Document Type",
    match: "",
    matching_algorithm: 0,
    is_insensitive: true,
    owner: 1,
    user_can_change: true,
};

// Mock storage path data
export const mockStoragePath = {
    id: 1,
    name: "Test Storage Path",
    match: "",
    matching_algorithm: 0,
    is_insensitive: true,
    owner: 1,
    user_can_change: true,
    path: "/test/path",
};

// Mock custom field data
export const mockCustomField = {
    id: 1,
    name: "Test Custom Field",
    data_type: "string",
    required: false,
};
