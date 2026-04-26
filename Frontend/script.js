function calculate() {
    let labour = Number(document.getElementById("labour").value);
    let material = Number(document.getElementById("material").value);
    let other = Number(document.getElementById("other").value);

    let total = labour + material + other;

    document.getElementById("total").innerText = total;
}

function saveData() {
    let siteName = document.getElementById("siteName").value;
    let total = document.getElementById("total").innerText;

    fetch("http://localhost:5000/save", {
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
    .then(data => {
        alert("Data Saved ✅");
        loadData(); // refresh list
    });
}

function loadData() {
    fetch("http://localhost:5000/sites")
    .then(res => res.json())
    .then(data => {
        let list = document.getElementById("list");
        list.innerHTML = "";

        data.forEach((item, index) => {
            let li = document.createElement("li");

            li.innerHTML = `
                ${item.siteName} - ₹${item.totalCost}
                <button onclick="deleteData('${item._id}')">❌</button>
            `;

            li.style.animationDelay = index * 0.2 + "s";

            list.appendChild(li);
        });
    });
}


function deleteData(id) {
    if (confirm("Delete this project?")) {
        fetch(`http://localhost:5000/delete/${id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            alert("Deleted ✅");
            loadData();
        });
    }
}



// page load pe data load
window.onload = loadData;