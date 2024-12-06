const knapp = document.getElementsByClassName('regn-ut')

knapp.addEventListener('click', () => {
    const kvalitet = document.getElementsByID('kvalitet').value();
    const mengde = document.getElementsByID('mengde').value();
    console.log(kvalitet + mengde);
});