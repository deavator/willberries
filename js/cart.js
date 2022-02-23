const cart = () => {

    const cartBtn = document.querySelector('.button-cart'),
        modalCart = document.getElementById('modal-cart'),
        modalCloseBtn = document.querySelector('.modal-close');


    cartBtn.addEventListener('click', () => {
        modalCart.style.display = 'block';
    });

    modalCloseBtn.addEventListener('click', () => {
        modalCart.style.display = '';
    });

    modalCart.addEventListener("click", (e) => {
        if (e.target.className == "overlay") {
            modalCart.style.display = '';
        }
    });
};

cart();