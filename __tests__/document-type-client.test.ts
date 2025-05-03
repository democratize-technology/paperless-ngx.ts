import fetchMock from "jest-fetch-mock";
import { DocumentTypeClient } from "../src/client/document-type-client";
import type { DocumentType, DocumentTypeRequest } from "../src/models";
import { TEST_BASE_URL, TEST_TOKEN, mockDocumentType, createMockPaginationResponse } from "./test-utils";

describe("DocumentTypeClient", () => {
    let client: DocumentTypeClient;

    beforeEach(() => {
        fetchMock.resetMocks();
        client = new DocumentTypeClient(TEST_BASE_URL, TEST_TOKEN);
    });

    describe("getDocumentTypes", () => {
        it("should fetch document types with no parameters", async () => {
            // Arrange
            const mockDocumentTypes = [mockDocumentType, { ...mockDocumentType, id: 2, name: "Another Document Type" }];
            const mockResponse = createMockPaginationResponse(mockDocumentTypes);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            // Act
            const result = await client.getDocumentTypes();

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/document_types/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockResponse);
        });

        it("should fetch document types with query parameters", async () => {
            // Arrange
            const mockDocumentTypes = [mockDocumentType];
            const mockResponse = createMockPaginationResponse(mockDocumentTypes);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const queryParams = {
                page: 1,
                page_size: 10,
                ordering: "name",
                name__icontains: "test",
            };

            // Act
            const result = await client.getDocumentTypes(queryParams);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining(`${TEST_BASE_URL}/api/document_types/?`),
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

    describe("getDocumentType", () => {
        it("should fetch a single document type by ID", async () => {
            // Arrange
            fetchMock.mockResponseOnce(JSON.stringify(mockDocumentType));

            // Act
            const result = await client.getDocumentType(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/document_types/1/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockDocumentType);
        });
    });

    describe("createDocumentType", () => {
        it("should create a new document type", async () => {
            // Arrange
            const newDocumentType: DocumentTypeRequest = {
                name: "New Document Type",
                match: "New",
                matching_algorithm: 0,
                is_insensitive: true,
            };

            const createdDocumentType: DocumentType = {
                ...mockDocumentType,
                id: 3,
                name: "New Document Type",
                match: "New",
            };

            fetchMock.mockResponseOnce(JSON.stringify(createdDocumentType));

            // Act
            const result = await client.createDocumentType(newDocumentType);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/document_types/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(newDocumentType),
                })
            );
            expect(result).toEqual(createdDocumentType);
        });
    });

    describe("updateDocumentType", () => {
        it("should update an existing document type", async () => {
            // Arrange
            const updateData: DocumentTypeRequest = {
                name: "Updated Document Type",
                match: "Updated",
            };

            const updatedDocumentType = {
                ...mockDocumentType,
                name: "Updated Document Type",
                match: "Updated",
            };

            fetchMock.mockResponseOnce(JSON.stringify(updatedDocumentType));

            // Act
            const result = await client.updateDocumentType(1, updateData);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/document_types/1/`,
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify(updateData),
                })
            );
            expect(result).toEqual(updatedDocumentType);
        });
    });

    describe("deleteDocumentType", () => {
        it("should delete a document type", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 204 });

            // Act
            await client.deleteDocumentType(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/document_types/1/`,
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });
});
