//Висота та ширина зображення однієї карти в пікселях
const cardHeight = 243;
const cardWidth = 168;

//Колода
const deck = {
    0: {
        name: 'Shirt',//Сорочка
        value: 0,
        left: -335,
        top: -973
    },
    1: {
        name: '6',
        value: 6,
        left: -837,
        top: 0
    },
    2: {
        name: '7',
        value: 7,
        left: -1005,
        top: 0
    },
    3: {
        name: '8',
        value: 8,
        left: -1173,
        top: 0
    },
    4: {
        name: '9',
        value: 9,
        left: -1340,
        top: 0
    },
    5: {
        name: '10',
        value: 10,
        left: -1507,
        top: 0
    },
    6: {
        name: 'Jack',//Валет
        value: 2,
        left: -1675,
        top: 0
    },
    7: {
        name: 'Queen',//Дама
        value: 3,
        left: -1842,
        top: 0
    },
    8: {
        name: 'King',//Король
        value: 4,
        left: -2010,
        top: 0
    },
    9: {
        name: 'Ace',//Туз
        value: 11,
        left: -2178,
        top: 0
    },
}

//Гравець 1
let player1 = {
    name: 'player1',
    currentCard: deck[0],
    score: 0,
}

//Гравець 2
let player2 = {
    name: 'player2',
    currentCard: deck[0],
    score: 0,
}

let isGeneratorEnabled = true; //флаг - чи доступна кнопка "генерувати"?
let currentStage = 0; //Поточний етап гри

document.addEventListener("DOMContentLoaded", () => {
	player1.name = prompt("Введіть ім'я: ");

    if (player1.name == null || !isValidName(player1.name)) {
        alert("Розмір ім'я повинен бути від 1 до 18 символів!");
        window.location.reload();
    }
    else {
        document.getElementById('player1-name').innerText = player1.name;
    }


    //Обробка події клік на кнопку generate
    document.getElementById("btn-generate").addEventListener("click", () => {
        if (isGeneratorEnabled) {
            updateStage();

            if (currentStage == 1)
                resetScore();

            generateCards();
        }
    });

    //Обробка події "карти сгенеровані"
    document.addEventListener("cardsGenerated", () => {
        updateScore();
        enableGeneratorBtn();

        if (currentStage == 3) {
            if (player1.score == player2.score) {
                document.getElementById("current-status").innerText = "Нічия! Спробуйте ще раз!";
            }
            else {
                let winner = player1.score > player2.score ? player1 : player2;
                document.getElementById("current-status").innerText = "Вітаю, " + winner.name + "! Ви перемогли!";
            }
        }
    });

    //Генерація карти для кожного гравця
    function generateCards() {
        disableGeneratorBtn();
        for (let i = 1; i < 7; i++) {
            setTimeout(() => {
                player1.currentCard = getRandomCard();
                player2.currentCard = getRandomCard();
                document.getElementById('player1-current-card').style.backgroundPosition = getCardBackgroundPosition(player1.currentCard);
                document.getElementById('player2-current-card').style.backgroundPosition = getCardBackgroundPosition(player2.currentCard);
                if (i == 6) {
                    document.dispatchEvent(new Event("cardsGenerated")); //Генарація події - карти згенерованні
                }
            }, 150 * i);
        }
    }

    function updateStage() {

        currentStage++;

        if (currentStage > 3) {
            currentStage = 1;
        }

        switch (currentStage) {
            case 1:
                document.getElementById("current-status").innerText = "Cпроба 1 з 3";
                break;
            case 2:
                document.getElementById("current-status").innerText = "Cпроба 2 з 3";
                break;
            case 3:
                document.getElementById("current-status").innerText = "Cпроба 3 з 3";
                break;
            default:
                document.getElementById("current-status").innerText = "Почніть гру!";
        }
    }

    function updateScore() {

        player1.score += player1.currentCard.value;
        player2.score += player2.currentCard.value;
        document.getElementById("player1-score").innerText = `${player1.score} ${currentStage > 1 ? '(+' + player1.currentCard.value + ')' : ''}`;
        document.getElementById("player2-score").innerText = `${player2.score} ${currentStage > 1 ? '(+' + player2.currentCard.value + ')' : ''}`;
    }

    function resetScore() {

        player1.score = 0;
        player2.score = 0;
        document.getElementById("player1-score").innerText = 0;
        document.getElementById("player2-score").innerText = 0;
    }

    function disableGeneratorBtn() {
        isGeneratorEnabled = false;
        document.getElementById("btn-generate").style.backgroundColor = "gray";
    }

    function enableGeneratorBtn() {
        isGeneratorEnabled = true;
        document.getElementById("btn-generate").style.backgroundColor = "chartreuse";
    }
});

function isValidName(name) {
    const trimmedName = name.trim();
    return trimmedName.length > 0 && trimmedName.length <= 18;
}

function getCardBackgroundPosition(card) {
    return card.left + "px " + card.top + "px"
}

function getCardBackgroundPositionByOffset(left = 0, right = 0) {
    return left + "px " + right + "px"
}

//Функція для генерації рандомниї карти та масті
function getRandomCard() {
    //Генерація рандомного номіналу
    let randomNumber = Math.floor(Math.random() * 10);
    //Генерація карткової масті
    let randomNumberForSuit = Math.floor(Math.random() * 4);
    let suitTopOffset = 0 - (randomNumberForSuit * cardHeight);
    const randomCard = {
        name: deck[randomNumber].name,
        value: deck[randomNumber].value,
        left: deck[randomNumber].left,
        top: suitTopOffset,
    };

    return randomCard;
}