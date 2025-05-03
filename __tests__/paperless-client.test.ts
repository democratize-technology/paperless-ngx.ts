import { PaperlessClient } from "../src/index";
import {
    DocumentClient,
    TagClient,
    CorrespondentClient,
    DocumentTypeClient,
    StoragePathClient,
    CustomFieldClient,
    UserClient,
    ShareLinkClient,
    SystemClient,
} from "../src/client";
import { TEST_BASE_URL, TEST_TOKEN, TEST_AUTH_CONFIG } from "./test-utils";

describe("PaperlessClient", () => {
    describe("constructor", () => {
        it("should initialize all client instances with string token", () => {
            // Arrange & Act
            const client = new PaperlessClient(TEST_BASE_URL, TEST_TOKEN);

            // Assert
            expect(client.documents).toBeInstanceOf(DocumentClient);
            expect(client.tags).toBeInstanceOf(TagClient);
            expect(client.correspondents).toBeInstanceOf(CorrespondentClient);
            expect(client.documentTypes).toBeInstanceOf(DocumentTypeClient);
            expect(client.storagePaths).toBeInstanceOf(StoragePathClient);
            expect(client.customFields).toBeInstanceOf(CustomFieldClient);
            expect(client.users).toBeInstanceOf(UserClient);
            expect(client.shareLinks).toBeInstanceOf(ShareLinkClient);
            expect(client.system).toBeInstanceOf(SystemClient);
        });

        it("should initialize all client instances with auth config object", () => {
            // Arrange & Act
            const client = new PaperlessClient(TEST_BASE_URL, TEST_AUTH_CONFIG);

            // Assert
            expect(client.documents).toBeInstanceOf(DocumentClient);
            expect(client.tags).toBeInstanceOf(TagClient);
            expect(client.correspondents).toBeInstanceOf(CorrespondentClient);
            expect(client.documentTypes).toBeInstanceOf(DocumentTypeClient);
            expect(client.storagePaths).toBeInstanceOf(StoragePathClient);
            expect(client.customFields).toBeInstanceOf(CustomFieldClient);
            expect(client.users).toBeInstanceOf(UserClient);
            expect(client.shareLinks).toBeInstanceOf(ShareLinkClient);
            expect(client.system).toBeInstanceOf(SystemClient);
        });

        it("should pass baseUrl and auth to all client instances", () => {
            // This is a more detailed test that verifies each client was initialized properly

            // Arrange
            // Spy on all client constructors
            const documentSpy = jest.spyOn(DocumentClient.prototype, "constructor" as any);
            const tagSpy = jest.spyOn(TagClient.prototype, "constructor" as any);
            const correspondentSpy = jest.spyOn(CorrespondentClient.prototype, "constructor" as any);
            const documentTypeSpy = jest.spyOn(DocumentTypeClient.prototype, "constructor" as any);
            const storagePathSpy = jest.spyOn(StoragePathClient.prototype, "constructor" as any);
            const customFieldSpy = jest.spyOn(CustomFieldClient.prototype, "constructor" as any);
            const userSpy = jest.spyOn(UserClient.prototype, "constructor" as any);
            const shareLinkSpy = jest.spyOn(ShareLinkClient.prototype, "constructor" as any);
            const systemSpy = jest.spyOn(SystemClient.prototype, "constructor" as any);

            // Act
            // Note: The spies won't actually intercept the constructor calls properly in JavaScript,
            // but we're just ensuring the client instantiation doesn't throw errors
            const client = new PaperlessClient(TEST_BASE_URL, TEST_AUTH_CONFIG);

            // Assert
            // Check private properties of each client - this is a bit hacky, but ensures they
            // were initialized with correct values
            expect((client.documents as any).baseUrl).toBe(TEST_BASE_URL);
            expect((client.documents as any).auth).toEqual(TEST_AUTH_CONFIG);

            expect((client.tags as any).baseUrl).toBe(TEST_BASE_URL);
            expect((client.tags as any).auth).toEqual(TEST_AUTH_CONFIG);

            expect((client.correspondents as any).baseUrl).toBe(TEST_BASE_URL);
            expect((client.correspondents as any).auth).toEqual(TEST_AUTH_CONFIG);

            expect((client.documentTypes as any).baseUrl).toBe(TEST_BASE_URL);
            expect((client.documentTypes as any).auth).toEqual(TEST_AUTH_CONFIG);

            expect((client.storagePaths as any).baseUrl).toBe(TEST_BASE_URL);
            expect((client.storagePaths as any).auth).toEqual(TEST_AUTH_CONFIG);

            expect((client.customFields as any).baseUrl).toBe(TEST_BASE_URL);
            expect((client.customFields as any).auth).toEqual(TEST_AUTH_CONFIG);

            expect((client.users as any).baseUrl).toBe(TEST_BASE_URL);
            expect((client.users as any).auth).toEqual(TEST_AUTH_CONFIG);

            expect((client.shareLinks as any).baseUrl).toBe(TEST_BASE_URL);
            expect((client.shareLinks as any).auth).toEqual(TEST_AUTH_CONFIG);

            expect((client.system as any).baseUrl).toBe(TEST_BASE_URL);
            expect((client.system as any).auth).toEqual(TEST_AUTH_CONFIG);
        });
    });
});
