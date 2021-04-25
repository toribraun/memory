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

startGame(DIMENSION);


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


function cardClickHandler(targetCard) {
    console.log('click!');
    targetCard.style.color = 'black';
    if (lastOpenedCard === null) {
        lastOpenedCard = targetCard;
    }
    else {
        if (targetCard.textContent === lastOpenedCard.textContent) {
            targetCard.style.backgroundColor = 'red';
            lastOpenedCard.style.backgroundColor = 'red';
        }
        else {
            const secondCard = lastOpenedCard;
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
