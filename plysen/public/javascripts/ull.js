const nummerOptions = {
  hifa: [
      { value: '6054', text: '6054' },
      { value: '6055', text: '6055' },
      { value: '6056', text: '6056' },
      { value: '6058', text: '6058' },
      { value: '6061', text: '6061' },
      { value: '6102', text: '6102' },
      { value: '6103', text: '6103' }
  ],
  ragg: [
      { value: 'hvit', text: 'Hvit' },
      { value: 'svart', text: 'Svart' }
  ],
  lsvkv: [
      { value: '413', text: '413' },
      { value: '415', text: '415' },
      { value: '449', text: '449' },
      { value: '450', text: '450' },
      { value: '451', text: '451' },
      { value: '452', text: '452' },
      { value: '453', text: '453' },
      { value: '2144', text: '2144' },
      { value: 'vidde', text: 'Vidde' }
  ],
  troll: [
      { value: '702', text: '702' },
      { value: '703', text: '703' },
      { value: '704', text: '704' },
      { value: '705', text: '705' },
      { value: '706', text: '706' },
      { value: '707', text: '707' },
      { value: '733', text: '733' },
      { value: '7055', text: '7055' },
      { value: '765', text: '765' }
  ],
  vevgarn: [
      { value: '5427', text: '5427' },
      { value: '5428', text: '5428' },
      { value: '5429', text: '5429' },
      { value: '5430', text: '5430' },
      { value: '5431', text: '5431' },
      { value: '5432', text: '5432' },
      { value: '5433', text: '5433' },
      { value: '5480', text: '5480' }
  ],
  bondegarn: [
      { value: '110', text: '110' },
      { value: '115', text: '115' },
      { value: '130', text: '130' }
  ],
  uvasket: [
      { value: '100', text: '100' },
      { value: '110', text: '110' },
      { value: '115', text: '115' },
      { value: '130', text: '130' }
  ],
  pels: [
    { value: 'pels', text: 'pels' }
  ],
  jul: [
    { value: 'rød', text: 'Nisserød' },
    { value: 'blå', text: 'Nisseblå' }
  ],
  åt: [
    { value: 'rød', text: 'Rød' },
    { value: 'oransje', text: 'Oransje' },
    { value: 'mørkgrå', text: 'Mørk Grå' },
    { value: '5480', text: '5480' },
  ],
};

document.getElementById('ulltype').addEventListener('change', function() {
  const ulltype = this.value;
  const nummerSelect = document.getElementById('nummer');

  // Clear existing options
  nummerSelect.innerHTML = '';

  // Add default option
  const defaultOption = document.createElement('option');
    defaultOption.text = 'Velg Nummer';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    nummerSelect.add(defaultOption);

  // Add new options based on selected ulltype
  if (nummerOptions[ulltype]) {
      nummerOptions[ulltype].forEach(option => {
          const newOption = document.createElement('option');
          newOption.value = option.value;
          newOption.text = option.text;
          nummerSelect.add(newOption);
      });
  }
});


document.getElementById("ullForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const ulltype = document.getElementById("ulltype").value;
  const nummer = document.getElementById("nummer").value;
  const mengde = parseFloat(document.getElementById("mengde").value);

  // Fetch the recipes.json file from the server
  fetch("/data/recipes")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((recipes) => {
      console.log('Hentet oppskrifter:', recipes);
      const recipe = finnOppskrift(recipes, ulltype, nummer);

      if (recipe) {
        console.log('Fant oppskrift:', recipe);
        const result = regnUt(mengde, recipe.oppskrift);
        displayResult(result, recipe.oppskrift);
      } else {
        console.error("Ingen oppskrift funnet for:", { ulltype, nummer }, ". Prøv å oppdatere siden, og gjør et nytt forsøk!");
      }
    })
    .catch((error) => console.error("Det skjedde en feil med å hente opppskriftene:", error));
});

function finnOppskrift(recipes, ulltype, nummer) {
  console.log("Leter etter oppskrifter med:", { ulltype, nummer });
  if (recipes[ulltype]) {
    for (let i = 0; i < recipes[ulltype].length; i++) {
      console.log("Sjekker oppskriften:", recipes[ulltype][i]);
      if (recipes[ulltype][i].nummer === nummer) {
        console.log('Fant en match:', recipes[ulltype][i]);
        return recipes[ulltype][i];
      }
    }
  }
  console.log('Ingen match for:', { ulltype, nummer });
  return null;
}

function regnUt(mengde, oppskrift) {
  let result = [];
  for (let key in oppskrift) {
    if (oppskrift.hasOwnProperty(key)) {
      let calculatedValue = ((oppskrift[key] * mengde) / 100).toFixed(2);
      if (calculatedValue !== "0.00") {
        result.push(parseFloat(calculatedValue));
      }
    }
  }
  return result;
}

function displayResult(result, oppskrift) {
  // Create table
  let table = document.createElement('table');
  table.id = 'resultTableCSS';
  table.className = 'table table-striped table-bordered table-hover';
  let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');

  // Create header row
  let headerRow = document.createElement('tr');
  let headerCell1 = document.createElement('th');
  let headerCell2 = document.createElement('th');
  headerCell1.textContent = 'Property';
  headerCell2.textContent = 'Value';
  headerRow.appendChild(headerCell1);
  headerRow.appendChild(headerCell2);
  thead.appendChild(headerRow);

  // Add rows to table
  result.forEach((value, index) => {
      let row = document.createElement('tr');
      let cell1 = document.createElement('td');
      let cell2 = document.createElement('td');
      const propertyName = Object.keys(oppskrift)[index];
      console.log('Property Name:', propertyName); // Debugging statement
      cell1.textContent = propertyName; // Use the property name
      cell2.textContent = value;
      row.appendChild(cell1);
      row.appendChild(cell2);
      tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  // Clear previous results
  let resultTable = document.getElementById('resultTable');
  resultTable.innerHTML = '';

  // Append table to the resultTable div
  resultTable.appendChild(table);
}
