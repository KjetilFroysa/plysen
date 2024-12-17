document.getElementById('ullForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Collect input values
    const ulltype = document.getElementById('ulltype').value;
    const nummer = document.getElementById('nummer').value;
    const mengde = parseFloat(document.getElementById('mengde').value);

    // Fetch the recipes.json file from the server
    fetch('/data/recipes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(recipes => {
            const oppskrift = finnOppskrift(recipes, ulltype, nummer);

            if (oppskrift) {
                // Calculate the result
                const result = regnUt(mengde, oppskrift);

                // Display the result in a table
                displayResult(result);
            } else {
                console.error('No recipe found for the given ulltype and nummer');
            }
        })
        .catch(error => console.error('Error loading recipes:', error));
});

function finnOppskrift(recipes, ulltype, nummer) {
    console.log('Searching for recipe with:', { ulltype, nummer });
    if (recipes[ulltype]) {
        for (let i = 0; i < recipes[ulltype].length; i++) {
            console.log('Checking recipe:', recipes[ulltype][i]);
            if (recipes[ulltype][i].nummer === nummer) {
                return recipes[ulltype][i].oppskrift;
            }
        }
    }
    return null;
}

function regnUt(mengde, oppskrift) {
    let result = [];
    for (let key in oppskrift) {
        if (oppskrift.hasOwnProperty(key)) {
            result.push(oppskrift[key] * mengde / 100);
        }
    }
    return result;
}

function displayResult(result) {
    // Create table
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');

    // Add rows to table
    result.forEach((value, index) => {
        let row = document.createElement('tr');
        let cell1 = document.createElement('td');
        let cell2 = document.createElement('td');
        cell1.textContent = `Item ${index + 1}`;
        cell2.textContent = value;
        row.appendChild(cell1);
        row.appendChild(cell2);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    // Clear previous results
    const resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = '';

    // Append table to the resultTable div
    resultTable.appendChild(table);
}