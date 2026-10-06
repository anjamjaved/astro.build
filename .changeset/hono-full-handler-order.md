---
'@astrojs/cloudflare': patch
'astro': patch
---

Fixes the `astro/hono` usage examples so they mount the same handlers in the same order as `astro()`: `trailingSlash()`, `sessions()`, `redirects()`, `cache()`, `i18n()`, `middleware()`, `actions()`, then `pages()`. Leaving out `redirects()` or `trailingSlash()` made configured redirects and trailing-slash normalization return 404.
