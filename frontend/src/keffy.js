/*
Конструктор слайдера
*/
const Keffy = function(name, params = {}) {
    const {
        active = 1,
    } = params;
    this.slider = document.querySelector(name);
    this.sWrapper = this.slider.querySelector('.keffy__wrapper');
    this.sPrev = this.slider.querySelector('.keffy__prev-b');
    this.sNext = this.slider.querySelector('.keffy__next-b');
    this.sSlide = this.slider.querySelectorAll('.keffy__slide');
    this.sPagination = this.slider.querySelector('.keffy__pagination');
    this.sBullet = {};
    this.sActive = active - 1;


    if (this.sPrev) this.sPrev.addEventListener('click',
        this.goToSlide.bind(this, -1)
    );
    if (this.sNext) this.sNext.addEventListener('click',
        this.goToSlide.bind(this, 1)
    );

    this.sSlide.forEach(item => {
        item.addEventListener('touchstart', this.handleStart.bind(this));
        item.addEventListener('touchend', this.handleEnd.bind(this));
        //item.addEventListener('mousedown', this.handleStart.bind(this));
        //item.addEventListener('mouseup', this.handleEnd.bind(this));
        item.addEventListener('wheel', this.scroll.bind(this))
    });

    if (this.sPagination) this.buildPagination();

    this.sSlide[this.sActive].classList.add('_active');

    this.touchesSlider = [0, 0];
};

/*
Создаем пагинацию
*/

Keffy.prototype.buildPagination = function() {
    this.sPagination.innerHTML = "";
    for (let l = this.sSlide.length, n = 0; n < l; n++) {
        let newElem = document.createElement("div");
        newElem.className = "keffy__bullet";
        newElem.setAttribute('data-snumb', n);
        newElem.addEventListener('click', this.goToBullet.bind(this));
        if (this.sActive == n) newElem.classList.add('_active');
        this.sPagination.appendChild(newElem);
    }
    this.sBullet = this.sPagination.querySelectorAll('.keffy__bullet');
};

/*
Перейти по кнопкам пагинации слайдера
*/

Keffy.prototype.goToSlide = function(next=0) {
    let sLength = this.sSlide.length - 1;
    let numb = this.sActive + next;

    if (numb >= 0 && numb <= sLength) {
        let active = this.slider.querySelectorAll('._active');
        active[0].classList.remove('_active');
        this.sSlide[numb].classList.add('_active');

        if (this.sPagination) {
            active[1].classList.remove('_active');
            this.sBullet[numb].classList.add('_active');
        }
        if (next) this.sActive = numb;
    }
};

/*
Обработчик пагинации слайдера
*/

Keffy.prototype.goToBullet = function(event) {
    event = event || window.event;
    let elem = event.currentTarget;
    this.sActive = +elem.getAttribute('data-snumb');

    this.goToSlide();
};

/*
Обработчик начала touch слайдера
*/

Keffy.prototype.handleStart = function(event) {
    event = event || window.event;
    let touches = event.changedTouches;
    this.touchesSlider[0] = +event.clientX || +touches[0].clientX;
    this.touchesSlider[1] = +event.clientY || +touches[0].clientY;
};

/*
Обработчик завершения touch слайдера
*/

Keffy.prototype.handleEnd = function(event) {
    event = event || window.event;
    let elem = event.currentTarget;
    let touches = event.changedTouches;
    let len = touches ? touches.length - 1 : 0;
    let endX = event.clientX || touches[len].clientX;
    let endY = event.clientY || touches[len].clientY;
    let differenceX = endX - this.touchesSlider[0];
    let differenceY = endY - this.touchesSlider[1];
    /*
      Если сдвиг больше 50px
    */
    if (Math.abs(differenceY) > 50 && Math.abs(differenceY) > Math.abs(differenceX)) {
        let top = +elem.pageYOffset || elem.scrollTop;
        let bottom = elem.scrollHeight - (elem.clientHeight + top);
        if (differenceY > 0 && top <= 1) {
            this.goToSlide(-1);
        } else if (differenceY < 0 && bottom <= 1) {
            this.goToSlide(1);
        } else {
            elem.scrollBy(0, -differenceY);
        }
    }
};

/*
Обработчик скроллинга слайдов
*/

Keffy.prototype.scroll = function(event) {
    event = event || window.event;
    let elem = event.currentTarget;
    let delta = event.deltaY || event.detail || event.wheelDelta;
    let top = +elem.pageYOffset || elem.scrollTop;
    let bottom = elem.scrollHeight - (elem.clientHeight + top);
    if (delta < 0 && top <= 1) {
        this.goToSlide(-1);
    } else if (delta > 0 && bottom <= 1) {
        this.goToSlide(1);
    }
};

export default Keffy;