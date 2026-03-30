// первая кнопка
window.addEventListener('DOMContentLoaded', function() {

    // ---------------------- Вращающиеся цветки ----------------------
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
                       
            const moveX = mouseX * moveIntensity;
            const moveY = mouseY * moveIntensity;
         
            flower.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${tiltX}deg)`;
        });
    });



    // ---------------------- Пролистывание (первая кнопка) ----------------------
    
    const scrollBtn = document.querySelector('.button_flower');
    const targetSection = document.getElementById('section2');

    if (scrollBtn && targetSection) {
        scrollBtn.addEventListener('click', function() {
            targetSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'     
            });
        });
    }




    // ---------------------- Мемо ----------------------
    
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;

    // Обработка открытия карточки
    function flipCard() {
        if (lockBoard) 
            return;

        if (this === firstCard) 
            return;

        if (this.classList.contains('flipped')) 
            return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;

        if (firstCard.dataset.type === secondCard.dataset.type) {
            disableCards()  
        } else {
            unflipCards();
        } 
    }

    // Заморозка карточек (если открыты две одинкаовые)
    function disableCards() {

        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        matchedPairs = matchedPairs + 1;
        
        if (matchedPairs === 3) {
            setTimeout(() => {
                const memoOverlay = document.getElementById('memo_overlay');
                if (memoOverlay) 
                    memoOverlay.style.display = 'flex';
            }, 300);
        }
        resetBoard();
    }

    // Переворачиваем карточки обратно, если они оказались разными
    function unflipCards() {
        
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    
    }

    // Сброс после того, как какрточки оказались разными
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Плашка memo и кнока на ней
    const memoNextBtn = document.getElementById('memo_next_btn');
    if (memoNextBtn) {
        memoNextBtn.addEventListener('click', () => {
            document.getElementById('memo_overlay').style.display = 'none';
        });
    }

    // Подгрузка всех карточек
    const memoCards = document.querySelectorAll('.memory_card');
    memoCards.forEach(card => card.addEventListener('click', flipCard));

    // Перемешивание карточек
    memoCards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 6);
        card.style.order = randomPos;
    }); 


    // ---------------------- собрать цветок ----------------------
    
    let isDragging = false;
    let draggingItem = null;
    
    let shiftXvw = 0;
    let shiftYvw = 0;
    
    let isSaveClicked = false; 

    // Все перемещаемые объекты
    const itemIds = [
        "tsvetok1", "tsvetok2", "tsvetok3", "tsvetok4",
        "listva1", "listva2", "listva3", "listva4",
        "ukrash1", "ukrash2", "ukrash3", "ukrash4"
    ];

    // Соответствие перемещаемых объектов и целвых зон
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

    // Начало движения драг н дропом
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

    // В процессе перетягивания 
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

    // Отпускание драг н дропа
    function onEnd() {
        if (!draggingItem) 
            return;
        
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
        }

        draggingItem.style.cursor = 'grab';
        document.body.style.overflow = '';
        isDragging = false;
        draggingItem = null;
    }

    // Обработка кнопки "Сохранить выбор"
    const saveButton = document.querySelector('.knopka3');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            isSaveClicked = true; 
            checkGameCompletion(); 
        });
    }

    // Проверяем, что в каждую из зон поместили по объекту 
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

    // Плашка Введите имя
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

    // Добавляем события всем перемещаемым объектам
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


    // ---------------------- ЛАБИРИНТ -----------------------------

    // Карта лабиринта
    const labMatrix = [
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

    // Маршрут лабиринта
    const labPath = [
        [0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[3,3],[2,3],[1,3],[1,4],[1,5],[1,6],
        [2,6],[3,6],[4,6],[5,6],[6,6],[6,5],[6,4],[6,3],[6,2],[6,1],[7,1],[8,1],[8,2],[8,3],
        [8,4],[8,5],[8,6],[8,7],[8,8],[7,8],[6,8],[5,8],[5,9],[5,10],[5,11],[4,11],[3,11],
        [3,10],[3,9],[2,9],[1,9],[0,9],[0,10],[0,11],[0,12],[0,13],[1,13],[2,13],[3,13],
        [4,13],[4,14],[5,14],[5,15],[6,15],[7,15],[7,14],[7,13],[7,12],[8,12],[9,12]
    ];

    let labCurrentX = 0, labCurrentY = 0, currentStep = 0;
    const startLeftVw = 15.5, startTopVw = 12, kSize = 5.5;

    // Отображение в текущей клетке
    function updateLabUI() {
        const item = document.getElementById('lab-item');
        item.style.left = (startLeftVw + (labCurrentX * kSize)) + "vw";
        item.style.top = (startTopVw + (labCurrentY * kSize)) + "vw";
        if (labCurrentX === 12 && labCurrentY === 9) {
            setTimeout(() => document.getElementById('lab_overlay').style.display = 'flex', 300);
        }
    }

    // Управление клавиатурой
    document.addEventListener('keydown', (e) => {
        let nX = labCurrentX;
        let nY = labCurrentY;

        if (e.key === "ArrowUp")
            nY = nY - 1;
        else if (e.key === "ArrowDown") 
            nY = nY + 1;
        else if (e.key === "ArrowLeft") 
            nX = nX - 1;
        else if (e.key === "ArrowRight") 
            nX = nX + 1;
        else 
            return;

        if (nY >= 0 && nY < 10 && nX >= 0 && nX < 16 && labMatrix[nY][nX] === 1) {            
            labCurrentX = nX; labCurrentY = nY;
            updateLabUI();
        }

        e.preventDefault();
    });

    // Управление тапами
    document.querySelector('.section5').addEventListener('touchstart', (e) => {
        if (e.target.id === 'lab_next_btn') 
            return;

        e.preventDefault();

        if (currentStep < labPath.length - 1) {
            currentStep++;
            labCurrentY = labPath[currentStep][0];
            labCurrentX = labPath[currentStep][1];
            updateLabUI();
        }
    });

    // Обработка кнопки в popup
    const labNextBtn = document.getElementById('lab_next_btn');
    if (labNextBtn) {
        labNextBtn.addEventListener('click', () => {
            document.getElementById('lab_overlay').style.display = 'none';
        });
    }

});