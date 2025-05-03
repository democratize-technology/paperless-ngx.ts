import { PaperlessApiError, MatchingAlgorithm, FileVersion, DataType } from "../src/models/common";

describe("PaperlessApiError", () => {
    it("should create an error with the correct properties", () => {
        // Arrange
        const status = 400;
        const statusText = "Bad Request";
        const body = { detail: "Invalid request parameters" };

        // Act
        const error = new PaperlessApiError(status, statusText, body);

        // Assert
        expect(error.status).toBe(status);
        expect(error.statusText).toBe(statusText);
        expect(error.body).toBe(body);
        expect(error.message).toBe(`API Error: ${status} ${statusText}`);
        expect(error.name).toBe("PaperlessApiError");
    });

    it("should create an error without a body", () => {
        // Arrange
        const status = 500;
        const statusText = "Internal Server Error";

        // Act
        const error = new PaperlessApiError(status, statusText);

        // Assert
        expect(error.status).toBe(status);
        expect(error.statusText).toBe(statusText);
        expect(error.body).toBeUndefined();
        expect(error.message).toBe(`API Error: ${status} ${statusText}`);
        expect(error.name).toBe("PaperlessApiError");
    });

    it("should be an instance of Error", () => {
        // Arrange & Act
        const error = new PaperlessApiError(404, "Not Found");

        // Assert
        expect(error).toBeInstanceOf(Error);
    });

    it("should be an instance of PaperlessApiError", () => {
        // Arrange & Act
        const error = new PaperlessApiError(404, "Not Found");

        // Assert
        expect(error).toBeInstanceOf(PaperlessApiError);
    });
});

describe("Enums", () => {
    it("should have the correct values for MatchingAlgorithm", () => {
        expect(MatchingAlgorithm.NONE).toBe(0);
        expect(MatchingAlgorithm.ANY_WORD).toBe(1);
        expect(MatchingAlgorithm.ALL_WORDS).toBe(2);
        expect(MatchingAlgorithm.EXACT_MATCH).toBe(3);
        expect(MatchingAlgorithm.REGULAR_EXPRESSION).toBe(4);
        expect(MatchingAlgorithm.FUZZY_WORD).toBe(5);
        expect(MatchingAlgorithm.AUTOMATIC).toBe(6);
    });

    it("should have the correct values for FileVersion", () => {
        expect(FileVersion.ARCHIVE).toBe("archive");
        expect(FileVersion.ORIGINAL).toBe("original");
    });

    it("should have the correct values for DataType", () => {
        expect(DataType.STRING).toBe("string");
        expect(DataType.URL).toBe("url");
        expect(DataType.DATE).toBe("date");
        expect(DataType.BOOLEAN).toBe("boolean");
        expect(DataType.INTEGER).toBe("integer");
        expect(DataType.FLOAT).toBe("float");
        expect(DataType.MONETARY).toBe("monetary");
        expect(DataType.DOCUMENTLINK).toBe("documentlink");
        expect(DataType.SELECT).toBe("select");
    });
});
