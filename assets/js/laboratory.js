
function saveTest(){
    let pid = document.getElementById("pid").value;
    let test = document.getElementById("testType").value;
    let result = document.getElementById("result").value;
    let date = document.getElementById("date").value;

    if(pid=="" || result=="" || date==""){
        alert("Please fill all fields");
        return;
    }

    let record = { pid, test, result, date };

    let data = JSON.parse(localStorage.getItem("labReports")) || [];
    data.push(record);
    localStorage.setItem("labReports", JSON.stringify(data));

    loadData();
    clearForm();
}

function loadData(){
    let data = JSON.parse(localStorage.getItem("labReports")) || [];
    let table = "";

    data.forEach((item, index)=>{
        table += `
        <tr>
            <td>${item.pid}</td>
            <td>${item.test}</td>
            <td>${item.result}</td>
            <td>${item.date}</td>
            <td><button class="del" onclick="delData(${index})">X</button></td>
        </tr>`;
    });

    document.getElementById("labData").innerHTML = table;
}

function delData(i){
    let data = JSON.parse(localStorage.getItem("labReports")) || [];
    data.splice(i,1);
    localStorage.setItem("labReports", JSON.stringify(data));
    loadData();
}

function clearForm(){
    document.getElementById("pid").value="";
    document.getElementById("result").value="";
    document.getElementById("date").value="";
}

loadData();
