async function save(){
    const data = {
        siteName: document.getElementById("name").value,
        location: document.getElementById("location").value,
        expenses: []
    };

    await fetch("http://localhost:5000/add-site", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    alert("Saved");
}

function downloadExcel(){
    window.location = "http://localhost:5000/download";
}