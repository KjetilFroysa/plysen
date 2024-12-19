document.addEventListener("DOMContentLoaded", function () {
  fetch("/data/ullLager")
    .then((response) => response.json())
    .then((ullLager) => {
      displayInventory(ullLager);
    })
    .catch((error) => console.error("Error loading recipes:", error));
});

function displayInventory(ullLager) {
  //Hent elementene
  const inventoryTableBody = document.querySelector("#inventoryTableBody");

  //Fjern tidligere resultater
  inventoryTableBody.innerHTML = "";

  //Legg til resultatene i tbody"
  ullLager.forEach((item) => {
    let row = document.createElement("tr");

    let cellImg = document.createElement('td');
        let img = document.createElement('img');
        img.src = item.bilde;
        img.alt = item.navn;
        cellImg.appendChild(img);
        row.appendChild(cellImg);

    let cellNavn = document.createElement("td");
    cellNavn.textContent = item.navn;
    row.appendChild(cellNavn);

    let cellNummer = document.createElement("td");
    cellNummer.textContent = item.nummer;
    row.appendChild(cellNummer);

    let cellMelert = document.createElement("td");
    cellMelert.textContent = item.melert ? "Ja" : "Nei";
    row.appendChild(cellMelert);

    let cellMengde = document.createElement("td");
    cellMengde.textContent = item.mengde + " kg";
    row.appendChild(cellMengde);

    inventoryTableBody.appendChild(row);
  });
}
