import { PostHogProvider as BasePostHogProvider } from 'posthog-js/react'
import posthog from 'posthog-js'
import type { ReactNode } from 'react'
import { env } from 'cloudflare:workers'

// Only init posthog in production
if (typeof window !== 'undefined' && env.VITE_POSTHOG_KEY && import.meta.env.PROD) {
  posthog.init(env.VITE_POSTHOG_KEY, {
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
  })
}

export default function PostHogProvider({ children }: { children: ReactNode }) {
  return <BasePostHogProvider client={posthog}>{children}</BasePostHogProvider>
}

export function logCustomEvent(eventName: string, properties?: Record<string, any>) {
  if (env.VITE_POSTHOG_KEY && import.meta.env.PROD) {
    posthog.capture(eventName, properties)
  }
}