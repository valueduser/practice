// @ts-check
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import node from '@astrojs/node'
import sentry from '@sentry/astro'
import 'dotenv/config'

const port = Number(process.env.PORT) || 4321

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
  server: { port: port },
  adapter: node({
    mode: 'standalone',
  }),
  redirects: {
    '/app': '/dashboard',
  },
})
