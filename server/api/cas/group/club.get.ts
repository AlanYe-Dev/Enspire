import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const requestSchema = z.object({
  club: z.string(),
})

export default eventHandler(async (event) => {
  const { auth } = event.context

  if (!auth.userId) {
    setResponseStatus(event, 403)
    return
  }

  // get clubId from request body
  const requestBody = await readValidatedBody(event, body => requestSchema.safeParse(body))

  if (!requestBody.success) {
    setResponseStatus(event, 400)
    return
  }

  const joinGroup = await prisma.joinGroup.findUnique({
    where: {
      clubId: Number(requestBody.data.club),
    },
    // only use include if the value required is not a scalar
    // include: {
    //   wechatGroupUrl: true,
    // },
  })

  return {
    data: joinGroup,
  }
})