import { getCookie } from 'hono/cookie';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import {
	actions,
	cache,
	i18n,
	middleware,
	pages,
	redirects,
	sessions,
	trailingSlash,
} from 'astro/hono';

const app = new Hono();

// Request logging — see every request in the terminal.
app.use(logger());

// Auth gate — redirects unauthenticated dashboard requests before Astro renders.
app.use(async (c, next) => {
	const url = new URL(c.req.url);
	if (url.pathname.startsWith('/dashboard')) {
		const session = getCookie(c, 'session');
		if (!session) {
			return c.redirect('/login');
		}
	}
	return next();
});

// The Astro handlers below run in the same order as `astro()`.

// Trailing-slash normalization (redirects to the configured form).
app.use(trailingSlash());

// Sessions — available to everything below, persisted after the response.
app.use(sessions());

// Redirects from the `redirects` config. Return before rendering.
app.use(redirects());

// Route caching — wraps i18n, middleware, and rendering.
app.use(cache());

// i18n post-processing (locale redirects, fallback routing). Mounted before
// middleware() and pages() because pages() returns the response without
// calling next().
app.use(i18n());

// User middleware from src/middleware.ts (calls next Hono handler internally).
app.use(middleware());

// Astro Actions (RPC + form), run from inside the middleware chain.
app.use(actions());

// Page rendering (endpoints, pages, fallbacks).
app.use(pages());

export default app;
