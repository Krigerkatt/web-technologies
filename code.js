const todoList = document.getElementById("todoList");
const doingList = document.getElementById("doingList");
const doneList = document.getElementById("doneList");

const addTodoBtn = document.getElementById("addTodoBtn");
const addDoingBtn = document.getElementById("addDoingBtn");
const addDoneBtn = document.getElementById("addDoneBtn");

function addTask(listElement, taskText) {
  const li = document.createElement("li");
  li.textContent = taskText;
  listElement.appendChild(li);
}

addTodoBtn.addEventListener("click", () => {
  const text = prompt("Введите задачу (Не выполнена):");
  if (text) addTask(todoList, text);
});

addDoingBtn.addEventListener("click", () => {
  const text = prompt("Введите задачу (В процессе):");
  if (text) addTask(doingList, text);
});

addDoneBtn.addEventListener("click", () => {
  const text = prompt("Введите задачу (Выполнена):");
  if (text) addTask(doneList, text);
});