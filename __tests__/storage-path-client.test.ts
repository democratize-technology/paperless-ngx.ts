import fetchMock from "jest-fetch-mock";
import { StoragePathClient } from "../src/client/storage-path-client";
import type { StoragePath, StoragePathRequest } from "../src/models";
import { TEST_BASE_URL, TEST_TOKEN, mockStoragePath, createMockPaginationResponse } from "./test-utils";

describe("StoragePathClient", () => {
    let client: StoragePathClient;

    fetchMock.enableMocks();

    beforeEach(() => {
        fetchMock.resetMocks();
        client = new StoragePathClient(TEST_BASE_URL, TEST_TOKEN);
    });

    describe("getStoragePaths", () => {
        it("should fetch storage paths with no parameters", async () => {
            // Arrange
            const mockStoragePaths = [
                mockStoragePath,
                { ...mockStoragePath, id: 2, name: "Another Storage Path", path: "/another/path" },
            ];
            const mockResponse = createMockPaginationResponse(mockStoragePaths);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            // Act
            const result = await client.getStoragePaths();

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/storage_paths/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockResponse);
        });

        it("should fetch storage paths with query parameters", async () => {
            // Arrange
            const mockStoragePaths = [mockStoragePath];
            const mockResponse = createMockPaginationResponse(mockStoragePaths);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const queryParams = {
                page: 1,
                page_size: 10,
                ordering: "name",
                name__icontains: "test",
            };

            // Act
            const result = await client.getStoragePaths(queryParams);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining(`${TEST_BASE_URL}/api/storage_paths/?`),
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

    describe("getStoragePath", () => {
        it("should fetch a single storage path by ID", async () => {
            // Arrange
            fetchMock.mockResponseOnce(JSON.stringify(mockStoragePath));

            // Act
            const result = await client.getStoragePath(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/storage_paths/1/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockStoragePath);
        });
    });

    describe("createStoragePath", () => {
        it("should create a new storage path", async () => {
            // Arrange
            const newStoragePath: StoragePathRequest = {
                name: "New Storage Path",
                path: "/new/path",
                match: "New",
                matching_algorithm: 0,
                is_insensitive: true,
            };

            const createdStoragePath: StoragePath = {
                ...mockStoragePath,
                id: 3,
                name: "New Storage Path",
                path: "/new/path",
                match: "New",
            };

            fetchMock.mockResponseOnce(JSON.stringify(createdStoragePath));

            // Act
            const result = await client.createStoragePath(newStoragePath);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/storage_paths/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(newStoragePath),
                })
            );
            expect(result).toEqual(createdStoragePath);
        });
    });

    describe("updateStoragePath", () => {
        it("should update an existing storage path", async () => {
            // Arrange
            const updateData: StoragePathRequest = {
                name: "Updated Storage Path",
                path: "/updated/path",
            };

            const updatedStoragePath = {
                ...mockStoragePath,
                name: "Updated Storage Path",
                path: "/updated/path",
            };

            fetchMock.mockResponseOnce(JSON.stringify(updatedStoragePath));

            // Act
            const result = await client.updateStoragePath(1, updateData);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/storage_paths/1/`,
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify(updateData),
                })
            );
            expect(result).toEqual(updatedStoragePath);
        });
    });

    describe("deleteStoragePath", () => {
        it("should delete a storage path", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 204 });

            // Act
            await client.deleteStoragePath(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/storage_paths/1/`,
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });
});
