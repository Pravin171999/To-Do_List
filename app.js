// Input
let todoInput = document.querySelector("input");
// Add Button
let addButton = document.getElementById("addButton");
// Update Button
let update = document.getElementById("update");
// Show Task
let showTask = document.getElementById("showTask");
// console.log(addButton);
// Search
let searchTask = document.getElementById("searchTask");
// Dropdown
let dropdown = document.getElementById("dropdown");

let taskArray = [];
update.style.display = "none";
// For id Generation
function uuid() {
  // Get the current time in milliseconds since the Unix epoch.
  var dt = new Date().getTime();
  // Replace the placeholders in the UUID template with random hexadecimal characters.
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      // Generate a random hexadecimal digit.
      var r = (dt + Math.random() * 16) % 16 | 0;
      // Update dt to simulate passage of time for the next random character.
      dt = Math.floor(dt / 16);
      // Replace 'x' with a random digit and 'y' with a specific digit (4 for UUID version 4).
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  // Return the generated UUID.
  return uuid;
}
function getTask() {
  if (localStorage.getItem("task"))
    return JSON.parse(localStorage.getItem("task"));
  return [];
}
let initialTasksData = getTask();

if (initialTasksData.length > 0) {
  taskArray = initialTasksData;
  showTaskData(initialTasksData);
  sortTasks(initialTasksData);
  searchTasks(taskArray);
}
// For Create
function handleCreate() {
  let task = {
    id: uuid(),
    taskName: todoInput.value,
    completed: false,
  };
  if (todoInput.value === "") {
    alert("Enter Value");
  } else {
    taskArray.push(task);
  }
  localStorage.setItem("task", JSON.stringify(taskArray));
  todoInput.value = "";
  showTaskData(taskArray);
  sortTasks(taskArray);

  searchTasks(taskArray);
}
addButton.addEventListener("click", handleCreate);

// Edit Handle;
function editHandle(icon) {
  let editId = icon.getAttribute("data-id");
  // console.log(editId);
  localStorage.setItem("id", editId);
  let localDataArray = JSON.parse(localStorage.getItem("task"));
  // console.log(localDataArray);

  let localTaskObj = localDataArray.find((task) => task.id === editId);
  // console.log(localTaskObj);
  todoInput.value = localTaskObj.taskName;
  addButton.style.display = "none";
  update.style.display = "block";
}
//Update
function handleUpdate() {
  let updateId = localStorage.getItem("id");
  let localDataArray = getTask();
  let localTaskObj = localDataArray.find((task) => task.id === updateId);
  if (localTaskObj) {
    localTaskObj.taskName = todoInput.value;
  }

  localStorage.setItem("task", JSON.stringify(localDataArray));

  showTaskData(localDataArray);
  sortTasks(allTodoTasks);

  searchTasks(allTodoTasks);
  addButton.style.display = "block";
  update.style.display = "none";
}
update.addEventListener("click", handleUpdate);
// Delete
function deleteHandle(icon) {
  let deleteId = icon.getAttribute("data-id");
  let localDataArray = getTask();
  let newLocalDataArray = localDataArray.filter((task) => task.id !== deleteId);
  //  console.log(newLocalDataArray);
  localStorage.setItem("task", JSON.stringify(newLocalDataArray));
  showTaskData(newLocalDataArray);
  sortTasks(allTodoTasks);

  searchTasks(allTodoTasks);
}
//CheckBox
function checkhandle(inputTag) {
  let taskDataFromLocal = JSON.parse(localStorage.getItem("task"));

  let statusId = inputTag.getAttribute("data-id");

  let getParticularTask = taskDataFromLocal.find(
    (item) => item.id === statusId
  );

  if (inputTag.checked) {
    getParticularTask.completed = true;
  } else {
    getParticularTask.completed = false;
  }

  localStorage.setItem("task", JSON.stringify(taskDataFromLocal));

  showTaskData(taskDataFromLocal);
  sortTasks(taskDataFromLocal);

  searchTasks(taskDataFromLocal);
}
// Sort
function sortTasks(task) {
  let complete = task.filter((e) => e.completed === true);

  let incompletedData = task.filter((e) => e.completed === false);

  let dropdown = document.getElementById("dropdown");

  dropdown.addEventListener("change", (e) => {
    let options = e.target.value;
    console.log(options);
    if (options === "allTasks") {
      showTaskData(task);
    } else if (options === "pendingTasks") {
      showTaskData(incompletedData);
    } else if (options === "complete") {
      showTaskData(complete);
    }
  });
}

//Search

function searchTasks(task) {
  let searchInput = document.getElementById("searchTask");
  
  searchInput.addEventListener("input", (e) => {
    let searchValue = e.target.value.trim();
    console.log(searchValue);

    let matchedData = task.filter((e) => e.taskName.toLowerCase().includes(searchValue.toLowerCase()));

    if (searchValue.length > 0) {
      showTaskData(matchedData);
    } else {
      showTaskData(task);
    }
  });
}

// Show Table
function showTaskData(data) {
  let result = "";
  data.map((task) => {
    result += `
      <div class="notes">
            <div class="noteHead">
              <input onchange="checkhandle(this)" data-id = ${
                task.id
              } type="checkbox" class="checkbox" ${
      task.completed ? "checked" : ""
    }>
              <span id="status" data-id=${task.id} style="${
      task.completed ? "color: green" : "color: red"
    }" >${task.completed ? "Completed" : "Pending"}</span>
              <div class="icons">
                <i onclick="editHandle(this)" data-id = ${
                  task.id
                } class="fa fa-edit"></i>
                <i class="fa fa-trash" style="color:red" onclick ="deleteHandle(this)" data-id=${
                  task.id
                }></i>
              </div>
            </div>
            <div class="noteBody">
              <h1><span id = "taskId" style="${
                task.completed ? "text-decoration: line-through" : ""
              }" > ${task.taskName}</span></h1>
            </div>
          </div>`;
  });
  showTask.innerHTML = result;
}
