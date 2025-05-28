import { defineMiddleware } from 'astro/middleware'
import PocketBase from 'pocketbase'
import type {
  TypedPocketBase,
} from '@src/data/pocketbase-types'
import { isLoggedIn } from '@lib/auth'

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.pb = new PocketBase(import.meta.env.POCKETBASE_URL ||
    process.env.POCKETBASE_URL)as TypedPocketBase

  context.locals.pb.autoCancellation(false)

  if (!(await isLoggedIn(context.locals.pb, context.request))) {
    if (context.url.pathname.startsWith('/app/api')) {
      return new Response('Unauthorized', {
        status: 401,
      })
    }

    if (context.url.pathname.startsWith('/app')) {
      return context.redirect('/login')
    }
  }

  return next()
})