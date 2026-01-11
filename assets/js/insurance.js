
function saveInsurance(){
    let pid = document.getElementById("pid").value;
    let company = document.getElementById("company").value;
    let policy = document.getElementById("policy").value;
    let validity = document.getElementById("validity").value;

    if(pid=="" || company=="" || policy=="" || validity==""){
        alert("Please fill all fields");
        return;
    }

    let record = { pid, company, policy, validity };

    let data = JSON.parse(localStorage.getItem("insurance")) || [];
    data.push(record);
    localStorage.setItem("insurance", JSON.stringify(data));

    loadData();
    clearForm();
}

function loadData(){
    let data = JSON.parse(localStorage.getItem("insurance")) || [];
    let table = "";

    data.forEach((item, index)=>{
        table += `
        <tr>
            <td>${item.pid}</td>
            <td>${item.company}</td>
            <td>${item.policy}</td>
            <td>${item.validity}</td>
            <td><button class="del" onclick="delData(${index})">X</button></td>
        </tr>`;
    });

    document.getElementById("insData").innerHTML = table;
}

function delData(i){
    let data = JSON.parse(localStorage.getItem("insurance")) || [];
    data.splice(i,1);
    localStorage.setItem("insurance", JSON.stringify(data));
    loadData();
}

function clearForm(){
    document.getElementById("pid").value="";
    document.getElementById("company").value="";
    document.getElementById("policy").value="";
    document.getElementById("validity").value="";
}

loadData();
