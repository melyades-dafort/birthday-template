import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { O as redirect, c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CjWc2dbt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var supabaseUrl = "";
var isSupabaseConfigured = () => {
	return Boolean(supabaseUrl);
};
function generateShortId() {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * 62));
	return result;
}
async function createShortUrl(data, origin) {
	if (!isSupabaseConfigured()) {
		console.warn("Supabase not configured, using fallback");
		return {
			shortUrl: `${origin}/?d=${encodeURIComponent(data)}`,
			fallback: true,
			message: "Database not configured. Using compression fallback."
		};
	}
	try {
		const shortId = generateShortId();
		const expiresAt = /* @__PURE__ */ new Date();
		expiresAt.setFullYear(expiresAt.getFullYear() + 1);
		const { error } = await null.from("short_urls").insert({
			id: shortId,
			data,
			expires_at: expiresAt.toISOString(),
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (error) {
			console.error("Supabase insert error:", error);
			throw error;
		}
		console.log(`✅ Created short URL: ${shortId}`);
		return {
			shortUrl: `${origin}/s/${shortId}`,
			shortId,
			expiresAt: expiresAt.getTime(),
			fallback: false
		};
	} catch (error) {
		console.error("Error creating short URL:", error);
		return {
			shortUrl: `${origin}/?d=${encodeURIComponent(data)}`,
			fallback: true,
			error: "Failed to create short link, using compression fallback"
		};
	}
}
async function getShortUrl(id) {
	if (!isSupabaseConfigured()) throw new Error("Database not configured");
	try {
		const { data, error } = await null.from("short_urls").select("data, expires_at").eq("id", id).single();
		if (error || !data) {
			console.error("Short URL not found:", id);
			return null;
		}
		if (new Date(data.expires_at) < /* @__PURE__ */ new Date()) {
			console.warn("Short URL expired:", id);
			return null;
		}
		console.log(`✅ Retrieved short URL: ${id}`);
		return data.data;
	} catch (error) {
		console.error("Error retrieving short URL:", error);
		return null;
	}
}
var styles_default = "/assets/styles-C3jVfhXR.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$3 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "A Little Birthday Surprise \\u2014 An Interactive Gift" },
			{
				name: "description",
				content: "An interactive digital birthday present: unwrap a 3D cake, drift through a memory universe, and make a wish."
			},
			{
				property: "og:title",
				content: "A Little Birthday Surprise \\u2014 An Interactive Gift"
			},
			{
				property: "og:description",
				content: "An interactive digital birthday present: unwrap a 3D cake, drift through a memory universe, and make a wish."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			},
			{
				name: "twitter:title",
				content: "A Little Birthday Surprise \\u2014 An Interactive Gift"
			},
			{
				name: "twitter:description",
				content: "An interactive digital birthday present: unwrap a 3D cake, drift through a memory universe, and make a wish."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/07c54516-e216-48dd-8ad0-8b0a97d68016/id-preview-6ebfdcb7--1db1e8e4-e7e1-4b5a-8a0d-ade32dd125f2.lovable.app-1783844239111.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/07c54516-e216-48dd-8ad0-8b0a97d68016/id-preview-6ebfdcb7--1db1e8e4-e7e1-4b5a-8a0d-ade32dd125f2.lovable.app-1783844239111.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@300;400;500;600&family=Caveat:wght@400;600&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "alternate icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$3.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$1 = () => import("./admin-C3EZBh-Z.mjs");
var Route$2 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./routes-C_DMlAiU.mjs");
var Route$1 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/s/$id")({ loader: async ({ params }) => {
	const { id } = params;
	try {
		const data = await getShortUrl(id);
		if (!data) throw redirect({ to: "/" });
		throw redirect({
			to: "/",
			search: { d: data }
		});
	} catch (error) {
		if (error && typeof error === "object" && "to" in error) throw error;
		console.error("Error retrieving short link:", error);
		throw redirect({ to: "/" });
	}
} });
var AdminRoute = Route$2.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$3
});
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	AdminRoute,
	SIdRoute: Route.update({
		id: "/s/$id",
		path: "/s/$id",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter, getShortUrl as n, isSupabaseConfigured as r, createShortUrl as t };
