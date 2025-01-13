document.addEventListener("DOMContentLoaded", function () {
  fetch("/data/ullLager")
    .then((response) => response.json())
    .then((ullLager) => {
      displayInventory(ullLager);
    })
    .catch((error) => console.error("Error loading recipes:", error));
});

function displayInventory(ullLager) {
  const inventoryTableBody = document.querySelector("#inventoryTableBody");
  inventoryTableBody.innerHTML = "";
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

    let cellType = document.createElement("td");
    cellType.textContent = item.type || ""; // Handle missing type property
    row.appendChild(cellType);

    let cellKvantitet = document.createElement("td");
    cellKvantitet.textContent = item.kvantitet + " kg";
    row.appendChild(cellKvantitet);

    inventoryTableBody.appendChild(row);
  });
}
