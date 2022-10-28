import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const messagesRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.message.findMany()
  }),
  add: publicProcedure
    .input(
      z.object({
        text: z.string().min(1, 'Message needs at least one letter'),
      })
    )

    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.message.create({
        data: { text: input.text },
      })
    }),
})
