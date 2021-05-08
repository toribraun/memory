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
let lastOpenedCard = null;
let twoOpened = false;

startGame(DIMENSION);


function startGame(dimension) {
    for (let i = 0; i < dimension; i++) {
        const row = [];
        const newTr = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cardEl = document.createElement('td');
            row.push(new Card(i, j));
            cardEl.textContent = i;
            cardEl.played = false;
            cardEl.addEventListener('click', () => cardClickHandler(cardEl));
            newTr.append(cardEl);
        }
        document.querySelector('#fieldWrapper').append(newTr);
        FIELD.push(row)
    }
    console.log(FIELD)
}


function cardClickHandler(targetCard) {
    if (twoOpened === true || targetCard.played) {
        return;
    }
    console.log('click!');
    targetCard.style.color = 'black';
    if (lastOpenedCard === null) {
        lastOpenedCard = targetCard;
    } else {
        if (targetCard === lastOpenedCard) {
            return;
        }
        if (targetCard.textContent === lastOpenedCard.textContent) {
            targetCard.played = true;
            lastOpenedCard.played = true;
            targetCard.style.backgroundColor = 'red';
            lastOpenedCard.style.backgroundColor = 'red';
        } else {
            const secondCard = lastOpenedCard;
            twoOpened = true;
            console.log('Both cards are opened');
            let timerId = setTimeout(hideCards, 1500, targetCard, secondCard);
            // if (twoOpened) {
            //     targetCard.addEventListener('click', hideCardsAndClearTimeout(timerId, targetCard, secondCard));
            // }
            // else {
            //     targetCard.removeEventListener('click', hideCardsAndClearTimeout(timerId, targetCard, secondCard));
            // }
        }
        lastOpenedCard = null;
    }
}

function hideCards(targetCard, secondCard) {
    targetCard.style.color = 'transparent';
    secondCard.style.color = 'transparent';
    console.log('Closed');
    twoOpened = false;
}

function hideCardsAndClearTimeout(timerId, targetCard, secondCard) {
    hideCards(targetCard, secondCard);
    clearTimeout(timerId);
}