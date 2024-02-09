import z from "zod"
import { prisma } from "../../lib/pisma"
import { FastifyInstance } from "fastify"

export async function createPoll(app:FastifyInstance) {
 

app.post("/polls", async (request, reply) =>{
    const createPollBody = z.object({
        title: z.string(),
        options: z.array(z.string()),
    })

    const {title, options} = createPollBody.parse(request.body) /* verifica se o request.body está no formato correto */
    
    const poll = await prisma.poll.create({
        data: {
            title,
            options: {
                createMany: {
                    data:options.map(option=> {
                        return {title: option}
                    }),
                }
            },
        }
    })

    

    return reply.status(201).send({pollId: poll.id})
})



}