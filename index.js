let langFirstData = [];
let langSecondData = [];
let wordLearned = [];
let idWord;
let counterGood = 0;
let counterBad = 0;
let percentageGood = 0;
let timeUpdate = 1500;
let lastTime = 0;
let workTime = 0;
let lastAnswer = true;
let langMode = 0;

let EloadFile = document.getElementById(`file`);
let EreadFile = document.getElementById(`readFile`);
let Etraining = document.getElementById(`training`);
let Econgrat = document.getElementById(`congrat`);
let EerrorReadFile = document.getElementById(`errorReadFile`);
let Ecounters = document.getElementById(`counters`);
let EcounterGood = document.getElementById(`counterGood`);
let EpercentageGood = document.getElementById(`percentageGood`);
let EcounterBad = document.getElementById(`counterBad`);
let EcounterTotal = document.getElementById(`counterTotal`);
let ElastTime = document.getElementById(`lastTime`);
let EworkTime = document.getElementById(`workTime`);

let EorigWord = document.getElementById(`origWord`);
let EinputWord = document.getElementById(`inputWord`);
let EbtCheck = document.getElementById(`btCheck`);
let EbtLearnedWords = document.getElementById(`btLearnedWords`);
let Eanswer = document.getElementById(`answer`);
let EpreAnswer = document.getElementById(`preAnswer`);
let EbtChangeMode = document.getElementById(`btChangeMode`);


let EheadMedal = document.getElementById(`headMedal`);
let EmedalImg = document.getElementById(`medalImg`);
let EheadText = document.getElementById(`headText`);

EbtCheck.addEventListener("click", checkWords);
EbtChangeMode.addEventListener("click", changeLangMode);
EbtLearnedWords.addEventListener("click", writeFile);

