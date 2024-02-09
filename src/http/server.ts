import fastify from 'fastify'
import {PrismaClient} from "@prisma/client"
import {z} from 'zod'


const app = fastify()

const prisma = new PrismaClient()

app.post("/polls", async (request) =>{

    const createPollBody = z.object({
        title: z.string()
    })

    const {title} = createPollBody.parse(request.body) /* verifica se o request.body está no formato correto */
    
    const poll = await prisma.poll.create({
        data: {
            title,
        }
    })

    return poll
})





app.listen({port:3333}).then(()=>{
    console.log("HTTP server running!")
})


//ORMs
//validate data (zod)