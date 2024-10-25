import { defineMiddleware } from 'astro/middleware'
import PocketBase from 'pocketbase'
import type {
  TypedPocketBase,
} from '@src/data/pocketbase-types'

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.pb = new PocketBase(import.meta.env.POCKETBASE_URL ||
    process.env.POCKETBASE_URL)as TypedPocketBase

  return next()
})