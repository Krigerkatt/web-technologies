const todoList = document.getElementById("todoList");
const doingList = document.getElementById("doingList");
const doneList = document.getElementById("doneList");

const addTodoBtn = document.getElementById("addTodoBtn");
const addDoingBtn = document.getElementById("addDoingBtn");
const addDoneBtn = document.getElementById("addDoneBtn");

const delTodoBtn = document.getElementById("delTodoBtn");
const delDoingBtn = document.getElementById("delDoingBtn");
const delDoneBtn = document.getElementById("delDoneBtn");

function createTask(text, listType) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = text;

  const btnContainer = document.createElement("div");
  btnContainer.className = "task-buttons";

  const leftBtn = document.createElement("button");
  leftBtn.textContent = "←";
  leftBtn.className = "task-btn";

  const editBtn = document.createElement("button");
  editBtn.textContent = "✎";
  editBtn.className = "task-btn";

  const rightBtn = document.createElement("button");
  rightBtn.textContent = "→";
  rightBtn.className = "task-btn";

  btnContainer.append(leftBtn, editBtn, rightBtn);
  li.append(span, btnContainer);

  editBtn.addEventListener("click", () => {
    const newText = prompt("Измените текст задачи:", span.textContent);
    if (newText) span.textContent = newText;
  });

  leftBtn.addEventListener("click", () => {
    if (listType === "doing") {
      todoList.appendChild(li);
      listType = "todo";
    } else if (listType === "done") {
      doingList.appendChild(li);
      listType = "doing";
    }
  });

  rightBtn.addEventListener("click", () => {
    if (listType === "todo") {
      doingList.appendChild(li);
      listType = "doing";
    } else if (listType === "doing") {
      doneList.appendChild(li);
      listType = "done";
    }
  });

  return li;
}

function addTask(listElement, listType) {
  const text = prompt("Введите текст задачи:");
  if (!text) return;
  const task = createTask(text, listType);
  listElement.appendChild(task);
}

function clearTasks(listElement) {
  if (listElement.children.length === 0) {
    alert("Нет задач для удаления!");
    return;
  }
  const confirmDelete = confirm("Удалить все задачи в этой колонке?");
  if (confirmDelete) listElement.innerHTML = "";
}

addTodoBtn.addEventListener("click", () => addTask(todoList, "todo"));
addDoingBtn.addEventListener("click", () => addTask(doingList, "doing"));
addDoneBtn.addEventListener("click", () => addTask(doneList, "done"));

delTodoBtn.addEventListener("click", () => clearTasks(todoList));
delDoingBtn.addEventListener("click", () => clearTasks(doingList));
delDoneBtn.addEventListener("click", () => clearTasks(doneList));