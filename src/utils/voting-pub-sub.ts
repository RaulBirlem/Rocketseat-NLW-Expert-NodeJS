/* cada enquete tem seu canal */
/* cada enquete mostra sua pontuação em ponto real */





/* Sempre que uma mensagem for publicada dentro
de um canal ela recebe a opção e o total de votos 
naquele momento */

type Message= {pollOptionId: string, votes:number}
/* subscriber: pessoa acessando o canal(a enquete) */
type Subscriber = (message:Message) => void


class VotingPubSub {
    private channels: Record<string, Subscriber[]> = {}

    subscribe(pollId: string, subscriber: Subscriber) {
        if(!this.channels[pollId]){
            /* se ninguem assinou os resultados*/

            this.channels[pollId] = []
            /* o array fica vazio */
        }
        this.channels[pollId].push(subscriber)
    }

    publish(pollId: string, message: Message){
        if(!this.channels[pollId]){
            return;
        }
        
        for(const subscriber of this.channels[pollId]){
/* percorre por todos os subscriber que estiver no canal */
/* e envia a mensagem com a opção e os resultados */
            subscriber(message)
        }
    }
}

export const voting = new VotingPubSub()