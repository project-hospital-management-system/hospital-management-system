
function saveStaff(){
    let name = document.getElementById("name").value;
    let role = document.getElementById("role").value;
    let phone = document.getElementById("phone").value;
    let shift = document.getElementById("shift").value;

    if(name=="" || role=="" || phone==""){
        alert("Please fill all fields");
        return;
    }

    let staff = { name, role, phone, shift };

    let data = JSON.parse(localStorage.getItem("staffList")) || [];
    data.push(staff);
    localStorage.setItem("staffList", JSON.stringify(data));

    loadData();
    clearForm();
}

function loadData(){
    let data = JSON.parse(localStorage.getItem("staffList")) || [];
    let table = "";

    data.forEach((item, index)=>{
        table += `
        <tr>
            <td>${item.name}</td>
            <td>${item.role}</td>
            <td>${item.phone}</td>
            <td>${item.shift}</td>
            <td><button class="del" onclick="delStaff(${index})">X</button></td>
        </tr>`;
    });

    document.getElementById("staffData").innerHTML = table;
}

function delStaff(i){
    let data = JSON.parse(localStorage.getItem("staffList")) || [];
    data.splice(i,1);
    localStorage.setItem("staffList", JSON.stringify(data));
    loadData();
}

function clearForm(){
    document.getElementById("name").value="";
    document.getElementById("role").value="";
    document.getElementById("phone").value="";
}

loadData();
