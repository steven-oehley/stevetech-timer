@AGENTS.md


# CLAUDE.md — stevetech timer app (multi-zone CHILD)

## What this app is
A CHILD zone of the stevetech platform. It is served at stevetech.co.za/timer via
the host's rewrites. It NEVER handles signup, login UI, passwords, or org
management — the HOST owns all identity. This app authenticates users via OIDC
against the host and only implements its own feature: a simple time tracker.

## How auth works here (critical — read carefully)
- BetterAuth runs here ONLY as an OIDC CLIENT using the genericOAuth plugin
  (docs: https://www.better-auth.com/docs/plugins/generic-oauth), provider:
    providerId: "host"
    clientId: env TIMER_CLIENT_ID       // printed by the host's register-clients script
    clientSecret: env TIMER_CLIENT_SECRET
    discoveryUrl: `${HOST_URL}/api/auth/.well-known/openid-configuration`
    scopes: ["openid", "profile", "email"]
- BetterAuth config MUST include:
    basePath: "/timer/api/auth"
    advanced: { cookiePrefix: "timer" }   // avoid cookie collision with host
- The ONLY login UI is /login: a single button calling
  authClient.signIn.oauth2({ providerId: "host", callbackURL: "/" }).
  Unauthenticated users are redirected there by middleware.
- On login, persist the "entitlements" claim from the host's userinfo onto the
  local user record (mapProfileToUser / getUserInfo hook).
- EVERY page and server action must verify: (a) local session exists,
  (b) entitlements includes "timer". If (a) fails → /timer/login. If (b) fails →
  redirect to `${HOST_URL}/dashboard?error=no-license`.

## Hard rules
- basePath: "/timer", assetPrefix: "/timer-static" in next.config.ts.
- Own database ONLY (timer_db). NEVER reference the host database.
- Every domain table carries userId (from local session) — scope all queries by it.
- Links back to the platform (dashboard, logout) are plain <a> to `${HOST_URL}/...`.
- Default shadcn theme, minimal UI, no design work.
- Do not add features beyond the spec. The point of this app is the auth flow.

## Env vars
DATABASE_URL, DIRECT_URL, BETTER_AUTH_SECRET,
BETTER_AUTH_URL (= HOST_URL + "/timer"), HOST_URL,
TIMER_CLIENT_ID, TIMER_CLIENT_SECRET (both from the host's register-clients script)