//чтение excel файла 
function readFile(input) {
    readXlsxFile(input.files[0]).then(function (data) {
        for (i = 0; i < data.length; i++) {
            langFirstData[i] = (`${data[i]}`).split(`,`)[0];
            langSecondData[i] = (`${data[i]}`).split(`,`)[1];
            wordLearned[i] = (`${data[i]}`).split(`,`)[2];
        }
        checkFile();
    });
};
//проверка правильности чтения/корректности файла
function checkFile() {
    if (langFirstData !== undefined && langFirstData.length > 0 && langSecondData !== undefined && langSecondData.length > 0 && wordLearned !== undefined && wordLearned.length > 0) {
        if(checkLearn() === false){
            searchWord(langFirstData);
            EreadFile.style.display = `none`;
            Etraining.style.display = `flex`;
        }
    } else {
        EerrorReadFile.style.display = `block`;
        EerrorReadFile.innerText = `Выбранный файл имеет неверную структуру, выберите другой файл`;
    }
}
//выбор рандомного слова
function searchWord(array){
    let num;
    lastAnswer === true ? num = randomInteger(0, (array.length - 1)) : num = lastAnswer;
    idWord = num;
    if(array[num] === undefined || array[num] == null || wordLearned[num] === `Learned`){
        if(checkLearn() === false){
            searchWord(langFirstData);
        }
    } else {
        EorigWord.innerText = `${array[num]}`;
        lastTime = 0;
        console.log(langSecondData[idWord]);
    }
}
function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
//проверка соответствия
function checkWords(){
    if (langSecondData[idWord].trim().toUpperCase() === document.getElementById('inputWord').value.trim().toUpperCase()){
        lastAnswer = true;
        EbtCheck.style.background = `darkgreen`;
        counterGood += 1;
        timeUpdate = 500;
        Ecounters.style.display = `block`;
    }else{
        lastAnswer = idWord;
        if (EinputWord.value.trim().toUpperCase() === ``){
            Eanswer.style.color = `red`;
            Eanswer.innerText = `вы ничего не ввели`;
        }else{
            Eanswer.innerText = `${langSecondData[idWord]}`;
           EbtCheck.style.background = `#ff2b2b`;
            counterBad += 1;
            Ecounters.style.display = `block`;
        }
        EpreAnswer.style.display = `block`;
        timeUpdate = 1500;
    }
    updateCounter();
    idWord = undefined;
   EinputWord.value = ``;
    setTimeout(() => {
        searchWord(langFirstData);
       Eanswer.innerText = ``;
       EbtCheck.style.background = `#3F51B5`;
        EpreAnswer.style.display = `none`;
        Eanswer.style.color = `black`;
    }, timeUpdate)
}
//обновление счетчиков при ответе
function updateCounter(){
    percentageGood = 100/((counterBad + counterGood)/counterGood);
    if(counterBad === 0 && counterGood === 0){
        percentageGood = 0;
    }
    EcounterGood.innerText = `${counterGood} `;
    EpercentageGood.innerText = `${percentageGood.toFixed(0)}`;
    EcounterBad.innerText = `${counterBad}`;
    EcounterTotal.innerText = `${counterGood+counterBad}`;
    ElastTime.innerText = `${createTime(lastTime)}`;
    checkMedal();
}
//медаль, зависит от процентов правильных ответов
function checkMedal() {

    if (percentageGood >= 50) {
       EheadMedal.style.display = `inline-block`;
        if (percentageGood >= 50 && percentageGood < 70) {
           EmedalImg.src = `images/medalion.png`;
        } else if (percentageGood >= 70 && percentageGood < 80) {
            EmedalImg.src = `images/bronzeMedal.png`;
        } else if (percentageGood >= 80 && percentageGood < 90) {
            EmedalImg.src = `images/silverMedal.png`;
        } else if (percentageGood >= 90) {
            EmedalImg.src = `images/goldMedal.png`;
        }
        EheadText.style.margin = `1% auto 0 4%`; 
    } else {
        EheadMedal.style.display = `none`;
        EheadText.style.margin = `1% auto 0 1%`; 
    }
}
//проверка все ли слова выучены
function checkLearn(){
    if(checkCountWords(wordLearned, `Learned`) >= wordLearned.length) {
        learnAllWords(checkCountWords(wordLearned, `Learned`));
        return true;
    } else {
        return false;
    }
}
//количество строк с заданной строкой
function checkCountWords(array, str) {
    let num = 0;
    let n = [];
    for(let i=0; i < array.length; i++){
        array[i] === str ? num += 1 : num += 0;
       /* //выведет в консоль номер строки с ошибкой в файле или номера не выученных строк
        if(array[i] !== str){
            n[n.length + 1] = i + 1;
        }
        */
    }
   // console.log(`${n}`)
    return num;
}
//поздравление при усвоении всех слов
function learnAllWords(count){
    EreadFile.style.display = `none`;
    Etraining.style.display = `none`;
    Econgrat.style.display = `block`;
    Econgrat.innerText = `The end. You are learned ${count} words`;
}
//перевод насчитанных секунд в формат "ЧЧ:ММ:СС"
function createTime(time){
    let hours = time / 3600;
    let minutes = (time - (Math.floor(hours) * 3600)) / 60;
    let seconds = time - ((Math.floor(hours)*3600) + (Math.floor(minutes)*60));
    let formTime = ``;

function addZero(data){
    if(data < 10){
        data = `0${Math.floor(data)}`
    }else{
        data = Math.floor(data)
    }
    return data;
}

    formTime = `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`
    return formTime;
}
//подсчет времени, затраченного на ответ
setInterval(() => {
    lastTime += 1;
    workTime += 1;
    EworkTime.innerText = `${createTime(workTime)}`;
}, 1000);
//смена языков местами
function changeLangMode() {
    let langData = [];
    if (langMode === 0) {
        EbtChangeMode.value = `RU -> EN`;
        langMode = 1;
    } else {
        EbtChangeMode.value = `EN -> RU`;
        langMode = 0;
    }
    langData = langFirstData;
    langFirstData = langSecondData;
    langSecondData = langData;
    lastAnswer = true;
    searchWord(langFirstData);
}

function writeFile(){
    writeXlsxFile(input.files[0]).then(function (data) {

    });
}


