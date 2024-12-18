const nummerOptions = {
  hifa: [
    { value: "6054", text: "6054" },
    { value: "6055", text: "6055" },
    { value: "6056", text: "6056" },
    { value: "6058", text: "6058" },
    { value: "6061", text: "6061" },
    { value: "6102", text: "6102" },
    { value: "6103", text: "6103" },
  ],
  ragg: [
    { value: "hvit", text: "Hvit" },
    { value: "svart", text: "Svart" },
  ],
  lsvkv: [
    { value: "413", text: "413" },
    { value: "415", text: "415" },
    { value: "449", text: "449" },
    { value: "450", text: "450" },
    { value: "451", text: "451" },
    { value: "452", text: "452" },
    { value: "453", text: "453" },
    { value: "2144", text: "2144" },
    { value: "vidde", text: "Vidde" },
  ],
  troll: [
    { value: "702", text: "702" },
    { value: "703", text: "703" },
    { value: "704", text: "704" },
    { value: "705", text: "705" },
    { value: "706", text: "706" },
    { value: "707", text: "707" },
    { value: "733", text: "733" },
    { value: "7055", text: "7055" },
    { value: "765", text: "765" },
  ],
  vevgarn: [
    { value: "5427", text: "5427" },
    { value: "5428", text: "5428" },
    { value: "5429", text: "5429" },
    { value: "5430", text: "5430" },
    { value: "5431", text: "5431" },
    { value: "5432", text: "5432" },
    { value: "5433", text: "5433" },
    { value: "5480", text: "5480" },
  ],
  bondegarn: [
    { value: "110", text: "110" },
    { value: "115", text: "115" },
    { value: "130", text: "130" },
  ],
  uvasket: [
    { value: "100", text: "100" },
    { value: "110", text: "110" },
    { value: "115", text: "115" },
    { value: "130", text: "130" },
  ],
  pels: [{ value: "pels", text: "pels" }],
  jul: [
    { value: "rød", text: "Nisserød" },
    { value: "blå", text: "Nisseblå" },
  ],
  åt: [
    { value: "rød", text: "Rød" },
    { value: "oransje", text: "Oransje" },
    { value: "mørkgrå", text: "Mørk Grå" },
    { value: "5480", text: "5480" },
  ],
};

//Forandre Nummer input basert på ulltype
document.getElementById("ulltype").addEventListener("change", function () {
  const ulltype = this.value;
  const nummerSelect = document.getElementById("nummer");
  nummerSelect.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.text = "Velg Nummer";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  nummerSelect.add(defaultOption);

  if (nummerOptions[ulltype]) {
    nummerOptions[ulltype].forEach((option) => {
      const newOption = document.createElement("option");
      newOption.value = option.value;
      newOption.text = option.text;
      nummerSelect.add(newOption);
    });
  }
});

//"Beregn" knappen
document.getElementById("ullForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const ulltype = document.getElementById("ulltype").value;
  const nummer = document.getElementById("nummer").value;
  const mengde = parseFloat(document.getElementById("mengde").value);

  // Henter oppskriftene fra json-filen
  fetch("/data/recipes")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((recipes) => {
      console.log("Hentet oppskrifter:", recipes);

      //Finn riktig oppskrift
      const ullTypeMatch = recipes[ulltype];
      if (ullTypeMatch) {
        console.log("Ser gjennom: ", ullTypeMatch, "for nummer:", nummer);
        const riktigOppskrift = finnOppskrift(ullTypeMatch, nummer);
        console.log("Fant riktig oppskrift:", riktigOppskrift);

        //Regn ut
        const utregnetResultat = regnUt(mengde, riktigOppskrift.oppskrift);
        console.log("Regnet ut alle verdier:", utregnetResultat);

        //Vis resultatene
        displayResult(utregnetResultat, riktigOppskrift.oppskrift);
      } else {
        console.error(
          "Ingen oppskrift funnet for:",
          { ulltype, nummer },
          ". Prøv å oppdatere siden, og gjør et nytt forsøk!"
        );
      }
    })
    .catch((error) =>
      console.error("Det skjedde en feil med å hente opppskriftene:", error)
    );
});

function finnOppskrift(ullTypeMatch, nummer) {
  for (let i = 0; i < ullTypeMatch.length; i++) {
    if (ullTypeMatch[i].nummer === nummer) {
      return ullTypeMatch[i];
    }
  }
  console.log(
    "Fant ingen oppskrift for nummer:",
    nummer,
    ". Prøv å oppdatere siden, og gjør et nytt forsøk!"
  );
  return null;
}

function regnUt(mengde, oppskrift) {
  let result = {};
  console.log("Oppskrift:", oppskrift);
  Object.entries(oppskrift).forEach(([key, value]) => {
    let calculatedValue = ((value * mengde) / 100).toFixed(2);
    if (calculatedValue !== "0.00") {
      result[key] = parseFloat(calculatedValue);
    }
  });
  console.log("Resultat:", result);
  return result;
}

function displayResult(utregnetResultat, oppskrift) {
  //Hent elementene
  const ullKvaliteterElement = document.querySelector(".ullKvaliteter");
  const prosentElement = document.querySelector(".prosent");
  const resultatElement = document.querySelector(".resultat");

  //Fjern tidligere resultater
  ullKvaliteterElement.innerHTML = "";
  prosentElement.innerHTML = "";
  resultatElement.innerHTML = "";

  //Lag ullKvaliteter header
  Object.entries(utregnetResultat).forEach(([key]) => {
    let cell = document.createElement("th");
    cell.className = 'scope="col"';
    cell.textContent = key;
    ullKvaliteterElement.appendChild(cell);
  });

  //Lag prosent header
  Object.entries(oppskrift).forEach(([key, value]) => {
    let cell = document.createElement("th");
    cell.className = 'scope="col"';
    cell.textContent = value + " %";
    prosentElement.appendChild(cell);
  });

  //Legg til resultatene i rekken "resultat"
  Object.entries(utregnetResultat).forEach(([key, value]) => {
    let cell = document.createElement("td");
    cell.textContent = value + " kg";
    resultatElement.appendChild(cell);
  });
}
