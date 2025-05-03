import fetchMock from "jest-fetch-mock";
import { BaseClient } from "../src/client/base-client";
import { PaperlessApiError } from "../src/models";

const BASE_URL = "http://localhost:8000";

// Test implementation of BaseClient to expose protected methods
class TestClient extends BaseClient {
    getAuthHeaderTest() {
        return this.getAuthHeader();
    }

    async requestTest(method, path, body) {
        return this.request(method, path, body);
    }

    buildQueryStringTest(params) {
        return this.buildQueryString(params);
    }
}

describe("BaseClient", () => {
    describe("constructor", () => {
        it("should normalize the base URL by removing trailing slash", () => {
            // Arrange & Act
            const client = new TestClient("http://localhost:8000/", "test-token");

            // Assert - We're checking a private property, but this is important enough to test
            expect(client.baseUrl).toBe("http://localhost:8000");
        });

        it("should keep the base URL without trailing slash as is", () => {
            // Arrange & Act
            const client = new TestClient("http://localhost:8000", "test-token");

            // Assert
            expect(client.baseUrl).toBe("http://localhost:8000");
        });

        it("should convert string token to token auth config", () => {
            // Arrange & Act
            const client = new TestClient("http://localhost:8000", "test-token");

            // Assert
            expect(client.auth).toEqual({ type: "token", token: "test-token" });
        });

        it("should keep auth config object as is", () => {
            // Arrange
            const authConfig = { type: "basic", username: "user", password: "pass" };

            // Act
            const client = new TestClient("http://localhost:8000", authConfig);

            // Assert
            expect(client.auth).toEqual(authConfig);
        });
    });

    describe("getAuthHeader", () => {
        it("should return token authorization header", () => {
            // Arrange
            const client = new TestClient(BASE_URL, { type: "token", token: "test-token" });

            // Act
            const headers = client.getAuthHeaderTest();

            // Assert
            expect(headers).toEqual({ Authorization: "Token test-token" });
        });

        it("should return basic authorization header", () => {
            // Arrange
            const client = new TestClient(BASE_URL, { type: "basic", username: "user", password: "pass" });

            // Act
            const headers = client.getAuthHeaderTest();

            // Assert
            // 'user:pass' in base64 is 'dXNlcjpwYXNz'
            expect(headers).toEqual({ Authorization: "Basic dXNlcjpwYXNz" });
        });

        it("should return cookie header with sessionid", () => {
            // Arrange
            const client = new TestClient(BASE_URL, { type: "cookie", sessionId: "test-session" });

            // Act
            const headers = client.getAuthHeaderTest();

            // Assert
            expect(headers).toEqual({ Cookie: "sessionid=test-session" });
        });
    });

    describe("buildQueryString", () => {
        it("should return empty string for undefined params", () => {
            // Arrange
            const client = new TestClient(BASE_URL, "test-token");

            // Act
            const queryString = client.buildQueryStringTest(undefined);

            // Assert
            expect(queryString).toBe("");
        });

        it("should return empty string for empty params", () => {
            // Arrange
            const client = new TestClient(BASE_URL, "test-token");

            // Act
            const queryString = client.buildQueryStringTest({});

            // Assert
            expect(queryString).toBe("");
        });

        it("should build query string for single param", () => {
            // Arrange
            const client = new TestClient(BASE_URL, "test-token");

            // Act
            const queryString = client.buildQueryStringTest({ page: 1 });

            // Assert
            expect(queryString).toBe("?page=1");
        });

        it("should build query string for multiple params", () => {
            // Arrange
            const client = new TestClient(BASE_URL, "test-token");

            // Act
            const queryString = client.buildQueryStringTest({ page: 1, page_size: 10, search: "test" });

            // Assert
            // Order might vary, so we check for presence of all params
            expect(queryString).toContain("page=1");
            expect(queryString).toContain("page_size=10");
            expect(queryString).toContain("search=test");
            expect(queryString.startsWith("?")).toBe(true);
        });

        it("should filter out undefined values", () => {
            // Arrange
            const client = new TestClient(BASE_URL, "test-token");

            // Act
            const queryString = client.buildQueryStringTest({ page: 1, filter: undefined, search: "test" });

            // Assert
            expect(queryString).toContain("page=1");
            expect(queryString).toContain("search=test");
            expect(queryString).not.toContain("filter");
        });

        it("should handle boolean values correctly", () => {
            // Arrange
            const client = new TestClient(BASE_URL, "test-token");

            // Act
            const queryString = client.buildQueryStringTest({ is_active: true, is_complete: false });

            // Assert
            expect(queryString).toContain("is_active=true");
            expect(queryString).toContain("is_complete=false");
        });

        it("should handle array values", () => {
            // Arrange
            const client = new TestClient(BASE_URL, "test-token");

            // Act
            const queryString = client.buildQueryStringTest({ tags__id: [1, 2, 3] });

            // Assert
            expect(queryString).toContain("tags__id=1%2C2%2C3");
        });
    });

    describe("request", () => {
        beforeEach(() => {
            fetchMock.resetMocks();
        });

        it("should make a GET request with proper headers", async () => {
            // Arrange
            const client = new TestClient(BASE_URL, "test-token");
            const mockData = { id: 1, name: "Test" };
            fetchMock.mockResponseOnce(JSON.stringify(mockData));

            // Act
            const result = await client.requestTest("GET", "/api/test/");

            // Assert
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/api/test/`, {
                method: "GET",
                headers: {
                    Authorization: "Token test-token",
                    "Content-Type": "application/json",
                },
                body: undefined,
                credentials: "same-origin",
            });
            expect(result).toEqual(mockData);
        });

        it("should make a POST request with request body", async () => {
            // Arrange
            const client = new TestClient(BASE_URL, "test-token");
            const requestBody = { name: "Test" };
            const responseData = { id: 1, name: "Test" };
            fetchMock.mockResponseOnce(JSON.stringify(responseData));

            // Act
            const result = await client.requestTest("POST", "/api/test/", requestBody);

            // Assert
            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/api/test/`, {
                method: "POST",
                headers: {
                    Authorization: "Token test-token",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
                credentials: "same-origin",
            });
            expect(result).toEqual(responseData);
        });

        it("should include credentials for cookie auth", async () => {
            // Arrange
            const client = new TestClient(BASE_URL, { type: "cookie", sessionId: "test-session" });
            const mockData = { id: 1, name: "Test" };
            fetchMock.mockResponseOnce(JSON.stringify(mockData));

            // Act
            const result = await client.requestTest("GET", "/api/test/");

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/api/test/`, {
                method: "GET",
                headers: {
                    Cookie: "sessionid=test-session",
                    "Content-Type": "application/json",
                },
                body: undefined,
                credentials: "include",
            });
            expect(result).toEqual(mockData);
        });

        it("should handle DELETE requests with 204 status", async () => {
            // Arrange
            const client = new TestClient(BASE_URL, "test-token");
            fetchMock.mockResponseOnce("", { status: 204 });

            // Act
            const result = await client.requestTest("DELETE", "/api/test/1/");

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/api/test/1/`, expect.anything());
            expect(result).toEqual({});
        });

        it("should throw PaperlessApiError for error responses", async () => {
            // Arrange
            const client = new TestClient(BASE_URL, "test-token");
            const errorBody = { detail: "Not found" };
            fetchMock.mockResponseOnce(JSON.stringify(errorBody), { status: 404, statusText: "Not Found" });

            // Act & Assert
            try {
                await client.requestTest("GET", "/api/test/999/");
                fail("Expected error was not thrown");
            } catch (error) {
                expect(error instanceof PaperlessApiError).toBe(true);
                expect(error.status).toBe(404);
                expect(error.statusText).toBe("Not Found");
                expect(error.body).toEqual(errorBody);
            }
        });

        it("should handle error responses without valid JSON", async () => {
            // Arrange
            const client = new TestClient(BASE_URL, "test-token");
            fetchMock.mockResponseOnce("Internal Server Error", { status: 500, statusText: "Internal Server Error" });

            // Act & Assert
            try {
                await client.requestTest("GET", "/api/test/");
                fail("Expected error was not thrown");
            } catch (error) {
                expect(error instanceof PaperlessApiError).toBe(true);
                expect(error.status).toBe(500);
                expect(error.statusText).toBe("Internal Server Error");
            }
        });
    });
});
