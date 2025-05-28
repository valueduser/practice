import type { TypedPocketBase } from "@data/pocketbase-types"
import { pb } from '@src/data/pocketbase'

export const isValidEmail = (email: string) => {
  if (typeof email !== 'string') return false
  if (email.length > 255) return false
  const regex = /^.+@.+$/
  return regex.test(email)
}

export const isValidPassword = (password: string) => {
  if (typeof password !== 'string') return false
  if (password.length > 255) return false
  if (password.length < 4) return false
  return true
}

export function isValidData(
  email: string,
  password: string
) {
  if (!isValidEmail(email)) {
    return false
  }

  if (!isValidPassword(password)) {
    return false
  }

  return true
}

export async function createUser(
  pb: TypedPocketBase, 
  email: string,
  password: string
) {
  return await pb.collection('users').create({
    email: email,
    password: password,
    passwordConfirm: password,
    emailVisibility: true,
  })
}

export async function loginUser(
  pb: TypedPocketBase, 
  email: string,
  password: string
) {
  return await pb
    .collection('users')
    .authWithPassword(email, password)
}

export function setCookieAndRedirectToDashboard( pb: TypedPocketBase) {
  return new Response(null, {
    status: 301,
    headers: {
      Location: '/dashboard',
      'Set-Cookie': pb.authStore.exportToCookie({
        secure: import.meta.env.DEV ? false : true,
      }),
    },
  })
}

export async function isLoggedIn(pb: TypedPocketBase, request: Request) {
  if (!request.headers.get('Cookie')) {
    return false
  }

  pb.authStore.loadFromCookie(
    request.headers.get('Cookie') || '',
    'pb_auth'
  )

  try {
    if (
      pb.authStore.isValid &&
      (await pb.collection('users').authRefresh())
    ) {
      return true
    }
  } catch (_) {
    pb.authStore.clear()
  }

  return false
}

export async function getUsername(request: Request) {
  pb.authStore.loadFromCookie(request.headers.get('Cookie') || '', 'pb_auth')
  return pb.authStore.model?.username
}