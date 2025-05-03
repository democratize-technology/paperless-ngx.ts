// __tests__/setup.js
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

global.beforeEach(() => {
  fetchMock.resetMocks();
});
