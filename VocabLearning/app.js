const format = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const input = document.getElementById('wordInput');
const getter = document.getElementById('button');
const result = document.getElementById('result');

async function getWordJsonInfo() {
    const word = input.value;
    const result = await fetch(`${format}${word}`);
    return await result.json();
}

let words = [];
async function printResult() {
    const audio = new Audio('https://api.dictionaryapi.dev/media/pronunciations/en/get-us.mp3');
    audio.play();

    result.innerHTML = '';
    const result1 = await getWordJsonInfo();
    for (let word of result1) {
        words.push({
            "word": word['word'],
            "partOfSpeech": word['meanings'][0]['partOfSpeech']
        })
    }

    for (let word of words) {
        const newNode = document.createElement('p');
        newNode.textContent = `${word['word']} (${word['partOfSpeech']})`;

        result.appendChild(newNode);
    }
    // document.getElementById('json').textContent = JSON.stringify(result, undefined, 2);

    words = [];
}

button.addEventListener('click', printResult);