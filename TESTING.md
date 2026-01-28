# Testing Guide

## Overview

This project uses Vitest for integration testing. The tests call real Census API endpoints through Vercel serverless functions to avoid CORS issues.

## Architecture

### Serverless Functions

The project uses Vercel serverless functions to proxy requests to the Census API:

- **`/api/classify.ts`** - Handles product classification requests (POST)
- **`/api/schedule-b.ts`** - Retrieves Schedule B codes (GET)

These functions:
- Run server-side to avoid CORS issues
- Forward requests to the Census API
- Handle cookie management for session persistence
- Can be tested locally with Vercel CLI

### Local Development

To run the project with serverless functions locally:

```bash
npm run dev
```

This uses `vercel dev` which:
- Starts the Vite dev server
- Runs serverless functions locally
- Automatically routes API requests to the functions

Alternatively, to run just the Vite dev server (without API functions):

```bash
npm run dev:vite
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests with UI

```bash
npm test:ui
```

This opens a browser-based UI for running and debugging tests.

### Run Tests Once (CI mode)

```bash
npm test:run
```

## Integration Tests

The integration tests are located in `src/api/__tests__/classifyApi.test.ts`.

### Test Coverage

1. **Classification Start** - Tests starting a new product classification
2. **Classification Continue** - Tests answering drill-down questions
3. **Schedule B Lookup** - Tests retrieving Schedule B code hierarchies

### Important Notes

- Tests call the **real Census API** via serverless functions
- Each test has extended timeouts (30-90 seconds) to accommodate API response times
- Tests require the serverless functions to be running
- Some tests may be skipped if the API doesn't return expected data

## Running Tests Locally

### Prerequisites

1. Start the Vercel dev server:
```bash
npm run dev
```

2. In another terminal, run the tests:
```bash
npm test
```

### Testing Against Production

To test against deployed serverless functions:

1. Deploy to Vercel:
```bash
vercel deploy
```

2. Update the API endpoints in your test environment to point to your Vercel URL

## Troubleshooting

### 400 Errors

If you see 400 errors:
- Ensure serverless functions are running (`npm run dev`)
- Check that the Census API is accessible
- Verify cookie handling is working correctly

### CORS Issues

If you encounter CORS errors:
- Make sure you're using the serverless functions (`/api/*` endpoints)
- Don't call the Census API directly from the browser

### Timeout Errors

If tests timeout:
- Increase timeout values in test files
- Check your internet connection
- Verify the Census API is responding

## CI/CD Integration

For continuous integration:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    npm ci
    npm run test:run
  env:
    VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

Note: Tests require serverless functions to be available during CI runs.
