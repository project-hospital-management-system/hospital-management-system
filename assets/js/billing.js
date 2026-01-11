
let services = [];
let subtotal = 0;
let discount = 0;

function addService(){
    let service = document.getElementById("service").value;
    let cost = parseFloat(document.getElementById("cost").value);

    if(service=="" || cost=="" || cost<=0){
        alert("Please enter valid service and cost");
        return;
    }

    services.push({ service, cost });
    subtotal += cost;

    checkInsurance();

    updateBill();

    document.getElementById("service").value="";
    document.getElementById("cost").value="";
}

function checkInsurance(){
    let pid = document.getElementById("pid").value;
    let ins = JSON.parse(localStorage.getItem("insurance")) || [];

    let found = ins.find(x => x.pid === pid);

    if(found){
        discount = subtotal * 0.20; // 20% discount
    } else {
        discount = 0;
    }
}

function updateBill(){
    document.getElementById("subtotal").innerText = subtotal;
    document.getElementById("discount").innerText = discount;
    document.getElementById("total").innerText = subtotal - discount;
}

function saveInvoice(){
    let pid = document.getElementById("pid").value;

    if(pid=="" || subtotal==0){
        alert("Enter patient ID and services before saving.");
        return;
    }

    let total = subtotal - discount;

    let record = {
        pid,
        services,
        total
    };

    let data = JSON.parse(localStorage.getItem("billing")) || [];
    data.push(record);
    localStorage.setItem("billing", JSON.stringify(data));

    resetBilling();
    loadData();
}

function resetBilling(){
    services = [];
    subtotal = 0;
    discount = 0;
    updateBill();
    document.getElementById("pid").value="";
}

function loadData(){
    let data = JSON.parse(localStorage.getItem("billing")) || [];
    let table = "";

    data.forEach((item, index)=>{
        let list = item.services.map(s => s.service + " (৳" + s.cost + ")").join("<br>");

        table += `
        <tr>
            <td>${item.pid}</td>
            <td>${list}</td>
            <td>৳ ${item.total}</td>
            <td><button class="del" onclick="deleteBill(${index})">X</button></td>
        </tr>`;
    });

    document.getElementById("billData").innerHTML = table;
}

function deleteBill(i){
    let data = JSON.parse(localStorage.getItem("billing")) || [];
    data.splice(i,1);
    localStorage.setItem("billing", JSON.stringify(data));
    loadData();
}

loadData();
