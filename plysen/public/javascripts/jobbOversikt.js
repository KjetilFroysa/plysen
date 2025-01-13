let removedOrder = null;
let removedOrderIndex = null;
let undoTimeout = null;


//Denne henter data fra bestillinger databasen, og viser det i en sortable tabell, som lar brukeren flytte rundt på rekkefølgen til bestillingene
document.addEventListener("DOMContentLoaded", function () {
  fetch("data/bestillinger")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("priorityTable");
      data.bestillinger.forEach((bestillinger, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${bestillinger.type}</td>
                            <td>${bestillinger.nummer}</td>
                            <td>${bestillinger.totalPåLager}</td>
                            <td>${formatDate(bestillinger.dato)}</td>
                            <td><button class="btn btn-danger" onclick="removeOrder(${index})">Fjern</button></td>
                        `;
        tableBody.appendChild(row);
      });

      initializeSortable();
    })
    .catch((error) => console.error("Error fetching the JSON:", error));
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}, ${hours}:${minutes}`;
}

function initializeSortable() {
  const tableBody = document.getElementById("priorityTable");
  Sortable.create(tableBody, {
    animation: 150,
    onEnd: function (evt) {
      updatePriorities();
    },
  });
}

function updatePriorities() {
  const tableBody = document.getElementById("priorityTable");
  const rows = Array.from(tableBody.children);
  const updatedOrders = rows.map((row, index) => {
    // Update the priority column
    row.cells[0].textContent = index + 1;
    return {
      prioritet: index + 1,
      type: row.cells[1].textContent,
      nummer: row.cells[2].textContent,
      totalPåLager: row.cells[3].textContent,
      dato: row.cells[4].textContent,
    };
  });

  fetch("/update-priorities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orders: updatedOrders }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Priorities updated successfully");
      } else {
        console.error("Error updating priorities:", data.message);
      }
    })
    .catch((error) => console.error("Error updating priorities:", error));
}

function removeOrder(index) {
  const tableBody = document.getElementById("priorityTable");
  removedOrder = Array.from(tableBody.children)[index];
  removedOrderIndex = index;
  tableBody.deleteRow(index);

  // Show undo button
  const undoContainer = document.getElementById("undoContainer");
  undoContainer.style.display = "block";

  // Set a timeout to remove the undo option after 10 seconds
  clearTimeout(undoTimeout);
  undoTimeout = setTimeout(() => {
    undoContainer.style.display = "none";
    removedOrder = null;
    removedOrderIndex = null;
  }, 400000);

  // Update priorities after removal
  updatePriorities();
}

document.getElementById("undoButton").addEventListener("click", function () {
  if (removedOrder && removedOrderIndex !== null) {
    const tableBody = document.getElementById("priorityTable");
    tableBody.insertBefore(removedOrder, tableBody.children[removedOrderIndex]);

    // Hide undo button
    const undoContainer = document.getElementById("undoContainer");
    undoContainer.style.display = "none";

    // Clear removed order data
    removedOrder = null;
    removedOrderIndex = null;

    // Clear the timeout
    clearTimeout(undoTimeout);

    // Update priorities after undo
    updatePriorities();
  }
});
