const BASE_URL = "https://construction-cost-app-1.onrender.com"; // 🔥 change if needed

function calculate() {
    let labour = Number(document.getElementById("labour").value);
    let material = Number(document.getElementById("material").value);
    let other = Number(document.getElementById("other").value);

    let total = labour + material + other;

    document.getElementById("total").innerText = total;
}

function saveData() {
    let siteName = document.getElementById("siteName").value;
    let total = Number(document.getElementById("total").innerText);

    fetch(`${BASE_URL}/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            siteName: siteName,
            totalCost: total
        })
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
                <button onclick="deleteData('${item._id}')">❌</button>
            `;

            list.appendChild(li);
        });
    });
    renderChart(data);
}

function deleteData(id) {
    fetch(`${BASE_URL}/delete/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        alert("Deleted ✅");
        loadData();
    });
}

let chart;

function renderChart(data) {
    const ctx = document.getElementById("chart").getContext("2d");

    const labels = data.map(d => d.siteName);
    const values = data.map(d => d.totalCost);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Project Cost (₹)",
                data: values
            }]
        }
    });
}

function downloadPDF() {
    const content = document.body.innerText;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "invoice.txt";
    link.click();
}
window.onload = loadData;