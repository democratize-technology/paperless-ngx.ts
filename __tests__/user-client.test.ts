import fetchMock from "jest-fetch-mock";
import { UserClient } from "../src/client/user-client";
import type { User, Group, UserRequest, GroupRequest } from "../src/models";
import { TEST_BASE_URL, TEST_TOKEN, createMockPaginationResponse } from "./test-utils";

describe("UserClient", () => {
    let client: UserClient;

    fetchMock.enableMocks();

    beforeEach(() => {
        fetchMock.resetMocks();
        client = new UserClient(TEST_BASE_URL, TEST_TOKEN);
    });

    // Mock data
    const mockUser: User = {
        id: 1,
        username: "testuser",
        first_name: "Test",
        last_name: "User",
        email: "test@example.com",
        is_superuser: false,
        is_staff: false,
        groups: [],
        permissions: [],
    };

    const mockGroup: Group = {
        id: 1,
        name: "Admins",
        permissions: ["*"],
    };

    describe("getUsers", () => {
        it("should fetch all users", async () => {
            // Arrange
            const mockUsers = [mockUser, { ...mockUser, id: 2, username: "user2" }];

            const mockResponse = createMockPaginationResponse(mockUsers);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            // Act
            const result = await client.getUsers();

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/users/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockResponse);
        });

        it("should fetch users with pagination parameters", async () => {
            // Arrange
            const mockUsers = [mockUser];
            const mockResponse = createMockPaginationResponse(mockUsers);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const params = { page: 1, page_size: 10 };

            // Act
            const result = await client.getUsers(params);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/users/?page=1&page_size=10`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe("getUser", () => {
        it("should fetch a single user by ID", async () => {
            // Arrange
            fetchMock.mockResponseOnce(JSON.stringify(mockUser));

            // Act
            const result = await client.getUser(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/users/1/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockUser);
        });
    });

    describe("createUser", () => {
        it("should create a new user", async () => {
            // Arrange
            const userRequest: UserRequest = {
                username: "newuser",
                email: "new@example.com",
                password: "password123",
                first_name: "New",
                last_name: "User",
                groups: [1],
                is_superuser: false,
                is_staff: false,
            };

            const newUser = { ...mockUser, ...userRequest, id: 3 };
            fetchMock.mockResponseOnce(JSON.stringify(newUser));

            // Act
            const result = await client.createUser(userRequest);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/users/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(userRequest),
                })
            );
            expect(result).toEqual(newUser);
        });
    });

    describe("updateUser", () => {
        it("should update an existing user", async () => {
            // Arrange
            const updateData = {
                first_name: "Updated",
                last_name: "Name",
            };

            const updatedUser = { ...mockUser, ...updateData };
            fetchMock.mockResponseOnce(JSON.stringify(updatedUser));

            // Act
            const result = await client.updateUser(1, updateData);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/users/1/`,
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify(updateData),
                })
            );
            expect(result).toEqual(updatedUser);
        });
    });

    describe("deleteUser", () => {
        it("should delete a user", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 204 });

            // Act
            await client.deleteUser(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/users/1/`,
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });

    describe("getGroups", () => {
        it("should fetch all groups", async () => {
            // Arrange
            const mockGroups = [mockGroup, { ...mockGroup, id: 2, name: "Viewers" }];

            const mockResponse = createMockPaginationResponse(mockGroups);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            // Act
            const result = await client.getGroups();

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/groups/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockResponse);
        });

        it("should fetch groups with pagination parameters", async () => {
            // Arrange
            const mockGroups = [mockGroup];
            const mockResponse = createMockPaginationResponse(mockGroups);
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

            const params = { page: 1, page_size: 10 };

            // Act
            const result = await client.getGroups(params);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/groups/?page=1&page_size=10`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe("getGroup", () => {
        it("should fetch a single group by ID", async () => {
            // Arrange
            fetchMock.mockResponseOnce(JSON.stringify(mockGroup));

            // Act
            const result = await client.getGroup(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/groups/1/`,
                expect.objectContaining({ method: "GET" })
            );
            expect(result).toEqual(mockGroup);
        });
    });

    describe("createGroup", () => {
        it("should create a new group", async () => {
            // Arrange
            const groupRequest: GroupRequest = {
                name: "New Group",
                permissions: ["documents.view_document"],
            };

            const newGroup = { ...mockGroup, ...groupRequest, id: 3 };
            fetchMock.mockResponseOnce(JSON.stringify(newGroup));

            // Act
            const result = await client.createGroup(groupRequest);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/groups/`,
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(groupRequest),
                })
            );
            expect(result).toEqual(newGroup);
        });
    });

    describe("updateGroup", () => {
        it("should update an existing group", async () => {
            // Arrange
            const updateData = {
                name: "Updated Group",
                permissions: ["documents.view_document", "documents.add_document"],
            };

            const updatedGroup = { ...mockGroup, ...updateData };
            fetchMock.mockResponseOnce(JSON.stringify(updatedGroup));

            // Act
            const result = await client.updateGroup(1, updateData);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/groups/1/`,
                expect.objectContaining({
                    method: "PATCH",
                    body: JSON.stringify(updateData),
                })
            );
            expect(result).toEqual(updatedGroup);
        });
    });

    describe("deleteGroup", () => {
        it("should delete a group", async () => {
            // Arrange
            fetchMock.mockResponseOnce("", { status: 204 });

            // Act
            await client.deleteGroup(1);

            // Assert
            expect(fetchMock).toHaveBeenCalledWith(
                `${TEST_BASE_URL}/api/groups/1/`,
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });
});
