const EasyLevelButton = document.getElementById('easyLevel');
const MediumLevelButton = document.getElementById('mediumLevel');
const HardLevelButton = document.getElementById('hardLevel');
const ShowRulesButton = document.getElementById('rulesButton');
const CloseRulesButton = document.getElementById('backFromRules');
const InputNameForm = document.getElementById('inputName');
const defaultBG = 'url("images/back_card.png")'
const IMAGES = ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png',
    '07.png', '08.png', '09.png', '10.png', '11.png', '12.png', '13.png',
    '14.png', '15.png', '16.png', '17.png', '18.png', '19.png', '20.png'];
let STATE;

document.querySelectorAll('.sound_icon').forEach(e => e.addEventListener('click', turnSound));


function createGameState(dimensionRow, dimensionCol) {
    return {
        score: 0,
        field: [],
        cardsToGuess: dimensionRow * dimensionCol,
        closeCardsTimerId: 0,
        lastOpenedCard: null,
        currentTimerId: null,
        scoreToDecrease: 0,
        scoreToAdd: 0,
        soundIsOn: checkSoundState(),
    }
}

function startGame(dimensionRow, dimensionCol) {
    document.getElementsByClassName('levelMenu')[0].hidden = true;
    document.getElementById('gameScreen').style.display = 'block';
    document.querySelector('.winScreen').style.display = 'none';
    STATE = createGameState(dimensionRow, dimensionCol);
    countScore();
    renderGrid(dimensionRow, dimensionCol);
    addResetListener(dimensionRow, dimensionCol);
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

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
    STATE.cardsToGuess = dimensionRow * dimensionCol;
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
        STATE.field.push([]);
        for (let j = 0; j < dimensionCol; j++) {
            const cell = document.createElement('td');
            cell.textContent = `${i} ${j}`;
            STATE.field[i].push(res_items[i][j]);
            cell.addEventListener('click', () => cardClickHandler(cell));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function updateScoreOnScreen() {
    document.getElementById('score').innerText = `ТВОИ ОЧКИ: ${STATE.score}`;
    if (STATE.score > 0) {
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
    if (STATE.currentTimerId !== null) {
        clearInterval(STATE.currentTimerId);
        STATE.currentTimerId = null;
    }
    STATE.scoreToAdd = 100;
    STATE.scoreToDecrease = 0;
    STATE.currentTimerId = setInterval(() => {
        if (STATE.scoreToDecrease < 60)  {
            STATE.scoreToDecrease += 2;
        }
    }, 1000);
}

function showWinScreen() {
    const winScreen = document.querySelector('.winText p');
    winScreen.innerHTML = `Ты нашел все пары и набрал ${STATE.score} ${getNoun(STATE.score)}!`
    document.querySelector('.winScreen').style.display = 'block';
    document.querySelector('#gameScreen').style.display = 'none';
}

function getNoun(score) {
    const lastDigits = score % 100;
    if (lastDigits < 10 || lastDigits > 20) {
        if ([2, 3, 4].indexOf(score % 10) !== -1) {
            return 'очка'
        } else if (score % 10 === 1) {
            return 'очко'
        }
    }
    return 'очков';
}

function closeExtraOpenedCards() {
    if (STATE.closeCardsTimerId) {
        clearTimeout(STATE.closeCardsTimerId);
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
    return STATE.field[i][j];
}

function isPair(card1, card2) {
    const [i1, j1] = card1.textContent.split(' ');
    const [i2, j2] = card2.textContent.split(' ');
    if (STATE.field[i1][j1] && STATE.field[i2][j2] && (i1 !== i2 || j1 !== j2) &&
        STATE.field[i1][j1] === STATE.field[i2][j2]) {
        STATE.field[i1][j1] = null;
        STATE.field[i2][j2] = null;
        return true;
    }
    return false;
}

function playAudio(audioFile) {
    if (!STATE.soundIsOn) {
        return;
    }
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

// function soundClickButton() {
//     playAudio('click1.mp3')
// }

function turnSound() {
    STATE.soundIsOn = !STATE.soundIsOn;
    const state = STATE.soundIsOn ? 'on' : 'off';
    window.localStorage.setItem('sound', state);
    checkSoundState();
}

function checkSoundState() {
    let state = window.localStorage.getItem('sound');
    if (state === null) {
        state = 'on';
    }
    document.querySelectorAll('.sound_icon .on').forEach(e => e.setAttribute('src', `images/sound_${state}_icon.png`));
    document.querySelectorAll('.sound_icon .on_hover').forEach(e => e.setAttribute('src', `images/sound_${state}_icon_hover.png`));
    return state === 'on';
}

function cardClickHandler(targetCard) {
    if (!getImageNameByCard(targetCard) || targetCard === STATE.lastOpenedCard)
        return;
    closeExtraOpenedCards();
    soundClickCard();
    targetCard.style.backgroundImage = `url(${'images/' + getImageNameByCard(targetCard)})`;
    if (STATE.lastOpenedCard === null) {
        STATE.lastOpenedCard = targetCard;
    } else {
        if (isPair(targetCard, STATE.lastOpenedCard)) {
            STATE.score += Math.max(STATE.scoreToAdd - STATE.scoreToDecrease, 0);
            updateScoreOnScreen();
            countScore();
            STATE.cardsToGuess -= 2;
            if (STATE.cardsToGuess === 0) {
                showWinScreen();
            }
        } else {
            const secondCard = STATE.lastOpenedCard;
            if (STATE.score > 5) {
                STATE.score -= 5;
                updateScoreOnScreen();
            }
            STATE.closeCardsTimerId = setTimeout(
                () => {
                    targetCard.style.backgroundImage = defaultBG;
                    secondCard.style.backgroundImage = defaultBG;
                }, 1500);
        }
        STATE.lastOpenedCard = null;
    }
}

function addResetListener (dimensionRow, dimensionCol) {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', () => startGame(dimensionRow, dimensionCol));
}


function addResultToLeaderboard(name, score) {
    localStorage.setItem(name, Math.max(score, Number(localStorage.getItem(name))).toString());
}

if (InputNameForm) {
    InputNameForm.addEventListener('submit', function () {
        console.log(InputNameForm.firstElementChild);
        addResultToLeaderboard(InputNameForm.elements.name.value, STATE.score);
    })
}

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
