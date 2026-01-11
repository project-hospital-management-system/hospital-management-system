
let users = JSON.parse(localStorage.getItem("users")) || [];

// Save user
function saveUser(){
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;
    let r = document.getElementById("role").value;

    if(u === "" || p === ""){
        alert("Username & Password required");
        return;
    }

    users.push({username:u, password:p, role:r});
    localStorage.setItem("users", JSON.stringify(users));

    alert("User Added Successfully");
    loadUsers();
}

// Show users in table
function loadUsers(){
    let table = document.getElementById("userTable");
    table.innerHTML = `
        <tr>
            <th>Username</th>
            <th>Role</th>
        </tr>
    `;

    users.forEach(u=>{
        table.innerHTML += `
            <tr>
                <td>${u.username}</td>
                <td><span class="role-badge">${u.role.toUpperCase()}</span></td>
            </tr>
        `;
    });
}

loadUsers();
