import { BaseClient } from "./base-client";
import type { User, UserRequest, Group, GroupRequest, PaginationParams, PaginatedResponse } from "../models";

/**
 * Client for user and group operations
 */
export class UserClient extends BaseClient {
    constructor(baseUrl: string, auth: any) {
        super(baseUrl, auth);
    }

    /**
     * Get a list of users with optional pagination
     */
    async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
        const queryString = this.buildQueryString(params);
        return this.request<PaginatedResponse<User>>("GET", `/api/users/${queryString}`);
    }

    /**
     * Get a single user by ID
     */
    async getUser(id: number): Promise<User> {
        return this.request<User>("GET", `/api/users/${id}/`);
    }

    /**
     * Create a new user
     */
    async createUser(user: UserRequest): Promise<User> {
        return this.request<User>("POST", "/api/users/", user);
    }

    /**
     * Update an existing user
     */
    async updateUser(id: number, user: Partial<UserRequest>): Promise<User> {
        return this.request<User>("PATCH", `/api/users/${id}/`, user);
    }

    /**
     * Delete a user
     */
    async deleteUser(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/users/${id}/`);
    }

    /**
     * Get a list of groups with optional pagination
     */
    async getGroups(params?: PaginationParams): Promise<PaginatedResponse<Group>> {
        const queryString = this.buildQueryString(params);
        return this.request<PaginatedResponse<Group>>("GET", `/api/groups/${queryString}`);
    }

    /**
     * Get a single group by ID
     */
    async getGroup(id: number): Promise<Group> {
        return this.request<Group>("GET", `/api/groups/${id}/`);
    }

    /**
     * Create a new group
     */
    async createGroup(group: GroupRequest): Promise<Group> {
        return this.request<Group>("POST", "/api/groups/", group);
    }

    /**
     * Update an existing group
     */
    async updateGroup(id: number, group: Partial<GroupRequest>): Promise<Group> {
        return this.request<Group>("PATCH", `/api/groups/${id}/`, group);
    }

    /**
     * Delete a group
     */
    async deleteGroup(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/groups/${id}/`);
    }
}
