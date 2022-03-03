const cart = () => {

    // =============== ПЕРЕМЕННЫЕ ===========================

    const cartBtn = document.querySelector('.button-cart'),
        modalCart = document.getElementById('modal-cart'),
        modalCloseBtn = document.querySelector('.modal-close'),
        parentDiv = document.querySelector('.long-goods-list'),
        parentNew = document.querySelector('.short-goods'),
        cartTable = document.querySelector('.cart-table'),
        cartGoods = document.querySelector('.cart-table__goods'),
        cartTotal = document.querySelector('.card-table__total'),
        modalForm = document.querySelector('.modal-form'),
        modalText = document.querySelector('.modal-text'),
        cartCount = document.querySelector('.cart-count');


    // =============== ФУНКЦИИ =============================

    // Добавление товаров в корзину 
    const addToCard = (itemId) => {
        const goods = localStorage.getItem('goods') ?
            JSON.parse(localStorage.getItem('goods')) : [];

        const clickedItem = goods.find(item => item.id === itemId);

        // Если корзина с товаром существует, то cart = корзине. Иначе новый массив
        const cart = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : [];

        if (cart.some(item => item.id === clickedItem.id)) {
            // Перебор корзины и при совпадении id товара прибавляет его количество
            cart.map(item => {
                if (item.id === clickedItem.id) {
                    item.count++;
                }
                return item;
            });
        } else {
            // Добавляем свойство count списку свойств выбранного товара
            clickedItem.count = 1;
            // Добавляем в корзину
            cart.push(clickedItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    };


    // Открыть модальное окно 
    const openModal = () => {
        const cartItems = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : [];
        
        if (cartItems.length === 0) {
            cartTable.classList.add('hide');
            modalText.classList.remove('hide');
            modalForm.innerHTML = '';

        } else {
            cartTable.classList.remove('hide');
            modalText.classList.add('hide');
            modalForm.innerHTML = `
            <form class="modal-form" action="">
				<input class="modal-input" type="text" placeholder="Имя" name="nameCustomer">
				<input class="modal-input" type="text" placeholder="Телефон" name="phoneCustomer">
				<button class="button cart-buy" type="submit">
					<span class="button-text">Checkout</span>
				</button>
			</form>
            `;
        }

        modalCart.style.display = 'block';
    };
    

    // Закрыть модальное окно 
    const closeModal = () => {
        modalCart.style.display = '';

        // При закрытии модального окна вычистить из корзины товары с нулевым значением количества
        const cart = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : [];

        // Переcобираем объект, исключив элементы с count = 0
        const newCart = cart.filter(item => item.count !== 0);

        // Записываем очищенный массив в LS 
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    // Отрисовка товаров корзины 
    const renderCartItems = (cartItems) => {
        cartGoods.innerHTML = '';
        cartItems.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price}$</td>
                <td><button class="cart-btn-minus">-</button></td>
                <td>${item.count}</td>
                <td><button class="cart-btn-plus">+</button></td>
                <td>${+item.price * +item.count}$</td>
                <td><button class="cart-btn-delete">x</button></td>
            `;
            cartGoods.append(tr);

            tr.addEventListener('click', (e) => {
                if (e.target.classList.contains('cart-btn-minus')) {
                    minusCartItem(item.id);
                } else if (e.target.classList.contains('cart-btn-plus')) {
                    plusCartItem(item.id);
                } else {
                    deleteCartItem(item.id);
                }
                cartItemsCount();
            });
        });
    // =====================================================

        // Подсчет общей стоимости товаров в корзине
        let totalSum = 0;
        

        cartItems.map(item => {
            totalSum = totalSum + (+item.count * +item.price);
            return item;
        });

        cartTotal.textContent = `${totalSum}$`;
    };

    // ============== КОНЕЦ ФУНКЦИИ =========================

    // Подсчет количества товаров в корзине
    const cartItemsCount = () => {
        const cartItems = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : [];

        let totalCount = 0;
        cartItems.map(item => {
            totalCount += +item.count;
            return item;
        });

        if (totalCount === 0) {
            cartCount.classList.add('hide');
        } else {
            cartCount.classList.remove('hide');
            cartCount.textContent = totalCount;
        }
    };
    
    // =====================================================

    // Действия с количеством товаров в корзине
    // Удаление
    const deleteCartItem = (cartId) => {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const newCart = cart.filter(item => item.id !== cartId);
        localStorage.setItem('cart', JSON.stringify(newCart));
        openModal();
        renderCartItems(newCart);
    };
    // Прибавление
    const plusCartItem = (cartId) => {
        const cart = JSON.parse(localStorage.getItem('cart'));
        cart.map(item => {
            if (item.id === cartId) {
                item.count++;
            }
            return item;
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems(cart);
    };
    // Уменьшение
    const minusCartItem = (cartId) => {
        const cart = JSON.parse(localStorage.getItem('cart'));
        cart.map(item => {
            if (item.id === cartId && item.count > 0) {
                item.count--;
            }
            return item;
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems(cart);
    };

    // =====================================================

    // Отправка информации о заказе товара
    const sendFormData = (name, tel) => {
        const cartItems = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : [];

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                cart: cartItems,
                name: name,
                tel: tel
            })
        })
        .then(() => {
            // После успешной отправки данных 
            closeModal();
            localStorage.removeItem('cart');
        });
    };
    // =====================================================

    cartItemsCount();

    // =============== ОБРАБОТКА СОБЫТИЙ ===================
    // =====================================================
    
    // Открыть модальное окно корзины
    cartBtn.addEventListener('click', () => {
        const cartItems = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : [];

        renderCartItems(cartItems);

        openModal();
    });
    // =====================================================

    // Закрыть модальное окно корзины
    // 1. Нажатием кнопки крестик
    modalCloseBtn.addEventListener('click', () => {
        closeModal();
    });
    // 2. Нажатием в поле за пределами окна
    modalCart.addEventListener("click", (e) => {
        if (e.target.className == "overlay") {
            closeModal();
        }
    });
    // =====================================================

    // Если на index.html, то используем блок parentNew иначе parentDIV 
    const parent = window.location.pathname === '/goods.html' ? parentDiv : parentNew;

    // Добавить товар в корзину (если на страничке goods.html)
        // Нажатие на кнопку добавить в корзину
        parent.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                const toCartBtn = e.target.closest('.add-to-cart');
                addToCard(toCartBtn.dataset.id);
            }
            cartItemsCount();
        });

    // =====================================================

    // Отправка данных о заказе товаров при нажатии на кнопку submit
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendFormData(modalForm.nameCustomer.value, modalForm.phoneCustomer.value);
    });
};

cart();