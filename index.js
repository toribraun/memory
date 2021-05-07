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


function renderGrid (dimension) {
    SCORE = 0;
    document.getElementById('score').innerText = `ТВОИ ОЧКИ: ${SCORE}`;
    document.getElementById('description').innerText = `Найди карточки, дающие в сумме ${(DIMENSION + 1) * 11}`
    GuessedCards = dimension ** 2;
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


function CloseExtraOpenedCards() {
    let allCards = Object.values(document.getElementsByTagName('td'));
    let openedCards = allCards.filter(function(card) {return card.style.backgroundColor !== GuessedBackgroundColor && card.style.color !== 'transparent'});
    if (openedCards.length > 1) {
        openedCards.forEach(function(card) {return card.style.color = 'transparent'});
    }
}


function cardClickHandler(targetCard) {
    console.log('click!');
    CloseExtraOpenedCards();
    targetCard.style.color = 'black';
    if (lastOpenedCard === null) {
        lastOpenedCard = targetCard;
    }
    else {
        if (Number(targetCard.textContent) + Number(lastOpenedCard.textContent) === (DIMENSION + 1) * 11) {
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
                    targetCard.style.color = 'transparent';
                    secondCard.style.color = 'transparent';
                    // TODO: заблокировать клики, пока не закроются карты ИЛИ закрывать карты сразу по клику
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
