import { BaseClient } from "./base-client";
import type { SystemStatus, Statistics, SearchResult, Task, Acknowledge } from "../models";

/**
 * Client for system-related operations
 */
export class SystemClient extends BaseClient {
    constructor(baseUrl: string, auth: any) {
        super(baseUrl, auth);
    }

    /**
     * Get the current system status
     */
    async getSystemStatus(): Promise<SystemStatus> {
        return this.request<SystemStatus>("GET", `/api/status/`);
    }

    /**
     * Get system statistics
     */
    async getStatistics(): Promise<Statistics> {
        return this.request<Statistics>("GET", `/api/statistics/`);
    }

    /**
     * Perform a global search
     */
    async search(query: string, params?: Record<string, any>): Promise<SearchResult> {
        const queryParams = new URLSearchParams();
        queryParams.append("query", query);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                queryParams.append(key, value.toString());
            });
        }

        return this.request<SearchResult>("GET", `/api/search/?${queryParams.toString()}`);
    }

    /**
     * Get autocomplete suggestions
     */
    async getAutocompleteSuggestions(term: string, limit?: number): Promise<string[]> {
        const queryParams = new URLSearchParams();
        queryParams.append("term", term);
        if (limit) {
            queryParams.append("limit", limit.toString());
        }

        return this.request<string[]>("GET", `/api/search/autocomplete/?${queryParams.toString()}`);
    }

    /**
     * Alias for getAutocompleteSuggestions
     */
    async autocomplete(term: string, limit?: number): Promise<string[]> {
        return this.getAutocompleteSuggestions(term, limit);
    }

    /**
     * Get all tasks with optional filtering
     */
    async getTasks(params?: Record<string, any>): Promise<any[]> {
        const queryString = this.buildQueryString(params);
        return this.request<any[]>("GET", `/api/tasks/${queryString}`);
    }

    /**
     * Get a single task by ID
     */
    async getTask(taskId: string): Promise<Task> {
        return this.request<Task>("GET", `/api/tasks/${taskId}/`);
    }

    /**
     * Acknowledge a specific task
     */
    async acknowledgeTask(taskId: string): Promise<Acknowledge> {
        return this.request<Acknowledge>("POST", `/api/tasks/acknowledge/`, { tasks: [taskId] });
    }
}
