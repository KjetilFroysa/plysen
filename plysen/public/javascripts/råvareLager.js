document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('ullLager').addEventListener('click', function() {
        fetchRåvareLager();
    });
});

function fetchRåvareLager() {
    fetch('/data/råvareLager')
        .then(response => response.json())
        .then(data => {
            displayRåvareLager(data);
        })
        .catch(error => console.error('Error loading råvareLager:', error));
}

function displayInventory(råvareLager) {
    //Hent elementene
    const inventoryTableBody = document.querySelector("#inventoryTableBody");
  
    //Fjern tidligere resultater
    inventoryTableBody.innerHTML = "";
  
    //Legg til resultatene i tbody"
    råvareLager.forEach((item) => {
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
  
      let cellTotal = document.createElement("td");
      cellTotal.textContent = item.total + " kg";
      row.appendChild(cellTotal);
  
      inventoryTableBody.appendChild(row);
    });
  }
  