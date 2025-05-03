import fetchMock from "jest-fetch-mock";
import { TagClient } from "../src/client/tag-client";
import type { Tag, TagRequest } from "../src/models";
import { TEST_BASE_URL, TEST_TOKEN, mockTag, createMockPaginationResponse } from "./test-utils";

describe("TagClient", () => {
    let client: TagClient;

    beforeEach(() => {
        fetchMock.resetMocks();
        client = new TagClient(TEST_BASE_URL, TEST_TOKEN);
    });

    describe("getTags", () => {
        it("should fetch tags with no parameters", async () => {
            // Arrange
            const mockTags = [mockTag, { ...mockTag, id: 2, name: "Another Tag" }];
            const mockResponse = createMockPaginationResponse(mockTags);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            // Act
            const result = await client.getTags();

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/tags/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockResponse);
        });

        it("should fetch tags with query parameters", async () => {
            // Arrange
            const mockTags = [mockTag];
            const mockResponse = createMockPaginationResponse(mockTags);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const queryParams = {
                page: 1,
                page_size: 10,
                ordering: "name",
                name__icontains: "test",
            };

            // Act
            const result = await client.getTags(queryParams);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining(`${TEST_BASE_URL}/api/tags/?`),
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

    describe("getTag", () => {
        it("should fetch a single tag by ID", async () => {
            // Arrange
            fetchMock.mockResponseOnce(JSON.stringify(mockTag));

            // Act
            const result = await client.getTag(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/tags/1/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockTag);
        });
    });

    describe("createTag", () => {
        it("should create a new tag", async () => {
            // Arrange
            const newTag: TagRequest = {
                name: "New Tag",
                color: "#00FF00",
                is_inbox_tag: true,
            };

            const createdTag: Tag = {
                ...mockTag,
                id: 3,
                name: "New Tag",
                color: "#00FF00",
                is_inbox_tag: true,
            };

            fetchMock.mockResponseOnce(JSON.stringify(createdTag));

            // Act
            const result = await client.createTag(newTag);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/tags/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(newTag),
                })
            );
            expect(result).toEqual(createdTag);
        });
    });

    describe("updateTag", () => {
        it("should update an existing tag", async () => {
            // Arrange
            const updateData: TagRequest = {
                name: "Updated Tag",
                color: "#0000FF",
            };

            const updatedTag = {
                ...mockTag,
                name: "Updated Tag",
                color: "#0000FF",
            };

            fetchMock.mockResponseOnce(JSON.stringify(updatedTag));

            // Act
            const result = await client.updateTag(1, updateData);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/tags/1/`,
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify(updateData),
                })
            );
            expect(result).toEqual(updatedTag);
        });
    });

    describe("deleteTag", () => {
        it("should delete a tag", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 204 });

            // Act
            await client.deleteTag(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/tags/1/`,
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });
});
