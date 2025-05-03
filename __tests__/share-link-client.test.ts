import fetchMock from "jest-fetch-mock";
import { ShareLinkClient } from "../src/client/share-link-client";
import type { ShareLink, ShareLinkRequest } from "../src/models";
import { TEST_BASE_URL, TEST_TOKEN, createMockPaginationResponse } from "./test-utils";

describe("ShareLinkClient", () => {
    let client: ShareLinkClient;

    fetchMock.enableMocks();

    beforeEach(() => {
        fetchMock.resetMocks();
        client = new ShareLinkClient(TEST_BASE_URL, TEST_TOKEN);
    });

    describe("getShareLinks", () => {
        it("should fetch share links with no parameters", async () => {
            // Arrange
            const mockShareLinks: ShareLink[] = [
                {
                    id: 1,
                    document: 123,
                    created: "2023-01-01T00:00:00Z",
                    expiration: "2023-12-31T23:59:59Z",
                    slug: "abc123",
                    infinite: false,
                    owner: 1,
                    permission_public: false,
                },
                {
                    id: 2,
                    document: 456,
                    created: "2023-01-02T00:00:00Z",
                    expiration: null,
                    slug: "def456",
                    infinite: true,
                    owner: 1,
                    permission_public: true,
                },
            ];

            const mockResponse = createMockPaginationResponse(mockShareLinks);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            // Act
            const result = await client.getShareLinks();

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/share_links/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockResponse);
        });

        it("should fetch share links with query parameters", async () => {
            // Arrange
            const mockShareLinks: ShareLink[] = [
                {
                    id: 1,
                    document: 123,
                    created: "2023-01-01T00:00:00Z",
                    expiration: "2023-12-31T23:59:59Z",
                    slug: "abc123",
                    infinite: false,
                    owner: 1,
                    permission_public: false,
                },
            ];

            const mockResponse = createMockPaginationResponse(mockShareLinks);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const queryParams = {
                page: 1,
                page_size: 10,
                document__id: 123,
            };

            // Act
            const result = await client.getShareLinks(queryParams);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining(`${TEST_BASE_URL}/api/share_links/?`),
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

    describe("getShareLink", () => {
        it("should fetch a single share link by ID", async () => {
            // Arrange
            const mockShareLink: ShareLink = {
                id: 1,
                document: 123,
                created: "2023-01-01T00:00:00Z",
                expiration: "2023-12-31T23:59:59Z",
                slug: "abc123",
                infinite: false,
                owner: 1,
                permission_public: false,
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockShareLink));

            // Act
            const result = await client.getShareLink(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/share_links/1/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockShareLink);
        });
    });

    describe("createShareLink", () => {
        it("should create a new share link", async () => {
            // Arrange
            const newShareLink: ShareLinkRequest = {
                document: 123,
                expiration: "2023-12-31T23:59:59Z",
                permission_public: false,
            };

            const createdShareLink: ShareLink = {
                id: 1,
                document: 123,
                created: "2023-01-01T00:00:00Z",
                expiration: "2023-12-31T23:59:59Z",
                slug: "abc123",
                infinite: false,
                owner: 1,
                permission_public: false,
            };

            fetchMock.mockResponseOnce(JSON.stringify(createdShareLink));

            // Act
            const result = await client.createShareLink(newShareLink);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/share_links/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(newShareLink),
                })
            );
            expect(result).toEqual(createdShareLink);
        });

        it("should create an infinite share link when expiration is null", async () => {
            // Arrange
            const newShareLink: ShareLinkRequest = {
                document: 123,
                expiration: null,
                permission_public: true,
            };

            const createdShareLink: ShareLink = {
                id: 1,
                document: 123,
                created: "2023-01-01T00:00:00Z",
                expiration: null,
                slug: "abc123",
                infinite: true,
                owner: 1,
                permission_public: true,
            };

            fetchMock.mockResponseOnce(JSON.stringify(createdShareLink));

            // Act
            const result = await client.createShareLink(newShareLink);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/share_links/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(newShareLink),
                })
            );
            expect(result).toEqual(createdShareLink);
        });
    });

    describe("updateShareLink", () => {
        it("should update an existing share link", async () => {
            // Arrange
            const updateData: Partial<ShareLinkRequest> = {
                expiration: "2024-06-30T23:59:59Z",
                permission_public: true,
            };

            const updatedShareLink: ShareLink = {
                id: 1,
                document: 123,
                created: "2023-01-01T00:00:00Z",
                expiration: "2024-06-30T23:59:59Z",
                slug: "abc123",
                infinite: false,
                owner: 1,
                permission_public: true,
            };

            fetchMock.mockResponseOnce(JSON.stringify(updatedShareLink));

            // Act
            const result = await client.updateShareLink(1, updateData);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/share_links/1/`,
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify(updateData),
                })
            );
            expect(result).toEqual(updatedShareLink);
        });
    });

    describe("deleteShareLink", () => {
        it("should delete a share link", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 204 });

            // Act
            await client.deleteShareLink(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/share_links/1/`,
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });
});
