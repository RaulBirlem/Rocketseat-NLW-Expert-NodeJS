import z from "zod"
import { randomUUID } from "crypto"
import { prisma } from "../../lib/pisma"
import { FastifyInstance } from "fastify"

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

    if(!sessionId){
        sessionId = randomUUID()

        reply.setCookie('sessionId', sessionId, {
            path: '/', /* todos os caminhos podem acessar as options */
            maxAge: 60 * 60 * 24 * 30,
            signed:true,
            httpOnly:true, /* front end não acessa as informações'cookies' */
        })
    }

    

    return reply.status(201).send({sessionId})
})



}