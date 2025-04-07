import { preview } from 'vite'
import { afterAll, beforeAll } from 'vitest'
import type { PreviewServer } from 'vite'

let server: PreviewServer

beforeAll(async () => {
  server = await preview({ preview: { port: 4321 } })
})

afterAll(async () => {
  await server?.close()
})