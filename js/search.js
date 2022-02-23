const search = () => {

    const input = document.querySelector('.search-block > input');
    const inputBtn = document.querySelector('.search-block > button');

    inputBtn.addEventListener('click', () => {
        console.log(input.value);
    });


};

search();