// @ts-check
import { defineConfig } from 'astro/config'
import sentry from '@sentry/astro'
import tailwind from '@astrojs/tailwind'

import node from '@astrojs/node'
import 'dotenv/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sentry({
      dsn: 'https://05308ed7adf7eec9d9098ac7704ba244@o141824.ingest.us.sentry.io/4509403298332672',
      tracesSampleRate: 0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      sourceMapsUploadOptions: {
        project: 'practice',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),
  redirects: {
    '/app': '/dashboard',
  },
})
