import { FastifyInstance } from "fastify";

export async function pollResults(app: FastifyInstance){
    app.get('/polls/:pollId/results', {websocket:true}, (connection,request)=>{
        connection.socket.on('message', (message:string) => {
            connection.socket.send("Você enviou:"+message)

            
        })
    })

}

/* rota websocket */
/* rota contínua não tem request e response apenas */
/* quando o usuário acessar a enquete ele recebe os resultados
em tempo real apenas dessa enquete, mantendo a conexão */