const form = document.getElementById('goodShit');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const kvalitet = data.kvalitet;
    const mengde = data.mengde;
    console.log(data);
});


