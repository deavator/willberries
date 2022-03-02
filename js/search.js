// import renderGoods from 'getGoods.js';
const search = () => {

    const input = document.querySelector('.search-block > input');
    const inputBtn = document.querySelector('.search-block > button');
    const parentDiv = document.querySelector('.long-goods-list');


    // Поиск товаров
    inputBtn.addEventListener('click', () => {
        getData(input.value);
        input.value = '';
    });

    // Отрисовка данных
    const renderGoods = (goods) => {
        parentDiv.innerHTML = '';

        goods.forEach(card => {
            const cardContent = document.createElement('div');
            cardContent.classList.add('col-lg-3');
            cardContent.classList.add('col-sm-6');

            cardContent.innerHTML = `
                <div class="goods-card">
    					<span class="label ${card.label ? null : 'd-none'}">${card.label}</span>
    					<img src="db/${card.img}" alt=${card.name}>
    					<h3 class="goods-title">${card.name}</h3>
    					<p class="goods-description">${card.description}</p>
    					<button class="button goods-card-btn add-to-cart" data-id=${card.id}>
    						<span class="button-price">${card.price}$</span>
    					</button>
    				</div>
            `;
            parentDiv.append(cardContent);
        });
    };


    // Получение данные в LS
    const getData = (searchName) => {

        // uncomment line
        // off-line
        fetch('/db/db.json')

        // online
        // fetch('https://willberries-bc782-default-rtdb.europe-west1.firebasedatabase.app/goods.json')

            .then((res) => res.json())
            .then((data) => {

                // Off-line mode 
                const array = data.goods.filter((item) => item.name.toLowerCase().includes(searchName.toLowerCase()));

                // On-line mode 
                // const array = data.filter((good) => good.name.toLowerCase().includes(searchName.toLowerCase()));

                localStorage.setItem('goods', JSON.stringify(array));

                // window.location.href = 'goods.html';
                if (window.location.pathname !== '/goods.html') {
                    window.location.href = 'goods.html';
                    renderGoods(array);
                } else {
                    renderGoods(array);
                }
            });
    };

};

search();