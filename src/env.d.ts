/// <reference path="../.astro/types.d.ts" />

import type { TypedPocketBase } from '@data/pocketbase-types'
declare global {
  namespace App {
    interface Locals extends Record<string, any> {
      pb: TypedPocketBase
    }
  }
}