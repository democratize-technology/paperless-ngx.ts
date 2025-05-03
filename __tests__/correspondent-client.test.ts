import fetchMock from "jest-fetch-mock";
import { CorrespondentClient } from "../src/client/correspondent-client";
import type { Correspondent, CorrespondentRequest } from "../src/models";
import { TEST_BASE_URL, TEST_TOKEN, mockCorrespondent, createMockPaginationResponse } from "./test-utils";

describe("CorrespondentClient", () => {
    let client: CorrespondentClient;

    beforeEach(() => {
        fetchMock.resetMocks();
        client = new CorrespondentClient(TEST_BASE_URL, TEST_TOKEN);
    });

    describe("getCorrespondents", () => {
        it("should fetch correspondents with no parameters", async () => {
            // Arrange
            const mockCorrespondents = [
                mockCorrespondent,
                { ...mockCorrespondent, id: 2, name: "Another Correspondent" },
            ];
            const mockResponse = createMockPaginationResponse(mockCorrespondents);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            // Act
            const result = await client.getCorrespondents();

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/correspondents/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockResponse);
        });

        it("should fetch correspondents with query parameters", async () => {
            // Arrange
            const mockCorrespondents = [mockCorrespondent];
            const mockResponse = createMockPaginationResponse(mockCorrespondents);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const queryParams = {
                page: 1,
                page_size: 10,
                ordering: "name",
                name__icontains: "test",
            };

            // Act
            const result = await client.getCorrespondents(queryParams);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining(`${TEST_BASE_URL}/api/correspondents/?`),
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

    describe("getCorrespondent", () => {
        it("should fetch a single correspondent by ID", async () => {
            // Arrange
            fetchMock.mockResponseOnce(JSON.stringify(mockCorrespondent));

            // Act
            const result = await client.getCorrespondent(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/correspondents/1/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockCorrespondent);
        });
    });

    describe("createCorrespondent", () => {
        it("should create a new correspondent", async () => {
            // Arrange
            const newCorrespondent: CorrespondentRequest = {
                name: "New Correspondent",
                match: "New",
                matching_algorithm: 0,
                is_insensitive: true,
            };

            const createdCorrespondent: Correspondent = {
                ...mockCorrespondent,
                id: 3,
                name: "New Correspondent",
                match: "New",
            };

            fetchMock.mockResponseOnce(JSON.stringify(createdCorrespondent));

            // Act
            const result = await client.createCorrespondent(newCorrespondent);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/correspondents/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(newCorrespondent),
                })
            );
            expect(result).toEqual(createdCorrespondent);
        });
    });

    describe("updateCorrespondent", () => {
        it("should update an existing correspondent", async () => {
            // Arrange
            const updateData: CorrespondentRequest = {
                name: "Updated Correspondent",
                match: "Updated",
            };

            const updatedCorrespondent = {
                ...mockCorrespondent,
                name: "Updated Correspondent",
                match: "Updated",
            };

            fetchMock.mockResponseOnce(JSON.stringify(updatedCorrespondent));

            // Act
            const result = await client.updateCorrespondent(1, updateData);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/correspondents/1/`,
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify(updateData),
                })
            );
            expect(result).toEqual(updatedCorrespondent);
        });
    });

    describe("deleteCorrespondent", () => {
        it("should delete a correspondent", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 204 });

            // Act
            await client.deleteCorrespondent(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/correspondents/1/`,
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });
});
