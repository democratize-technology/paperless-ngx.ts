# Paperless-ngx TypeScript Client

A comprehensive TypeScript client for the Paperless-ngx REST API.

## Installation

```bash
npm install paperless-ngx
```

## Usage

### Basic Usage

```typescript
import { PaperlessClient } from 'paperless-ngx';

// Create a client instance with token authentication
const client = new PaperlessClient('http://localhost:8000', 'your-auth-token');

// Or use basic authentication
const client = new PaperlessClient('http://localhost:8000', {
  type: 'basic',
  username: 'your-username',
  password: 'your-password'
});

// Or use cookie-based authentication
const client = new PaperlessClient('http://localhost:8000', {
  type: 'cookie',
  sessionId: 'your-session-id'
});
```

### Working with Documents

```typescript
// Get a list of documents
const documents = await client.documents.getDocuments();

// Get a specific document
const document = await client.documents.getDocument(123);

// Create a new document
const newDocument = await client.documents.createDocument({
  title: 'Test Document',
  correspondent: 1,
  tags: [1, 2, 3]
});

// Update a document
await client.documents.updateDocument(123, {
  title: 'Updated Title'
});

// Delete a document
await client.documents.deleteDocument(123);

// Download a document
const pdfBlob = await client.documents.downloadDocument(123);
// Use with file-saver or similar
// saveAs(pdfBlob, 'document.pdf');

// Upload a document
const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
await client.documents.uploadDocument(file, {
  title: 'Uploaded Document',
  tags: [1, 2]
});
```

### Working with Tags

```typescript
// Get all tags
const tags = await client.tags.getTags();

// Create a tag
const newTag = await client.tags.createTag({
  name: 'New Tag',
  color: '#ff0000'
});

// Update a tag
await client.tags.updateTag(1, {
  name: 'Updated Tag'
});

// Delete a tag
await client.tags.deleteTag(1);
```

### Working with Custom Fields

```typescript
// Get all custom fields
const customFields = await client.customFields.getCustomFields();

// Create a custom field
const newCustomField = await client.customFields.createCustomField({
  name: 'Contract Number',
  data_type: 'string'
});
```

### Searching

```typescript
// Perform a search
const results = await client.system.search('invoice');

// Get autocomplete suggestions
const suggestions = await client.system.getAutocompleteSuggestions('inv');
```

## Advanced Usage

### Pagination

Most list endpoints support pagination:

```typescript
// Get the second page of documents with 25 items per page
const documents = await client.documents.getDocuments({
  page: 2,
  page_size: 25
});

console.log(`Showing ${documents.results.length} of ${documents.count} documents`);
console.log(`Next page URL: ${documents.next}`);
```

### Filtering Documents

```typescript
// Get documents with specific filters
const documents = await client.documents.getDocuments({
  correspondent__id: 5,
  tags__id: 3,
  created__date__gt: '2023-01-01'
});
```

### Bulk Operations

```typescript
// Bulk edit documents
const result = await client.documents.bulkEditDocuments({
  documents: [1, 2, 3],
  method: 'add_tag',
  parameters: { tag: 5 }
});

// Bulk download documents
const zip = await client.documents.bulkDownloadDocuments([1, 2, 3], {
  content: 'both',
  compression: 'deflated'
});
```

## API Documentation

For a complete list of available endpoints and operations, see the [Paperless-ngx API documentation](https://docs.paperless-ngx.com/api/).
