document.addEventListener('DOMContentLoaded', function() {
    fetch('/data/recipes')
        .then(response => response.json())
        .then(recipes => {
            displayInventory(recipes);
        })
        .catch(error => console.error('Error loading recipes:', error));
});

function displayInventory(recipes) {
    const inventoryTableBody = document.querySelector('#inventoryTable tbody');

    for (const ulltype in recipes) {
        if (recipes.hasOwnProperty(ulltype)) {
            recipes[ulltype].forEach(recipe => {
                for (const property in recipe.oppskrift) {
                    if (recipe.oppskrift.hasOwnProperty(property)) {
                        const row = document.createElement('tr');
                        const ulltypeCell = document.createElement('td');
                        const nummerCell = document.createElement('td');
                        const propertyCell = document.createElement('td');
                        const valueCell = document.createElement('td');

                        ulltypeCell.textContent = ulltype;
                        nummerCell.textContent = recipe.nummer;
                        propertyCell.textContent = property;
                        valueCell.textContent = recipe.oppskrift[property];

                        row.appendChild(ulltypeCell);
                        row.appendChild(nummerCell);
                        row.appendChild(propertyCell);
                        row.appendChild(valueCell);

                        inventoryTableBody.appendChild(row);
                    }
                }
            });
        }
    }
}