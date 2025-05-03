import fetchMock from "jest-fetch-mock";
import { SystemClient } from "../src/client/system-client";
import type { SystemStatus, Statistics, SearchResult } from "../src/models";
import { TEST_BASE_URL, TEST_TOKEN, createMockPaginationResponse } from "./test-utils";

describe("SystemClient", () => {
    let client: SystemClient;

    fetchMock.enableMocks();

    beforeEach(() => {
        fetchMock.resetMocks();
        client = new SystemClient(TEST_BASE_URL, TEST_TOKEN);
    });

    describe("getSystemStatus", () => {
        it("should fetch system status", async () => {
            // Arrange
            const mockStatus: SystemStatus = {
                pngx_version: "1.14.5",
                server_os: "Linux",
                install_type: "docker",
                storage: {
                    total: 500000000000,
                    available: 250000000000,
                },
                database: {
                    type: "postgresql",
                    url: "postgres://user:pass@localhost:5432/paperless",
                    status: "OK",
                    error: "",
                    migration_status: {
                        latest_migration: "1234_migration",
                        unapplied_migrations: [],
                    },
                },
                tasks: {
                    redis_url: "redis://localhost:6379/0",
                    redis_status: "OK",
                    redis_error: "",
                    celery_status: "OK",
                },
                index: {
                    status: "OK",
                    error: "",
                    last_modified: "2023-01-01T00:00:00Z",
                },
                classifier: {
                    status: "OK",
                    error: "",
                    last_trained: "2023-01-01T00:00:00Z",
                },
                sanity_check: {
                    status: "OK",
                    error: "",
                    last_run: "2023-01-01T00:00:00Z",
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockStatus));

            // Act
            const result = await client.getSystemStatus();

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/status/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockStatus);
        });
    });

    describe("getStatistics", () => {
        it("should fetch statistics", async () => {
            // Arrange
            const mockStats: Statistics = {
                documents_by_month: [{ year: 2023, month: 1, count: 50 }],
                documents_by_year: [{ year: 2023, count: 500 }],
                inbox_count: 10,
                document_file_type_counts: [{ mime_type: "application/pdf", mime_type_count: 800 }],
                document_type_counts: [{ document_type__name: "Invoice", document_type_count: 300 }],
                tag_counts: [{ tag__name: "Important", tag_count: 150 }],
                correspondent_counts: [{ correspondent__name: "Company", correspondent_count: 200 }],
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockStats));

            // Act
            const result = await client.getStatistics();

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/statistics/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockStats);
        });
    });

    describe("search", () => {
        it("should perform a basic search", async () => {
            // Arrange
            const mockResults: SearchResult = {
                total: 2,
                documents: [
                    {
                        id: 1,
                        title: "Test Document",
                        content: "This is a test document with search terms",
                    },
                    {
                        id: 2,
                        title: "Another Document",
                        content: "This document also has search terms",
                    },
                ],
                saved_views: [],
                tags: [],
                correspondents: [],
                document_types: [],
                storage_paths: [],
                users: [],
                groups: [],
                mail_rules: [],
                mail_accounts: [],
                workflows: [],
                custom_fields: [],
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockResults));

            // Act
            const result = await client.search("search terms");

            // Assert
            expect(fetchMock).toHaveBeenCalled();
            expect(result).toEqual(mockResults);
        });

        it("should perform a search with additional parameters", async () => {
            // Arrange
            const mockResults: SearchResult = {
                total: 1,
                documents: [
                    {
                        id: 1,
                        title: "Test Document",
                        content: "This is a test document with search terms",
                    },
                ],
                saved_views: [],
                tags: [],
                correspondents: [],
                document_types: [],
                storage_paths: [],
                users: [],
                groups: [],
                mail_rules: [],
                mail_accounts: [],
                workflows: [],
                custom_fields: [],
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockResults));

            const searchParams = {
                page: 1,
                page_size: 10,
                more_like_id: 5,
            };

            // Act
            const result = await client.search("search terms", searchParams);

            // Assert
            expect(fetchMock).toHaveBeenCalled();

            // Check that all parameters are included
            const url = fetchMock.mock.calls[0][0] as string;
            Object.entries(searchParams).forEach(([key, value]) => {
                expect(url).toContain(`${key}=${value}`);
            });

            expect(result).toEqual(mockResults);
        });
    });

    describe("getAutocompleteSuggestions", () => {
        it("should get autocomplete suggestions", async () => {
            // Arrange
            const mockSuggestions = ["invoice", "invoice 2023", "important invoice"];
            fetchMock.mockResponseOnce(JSON.stringify(mockSuggestions));

            // Act
            const result = await client.getAutocompleteSuggestions("inv");

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/search/autocomplete/?term=inv`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockSuggestions);
        });

        it("should get autocomplete suggestions with limit", async () => {
            // Arrange
            const mockSuggestions = ["invoice", "invoice 2023"];
            fetchMock.mockResponseOnce(JSON.stringify(mockSuggestions));

            // Act
            const result = await client.getAutocompleteSuggestions("inv", 2);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/search/autocomplete/?term=inv&limit=2`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockSuggestions);
        });
    });

    describe("autocomplete", () => {
        it("should get autocomplete suggestions (alias method)", async () => {
            // Arrange
            const mockSuggestions = ["invoice", "invoice 2023", "important invoice"];
            fetchMock.mockResponseOnce(JSON.stringify(mockSuggestions));

            // Act
            const result = await client.autocomplete("inv");

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/search/autocomplete/?term=inv`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockSuggestions);
        });

        it("should get autocomplete suggestions with limit (alias method)", async () => {
            // Arrange
            const mockSuggestions = ["invoice", "invoice 2023"];
            fetchMock.mockResponseOnce(JSON.stringify(mockSuggestions));

            // Act
            const result = await client.autocomplete("inv", 2);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/search/autocomplete/?term=inv&limit=2`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockSuggestions);
        });
    });

    describe("getTasks", () => {
        it("should fetch tasks with no parameters", async () => {
            // Arrange
            const mockTasks = [
                {
                    id: 1,
                    task_id: "abc123",
                    task_name: "process_document",
                    status: "COMPLETE",
                    result: { document_id: 42 },
                    date_created: "2023-01-01T00:00:00Z",
                    date_done: "2023-01-01T00:01:00Z",
                },
                {
                    id: 2,
                    task_id: "def456",
                    task_name: "index_document",
                    status: "PENDING",
                    result: null,
                    date_created: "2023-01-02T00:00:00Z",
                    date_done: null,
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockTasks));

            // Act
            const result = await client.getTasks();

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/tasks/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockTasks);
        });

        it("should fetch tasks with query parameters", async () => {
            // Arrange
            const mockTasks = [
                {
                    id: 1,
                    task_id: "abc123",
                    task_name: "process_document",
                    status: "COMPLETE",
                    result: { document_id: 42 },
                    date_created: "2023-01-01T00:00:00Z",
                    date_done: "2023-01-01T00:01:00Z",
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockTasks));

            const queryParams = {
                status: "COMPLETE",
                task_name: "process_document",
            };

            // Act
            const result = await client.getTasks(queryParams);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining(`${TEST_BASE_URL}/api/tasks/?`),
                expect.objectContaining({ method: "GET" })
            );

            // Check that all query parameters are included
            const url = fetchMock.mock.calls[0][0] as string;
            Object.entries(queryParams).forEach(([key, value]) => {
                expect(url).toContain(`${key}=${value}`);
            });

            expect(result).toEqual(mockTasks);
        });
    });

    describe("getTask", () => {
        it("should fetch a single task by ID", async () => {
            // Arrange
            const mockTask = {
                id: 1,
                task_id: "abc123",
                task_name: "process_document",
                status: "COMPLETE",
                result: { document_id: 42 },
                date_created: "2023-01-01T00:00:00Z",
                date_done: "2023-01-01T00:01:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockTask));

            // Act
            const result = await client.getTask("abc123");

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/tasks/abc123/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockTask);
        });
    });

    describe("acknowledgeTask", () => {
        it("should acknowledge a specific task", async () => {
            // Arrange
            fetchMock.mockResponseOnce(JSON.stringify({ result: 0 }), { status: 200 });
            const taskId = "abc123";

            // Act
            await client.acknowledgeTask(taskId);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/tasks/acknowledge/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({ tasks: [taskId] }),
                })
            );
        });
    });
});
