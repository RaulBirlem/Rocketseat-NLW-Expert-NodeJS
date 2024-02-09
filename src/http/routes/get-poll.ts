import z from "zod"
import { prisma } from "../../lib/pisma"
import { FastifyInstance } from "fastify"

export async function getPoll(app:FastifyInstance) {
 

app.get("/polls/:pollId", async (request, reply) =>{
    const getPollParams = z.object({
        pollId: z.string().uuid(),
    })

    const {pollId} = getPollParams.parse(request.params)
    
    const poll = await prisma.poll.findUnique({
        
        where: {
            id: pollId,
        },

        include: {
            /* traz dado de relacionamento ao mesmo tempo que os dados da enquete*/
            options:{
                select:{
                    id:true,
                    title:true
                }
            }
        }
    })

    

    return reply.send({poll})
})



}