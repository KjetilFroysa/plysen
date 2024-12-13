const knapp = document.getElementById('regn-ut');

knapp.addEventListener("click", function(e) {
    const kvalitet = document.getElementById('kvalitet').value;
    const mengde = document.getElementById('mengde').value;
    console.log(kvalitet + mengde);
});


class HIFA {
    constructor(navn, nummer, c1_kvit, c1_svart, c1_brun_620) {
        this.navn = navn;
        this.nummer = nummer;
        this.oppskrift = [
            c1_kvit,
            c1_svart,
            c1_brun_620,
        ]
    }
};

const hifa_6054 = new HIFA ("HIFA", 6054, 97.5, 2.5, 0);
const hifa_6055 = new HIFA ("HIFA", 6055, 88, 12, 0);

fetch('./kvaliteter.json')
.then(response => response.json())
.then(data=> {
    console.log(data);
});

console.log(data.name);

console.log (hifa_6054);
console.log(hifa_6054.oppskrift);
console.log (hifa_6055);
console.log(hifa_6055.oppskrift[0]);