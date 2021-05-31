// import * as path from "path";
// import fs from "fs";


class Card {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        // this.image = image;
        this.isOpen = false;
    }

    open() {
        this.isOpen = true;
        // как-то отображаем
    }

    close() {
        this.isOpen = false;
        // как-то отображаем
    }
}

const GuessedBackgroundColor = 'red'
const FIELD = [];
const IMAGES = ['black.png', 'blue.png', 'gray.png', 'mint.png', 'orange.png', 'pink.png',
    'purple.png', 'red.png', 'vinous.png', 'white.png', 'yellow.png'];
const DIMENSION = 4;
let SCORE = 0;
let GuessedCards = DIMENSION ** 2;
let lastOpenedCard = null;

renderGrid(DIMENSION);
addResetListener();

function startGame(dimension) {
    for (let i = 0; i < dimension; i++) {
        const row = [];
        for (let j = 0; j < dimension; j++) {
            row.push(new Card(i, j));
            const cardEl = document.getElementsByTagName('tr')[i].getElementsByTagName('td')[j];
            cardEl.textContent = i
            cardEl.addEventListener('click', () => cardClickHandler(cardEl));
        }
        FIELD.push(row)
    }
    console.log(FIELD)
}

// function getFiles (dir, files_){
//     files_ = files_ || [];
//     let files = fs.readdirSync(dir);
//     for (const i in files) {
//         const name = dir + '/' + files[i];
//         if (fs.statSync(name).isDirectory()){
//             getFiles(name, files_);
//         } else {
//             files_.push(name);
//         }
//     }
//     return files_;
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


function renderGrid (dimension) {
    SCORE = 0;
    document.getElementById('score').innerText = `ТВОИ ОЧКИ: ${SCORE}`;
    document.getElementById('description').innerText = `Найди карточки, дающие в сумме ${(DIMENSION + 1) * 11}`
    GuessedCards = dimension ** 2;
    const container = document.getElementById('fieldWrapper');
    container.innerHTML = '';

    // let items = [];
    // for (let i = 0; i < dimension; i++) {
    //     for (let j = 0; j < dimension; j++) {
    //         items.push(`${(i + 1) * 10 + j + 1}`);
    //     }
    // }

    let items = shuffle(IMAGES).slice(0, dimension ** 2 / 2);
    items = shuffle(items.concat(items))
    const res_items = [];
    for (let i = 0; i < dimension ** 2; i += dimension) {
        res_items.push(items.slice(i, i + dimension));
    }

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = res_items[i][j];
            // cell.style.backgroundImage = `url('${'images/' + res_items[i][j]}')`;
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


function cardClickHandler(targetCard) {
    console.log('click!');
    CloseExtraOpenedCards();
    targetCard.style.backgroundImage = `url(${'images/' + targetCard.textContent})`
    // targetCard.style.color = 'black';
    if (lastOpenedCard === null) {
        lastOpenedCard = targetCard;
    }
    else {
        if (targetCard.textContent === lastOpenedCard.textContent) {
        // if (Number(targetCard.textContent) + Number(lastOpenedCard.textContent) === (DIMENSION + 1) * 11) {
            targetCard.style.backgroundColor = GuessedBackgroundColor;
            lastOpenedCard.style.backgroundColor = GuessedBackgroundColor;
            SCORE += DIMENSION;
            GuessedCards -= 2;
            if (GuessedCards === 0) {
                alert(`You win! Score: ${SCORE}`);
            }
        }
        else {
            const secondCard = lastOpenedCard;
            if (SCORE > 0) {
                SCORE -= 1;
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

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    renderGrid(DIMENSION);
}
