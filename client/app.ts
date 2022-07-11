import { User, Role } from './models/User.js';
import { userService } from './UserServices/UserService.js';



function dateTimeDC(target: any, propertyKey: string) {
  Reflect.defineProperty(target, propertyKey, {
    get: () => {
      return new Date().toLocaleString();
    }
  });
}

class App {
  loadBtn: HTMLButtonElement;
  refreshBtn: HTMLButtonElement;
  hostElement: HTMLElement;
  @dateTimeDC
  date: string;
  constructor() {
    this.loadBtn = document.getElementById("load-btn")! as HTMLButtonElement;
    this.refreshBtn = document.getElementById("refresh-btn")! as HTMLButtonElement;
    this.hostElement = document.getElementById("table-container")!;
    this.init();
  }

  async init() {
    this.loadBtn.addEventListener("click", this.loadUsers.bind(this));
    this.refreshBtn.addEventListener("click", this.refreshUsers.bind(this));
    this.refreshBtn.style.display = "none";
  }

  hookEvents() {
    const editBtns = document.getElementsByClassName("btn-primary");
    const saveBtns = document.getElementsByClassName("btn-success");
    const cancelBtns = document.getElementsByClassName("btn-warning");
    const deleteBtns = document.getElementsByClassName("btn-danger");
    const addUserBtn = document.getElementById("add-user")! as HTMLButtonElement;
    for (let i = 0; i < editBtns.length; i++) {
      editBtns[i].addEventListener("click", this.editUser.bind(this));
    }
    for (let i = 0; i < saveBtns.length; i++) {
      saveBtns[i].addEventListener("click", this.saveUser.bind(this));
      let saveBtn = saveBtns[i] as HTMLButtonElement;
      saveBtn.style.display = "none";
    }
    for (let i = 0; i < cancelBtns.length; i++) {
      cancelBtns[i].addEventListener("click", this.cancelUser.bind(this));
      let cancelBtn = cancelBtns[i] as HTMLButtonElement;
      cancelBtn.style.display = "none";
    }
    for (let i = 0; i < deleteBtns.length; i++) {
      deleteBtns[i].addEventListener("click", this.deleteUser.bind(this));
    }
    addUserBtn.addEventListener("click", this.addUser.bind(this));
  }

  async loadUsers() {
    this.loadBtn.style.display = "none";
    this.refreshBtn.style.display = "block";
    const users = await userService.find();
    this.hostElement.innerHTML = this.render();
    this.renderTable(users);
    document.getElementsByTagName("footer")[0].innerHTML = `Date: ${this.date}`;
  }

  render() {
    return `
    <div class="container">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Middle Name</th> 
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Address</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody id="users-table">
            </tbody>
          </table>
          <button id="add-user">Add New User</button>
    </div>
    `;
  }

