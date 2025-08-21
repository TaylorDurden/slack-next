# Testing Guide

This project includes comprehensive unit tests and end-to-end (e2e) tests to ensure code quality and functionality.

## Test Structure

```
tests/
├── e2e/                    # End-to-end tests using Playwright
│   ├── auth.spec.ts        # Authentication flow tests
│   ├── home.spec.ts        # Home page tests
│   └── workspaces.spec.ts  # Workspace management tests
├── unit/                   # Unit tests using Vitest
│   ├── features/
│   │   ├── auth/          # Authentication feature tests
│   │   └── workspaces/    # Workspace feature tests
│   └── lib/               # Utility function tests
└── mocks.ts               # Shared test mocks
```

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test:unit -- tests/unit/features/workspaces/api/useCreateWorkspace.test.ts
```

### End-to-End Tests (Playwright)

```bash
# Run all e2e tests
npm run test:e2e

# Run e2e tests with UI
npm run test:e2e:ui

# Run e2e tests in debug mode
npm run test:e2e:debug

# Run specific e2e test file
npm run test:e2e -- tests/e2e/workspaces.spec.ts
```

### All Tests

```bash
# Run both unit and e2e tests
npm run test:all
```

## Test Coverage

### Unit Tests

Unit tests cover:

- **API Hooks**: Testing custom hooks for data fetching and mutations
- **Components**: Testing React components in isolation
- **Store**: Testing state management with Jotai
- **Utilities**: Testing helper functions

### E2E Tests

E2E tests cover:

- **User Flows**: Complete user journeys through the application
- **Authentication**: Sign up, sign in, and authentication flows
- **Workspace Management**: Creating, viewing, and managing workspaces
- **Error Handling**: Testing error states and edge cases

## Writing Tests

### Unit Test Guidelines

1. **Use descriptive test names** that explain what is being tested
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Mock external dependencies** to isolate the unit under test
4. **Test both success and error cases**
5. **Use meaningful assertions** that verify the expected behavior

Example:

```typescript
describe("useCreateWorkspace", () => {
  it("should successfully create a workspace", async () => {
    // Arrange
    const mockWorkspaceId = "workspace123";
    mockMutation.mockResolvedValue(mockWorkspaceId);

    // Act
    const { result } = renderHook(() => useCreateWorkspace());
    await act(async () => {
      await result.current.mutate({ name: "Test Workspace" });
    });

    // Assert
    expect(result.current.data).toBe(mockWorkspaceId);
    expect(result.current.isSuccess).toBe(true);
  });
});
```

### E2E Test Guidelines

1. **Test complete user journeys** from start to finish
2. **Use page objects** for better maintainability
3. **Mock API responses** to control test data
4. **Test error scenarios** and edge cases
5. **Use meaningful selectors** (prefer role-based selectors)

Example:

```typescript
test("should create a new workspace successfully", async ({ page }) => {
  // Mock API responses
  await page.route("**/api/workspaces/create", (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ workspaceId: "workspace123" }),
    });
  });

  // Navigate and interact
  await page.goto("/");
  await page.getByLabel("Workspace name").fill("My Test Workspace");
  await page.getByRole("button", { name: "Create workspace" }).click();

  // Verify results
  await expect(page.getByText("Workspace created successfully!")).toBeVisible();
  await expect(page).toHaveURL(/\/workspaces\/workspace123/);
});
```

## Mocking

### Convex Mocks

For unit tests that use Convex, mock the `convex/react` module:

```typescript
const mockMutation = vi.fn();
vi.mock("convex/react", () => ({
  useMutation: () => mockMutation,
}));
```

### Navigation Mocks

For components that use Next.js navigation:

```typescript
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));
```

### Toast Mocks

For components that use toast notifications:

```typescript
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
```

## Best Practices

1. **Keep tests focused**: Each test should verify one specific behavior
2. **Use meaningful data**: Use realistic test data that represents real usage
3. **Clean up after tests**: Reset mocks and state between tests
4. **Test edge cases**: Include tests for error conditions and boundary values
5. **Maintain test data**: Keep test data consistent and up-to-date
6. **Use TypeScript**: Leverage TypeScript for better test reliability

## Debugging Tests

### Unit Tests

```bash
# Run tests with verbose output
npm run test:unit -- --reporter=verbose

# Run specific test with debugger
npm run test:unit -- --run tests/unit/features/workspaces/api/useCreateWorkspace.test.ts
```

### E2E Tests

```bash
# Run tests with UI for debugging
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Run tests with headed browser
npm run test:e2e -- --headed
```

## Continuous Integration

Tests are automatically run in CI/CD pipelines:

- Unit tests run on every commit
- E2E tests run on pull requests
- Coverage reports are generated and tracked

## Coverage Goals

- **Unit Tests**: Aim for >90% coverage
- **E2E Tests**: Cover all critical user flows
- **Integration Tests**: Test component interactions

## Troubleshooting

### Common Issues

1. **Tests failing due to timeouts**: Increase timeout values or optimize slow operations
2. **Mock not working**: Ensure mocks are set up before the component renders
3. **Async test failures**: Use `waitFor` or `act` for async operations
4. **E2E test flakiness**: Add proper waits and use stable selectors

### Getting Help

- Check existing test examples in the codebase
- Review the testing documentation for the tools used
- Ask for help in the team chat or create an issue
