import { FastifyInstance } from "fastify";
import { voting } from "../../utils/voting-pub-sub";
import z from "zod";

export async function pollResults(app: FastifyInstance){
    app.get('/polls/:pollId/results', {websocket:true}, (connection,request)=>{
        const getPollParams = z.object({
            pollId: z.string().uuid(),
        })
    
        const {pollId} = getPollParams.parse(request.params)
        
        voting.subscribe(pollId,(message) => {
            connection.socket.send(JSON.stringify(message))
        })
    })

}

/* rota websocket */
/* rota contínua não tem request e response apenas */
/* quando o usuário acessar a enquete ele recebe os resultados
em tempo real apenas dessa enquete, mantendo a conexão */
//pattern - Pub/Sub - evento causa efeito colateral em algum elemento
// quando o evento é dividido em partes.
//para receber dados apenas da enquete selecionada