  renderTable(users: User[]) {
    const usersTable = document.getElementById("users-table")!;
    usersTable.innerHTML = "";
    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${user.firstname}</td>
      <td>${user.middlename}</td>
      <td>${user.lastname}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>
        <select class="form-control" id="role-select" disabled>
          <option value="${Role.SUPERADMIN}" ${user.role === Role.SUPERADMIN ? "selected" : ""}>SuperAdmin</option>
          <option value="${Role.ADMIN}" ${user.role === Role.ADMIN ? "selected" : ""}>Admin</option>
          <option value="${Role.SUBSCRIBER}" ${user.role === Role.SUBSCRIBER ? "selected" : ""}>Subscriber</option>
        </select>
      </td>
      <td>${user.address}</td>
      <td>
        <button class="btn btn-primary">Edit</button>
        <button class="btn btn-danger">Delete</button>
        <button class="btn btn-success">Save</button>
        <button class="btn btn-warning">Cancel</button>
      </td>
      `;
      usersTable.appendChild(row);
    });
    this.hookEvents();
  }

  editUser(event: Event) {
    const editBtn = event.target as HTMLButtonElement;
    const row = editBtn.parentElement.parentElement;
    row.contentEditable = "true";
    editBtn.parentElement.contentEditable = "false";
    const select = row.getElementsByTagName("select")[0] as HTMLSelectElement;
    select.removeAttribute("disabled");
    editBtn.style.display = "none";
    const saveBtn = row.getElementsByClassName("btn-success")[0] as HTMLButtonElement;
    const cancelBtn = row.getElementsByClassName("btn-warning")[0] as HTMLButtonElement;
    const deleteBtn = row.getElementsByClassName("btn-danger")[0] as HTMLButtonElement;
    deleteBtn.style.display = "none";
    saveBtn.style.display = "block";
    cancelBtn.style.display = "block";
  }

  async saveUser(event: Event) {
    const saveBtn = event.target as HTMLButtonElement;
    const row = saveBtn.parentElement.parentElement;
    const select = row.getElementsByTagName("select")[0] as HTMLSelectElement;
    const role = select.value;
    const user: User = {
      id: -1,
      firstname: row.getElementsByTagName("td")[0].innerText,
      middlename: row.getElementsByTagName("td")[1].innerText,
      lastname: row.getElementsByTagName("td")[2].innerText,
      email: row.getElementsByTagName("td")[3].innerText,
      phone: row.getElementsByTagName("td")[4].innerText,
      role: role as Role,
      address: row.getElementsByTagName("td")[6].innerText
    };
    row.contentEditable = "false";
    await userService.update(user);
    saveBtn.style.display = "none";
    const editBtn = row.getElementsByClassName("btn-primary")[0] as HTMLButtonElement;
    const deleteBtn = row.getElementsByClassName("btn-danger")[0] as HTMLButtonElement;
    const cancelBtn = row.getElementsByClassName("btn-warning")[0] as HTMLButtonElement;
    editBtn.style.display = "block";
    deleteBtn.style.display = "block";
    cancelBtn.style.display = "none";
  }

  cancelUser(event: Event) {
    const cancelBtn = event.target as HTMLButtonElement;
    const row = cancelBtn.parentElement.parentElement;
    row.contentEditable = "false";
    const select = row.getElementsByTagName("select")[0] as HTMLSelectElement;
    select.setAttribute("disabled", "true");
    const editBtn = row.getElementsByClassName("btn-primary")[0] as HTMLButtonElement;
    const saveBtn = row.getElementsByClassName("btn-success")[0] as HTMLButtonElement;
    const deleteBtn = row.getElementsByClassName("btn-danger")[0] as HTMLButtonElement;
    editBtn.style.display = "block";
    saveBtn.style.display = "none";
    deleteBtn.style.display = "block";
    cancelBtn.style.display = "none";
  }

  async deleteUser(event: Event) {
    const deleteBtn = event.target as HTMLButtonElement;
    const row = deleteBtn.parentElement.parentElement;
    const select = row.getElementsByTagName("select")[0] as HTMLSelectElement;
    const role = select.value;
    const user: User = {
      id: null,
      firstname: row.getElementsByTagName("td")[0].innerText,
      middlename: row.getElementsByTagName("td")[1].innerText,
      lastname: row.getElementsByTagName("td")[2].innerText,
      email: row.getElementsByTagName("td")[3].innerText,
      phone: row.getElementsByTagName("td")[4].innerText,
      role: role as Role,
      address: row.getElementsByTagName("td")[6].innerText
    };
    await userService.delete(user);
    this.refreshUsers();
  }

  async addUser() {
    const trElement = document.createElement("tr");
    trElement.innerHTML = `
    <td><input type="text" class="form-control" id="first-name-input" placeholder="First Name"></td>
    <td><input type="text" class="form-control" id="middle-name-input" placeholder="Middle Name"></td>
    <td><input type="text" class="form-control" id="last-name-input" placeholder="Last Name"></td>
    <td><input type="text" class="form-control" id="email-input" placeholder="Email"></td>
    <td><input type="text" class="form-control" id="phone-input" placeholder="Phone"></td>
    <td>
      <select class="form-control" id="role-select">
        <option value="${Role.SUPERADMIN}">SuperAdmin</option>
        <option value="${Role.ADMIN}">Admin</option>
        <option value="${Role.SUBSCRIBER}" selected>Subscriber</option>
      </select>
    </td>
    <td><input type="text" class="form-control" id="address-input" placeholder="Address"></td>
    <td>
      <button class="btn btn-add-user">Save</button>
      <button class="btn btn-danger">Cancel</button>
    </td>
    `;
    const usersTable = document.getElementById("users-table") as HTMLTableElement;
    usersTable.appendChild(trElement);
    this.hookEvents();
    const saveBtn = trElement.getElementsByClassName("btn-add-user")[0] as HTMLButtonElement;
    saveBtn.addEventListener("click", this.createUser.bind(this));
  }

  async createUser() {
    const firstName = document.getElementById("first-name-input") as HTMLInputElement;
    const middleName = document.getElementById("middle-name-input") as HTMLInputElement;
    const lastName = document.getElementById("last-name-input") as HTMLInputElement;
    const email = document.getElementById("email-input") as HTMLInputElement;
    const phone = document.getElementById("phone-input") as HTMLInputElement;
    const role = document.getElementById("role-select") as HTMLSelectElement;
    const address = document.getElementById("address-input") as HTMLInputElement;
    const user: User = {
      id: null,
      firstname: firstName.value,
      middlename: middleName.value,
      lastname: lastName.value,
      email: email.value,
      phone: phone.value,
      role: role.value as Role,
      address: address.value
    };

    await userService.save(user);
    this.refreshUsers();
  }

  async refreshUsers() {
    const users = await userService.find();
    this.hostElement.innerHTML = "";
    setTimeout(() => {
      this.hostElement.innerHTML = this.render();
      this.renderTable(users);
    }, 100);
    document.getElementsByTagName("footer")[0].innerHTML = `Date: ${this.date}`;
  }
}

new App();