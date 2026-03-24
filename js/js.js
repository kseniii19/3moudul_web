// первая кнопка
window.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('mousemove', (e) => {
        const flowers = document.querySelectorAll('.button_flower img[class^="flower"]');
        
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

       
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        flowers.forEach((flower) => {
           
            const tiltIntensity = 0.05; 
            const moveIntensity = 0.02;

            const tiltX = mouseX * tiltIntensity;
            const tiltY = mouseY * tiltIntensity;
            
           
            const moveX = mouseX * moveIntensity;
            const moveY = mouseY * moveIntensity;

            
            flower.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${tiltX}deg)`;
        });
    });
});


// пролистывание первая кнопка
document.addEventListener('DOMContentLoaded', function() {
    // Находим кнопку
    const scrollBtn = document.querySelector('.button_flower');
    // Находим целевую секцию
    const targetSection = document.getElementById('section2');

    if (scrollBtn && targetSection) {
        scrollBtn.addEventListener('click', function() {
            // Запускаем плавную прокрутку
            targetSection.scrollIntoView({ 
                behavior: 'smooth', // Плавная анимация
                block: 'start'      // Прокрутить до начала секции
            });
        });
    }
});


// мемо
window.addEventListener('DOMContentLoaded', function() {

    const memoCards = document.querySelectorAll('.memory_card');
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('flipped')) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.type === secondCard.dataset.type;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;
        if (matchedPairs === 3) {
            setTimeout(() => {
                const memoOverlay = document.getElementById('memo_overlay');
                if (memoOverlay) memoOverlay.style.display = 'flex';
            }, 600);
        }
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    const memoNextBtn = document.getElementById('memo_next_btn');
    if (memoNextBtn) {
        memoNextBtn.addEventListener('click', () => {
            document.getElementById('memo_overlay').style.display = 'none';
        });
    }

    (function shuffle() {
        memoCards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 6);
            card.style.order = randomPos;
        });
    })();

    memoCards.forEach(card => card.addEventListener('click', flipCard));


    // собрать цветок
    let isDragging = false;
    let draggingItem = null;
    let shiftXvw = 0;
    let shiftYvw = 0;
    let isSaveClicked = false; 

    const itemIds = [
        "tsvetok1", "tsvetok2", "tsvetok3", "tsvetok4",
        "listva1", "listva2", "listva3", "listva4",
        "ukrash1", "ukrash2", "ukrash3", "ukrash4"
    ];

    const relations = {
        "tsvetok": "zone1",
        "listva": "zone2",
        "ukrash": "zone3"
    };

    const section = document.querySelector('.section3');
    const zones = document.querySelectorAll('.zone1, .zone2, .zone3');

    function getEventCoords(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    function onStart(e) {
        if (e.type === 'mousedown' && e.button !== 0) return;
        
        // Проверяем, что кликнули по элементу из списка или с нужным ID
        const target = e.target.closest('[id]');
        if (!target || !itemIds.includes(target.id)) return;

        isDragging = true;
        draggingItem = target;
        draggingItem.style.transition = "none";
        
        const coords = getEventCoords(e);
        const rect = draggingItem.getBoundingClientRect();
        const oneVw = window.innerWidth / 100;
        
        shiftXvw = (coords.x - rect.left) / oneVw;
        shiftYvw = (coords.y - rect.top) / oneVw;
        
        draggingItem.style.zIndex = "1000";
        draggingItem.style.cursor = 'grabbing';
        if (e.type === 'touchstart') document.body.style.overflow = 'hidden';
    }

    function onMove(e) {
        if (!isDragging || !draggingItem) return;
        if (e.cancelable) e.preventDefault();
        
        const coords = getEventCoords(e);
        const oneVw = window.innerWidth / 100;
        const sectionRect = section.getBoundingClientRect();
        
        let currentXvw = (coords.x - sectionRect.left) / oneVw - shiftXvw;
        let currentYvw = (coords.y - sectionRect.top) / oneVw - shiftYvw;
        
        draggingItem.style.left = currentXvw + 'vw';
        draggingItem.style.top = currentYvw + 'vw';
    }

    function onEnd() {
        if (!draggingItem) return;
        draggingItem.style.transition = "all 0.3s ease";
        const itemRect = draggingItem.getBoundingClientRect();
        let foundZone = null;

        zones.forEach(zone => {
            const zoneRect = zone.getBoundingClientRect();
            const isOver = !(itemRect.right < zoneRect.left || itemRect.left > zoneRect.right || 
                             itemRect.bottom < zoneRect.top || itemRect.top > zoneRect.bottom);
            if (isOver) foundZone = zone;
        });

        const itemType = draggingItem.id.replace(/[0-9]/g, '');
        const isCorrectZone = foundZone && foundZone.classList.contains(relations[itemType]);

        if (isCorrectZone) {
    draggingItem.classList.add('in-zone');

    // Устанавливаем разные слои:
                if (itemType === 'tsvetok') {
                    draggingItem.style.setProperty('z-index', '9', 'important'); // Самый верхний слой
                } else if (itemType === 'ukrash') {
                    draggingItem.style.setProperty('z-index', '8', 'important'); // Ниже цветка
                } else if (itemType === 'listva') {
                    draggingItem.style.setProperty('z-index', '5', 'important'); // Самый низ
                }
            const oneVw = window.innerWidth / 100;
            const secRect = section.getBoundingClientRect();
            const zRect = foundZone.getBoundingClientRect();
            
            let centerX = (zRect.left - secRect.left + zRect.width/2) / oneVw - (itemRect.width / 2 / oneVw);
            let centerY = (zRect.top - secRect.top + zRect.height/2) / oneVw - (itemRect.height / 2 / oneVw);
            
            draggingItem.style.left = centerX + "vw";
            draggingItem.style.top = centerY + "vw";
            checkGameCompletion();
        } else {
            draggingItem.classList.remove('in-zone');
            draggingItem.style.removeProperty('z-index');
            // Здесь можно добавить возврат на исходную позицию, если нужно
        }

        draggingItem.style.cursor = 'grab';
        document.body.style.overflow = '';
        isDragging = false;
        draggingItem = null;
    }

    const saveButton = document.querySelector('.knopka3');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            isSaveClicked = true; 
            checkGameCompletion(); 
        });
    }

    function checkGameCompletion() {
        const hasFlower = document.querySelector('[id^="tsvetok"].in-zone');
        const hasLeaves = document.querySelector('[id^="listva"].in-zone');
        const hasDecor = document.querySelector('[id^="ukrash"].in-zone');

        if (hasFlower && hasLeaves && hasDecor && isSaveClicked) {
            setTimeout(() => {
                const overlay = document.getElementById('overlay');
                if (overlay) overlay.style.display = 'flex';
            }, 600);
        } else if (isSaveClicked) {
            alert("Сначала собери цветок полностью!");
            isSaveClicked = false;
        }
    }

    const submitBtn = document.getElementById('modal_submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const nameInput = document.getElementById('flower_name');
            const resultName = nameInput ? nameInput.value.trim() : "";
            if (resultName !== "") {
                document.getElementById('overlay').style.display = 'none';
                isSaveClicked = false; 
            } else {
                alert("Пожалуйста, введи имя!");
            }
        });
    }

    itemIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('mousedown', onStart);
            el.addEventListener('touchstart', onStart, { passive: false });
            el.ondragstart = () => false;
        }
    });

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);

});
    




// лабиринт
   let labMatrix = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    [1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0],
    [1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
];

let labSizeX = 16;
let labSizeY = 10;

let labCurrentX = 0;
let labCurrentY = 0;

// Координаты финиша (последняя единица в матрице)
const finishX = 12; 
const finishY = 9; 

// Функция проверки победы
function checkLabWin() {
    if (labCurrentX === finishX && labCurrentY === finishY) {
        // Блокируем дальнейшее перемещение
        document.removeEventListener('keydown', flowerKeyDown);

        // Показываем плашку
        setTimeout(() => {
            const labOverlay = document.getElementById('lab_overlay');
            if (labOverlay) {
                labOverlay.style.display = 'flex';
            }
        }, 300);
    }
}

// Обработчик клавиш
function flowerKeyDown(e) {
    let labItem = document.getElementById('lab-item');
    if (!labItem) return;

    let itemTop = parseFloat(getComputedStyle(labItem).top);
    let itemLeft = parseFloat(getComputedStyle(labItem).left);
    const oneVw = window.innerWidth / 100;
    let kletkaSize = 5.5;

    let moved = false; // Флаг для фиксации движения

    // Стрелка вверх
    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (labCurrentY > 0 && labMatrix[labCurrentY - 1][labCurrentX] == 1) {
            let newY = itemTop / oneVw - kletkaSize;
            labItem.style.top = newY + "vw";
            labCurrentY -= 1;
            moved = true;
        }
    }
    // Стрелка вниз
    else if (e.key == "ArrowDown") {
        e.preventDefault();
        if (labCurrentY < labSizeY - 1 && labMatrix[labCurrentY + 1][labCurrentX] == 1) {
            let newY = itemTop / oneVw + kletkaSize;
            labItem.style.top = newY + "vw";
            labCurrentY += 1;
            moved = true;
        }
    }
    // Стрелка влево
    else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (labCurrentX > 0 && labMatrix[labCurrentY][labCurrentX - 1] == 1) {
            let newX = itemLeft / oneVw - kletkaSize;
            labItem.style.left = newX + "vw";
            labCurrentX -= 1;
            moved = true;
        }
    }
    // Стрелка вправо
    else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (labCurrentX < labSizeX - 1 && labMatrix[labCurrentY][labCurrentX + 1] == 1) {
            let newX = itemLeft / oneVw + kletkaSize;
            labItem.style.left = newX + "vw";
            labCurrentX += 1;
            moved = true;
        }
    }

    // Если был сделан шаг, проверяем, не финиш ли это
    if (moved) {
        checkLabWin();
    }
}

// Инициализация событий
document.addEventListener('DOMContentLoaded', () => {
    // Слушатель клавиатуры
    document.addEventListener('keydown', flowerKeyDown);

    // Логика кнопки "Вперед" на плашке
    const labNextBtn = document.getElementById('lab_next_btn');
    if (labNextBtn) {
        labNextBtn.addEventListener('click', () => {
            const labOverlay = document.getElementById('lab_overlay');
            if (labOverlay) {
                labOverlay.style.display = 'none';
            }
            // Можно добавить плавный скролл к следующей секции
            // window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
});