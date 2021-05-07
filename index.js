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

const FIELD = [];
const DIMENSION = 2;
let SCORE = 0;
let OpenedCards = DIMENSION ** 2;
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


function renderGrid (dimension) {
    OpenedCards = dimension ** 2;
    SCORE = 0;
    const container = document.getElementById('fieldWrapper');
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = `${(i + 1) * 10 + j + 1}`;
            cell.addEventListener('click', () => cardClickHandler(cell));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}


function cardClickHandler(targetCard) {
    console.log('click!');
    targetCard.style.color = 'black';
    if (lastOpenedCard === null) {
        lastOpenedCard = targetCard;
    }
    else {
        if (Number(targetCard.textContent) + Number(lastOpenedCard.textContent) === (DIMENSION + 1) * 11) {
            targetCard.style.backgroundColor = 'red';
            lastOpenedCard.style.backgroundColor = 'red';
            SCORE += DIMENSION;
            OpenedCards -= 2;
            if (OpenedCards === 0) {
                alert(`You win! Score: ${SCORE}`)
            }
        }
        else {
            const secondCard = lastOpenedCard;
            SCORE -= 1;
            setTimeout(
                () => {
                    targetCard.style.color = 'transparent';
                    secondCard.style.color = 'transparent';
                    // TODO: заблокировать клики, пока не закроются карты ИЛИ закрывать карты сразу по клику
                }, 1500);
        }
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
