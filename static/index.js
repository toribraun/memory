// import * as path from "path";
// import fs from 'fs';


const EasyLevelButton = document.getElementById('easyLevel');
const MediumLevelButton = document.getElementById('mediumLevel');
const HardLevelButton = document.getElementById('hardLevel');

if (EasyLevelButton) {
    EasyLevelButton.addEventListener('click', function () {
        document.getElementsByClassName('levelMenu')[0].hidden = true;
        document.getElementById('gameScreen').style.display = 'block';
        startGame(4, 5);
    })
}

if (MediumLevelButton) {
    MediumLevelButton.addEventListener('click', function () {
        document.getElementsByClassName('levelMenu')[0].hidden = true;
        document.getElementById('gameScreen').style.display = 'block';
        startGame(5, 6);
    })
}

if (HardLevelButton) {
    HardLevelButton.addEventListener('click', function () {
        document.getElementsByClassName('levelMenu')[0].hidden = true;
        document.getElementById('gameScreen').style.display = 'block';
        startGame(6, 6);
    })
}

const GuessedBackgroundColor = 'red'
const IMAGES = ['black.png', 'blue.png', 'gray.png', 'mint.png', 'orange.png', 'pink.png',
    'purple.png', 'red.png', 'vinous.png', 'white.png', 'yellow.png'];
let SCORE = 0;
const FIELD = [];
let GuessedCards;
let lastOpenedCard = null;


function startGame(dimensionRow, dimensionCol) {
    FIELD.length = 0;
    SCORE = 0;
    GuessedCards = dimensionRow * dimensionCol;
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
//
// console.log(path.join(process.cwd(), "/images"));
// console.log(getFiles(path.join(process.cwd(), "/images")));

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
    document.getElementById('score').innerText = `ТВОИ ОЧКИ: ${SCORE}`;
    GuessedCards = dimensionRow * dimensionCol;
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
            console.log(res_items[i][j]);
            cell.addEventListener('click', () => cardClickHandler(cell));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}


function CloseExtraOpenedCards() {
    let allCards = Object.values(document.getElementsByTagName('td'));
    let openedCards = allCards.filter(function(card) {
        return card.style.backgroundColor !== GuessedBackgroundColor && card.style.backgroundImage !== 'none'});
    if (openedCards.length > 1) {
        openedCards.forEach(function(card) {return card.style.backgroundImage = 'none'});
    }
}

function getImageNameByCard(card) {
    const [i, j] = card.textContent.split(' ');
    return FIELD[i][j]
}

function isPair(card1, card2) {
    const [i1, j1] = card1.textContent.split(' ');
    const [i2, j2] = card2.textContent.split(' ');
    console.log([i1, j1], [i2, j2])
    return (i1 !== i2 || j1 !== j2) && FIELD[i1][j1] === FIELD[i2][j2];
}


function cardClickHandler(targetCard) {
    console.log('click!');
    CloseExtraOpenedCards();
    targetCard.style.backgroundImage = `url(${'images/' + getImageNameByCard(targetCard)})`
    if (lastOpenedCard === null) {
        lastOpenedCard = targetCard;
    }
    else {
        if (isPair(targetCard, lastOpenedCard)) {
            targetCard.style.backgroundColor = GuessedBackgroundColor;
            lastOpenedCard.style.backgroundColor = GuessedBackgroundColor;
            SCORE += 40;
            GuessedCards -= 2;
            if (GuessedCards === 0) {
                alert(`You win! Score: ${SCORE}`);
            }
        }
        else {
            const secondCard = lastOpenedCard;
            if (SCORE > 0) {
                SCORE -= 10;
            }
            setTimeout(
                () => {
                    targetCard.style.backgroundImage = 'none';
                    secondCard.style.backgroundImage = 'none';
                }, 1500);
        }
        document.getElementById('score').innerText = `ТВОИ ОЧКИ: ${SCORE}`;
        lastOpenedCard = null;
    }
}

function addResetListener (dimensionRow, dimensionCol) {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', () => startGame(dimensionRow, dimensionCol));
}
