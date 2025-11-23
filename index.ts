import {
  type BetterAuthClientOptions,
  createAuthClient,
} from 'better-auth/client';
import {
  jwtClient,
  adminClient,
  organizationClient,
  emailOTPClient,
  magicLinkClient,
  phoneNumberClient,
} from 'better-auth/client/plugins';

const defaultBetterAuthClientOptions = {
  plugins: [
    jwtClient(),
    adminClient(),
    organizationClient(),
    emailOTPClient(),

    // TODO: add these in
    phoneNumberClient(),
    magicLinkClient(),
  ],
} satisfies BetterAuthClientOptions;

export let betterAuth: ReturnType<
  typeof createAuthClient<typeof defaultBetterAuthClientOptions>
>;
