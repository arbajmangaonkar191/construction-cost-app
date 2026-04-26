function calculate() {
    let labour = Number(document.getElementById("labour").value);
    let material = Number(document.getElementById("material").value);
    let other = Number(document.getElementById("other").value);

   let total = Number(document.getElementById("total").innerText.replace(/[^\d]/g, ""));

   document.getElementById("total").innerText = "₹ " + total;
}

function saveData() {
    let siteName = document.getElementById("siteName").value;
    let total = document.getElementById("total").innerText;

   fetch("https://construction-cost-app-1.onrender.com/save", {
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
    alert("Saved ✅");
    loadData();
});

if (!siteName || total === 0) {
    alert("Please enter valid data ❌");
    return;
}
}

function loadData() {
    fetch("https://construction-cost-app-1.onrender.com/sites")
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
        fetch(`https://construction-cost-app-1.onrender.com/delete/${id}`, {
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