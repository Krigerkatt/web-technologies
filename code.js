const modalElement = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const taskTextarea = document.getElementById("taskTextarea");
const priorityContainer = document.getElementById("priorityContainer");
const prioritySelect = document.getElementById("prioritySelect");
const confirmModalBtn = document.getElementById("confirmModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");

const todoList = document.getElementById("todoList");
const doingList = document.getElementById("doingList");
const doneList = document.getElementById("doneList");

const todoTitle = document.getElementById("todoTitle");
const doingTitle = document.getElementById("doingTitle");
const doneTitle = document.getElementById("doneTitle");

const addTodoBtn = document.getElementById("addTodoBtn");
const addDoingBtn = document.getElementById("addDoingBtn");
const addDoneBtn = document.getElementById("addDoneBtn");

const delTodoBtn = document.getElementById("delTodoBtn");
const delDoingBtn = document.getElementById("delDoingBtn");
const delDoneBtn = document.getElementById("delDoneBtn");

const sortTimeBtn = document.getElementById("sortTimeBtn");
const sortPriorityBtn = document.getElementById("sortPriorityBtn");

let editTaskElement = null;
let editTaskLi = null;

const prioOrder = { high: 0, medium: 1, low: 2 };

function getCurrentListType(li) {
  if (todoList.contains(li)) return "todo";
  if (doingList.contains(li)) return "doing";
  if (doneList.contains(li)) return "done";
  return null;
}

function getListByType(type) {
  if (type === "todo") return todoList;
  if (type === "doing") return doingList;
  if (type === "done") return doneList;
}

function updateCounts() {
  todoTitle.textContent = `Не выполнены (${todoList.children.length})`;
  doingTitle.textContent = `В процессе (${doingList.children.length})`;
  doneTitle.textContent = `Выполнены (${doneList.children.length})`;
}

function createTask(text, initialListType, priority) {
  const li = document.createElement("li");
  li.dataset.priority = priority;
  li.dataset.time = Date.now();
  li.classList.add(priority);

  const span = document.createElement("span");
  span.className = "task-text";
  span.innerHTML = text.replace(/\n/g, "<br>");

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

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "×";
  deleteBtn.className = "task-btn";

  btnContainer.append(leftBtn, editBtn, rightBtn, deleteBtn);
  li.append(span, btnContainer);

  editBtn.addEventListener("click", () => {
    editTaskElement = span;
    editTaskLi = li;
    openEditModal(
      span.textContent.replace(/<br>/g, "\n"),
      li.dataset.priority
    );
  });

  leftBtn.addEventListener("click", () => {
    const currentType = getCurrentListType(li);
    if (currentType === "doing") {
      todoList.appendChild(li);
    } else if (currentType === "done") {
      doingList.appendChild(li);
    }
    updateCounts();
  });

  rightBtn.addEventListener("click", () => {
    const currentType = getCurrentListType(li);
    if (currentType === "todo") {
      doingList.appendChild(li);
    } else if (currentType === "doing") {
      doneList.appendChild(li);
    }
    updateCounts();
  });

  deleteBtn.addEventListener("click", () => {
    li.remove();
    updateCounts();
  });

  getListByType(initialListType).appendChild(li);
  return li;
}

function openAddModal(type) {
  currentListType = type;
  editTaskElement = null;
  editTaskLi = null;
  modalTitle.textContent = "Напишите задачу:";
  priorityContainer.style.display = "block";
  taskTextarea.value = "";
  prioritySelect.value = "medium";
  confirmModalBtn.textContent = "Добавить";
  modalElement.showModal();
}

function openEditModal(currentText, currentPriority) {
  modalTitle.textContent = "Редактировать задачу:";
  priorityContainer.style.display = "block";
  taskTextarea.value = currentText;
  prioritySelect.value = currentPriority;
  confirmModalBtn.textContent = "Сохранить";
  modalElement.showModal();
}

function clearTasks(listElement) {
  if (listElement.children.length === 0) {
    alert("Нет задач для удаления!");
    return;
  }
  if (confirm("Удалить все задачи в этой колонке?")) {
    listElement.innerHTML = "";
    updateCounts();
  }
}

function sortLists(by) {
  const lists = [todoList, doingList, doneList];
  lists.forEach(list => {
    const items = Array.from(list.children);
    if (by === "time") {
      items.sort((a, b) => +a.dataset.time - +b.dataset.time);
    } else if (by === "priority") {
      items.sort((a, b) => prioOrder[a.dataset.priority] - prioOrder[b.dataset.priority]);
    }
    items.forEach(item => list.appendChild(item));
  });
}

addTodoBtn.addEventListener("click", () => openAddModal("todo"));
addDoingBtn.addEventListener("click", () => openAddModal("doing"));
addDoneBtn.addEventListener("click", () => openAddModal("done"));

delTodoBtn.addEventListener("click", () => clearTasks(todoList));
delDoingBtn.addEventListener("click", () => clearTasks(doingList));
delDoneBtn.addEventListener("click", () => clearTasks(doneList));

sortTimeBtn.addEventListener("click", () => sortLists("time"));
sortPriorityBtn.addEventListener("click", () => sortLists("priority"));

confirmModalBtn.addEventListener("click", () => {
  const text = taskTextarea.value.trim();
  if (!text) return;

  if (editTaskElement && editTaskLi) {
    editTaskElement.innerHTML = text.replace(/\n/g, "<br>");
    const newPriority = prioritySelect.value;
    editTaskLi.dataset.priority = newPriority;
    editTaskLi.classList.remove("high", "medium", "low");
    editTaskLi.classList.add(newPriority);
    
  } else {
    const priority = prioritySelect.value;
    createTask(text, currentListType, priority);
    updateCounts();
  }

  modalElement.close();
  taskTextarea.value = "";
  editTaskElement = null;
  editTaskLi = null;
});

cancelModalBtn.addEventListener("click", () => {
  modalElement.close();
  taskTextarea.value = "";
  editTaskElement = null;
  editTaskLi = null;
});

updateCounts();