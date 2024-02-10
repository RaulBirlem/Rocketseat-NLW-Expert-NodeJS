import z from "zod"
import { randomUUID } from "crypto"
import { prisma } from "../../lib/pisma"
import { FastifyInstance } from "fastify"
import { redis } from "../../lib/redis"

export async function voteOnPoll(app:FastifyInstance) {
 

app.post("/polls/:pollId/votes", async (request, reply) =>{
    const voteOnPollBody = z.object({
        pollOptionId: z.string().uuid()
    })

    const voteOnPollParams = z.object({
        pollId: z.string().uuid(),
    })

    const {pollId} = voteOnPollParams.parse(request.params)
    const {pollOptionId} = voteOnPollBody.parse(request.body) 


    let { sessionId } = request.cookies
    /*let sessionId = request.cookies.sessionId */


    if(sessionId){
        const userPreviousVoteOnPoll = await prisma.vote.findUnique({
            where: {
                sessionId_pollId:{
                    sessionId,
                    pollId,
                }
            }
        })

        if(userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId != pollOptionId){
/* se já votou  e o voto for diferente apagar voto anterior */            

            await prisma.vote.delete({
                where: {
                    id:userPreviousVoteOnPoll.id,
                }
            })

            //decrement rank
            await redis.zincrby(pollId,-1, userPreviousVoteOnPoll.pollOptionId)/* reduz a pontuação do anterior não do voto novo */

        } else if(userPreviousVoteOnPoll){
//se já votou na enquete e na mesma opção:
            return reply.status(400).send({message:"Você já votou nessa enquete!"})

        }
    }



    if(!sessionId){
        sessionId = randomUUID()

        reply.setCookie('sessionId', sessionId, {
            path: '/', /* todos os caminhos podem acessar as options */
            maxAge: 60 * 60 * 24 * 30,
            signed:true,
            httpOnly:true, /* front end não acessa as informações'cookies' */
        })
    }

    await prisma.vote.create({
        data: {
            sessionId,
            pollId,
            pollOptionId,
        }
    })



    await redis.zincrby(pollId, 1, pollOptionId)/* incrementa em 1 o ranking dessa enquete */

    return reply.status(201).send()
})



}