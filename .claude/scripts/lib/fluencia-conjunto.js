'use strict';
// A fluência pelo conjunto (22/10), nas aulas dos módulos marcados no mapa (`"fluencia": "conjunto"`, o M4 ao M6) e nas
// aulas marcadas (`"fluencia_regra": "conjunto"`, a 1.2, a 1.3 e a 1.4, onde parte por parte reprovava demais). A
// `tutor` e a régua mandam "passou é toda parte cumprida", e nessas aulas, em que a tarefa é texto e decisão do aluno
// sobre a ideia dele ou um caso, isso reprovava uma resposta inteira por dois itens de dez. O tutor ouve a regra pelo
// resumo (lib/resumo.js) e o avaliador pelo contexto (lib/contexto.js), com o mesmo texto: a régua manda o avaliador
// julgar pela mesma regra do tutor, e dois textos viravam divergência na ficha.
const NUCLEO = 'Nesta aula a fluência se julga pelo conjunto, e não parte por parte: isto substitui aqui o "passou é toda parte cumprida", e "faltando" passa a ter o sentido abaixo. Passa quando o que a aula ensina está de pé no que ele entregou. Não reprovam: uma minoria de itens fracos ou errados numa lista (perguntas, reescritas, números, critérios, passos), um deslize de conta com o método certo, uma parte que ele fez, mas fraca. Não passa quando: a confusão que a aula existe para desfazer aparece como decisão dele, e não como deslize num item (na 5.2, o LTV pela receita; na 4.6, a conta de cima para baixo); metade ou mais dos itens de uma parte cometem o erro que a aula ensina a evitar; ou uma parte que a condição pede não foi feita, nem depois de cobrada. Evidência e resultado que a condição pede são sim ou não: o que ele cola da oficina existe, o teste ficou vermelho antes do código e o verde é o mesmo teste, o ataque repetido não libera nada, o link abre, a sessão nova acertou. O que o plano da aula diz que não passa ou não se afrouxa vale como está: os dez nomes da 4.4, gente que ele alcança e que vive a dor, e a primeira entrevista com dia; a neblina aceita como sim, que na 5.5 não passa. Onde o material tem resposta certa (o disparo de março na 4.3, uma conta que tem de bater), errar é um item, contado como acima. Julgue se ele aplicou o que a aula ensinou, não se chegou à escolha que você faria; na dúvida, passou. Aqui, "faltando" é o que reprova por esta regra; o que ficou fraco e não reprova não é faltando.';

const PARA = {
  tutor: 'Antes de registrar, conte em cada parte quantos itens estão de pé: a cobrança que ele respondeu não conserta o que segue errado. Passou com algo fraco: diga que passou e aponte o que ficou fraco, com o porquê, como o próximo passo, sem pedir que refaça; no motivo, a parte leva "fraco, não reprova".',
  avaliador: 'O tutor ter apontado algo como fraco ou faltando não decide (é neste sentido que vale aqui o "não aprove uma parte que o tutor apontou como faltando"): aplique esta regra ao que o aluno entregou. Fluência que não aconteceu continua null. Na `evidencia` da fluência, diga cada parte e o que ficou fraco como tal. Este bloco é só para o campo `fluencia`, e não para nota nenhuma: `compreensao`, `dominio` e as outras saem da régua exatamente como sairiam sem ele.',
};

function regra(leitor) {
  return `${NUCLEO} ${PARA[leitor]}`;
}

// A linha que o tutor recebe: no resumo, e na saída do `milestone` quando a aula foi emendada num chat que abriu em
// outra unidade, cujo resumo não a trazia.
const linhaTutor = () => `Fluência pelo conjunto: ${regra('tutor')}`;

module.exports = { regra, linhaTutor };
