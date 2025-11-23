# TypeScript Error Reproduction: Better Auth Plugin Inference

This is a minimal reproduction repository demonstrating a TypeScript error when using `better-auth` with multiple plugins and type inference.

## The Error

When running `bun run build:types` (or `tsc`), TypeScript fails with the following errors:

```
index.ts(14,7): error TS2742: The inferred type of 'defaultBetterAuthClientOptions' cannot be named without a reference to './node_modules/better-auth/dist/index-D800W6ZW.mjs'. This is likely not portable. A type annotation is necessary.
index.ts(14,7): error TS2742: The inferred type of 'defaultBetterAuthClientOptions' cannot be named without a reference to './node_modules/better-auth/dist/index-DnkzGBwe.mjs'. This is likely not portable. A type annotation is necessary.
index.ts(14,7): error TS7056: The inferred type of this node exceeds the maximum length the compiler will serialize. An explicit type annotation is needed.
```

## Problem Description

The issue occurs when trying to infer types from `createAuthClient` with multiple plugins. The type system struggles to:
1. Name the inferred type without referencing internal module paths
2. Serialize the inferred type due to its complexity (exceeds maximum length)

## Reproduction Steps

1. Install dependencies:
```bash
bun install
```

2. Run TypeScript type checking:
```bash
bun run build:types
```

The error will be reproduced immediately.

## Running with Docker

You can also reproduce the error using Docker:

1. Build the Docker image:
```bash
docker build -t ts-better-auth-infer-plugins .
```

2. Run TypeScript type checking in the container:
```bash
docker run --rm ts-better-auth-infer-plugins bun run build:types
```

The same TypeScript errors will be reproduced in the containerized environment.

## Code Context

The problematic code is in `index.ts`:

```typescript
const defaultBetterAuthClientOptions = {
  plugins: [
    jwtClient(),
    adminClient(),
    organizationClient(),
    emailOTPClient(),
    phoneNumberClient(),
    magicLinkClient(),
  ],
} satisfies BetterAuthClientOptions;

export let betterAuth: ReturnType<
  typeof createAuthClient<typeof defaultBetterAuthClientOptions>
>;
```

## Expected Behavior

TypeScript should be able to infer the type of `defaultBetterAuthClientOptions` and use it with `createAuthClient` without requiring explicit type annotations.

## Actual Behavior

TypeScript fails to infer the type, requiring explicit type annotations which defeats the purpose of using `satisfies` for type safety while maintaining inference.

## Environment

- **Runtime**: Bun v1.2.18+
- **TypeScript**: ^5 (peer dependency)
- **better-auth**: 1.4.2-beta.1
- **OS**: macOS (darwin 24.6.0)

## Related Issues

- https://github.com/better-auth/better-auth/issues/4250#issuecomment-3530435793
  
  
## Workarounds

Potential workarounds (not implemented in this repo):
- Don't emit declaration files
