import fetchMock from "jest-fetch-mock";
import { DocumentClient } from "../src/client/document-client";
import type { Document, DocumentMetadata, DocumentRequest, Note, PaginatedResponse, Suggestions } from "../src/models";
import { BulkEditMethod } from "../src/models";
import { TEST_BASE_URL, TEST_TOKEN, mockDocument, createMockPaginationResponse } from "./test-utils";

describe("DocumentClient", () => {
    let client: DocumentClient;

    fetchMock.enableMocks();

    beforeEach(() => {
        fetchMock.resetMocks();
        client = new DocumentClient(TEST_BASE_URL, TEST_TOKEN);
    });

    describe("getDocuments", () => {
        it("should fetch documents with no parameters", async () => {
            // Arrange
            const mockDocuments = [mockDocument, { ...mockDocument, id: 2 }];
            const mockResponse = createMockPaginationResponse(mockDocuments);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            // Act
            const result = await client.getDocuments();

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockResponse);
        });

        it("should fetch documents with query parameters", async () => {
            // Arrange
            const mockDocuments = [mockDocument];
            const mockResponse = createMockPaginationResponse(mockDocuments);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const queryParams = {
                page: 1,
                page_size: 10,
                ordering: "-created",
                search: "test",
                tags__id: 1,
            };

            // Act
            const result = await client.getDocuments(queryParams);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining(`${TEST_BASE_URL}/api/documents/?`),
                expect.objectContaining({ method: "GET" })
            );

            // Check that all query parameters are included
            const url = fetchMock.mock.calls[0][0] as string;
            Object.entries(queryParams).forEach(([key, value]) => {
                expect(url).toContain(`${key}=${value}`);
            });

            expect(result).toEqual(mockResponse);
        });
    });

    describe("getDocument", () => {
        it("should fetch a single document by ID", async () => {
            // Arrange
            fetchMock.mockResponseOnce(JSON.stringify(mockDocument));

            // Act
            const result = await client.getDocument(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/1/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockDocument);
        });
    });

    describe("createDocument", () => {
        it("should create a new document", async () => {
            // Arrange
            const newDocument: DocumentRequest = {
                title: "New Document",
                correspondent: 1,
                tags: [1, 2],
            };

            fetchMock.mockResponseOnce(
                JSON.stringify({
                    ...mockDocument,
                    title: "New Document",
                    correspondent: 1,
                })
            );

            // Act
            const result = await client.createDocument(newDocument);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(newDocument),
                })
            );
            expect(result.title).toBe("New Document");
            expect(result.correspondent).toBe(1);
        });
    });

    describe("updateDocument", () => {
        it("should update an existing document", async () => {
            // Arrange
            const updateData: DocumentRequest = {
                title: "Updated Document",
                tags: [3, 4],
            };

            const updatedDocument = {
                ...mockDocument,
                title: "Updated Document",
                tags: [3, 4],
            };

            fetchMock.mockResponseOnce(JSON.stringify(updatedDocument));

            // Act
            const result = await client.updateDocument(1, updateData);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/1/`,
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify(updateData),
                })
            );
            expect(result).toEqual(updatedDocument);
        });
    });

    describe("deleteDocument", () => {
        it("should delete a document", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 204 });

            // Act
            await client.deleteDocument(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/1/`,
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });

    describe("downloadDocument", () => {
        it("should download a document in archive format by default", async () => {
            // Arrange
            const mockBlob = new Blob(["fake-pdf-content"], { type: "application/pdf" });
            fetchMock.mockResponseOnce(mockBlob);

            // Act
            const result = await client.downloadDocument(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/1/download/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toBeInstanceOf(Blob);
        });

        it("should download the original document when specified", async () => {
            // Arrange
            const mockBlob = new Blob(["fake-pdf-content"], { type: "application/pdf" });
            fetchMock.mockResponseOnce(mockBlob);

            // Act
            const result = await client.downloadDocument(1, true);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/1/download/?original=true`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toBeInstanceOf(Blob);
        });

        it("should throw error when download fails", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 404, statusText: "Not Found" });

            // Act & Assert
            await expect(client.downloadDocument(999)).rejects.toThrow("Download failed: 404 Not Found");
        });

        it("should throw an error when an error occurs", async () => {
            // Arrange
            fetchMock.mockResponseOnce(() => {
                throw new Error("ERROR_MESSAGE");
            });

            // Act & Assert
            await expect(client.downloadDocument(999)).rejects.toThrow("Download failed: ERROR_MESSAGE");
        });
    });

    describe("getDocumentPreview", () => {
        it("should get a document preview", async () => {
            // Arrange
            const mockBlob = new Blob(["fake-preview-content"], { type: "application/pdf" });
            fetchMock.mockResponseOnce(mockBlob);

            // Act
            const result = await client.getDocumentPreview(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/1/preview/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toBeInstanceOf(Blob);
        });

        it("should throw error when preview fails", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 404, statusText: "Not Found" });

            // Act & Assert
            await expect(client.getDocumentPreview(999)).rejects.toThrow("Preview failed: 404 Not Found");
        });

        // Adding this test to increase coverage for the specific error handling path
        it("should throw error with specific status code and message when preview fails", async () => {
            // Arrange
            fetchMock.mockResponseOnce("Internal Server Error", { status: 500, statusText: "Internal Server Error" });

            // Act & Assert
            await expect(client.getDocumentPreview(1)).rejects.toThrow("Preview failed: 500 Internal Server Error");
        });

        it("should throw an error when an error occurs", async () => {
            // Arrange
            fetchMock.mockResponseOnce(() => {
                throw new Error("ERROR_MESSAGE");
            });

            // Act & Assert
            await expect(client.getDocumentPreview(1)).rejects.toThrow("Preview failed: ERROR_MESSAGE");
        });
    });

    describe("getDocumentThumbnail", () => {
        it("should get a document thumbnail", async () => {
            // Arrange
            const mockBlob = new Blob(["fake-thumbnail-content"], { type: "image/png" });
            fetchMock.mockResponseOnce(mockBlob);

            // Act
            const result = await client.getDocumentThumbnail(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/1/thumb/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toBeInstanceOf(Blob);
        });

        it("should throw error when thumbnail fails", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 404, statusText: "Not Found" });

            // Act & Assert
            await expect(client.getDocumentThumbnail(999)).rejects.toThrow("Thumbnail failed: 404 Not Found");
        });

        // Adding this test to increase coverage for the specific error handling path
        it("should throw error with specific status code and message when thumbnail fails", async () => {
            // Arrange
            fetchMock.mockResponseOnce("Internal Server Error", { status: 500, statusText: "Internal Server Error" });

            // Act & Assert
            await expect(client.getDocumentThumbnail(1)).rejects.toThrow("Thumbnail failed: 500 Internal Server Error");
        });

        it("should throw an error when an error occurs", async () => {
            // Arrange
            fetchMock.mockResponseOnce(() => {
                throw new Error("ERROR_MESSAGE");
            });

            // Act & Assert
            await expect(client.getDocumentThumbnail(1)).rejects.toThrow("Thumbnail failed: ERROR_MESSAGE");
        });
    });

    describe("getDocumentMetadata", () => {
        it("should fetch document metadata", async () => {
            // Arrange
            const mockMetadata: DocumentMetadata = {
                original_checksum: "abc123",
                original_size: 12345,
                original_mime_type: "application/pdf",
                media_filename: "document.pdf",
                has_archive_version: true,
                original_metadata: { pages: 5 },
                archive_checksum: "def456",
                archive_media_filename: "document_archive.pdf",
                original_filename: "uploaded.pdf",
                archive_size: 10000,
                archive_metadata: { pages: 5 },
                lang: "eng",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockMetadata));

            // Act
            const result = await client.getDocumentMetadata(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/1/metadata/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockMetadata);
        });
    });

    describe("getDocumentNotes", () => {
        it("should fetch document notes", async () => {
            // Arrange
            const mockNotes: Note[] = [
                {
                    id: 1,
                    note: "This is a test note",
                    created: "2023-01-01T00:00:00Z",
                    user: {
                        id: 1,
                        username: "testuser",
                        first_name: "Test",
                        last_name: "User",
                    },
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockNotes));

            // Act
            const result = await client.getDocumentNotes(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/1/notes/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockNotes);
        });
    });

    describe("addDocumentNote", () => {
        it("should add a note to a document", async () => {
            // Arrange
            const noteContent = "This is a new note";
            const mockNotes: Note[] = [
                {
                    id: 1,
                    note: noteContent,
                    created: "2023-01-01T00:00:00Z",
                    user: {
                        id: 1,
                        username: "testuser",
                        first_name: "Test",
                        last_name: "User",
                    },
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockNotes));

            // Act
            const result = await client.addDocumentNote(1, noteContent);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/1/notes/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({ note: noteContent }),
                })
            );
            expect(result).toEqual(mockNotes);
        });
    });

    describe("deleteDocumentNote", () => {
        it("should delete a note from a document", async () => {
            // Arrange
            const mockNotes: Note[] = []; // Empty array after deletion
            fetchMock.mockResponseOnce(JSON.stringify(mockNotes));

            // Act
            const result = await client.deleteDocumentNote(1, 2);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/1/notes/`,
                expect.objectContaining({
                    method: "DELETE",
                    body: JSON.stringify({ id: 2 }),
                })
            );
            expect(result).toEqual(mockNotes);
        });
    });

    describe("getDocumentSuggestions", () => {
        it("should fetch document suggestions", async () => {
            // Arrange
            const mockSuggestions: Suggestions = {
                correspondents: [1, 2],
                tags: [3, 4],
                document_types: [5],
                storage_paths: [6],
                dates: ["2023-01-01"],
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockSuggestions));

            // Act
            const result = await client.getDocumentSuggestions(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/1/suggestions/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockSuggestions);
        });
    });

    describe("bulkDownloadDocuments", () => {
        it("should bulk download documents with default options", async () => {
            // Arrange
            const documentIds = [1, 2, 3];
            const mockBlob = new Blob(["fake-zip-content"], { type: "application/zip" });
            fetchMock.mockResponseOnce(mockBlob);

            // Act
            const result = await client.bulkDownloadDocuments(documentIds);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/bulk_download/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({
                        documents: documentIds,
                        content: "archive",
                        compression: "none",
                        follow_formatting: false,
                    }),
                })
            );
            expect(result).toBeInstanceOf(Blob);
        });

        it("should bulk download documents with custom options", async () => {
            // Arrange
            const documentIds = [1, 2, 3];
            const options = {
                content: "originals" as const,
                compression: "deflated" as const,
                follow_formatting: true,
            };

            const mockBlob = new Blob(["fake-zip-content"], { type: "application/zip" });
            fetchMock.mockResponseOnce(mockBlob);

            // Act
            const result = await client.bulkDownloadDocuments(documentIds, options);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/bulk_download/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({
                        documents: documentIds,
                        ...options,
                    }),
                })
            );
            expect(result).toBeInstanceOf(Blob);
        });

        it("should throw error when bulk download fails", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 400, statusText: "Bad Request" });

            // Act & Assert
            await expect(client.bulkDownloadDocuments([1, 2, 3])).rejects.toThrow(
                "Bulk download failed: 400 Bad Request"
            );
        });

        // Adding this test to increase coverage for the specific error handling path
        it("should throw error with specific status code and message when bulk download fails", async () => {
            // Arrange
            fetchMock.mockResponseOnce("Internal Server Error", { status: 500, statusText: "Internal Server Error" });

            // Act & Assert
            await expect(client.bulkDownloadDocuments([1, 2, 3])).rejects.toThrow(
                "Bulk download failed: 500 Internal Server Error"
            );
        });

        it("should throw an error when an error occurs", async () => {
            // Arrange
            fetchMock.mockResponseOnce(() => {
                throw new Error("ERROR_MESSAGE");
            });

            // Act & Assert
            await expect(client.bulkDownloadDocuments([1, 2, 3])).rejects.toThrow(
                "Bulk download failed: ERROR_MESSAGE"
            );
        });
    });

    describe("bulkEditDocuments", () => {
        it("should perform bulk edit operations", async () => {
            // Arrange
            const bulkEditRequest = {
                documents: [1, 2, 3],
                method: BulkEditMethod.ADD_TAG,
                parameters: { tag: 5 },
            };

            const mockResult = { result: "success" };
            fetchMock.mockResponseOnce(JSON.stringify(mockResult));

            // Act
            const result = await client.bulkEditDocuments(bulkEditRequest);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/bulk_edit/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(bulkEditRequest),
                })
            );
            expect(result).toEqual(mockResult);
        });
    });

    describe("getSelectionData", () => {
        it("should fetch selection data for documents", async () => {
            // Arrange
            const documentIds = [1, 2, 3];
            const mockSelectionData = {
                selected_correspondents: [{ id: 1, document_count: 2 }],
                selected_tags: [{ id: 2, document_count: 3 }],
                selected_document_types: [{ id: 3, document_count: 1 }],
                selected_storage_paths: [{ id: 4, document_count: 2 }],
                selected_custom_fields: [{ id: 5, document_count: 1 }],
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockSelectionData));

            // Act
            const result = await client.getSelectionData(documentIds);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/selection_data/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({ documents: documentIds }),
                })
            );
            expect(result).toEqual(mockSelectionData);
        });
    });

    describe("uploadDocument", () => {
        it("should upload a document without metadata", async () => {
            // Arrange
            const file = new File(["test content"], "test.pdf", { type: "application/pdf" });
            const mockResponse = "Task ID: 123456";

            // Mock fetch implementation to check FormData
            fetchMock.mockImplementationOnce(async (url, options: any) => {
                expect(options.body).toBeInstanceOf(FormData);
                const formData = options.body as FormData;
                expect(JSON.stringify(formData.get("document"))).toBe(JSON.stringify(file));
                expect(formData.get("from_webui")).toBe("true");

                return {
                    ok: true,
                    text: async () => mockResponse,
                } as Response;
            });

            // Act
            const result = await client.uploadDocument(file);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/post_document/`,
                expect.objectContaining({
                    method: "POST",
                    headers: expect.objectContaining({
                        Authorization: "Token test-token",
                    }),
                })
            );

            expect(result).toBe(mockResponse);
        });

        it("should upload a document with metadata", async () => {
            // Arrange
            const file = new File(["test content"], "test.pdf", { type: "application/pdf" });
            const metadata = {
                title: "Test Document",
                correspondent: 1,
                document_type: 2,
                storage_path: 3,
                created: "2023-01-01",
                archive_serial_number: 123,
                tags: [4, 5],
                custom_fields: { "6": "value1", "7": "value2" },
            };

            const mockResponse = "Task ID: 123456";

            // Mock fetch implementation to check FormData
            fetchMock.mockImplementationOnce(async (url, options: any) => {
                expect(options.body).toBeInstanceOf(FormData);
                const formData = options.body as FormData;

                expect(JSON.stringify(formData.get("document"))).toBe(JSON.stringify(file));
                expect(formData.get("title")).toBe(metadata.title);
                expect(formData.get("correspondent")).toBe(metadata.correspondent.toString());
                expect(formData.get("document_type")).toBe(metadata.document_type.toString());
                expect(formData.get("storage_path")).toBe(metadata.storage_path.toString());
                expect(formData.get("created")).toBe(metadata.created);
                expect(formData.get("archive_serial_number")).toBe(metadata.archive_serial_number.toString());

                // Tags should be added multiple times
                const tagEntries = Array.from(formData.entries())
                    .filter(([key]) => key === "tags")
                    .map(([_, value]) => value);

                expect(tagEntries).toEqual(["4", "5"]);

                // Custom fields
                expect(formData.get("custom_fields[6]")).toBe("value1");
                expect(formData.get("custom_fields[7]")).toBe("value2");

                expect(formData.get("from_webui")).toBe("true");

                return {
                    ok: true,
                    text: async () => mockResponse,
                } as Response;
            });

            // Act
            const result = await client.uploadDocument(file, metadata);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/documents/post_document/`,
                expect.objectContaining({ method: "POST" })
            );
            expect(result).toBe(mockResponse);
        });

        it("should throw error when upload fails", async () => {
            // Arrange
            const file = new File(["test content"], "test.pdf", { type: "application/pdf" });
            fetchMock.mockResponseOnce("", { status: 400, statusText: "Bad Request" });

            // Act & Assert
            await expect(client.uploadDocument(file)).rejects.toThrow("Upload failed: 400 Bad Request");
        });

        // Additional test for specific status code and message
        it("should throw error with specific status code and message when upload fails", async () => {
            // Arrange
            const file = new File(["test content"], "test.pdf", { type: "application/pdf" });
            fetchMock.mockResponseOnce("Internal Server Error", { status: 500, statusText: "Internal Server Error" });

            // Act & Assert
            await expect(client.uploadDocument(file)).rejects.toThrow("Upload failed: 500 Internal Server Error");
        });

        it("should throw an error when an error occurs", async () => {
            // Arrange
            const file = new File(["test content"], "test.pdf", { type: "application/pdf" });
            fetchMock.mockResponseOnce(() => {
                throw new Error("ERROR_MESSAGE");
            });

            // Act & Assert
            await expect(client.uploadDocument(file)).rejects.toThrow("Upload failed: ERROR_MESSAGE");
        });
    });
});
