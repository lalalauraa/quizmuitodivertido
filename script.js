const apiUrl = "https://opentdb.com/api.php?amount=3&type=multiple";


var selecionadoNum, acertos = 0, questaoAtual = 0;
function selecionar(num){
    selecionadoNum = num;
}

async function mostrarQuestoes(perguntas, numQuest){
    respostas = [];
    respostas.push(perguntas.results[numQuest].correct_answer);
    for (var i=0; i < perguntas.results[numQuest].incorrect_answers.length; i++){
        respostas.push(perguntas.results[numQuest].incorrect_answers[i]);
    }
    shuffleArray(respostas);
    var divTudo = document.getElementById('tudo');
    divTudo.innerHTML = `<div class="pergunta">${perguntas.results[numQuest].question}</div>
                        <button class="resposta" id="resposta1" onclick="selecionar(0)">${respostas[0]}</button>
                        <button class="resposta" id="resposta2" onclick="selecionar(1)">${respostas[1]}</button>
                        <button class="resposta" id="resposta3" onclick="selecionar(2)">${respostas[2]}</button>
                        <button class="resposta" id="resposta4" onclick="selecionar(3)">${respostas[3]}</button>
                        <br><br>
                        <button class="sla" id="botao-proximo">Proxima</button>`
    var proximo = document.getElementById('botao-proximo');
    let selecionadoPalavra;
    for(var i=1; i<=4; i++){
        document.getElementById('resposta'+i).addEventListener('click', () =>{
            selecionadoPalavra = respostas[selecionadoNum];
        });
    }
    proximo.addEventListener('click', () =>{
            if(selecionadoPalavra == perguntas.results[questaoAtual].correct_answer){
                acertos++;
            }
            questaoAtual++;
            if(questaoAtual <= 2){
                mostrarQuestoes(perguntas, questaoAtual);
            }
            else{
                document.getElementById('tudo').innerHTML = `Fim do Quiz. Resultado: ${acertos}/3
                                                            <p>Respostas certas:</p>
                                                            <p>1) ${perguntas.results[0].correct_answer}</p>
                                                            <p>2) ${perguntas.results[1].correct_answer}</p>
                                                            <p>3) ${perguntas.results[2].correct_answer}</p>
                                                            <button class="recomecar" id="recomecar">Recomeçar?</button>`
                var recomecarDiv = document.getElementById('recomecar');
                recomecarDiv.style.display ='block';
                recomecarDiv.addEventListener('click', () =>{
                    recomecarDiv.style.display = 'none';
                    acertos = 0;
                    questaoAtual = 0;
                    questoes();
                });
        }
    });
}
function shuffleArray(umaArray){
    for (let i = umaArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [umaArray[i], umaArray[j]] = [umaArray[j], umaArray[i]];
    }
}

function questoes(){
    var perguntas;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na solicitação');
            }
            return response.json();
        })
        .then(data => {
            mostrarQuestoes(data, 0);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    return perguntas;
}

document.getElementById('comecar').addEventListener('click', () => {
    document.getElementById('comecar').style.display = 'none';
    questoes();
});