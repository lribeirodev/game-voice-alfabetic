function game() {

    const SYNTH = window.speechSynthesis;
    const rightAnswerSoundEffect = new Audio("right_answer.wav");
    const wrongAnswerSoundEffect = new Audio("wrong_answer.wav");


    let LETRA_INDEX = 0;
    const LETRA = {
        PREFIX: "LETRA ",
    }

    const STATUS = {
        PAUSAR: "PAUSAR",
        INICIAR: "INICIAR",
        AGUARDANDO: "AGUARDANDO",
        JOGANDO: "JOGANDO",
    }

    const STATUS_RESPOSTA = {
        ACERTOU: "VOCÊ ACERTOU",
        ERROU: "VOCÊ ERROU",
    }

    const changeLetter = (index = 0) => {
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let letter = letters[index];
        document.getElementById("letter").innerText = letter;
    }

    const getLetter = () => document.getElementById("letter").textContent;

    const generateText = (text) => {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'pt-BR';
        msg.voiceURI = 'Google português do Brasil';
        return msg;
    }

    const speakText = (textObj) => {
        SYNTH.speak(textObj);
    }

    const playing = (transcript) => {
        let textObj;
            if (transcript === LETRA.PREFIX + getLetter()) {
                textObj = generateText(STATUS_RESPOSTA.ACERTOU);
                document.body.style.backgroundColor = "green";
                LETRA_INDEX++;
                changeLetter(LETRA_INDEX);
                rightAnswerSoundEffect.play();
            } else {
                textObj = generateText(STATUS_RESPOSTA.ERROU);
                document.body.style.backgroundColor = "red";
                wrongAnswerSoundEffect.play();
            }

            speakText(textObj);
    }

    const waiting = (transcript) => {
        let welcome = generateText("OLÁ JOGADOR, VOCÊ ESTA PRONTO PARA SER DESAFIADO");
        speakText(welcome);
        console.log(welcome)
    }

    const startGame = () => {
        let status = STATUS.JOGANDO;
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        if(status === STATUS.AGUARDANDO)
            waiting();

        recognition.addEventListener('result', e => {
            const transcript = e.results[0][0].transcript.toUpperCase();
            console.log(transcript);

            switch(status){
                case STATUS.JOGANDO: playing(transcript); break;
                case STATUS.AGUARDANDO: waiting(transcript); break;
            }

        });

        recognition.addEventListener('end', recognition.start);

        recognition.start();

    }

    changeLetter()
    startGame();

}

game();