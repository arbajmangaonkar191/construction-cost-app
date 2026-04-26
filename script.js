const BASE_URL = "https://construction-cost-app-1.onrender.com";

function calculate() {
    let labour = Number(document.getElementById("labour").value);
    let material = Number(document.getElementById("material").value);
    let other = Number(document.getElementById("other").value);

    let total = labour + material + other;

    document.getElementById("total").innerText = total;
}

function saveData() {
    let data = {
        siteName: document.getElementById("siteName").value,
        labour: Number(document.getElementById("labour").value),
        material: Number(document.getElementById("material").value),
        other: Number(document.getElementById("other").value),
        totalCost: document.getElementById("total").innerText
    };

    fetch(`${BASE_URL}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => {
        alert("Saved ✅");
        loadData();
    });
}

function loadData() {
    fetch(`${BASE_URL}/sites`)
    .then(res => res.json())
    .then(data => {
        let list = document.getElementById("list");
        list.innerHTML = "";

        data.forEach(item => {
            let li = document.createElement("li");

            li.innerHTML = `
                ${item.siteName} - ₹${item.totalCost}
                <button class="delete" onclick="deleteData('${item._id}')">X</button>
            `;

            list.appendChild(li);
        });
    });
}

function deleteData(id) {
    fetch(`${BASE_URL}/delete/${id}`, {
        method: "DELETE"
    })
    .then(() => loadData());
}

function downloadExcel() {
    window.open(`${BASE_URL}/download`);
}

window.onload = loadData;