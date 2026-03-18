window.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('mousemove', (e) => {
        const flowers = document.querySelectorAll('.button_flower img[class^="flower"]');
        
        // Координаты центра экрана (или центра вашей кнопки)
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Положение мыши относительно центра
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        flowers.forEach((flower) => {
            // Коэффициент силы наклона (чем меньше число, тем слабее движение)
            const tiltIntensity = 0.05; 
            const moveIntensity = 0.02;

            const tiltX = mouseX * tiltIntensity;
            const tiltY = mouseY * tiltIntensity;
            
            // Небольшое смещение (тяга)
            const moveX = mouseX * moveIntensity;
            const moveY = mouseY * moveIntensity;

            // Применяем трансформацию: сохраняем исходный наклон из CSS (если есть) 
            // и добавляем динамический наклон от мыши
            flower.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${tiltX}deg)`;
        });
    });

    // let isFixedMap = {
    //     "tsvetok1": false,
    //     "tsvetok2": false,
    //     "tsvetok3": false,
    //     "tsvetok4": false,
    //     "listva1": false,
    //     "listva2": false,
    //     "listva3": false,
    //     "listva4": false,
    //     "ukrash1": false,
    //     "ukrash2": false,
    //     "ukrash3": false,
    //     "ukrash4": false
    // }

     // let targetZones = {
     //     "item1": document.getElementById('zone1'),
    //     "item2": document.getElementById('zone2')
    // }

//     let isDragging = false;
//     let draggingItem = null;
//     // Переменные для хранения смещения курсора относительно угла элемента
//     let shiftX = 0;
//     let shiftY = 0;

//     //Вызывается, когда мы зажимаем мышку над элементом
//     function flowerMouseDown(e){
      
//       isDragging = true; //Во временной переменной запоминаем, что мы начали движение
//       draggingItem = e.target;
      
//       // Вычисляем, в каком именно месте элемента (относительно левого верхнего угла) 
//       // мы зажали кнопку мыши. Это нужно, чтобы объект не "прыгал" центром к курсору.
//       const rect = draggingItem.getBoundingClientRect(); //Получаем координаты прямоугольника вокруг объекта, который будем двигать

//       //Во временной переменной сохраняем сдвиг мышки относительно верхнего левого угла обхъекта
//       //Для этого берем коордирнату мышки (e.clientX) и из нее вычетаем координаты левого верхнего угла объекта
//       shiftX = e.clientX - rect.left; 
//       shiftY = e.clientY - rect.top;
      
//       // Отключаем встроенный браузерный Drag'n'Drop, иначе он перехватит событие
//       draggingItem.ondragstart = function() { return false; };
//     }


//     // Вызывается каждый раз, когда двигается мышка
//     function flowerMouseMove(e){
//       if (!isDragging || isFixedMap[draggingItem.id]) //Если мы сейчас ничего не двигаем (т.е. мышка не зажата), то ничего не делаем
//         return; 

//       // Получаем размеры окна
//       const vw = window.innerWidth;
//       const vh = window.innerHeight;

//       // Новые координаты в пикселях относительно окна (viewport)
//       const pxLeft = e.clientX - shiftX;
//       const pxTop = e.clientY - shiftY;

//       // Переводим пиксельные координаты в vw и vh
//       const vwLeft = (pxLeft / vw) * 100;
//       const vhTop = (pxTop / vh) * 100;

//       // Устанавливаем через vw и vh чтобы резиново двигалось
//       draggingItem.style.left = vwLeft + 'vw';
//       draggingItem.style.top = vhTop + 'vh';
//     }

//     //Вызывается, когда мы отпускаем мышку
//     function flowerMouseUp(e){      
//       isDragging = false; //Во временной переменной запоминаем, что мы больше не двигаем ничего
//       if (isFixedMap[draggingItem.id]) {
//         return; //Если объект зафиксирован, то ничего не делаем
//       }

//       // Получаем координаты прямоугольника вокруг зоны и объекта
//     //   const zoneRect = targetZones[draggingItem.id].getBoundingClientRect();
//     //   const itemRect = draggingItem.getBoundingClientRect();

//     //   // Проверяем, находится ли объект в зоне (по его левому верхнему углу)
//     //   if (itemRect.left > zoneRect.left && itemRect.left < zoneRect.right && 
//     //       itemRect.top > zoneRect.top && itemRect.top < zoneRect.bottom) {
//     //      draggingItem.style.width = itemRect.width*2 + 'px';
//     //      draggingItem.style.height = itemRect.height*2 + 'px';
//     //      draggingItem.style.left = zoneRect.left + "px";
//     //      draggingItem.style.top = zoneRect.top + "px";

//     //      isFixedMap[draggingItem.id] = true;
//     //   }
//     }


//     document.getElementById('tsvetok1').addEventListener('mousedown', flowerMouseDown);
//     document.getElementById('tsvetok2').addEventListener('mousedown', flowerMouseDown);
//     document.getElementById('tsvetok3').addEventListener('mousedown', flowerMouseDown);
//     document.getElementById('tsvetok4').addEventListener('mousedown', flowerMouseDown);
//     document.getElementById('listva1').addEventListener('mousedown', flowerMouseDown);
//     document.getElementById('listva2').addEventListener('mousedown', flowerMouseDown);
//     document.getElementById('listva3').addEventListener('mousedown', flowerMouseDown);
//     document.getElementById('listva4').addEventListener('mousedown', flowerMouseDown);
//     document.getElementById('ukrash1').addEventListener('mousedown', flowerMouseDown);
//     document.getElementById('ukrash2').addEventListener('mousedown', flowerMouseDown);
//     document.getElementById('ukrash3').addEventListener('mousedown', flowerMouseDown);
//     document.getElementById('ukrash4').addEventListener('mousedown', flowerMouseDown);      
//     document.addEventListener('mousemove', flowerMouseMove)
//     document.addEventListener('mouseup', flowerMouseUp);

    
// });

});

window.addEventListener('DOMContentLoaded', function() {
    let isDragging = false;
    let draggingItem = null;
    
    let shiftXvw = 0;
    let shiftYvw = 0;

    const itemIds = [
        "tsvetok1", "tsvetok2", "tsvetok3", "tsvetok4",
        "listva1", "listva2", "listva3", "listva4",
        "ukrash1", "ukrash2", "ukrash3", "ukrash4"
    ];

    const section = document.querySelector('.section3');

    function onMouseDown(e) {
        if (e.button !== 0) return; 
        
        isDragging = true;
        draggingItem = e.target;

        const rect = draggingItem.getBoundingClientRect();
        const oneVw = window.innerWidth / 100;

        // Фиксируем сдвиг курсора относительно угла самого элемента
        shiftXvw = (e.clientX - rect.left) / oneVw;
        shiftYvw = (e.clientY - rect.top) / oneVw;

        draggingItem.style.zIndex = 1000;
        draggingItem.style.cursor = 'grabbing';
    }

    function onMouseMove(e) {
        if (!isDragging || !draggingItem) return;

        const oneVw = window.innerWidth / 100;
        const sectionRect = section.getBoundingClientRect();

        // Считаем позицию курсора ОТНОСИТЕЛЬНО ВЕРХНЕГО УГЛА СЕКЦИИ
        // Это самое важное исправление
        let currentXvw = (e.clientX - sectionRect.left) / oneVw - shiftXvw;
        let currentYvw = (e.clientY - sectionRect.top) / oneVw - shiftYvw;

        draggingItem.style.left = currentXvw + 'vw';
        draggingItem.style.top = currentYvw + 'vw';
    }

    function onMouseUp() {
        if (draggingItem) {
            draggingItem.style.zIndex = 6;
            draggingItem.style.cursor = 'pointer';
        }
        isDragging = false;
        draggingItem = null;
    }

    itemIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('mousedown', onMouseDown);
            el.ondragstart = () => false;
        }
    });

    // Слушаем события на документе, чтобы не терять фокус при быстром движении
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});