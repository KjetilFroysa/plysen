document.addEventListener("DOMContentLoaded", function () {
    fetch("/data/recipes")
      .then((response) => response.json())
      .then((recipes) => {
        displayInventory(recipes);
      })
      .catch((error) => console.error("Error loading recipes:", error));
  });
  
  function displayRecipes(ullOppskrifter) {
    //Hent elementene
    const inventoryTableBody = document.querySelector("#inventoryTableBody");
  
    //Fjern tidligere resultater
    inventoryTableBody.innerHTML = "";
  
    //Legg til resultatene i tbody"
    ullOppskrifter.forEach((item) => {
      let row = document.createElement("tr");
  
    //   let cellImg = document.createElement('td');
    //       let img = document.createElement('img');
    //       img.src = item.bilde;
    //       img.alt = item.navn;
    //       cellImg.appendChild(img);
    //       row.appendChild(cellImg);
  
    //   let cellNavn = document.createElement("td");
    //   cellNavn.textContent = item.navn;
    //   row.appendChild(cellNavn);
  
      let cellNummer = document.createElement("td");
      cellNummer.textContent = item.nummer;
      row.appendChild(cellNummer);
  
    //   let cellMelert = document.createElement("td");
    //   row.appendChild(cellMelert);
  
      let cellOppskrift = document.createElement("td");
      cellOppskrift.textContent = item.oppskrift;
      row.appendChild(cellMengde);
  
      inventoryTableBody.appendChild(row);
    });
  }
  