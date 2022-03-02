const getGoods = () => {

    // ======= ПЕРЕМЕННЫЕ =========================================
    const links = document.querySelectorAll('.navigation-link'),
        viewAllLink = document.querySelector('.more'),
        categoryTitle = document.querySelector('.section-title'),
        parentNew = document.querySelector('.short-goods'),
        parentDiv = document.querySelector('.long-goods-list');


    //offline mode
    const url = '/db/db.json';
    //online mode
    // const url = 'https://willberries-bc782-default-rtdb.europe-west1.firebasedatabase.app/goods.json'; 


    // ======= ФУНКЦИИ ============================================

    // Получение списка товаров и запись в LS
    const getData = () => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data.goods);
                localStorage.setItem('goods', JSON.stringify(data.goods));
            });
    };

    // Фильтр данных из LS
    const filterData = (category, content) => {
        const goods = JSON.parse(localStorage.getItem('goods'));
        const filteredGoods = category ? goods.filter((item) => item[category] === content) : goods;

        localStorage.setItem('goods', JSON.stringify(filteredGoods));

        if (window.location.pathname !== '/goods.html') {
            window.location.href = 'goods.html';
            renderData(parentDiv);
        } else {
            renderData(parentDiv);
        }
    };


    // Отрисовка данных
    const renderData = (parent, category) => {

        const goods = JSON.parse(localStorage.getItem('goods'));

        categoryTitle.textContent = category;

        parentDiv.innerHTML = '';

        goods.forEach(card => {
            const cardContent = document.createElement('div');
            cardContent.classList.add('col-lg-3');
            cardContent.classList.add('col-sm-6');

            cardContent.innerHTML = `
                <div class="goods-card">
						<span class="label ${card.label ? null : 'd-none'}">${card.label}</span>
                        <div class="block-img">
						    <img class="goods-img" src="db/${card.img}" alt=${card.name}>
                        </div>
						<h3 class="goods-title">${card.name}</h3>
						<p class="goods-description">${card.description}</p>
						<button class="button goods-card-btn add-to-cart" data-id=${card.id}>
							<span class="button-price">${card.price}$</span>
						</button>
					</div>
            `;
            parent.append(cardContent);
        });
        getData();
    };


    // Отбор новых товаров
    const newArrivalGoods = () => {
        const goods = JSON.parse(localStorage.getItem('goods'));
        
        const filteredGoods = goods.filter(item => item.label === "New");

            //    Paste arr here
            
        localStorage.setItem('goods', JSON.stringify(filteredGoods));

        renderData(parentNew);
    };

    // ======= ЗАГРУЗКА СТРАНИЦЫ ==================================
    // renderData('All');

    // ======= ОБРАБОТЧИКИ СОБЫТИЙ ================================

    if (viewAllLink) {
        viewAllLink.addEventListener('click', (e) => {
            e.preventDefault();
            getData();
            filterData();
        });
    }


    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filterData(link.dataset.field, link.textContent);
        });
    });

    if (localStorage.getItem('goods') && window.location.pathname === '/goods.html') {
        renderData(parentDiv);
    } else {
        getData();
        newArrivalGoods();
    }
};
getGoods();