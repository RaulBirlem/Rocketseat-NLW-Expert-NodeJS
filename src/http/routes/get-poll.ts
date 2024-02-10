import z from "zod"
import { prisma } from "../../lib/pisma"
import { FastifyInstance } from "fastify"
import { redis } from "../../lib/redis"

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

    if(!poll){
        return reply.status(400).send({message:"Enquete não encontrada!"})
    }

    const result = await redis.zrange(pollId, 0, -1, "WITHSCORES") /* retorna todas as pontuações */

/* console.log(result) */
    const votes = result.reduce((obj,line,index)=>{ /* percorre o array */

        if(index % 2 === 0){
            const score = result[index+1]

            Object.assign(obj, {[line]: Number(score)})
        }

        return obj

    },{} as Record<string,number>)

    console.log(votes)
 
    return reply.send({
        poll: {
            id:poll.id,
            title:poll.title,
            options: poll.options.map((option) => {
                return {
                    id:option.id,
                    title:option.title,
                    score: (option.id in votes) ? votes[option.id] : 0,
                }
            })
        }
    })
})



}