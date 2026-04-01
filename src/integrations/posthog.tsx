import posthog from "posthog-js";
import { PostHogProvider as BasePostHogProvider } from "posthog-js/react";
import type { ReactNode } from "react";

/** 
 Cannot use env from `"cloudflare:workers"` since this code is not pathched during buildtime and throws error.
 Also, env var from wrangler.jsonc does not seem to work.
 When building locally, create  a `.env.local` file with VITE_POSTHOG_KEY. Otherwise provide this env var in your CI/CD pipeline or hosting platform.
*/
const posthogKey = import.meta.env.VITE_POSTHOG_KEY;

// Only init posthog in production
if (typeof window !== "undefined" && posthogKey && import.meta.env.PROD) {
	posthog.init(posthogKey, {
		api_host: "https://metrics.royz.dev",
		ui_host: "https://eu.posthog.com",
		defaults: "2026-01-30",
		person_profiles: "always",
		capture_heatmaps: true,
		capture_performance: true,
		session_recording: {
			maskAllInputs: true,
		},
		enable_recording_console_log: true,
		capture_pageview: true,
		capture_pageleave: true,
	});
}

export function PostHogProvider({ children }: { children: ReactNode }) {
	return <BasePostHogProvider client={posthog}>{children}</BasePostHogProvider>;
}

export function logCustomEvent(
	eventName: string,
	properties?: Record<string, any>,
) {
	if (posthogKey && import.meta.env.PROD) {
		posthog.capture(eventName, properties);
	}
}
