// src/server/router/_app.ts
import { router } from '../trpc'

import { messagesRouter } from './messages'

export const appRouter = router({
  msg: messagesRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
