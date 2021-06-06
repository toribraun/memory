// import * as path from "path";
// import fs from "fs";

const EasyLevelButton = document.getElementById('easyLevel');
const MediumLevelButton = document.getElementById('mediumLevel');
const HardLevelButton = document.getElementById('hardLevel');
const ShowRulesButton = document.getElementById('rulesButton');
const CloseRulesButton = document.getElementById('backFromRules');


if (ShowRulesButton) {
    ShowRulesButton.addEventListener('click', function () {
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('rulesScreen').style.display = 'block';
    })
}

if (CloseRulesButton) {
    CloseRulesButton.addEventListener('click', function () {
        document.getElementById('rulesScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
    })
}

if (EasyLevelButton) {
    EasyLevelButton.addEventListener('click', function () {
        startGame(4, 5);
    })
}

if (MediumLevelButton) {
    MediumLevelButton.addEventListener('click', function () {
        startGame(5, 6);
    })
}

if (HardLevelButton) {
    HardLevelButton.addEventListener('click', function () {
        startGame(5, 8);
    })
}

const defaultBG = 'url("images/back_card.png")'
const IMAGES = ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png',
    '07.png', '08.png', '09.png', '10.png', '11.png', '12.png', '13.png',
    '14.png', '15.png', '16.png', '17.png', '18.png', '19.png'];
let SCORE = 0;
const FIELD = [];
let CardsToGuess;
let CloseCardsTimerId;
let lastOpenedCard = null;
let currentTimerId;
let scoreToDecrease = 0;
let scoreToAdd = 0;


function startGame(dimensionRow, dimensionCol) {
    document.getElementsByClassName('levelMenu')[0].hidden = true;
    document.getElementById('gameScreen').style.display = 'block';
    FIELD.length = 0;
    SCORE = 0;
    currentTimerId = null;
    CardsToGuess = dimensionRow * dimensionCol;
    countScore();
    renderGrid(dimensionRow, dimensionCol);
    addResetListener(dimensionRow, dimensionCol);
}

// function getImages() {
//     let res = [];
//     console.log(path.join(process.cwd(), "/static/images"));
//     let files = fs.readdirSync(path.join(process.cwd(), "/static/images"));
//     for (const i in files) {
//         res.push(files[i]);
//     }
//     return res;
// }


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}


function renderGrid (dimensionRow, dimensionCol) {
    updateScoreOnScreen();
    CardsToGuess = dimensionRow * dimensionCol;
    const container = document.getElementById('fieldWrapper');
    container.innerHTML = '';
    let items = shuffle(IMAGES).slice(0, dimensionRow * dimensionCol / 2);
    items = shuffle(items.concat(items))
    const res_items = [];
    for (let i = 0; i < dimensionRow * dimensionCol; i += dimensionCol) {
        res_items.push(items.slice(i, i + dimensionCol));
    }

    for (let i = 0; i < dimensionRow; i++) {
        const row = document.createElement('tr');
        FIELD.push([]);
        for (let j = 0; j < dimensionCol; j++) {
            const cell = document.createElement('td');
            cell.textContent = `${i} ${j}`;
            FIELD[i].push(res_items[i][j]);
            cell.addEventListener('click', () => cardClickHandler(cell));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function updateScoreOnScreen() {
    document.getElementById('score').innerText = `ТВОИ ОЧКИ: ${SCORE}`;
    if (SCORE > 0) {
        const labelScore = document.getElementById('labelScore');
        labelScore.style.transitionDuration = `1s`;
        labelScore.style.transform = 'scale(1.3)';
        setTimeout(
            () => {
                labelScore.style.transform = 'scale(1)';
            }, 500);
    }
}

function countScore() {
    if (currentTimerId !== null) {
        clearInterval(currentTimerId);
        currentTimerId = null;
    }
    scoreToAdd = 100;
    scoreToDecrease = 0;
    currentTimerId = setInterval(() => {
        if (scoreToDecrease < 60)  {
            scoreToDecrease += 2;
        }
    }, 1000);
}


function closeExtraOpenedCards() {
    if (CloseCardsTimerId) {
        clearTimeout(CloseCardsTimerId);
    }
    let allCards = Object.values(document.getElementsByTagName('td'));
    let openedCards = allCards.filter(function(card) {
        return getImageNameByCard(card) && card.style.backgroundImage !== defaultBG});
    if (openedCards.length > 1) {
        openedCards.forEach(function(card) {return card.style.backgroundImage = defaultBG});
    }
}

function getImageNameByCard(card) {
    const [i, j] = card.textContent.split(' ');
    return FIELD[i][j]
}

function isPair(card1, card2) {
    const [i1, j1] = card1.textContent.split(' ');
    const [i2, j2] = card2.textContent.split(' ');
    if (FIELD[i1][j1] && FIELD[i2][j2] && (i1 !== i2 || j1 !== j2) && FIELD[i1][j1] === FIELD[i2][j2]) {
        FIELD[i1][j1] = null;
        FIELD[i2][j2] = null;
        return true
    }
    return false;
}

function playAudio(audioFile) {
    const audio = new Audio();
    audio.src = audioFile;
    audio.autoplay = true;
    setTimeout(
        () => {
            audio.autoplay = false;
        }, 1000);
}

function soundClickCard() {
    playAudio('sound2.mp3')
}

function soundClickButton() {
    playAudio('click1.mp3')
}


function cardClickHandler(targetCard) {
    if (!getImageNameByCard(targetCard) || targetCard === lastOpenedCard)
        return;
    closeExtraOpenedCards();
    soundClickCard();
    targetCard.style.backgroundImage = `url(${'images/' + getImageNameByCard(targetCard)})`;
    if (lastOpenedCard === null) {
        lastOpenedCard = targetCard;
    } else {
        if (isPair(targetCard, lastOpenedCard)) {
            SCORE += Math.max(scoreToAdd - scoreToDecrease, 0);
            updateScoreOnScreen();
            countScore();
            CardsToGuess -= 2;
            if (CardsToGuess === 0) {
                setTimeout(alert, 0, `You win! Score: ${SCORE}`);
            }
        } else {
            const secondCard = lastOpenedCard;
            if (SCORE > 5) {
                SCORE -= 5;
                updateScoreOnScreen();
            }
            CloseCardsTimerId = setTimeout(
                () => {
                    targetCard.style.backgroundImage = defaultBG;
                    secondCard.style.backgroundImage = defaultBG;
                }, 1500);
        }
        lastOpenedCard = null;
    }
}

function addResetListener (dimensionRow, dimensionCol) {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', () => startGame(dimensionRow, dimensionCol));
}


function addResultToLeaderboard(name) {
    localStorage.setItem(name, Math.max(SCORE, Number(localStorage.getItem(name))).toString());
}

