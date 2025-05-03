import fetchMock from "jest-fetch-mock";
import { CustomFieldClient } from "../src/client/custom-field-client";
import type { CustomField, CustomFieldRequest } from "../src/models";
import { TEST_BASE_URL, TEST_TOKEN, mockCustomField, createMockPaginationResponse } from "./test-utils";

describe("CustomFieldClient", () => {
    let client: CustomFieldClient;

    beforeEach(() => {
        fetchMock.resetMocks();
        client = new CustomFieldClient(TEST_BASE_URL, TEST_TOKEN);
    });

    describe("getCustomFields", () => {
        it("should fetch custom fields with no parameters", async () => {
            // Arrange
            const mockCustomFields = [mockCustomField, { ...mockCustomField, id: 2, name: "Another Custom Field" }];
            const mockResponse = createMockPaginationResponse(mockCustomFields);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            // Act
            const result = await client.getCustomFields();

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/custom_fields/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockResponse);
        });

        it("should fetch custom fields with query parameters", async () => {
            // Arrange
            const mockCustomFields = [mockCustomField];
            const mockResponse = createMockPaginationResponse(mockCustomFields);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const queryParams = {
                page: 1,
                page_size: 10,
                ordering: "name",
                name__icontains: "test",
            };

            // Act
            const result = await client.getCustomFields(queryParams);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining(`${TEST_BASE_URL}/api/custom_fields/?`),
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

    describe("getCustomField", () => {
        it("should fetch a single custom field by ID", async () => {
            // Arrange
            fetchMock.mockResponseOnce(JSON.stringify(mockCustomField));

            // Act
            const result = await client.getCustomField(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/custom_fields/1/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockCustomField);
        });
    });

    describe("createCustomField", () => {
        it("should create a new custom field", async () => {
            // Arrange
            const newCustomField: CustomFieldRequest = {
                name: "New Custom Field",
                data_type: "string",
                required: false,
            };

            const createdCustomField: CustomField = {
                ...mockCustomField,
                id: 3,
                name: "New Custom Field",
            };

            fetchMock.mockResponseOnce(JSON.stringify(createdCustomField));

            // Act
            const result = await client.createCustomField(newCustomField);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/custom_fields/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(newCustomField),
                })
            );
            expect(result).toEqual(createdCustomField);
        });
    });

    describe("updateCustomField", () => {
        it("should update an existing custom field", async () => {
            // Arrange
            const updateData: CustomFieldRequest = {
                name: "Updated Custom Field",
                data_type: "integer",
            };

            const updatedCustomField = {
                ...mockCustomField,
                name: "Updated Custom Field",
                data_type: "integer",
            };

            fetchMock.mockResponseOnce(JSON.stringify(updatedCustomField));

            // Act
            const result = await client.updateCustomField(1, updateData);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/custom_fields/1/`,
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify(updateData),
                })
            );
            expect(result).toEqual(updatedCustomField);
        });
    });

    describe("deleteCustomField", () => {
        it("should delete a custom field", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 204 });

            // Act
            await client.deleteCustomField(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/custom_fields/1/`,
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });
});
