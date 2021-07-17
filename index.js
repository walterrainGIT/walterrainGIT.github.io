let langFirstData = [];
let langSecondData = [];
let idWord;
let counterGood = 0;
let counterBad = 0;
let percentageGood = 0;
let timeUpdate = 1500;
let lastTime = 0;
let workTime = 0;
let lastAnswer = true;
let langMode = 0;


//чтение excel файла 
function readFile(input) {
    readXlsxFile(input.files[0]).then(function (data) {
        for (i = 0; i < data.length; i++) {
            langFirstData[i] = (`${data[i]}`).split(`,`)[0];
            langSecondData[i] = (`${data[i]}`).split(`,`)[1];
        }
        checkFile();
    });
};
//проверка правильности чтения/корректности файла
function checkFile() {
    if (langFirstData !== undefined && langFirstData.length > 0 && langSecondData !== undefined && langSecondData.length > 0) {
        searchWord(langFirstData);
        document.getElementById('readFile').style.display = `none`;
        document.getElementById('training').style.display = `flex`;
    } else {
        document.getElementById('errorReadFile').style.display = `block`;
        document.getElementById('errorReadFile').innerText = `Выбранный файл имеет неверную структуру, выберите другой файл`;
    }
}
//выбор рандомного слова
function searchWord(array){
    let num;
    lastAnswer === true ? num = randomInteger(0, (array.length - 1)) : num = lastAnswer;
    idWord = num;
    if(array[num] === undefined || array[num] == null){
        searchWord();
    } else {
        document.getElementById('origWord').innerText = `${array[num]}`;
        lastTime = 0;
        console.log(langSecondData[idWord])
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
        document.getElementById('btCheck').style.background = `darkgreen`;
        counterGood += 1;
        timeUpdate = 500;
        document.getElementById('counters').style.display = `block`;
    }else{
        lastAnswer = idWord;
        if(document.getElementById('inputWord').value.trim().toUpperCase() === ``){
            document.getElementById('answer').style.color = `red`;
            document.getElementById('answer').innerText = `вы ничего не ввели`;
        }else{
            document.getElementById('answer').innerText = `${langSecondData[idWord]}`;
            document.getElementById('btCheck').style.background = `#ff2b2b`;
            counterBad += 1;
            document.getElementById('counters').style.display = `block`;
        }
        document.getElementById('preAnswer').style.display = `block`;
        timeUpdate = 1500;
    }
    updateCounter();
    idWord = undefined;
    document.getElementById('inputWord').value = ``;
    setTimeout(() => {
        searchWord(langFirstData);
        document.getElementById('answer').innerText = ``;
        document.getElementById('btCheck').style.background = `#3F51B5`;
        document.getElementById('preAnswer').style.display = `none`;
        document.getElementById('answer').style.color = `black`;
    }, timeUpdate)
}
//обновление счетчиков при ответе
function updateCounter(){
    percentageGood = 100/((counterBad + counterGood)/counterGood);
    if(counterBad === 0 && counterGood === 0){
        percentageGood = 0;
    }
    document.getElementById('counterGood').innerText = `${counterGood} `;
    document.getElementById('percentageGood').innerText = `${percentageGood.toFixed(0)}`;
    document.getElementById('counterBad').innerText = `${counterBad}`;
    document.getElementById('counterTotal').innerText = `${counterGood+counterBad}`;
    document.getElementById('lastTime').innerText = `${createTime(lastTime)}`;
    checkMedal();
}

function checkMedal() {

    if (percentageGood >= 50) {
        document.getElementById('headMedal').style.display = `inline-block`;
        if (percentageGood >= 50 && percentageGood < 70) {
            document.getElementById(`medalImg`).src = `images/medalion.png`;
        } else if (percentageGood >= 70 && percentageGood < 80) {
            document.getElementById(`medalImg`).src = `images/bronzeMedal.png`;
        } else if (percentageGood >= 80 && percentageGood < 90) {
            document.getElementById(`medalImg`).src = `images/silverMedal.png`;
        } else if (percentageGood >= 90) {
            document.getElementById(`medalImg`).src = `images/goldMedal.png`;
        }
        document.getElementById('headLogo').style.marginLeft = `88%`;
        document.getElementById('headText').style.margin = `1% auto 0 5%`;
    } else {
        document.getElementById('headMedal').style.display = `none`;
        document.getElementById('headLogo').style.marginLeft = `79%`;
        document.getElementById('headText').style.margin = `1% auto 0 1%`;
    }
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
    document.getElementById('workTime').innerText = `${createTime(workTime)}`;
}, 1000);
//смена языков местами
function changeLangMode() {
    let langData = [];
    if (langMode === 0) {
        document.getElementById(`btChangeMode`).value = `RU -> EN`;
        langMode = 1;
    } else {
        document.getElementById(`btChangeMode`).value = `EN -> RU`;
        langMode = 0;
    }
    langData = langFirstData;
    langFirstData = langSecondData;
    langSecondData = langData;
    lastAnswer = true;
    searchWord(langFirstData);
}


