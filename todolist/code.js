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

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentListType = null;
let editTaskId = null;

const prioOrder = { high: 0, medium: 1, low: 2 };

const updateLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const getListByType = (type) => {
  if (type === "todo") return todoList;
  if (type === "doing") return doingList;
  if (type === "done") return doneList;
};

const updateCounts = () => {
  todoTitle.textContent = `Не выполнены (${tasks.filter(t => t.type === 'todo').length})`;
  doingTitle.textContent = `В процессе (${tasks.filter(t => t.type === 'doing').length})`;
  doneTitle.textContent = `Выполнены (${tasks.filter(t => t.type === 'done').length})`;
};

const createTaskElement = (task) => {
  const li = document.createElement("li");
  li.dataset.priority = task.priority;
  li.dataset.time = task.time;
  li.dataset.id = task.id;
  li.classList.add(task.priority);
  li.draggable = true;

  const span = document.createElement("span");
  span.className = "task-text";
  span.innerHTML = task.name.replace(/\n/g, "<br>");

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

  leftBtn.addEventListener("click", () => {
    let newType;
    if (task.type === "doing") newType = "todo";
    else if (task.type === "done") newType = "doing";
    if (newType) {
      task.type = newType;
      updateLocalStorage();
      renderTasks();
    }
  });

  rightBtn.addEventListener("click", () => {
    let newType;
    if (task.type === "todo") newType = "doing";
    else if (task.type === "doing") newType = "done";
    if (newType) {
      task.type = newType;
      updateLocalStorage();
      renderTasks();
    }
  });

  editBtn.addEventListener("click", () => {
    openEditModal(task.name, task.priority, task.id);
  });

  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => t.id !== task.id);
    updateLocalStorage();
    renderTasks();
  });

  li.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", task.id.toString());
  });

  return li;
};

const renderTasks = () => {
  todoList.innerHTML = "";
  doingList.innerHTML = "";
  doneList.innerHTML = "";

  tasks.forEach((task) => {
    const li = createTaskElement(task);
    getListByType(task.type).appendChild(li);
  });

  updateCounts();
};

const openAddModal = (type) => {
  currentListType = type;
  editTaskId = null;
  modalTitle.textContent = "Напишите задачу:";
  priorityContainer.style.display = "block";
  taskTextarea.value = "";
  prioritySelect.value = "medium";
  confirmModalBtn.textContent = "Добавить";
  modalElement.showModal();
};

const openEditModal = (currentText, currentPriority, id) => {
  editTaskId = id;
  modalTitle.textContent = "Редактировать задачу:";
  priorityContainer.style.display = "block";
  taskTextarea.value = currentText;
  prioritySelect.value = currentPriority;
  confirmModalBtn.textContent = "Сохранить";
  modalElement.showModal();
};

const clearTasks = (listType) => {
  if (tasks.filter(t => t.type === listType).length === 0) {
    alert("Нет задач для удаления!");
    return;
  }
  if (confirm("Удалить все задачи в этой колонке?")) {
    tasks = tasks.filter(t => t.type !== listType);
    updateLocalStorage();
    renderTasks();
  }
};

const sortLists = (by) => {
  const sorter = by === "time"
    ? (a, b) => a.time - b.time
    : (a, b) => prioOrder[a.priority] - prioOrder[b.priority];

  const todoTasks = tasks.filter(t => t.type === "todo").sort(sorter);
  const doingTasks = tasks.filter(t => t.type === "doing").sort(sorter);
  const doneTasks = tasks.filter(t => t.type === "done").sort(sorter);

  tasks = [...todoTasks, ...doingTasks, ...doneTasks];
  renderTasks();
};

const dragover = (e) => {
  e.preventDefault();
};

const drop = (e, type) => {
  e.preventDefault();
  const id = parseInt(e.dataTransfer.getData("text/plain"));
  const task = tasks.find(t => t.id === id);
  if (task && task.type !== type) {
    task.type = type;
    updateLocalStorage();
    renderTasks();
  }
};

todoList.addEventListener("dragover", dragover);
todoList.addEventListener("drop", (e) => drop(e, "todo"));
doingList.addEventListener("dragover", dragover);
doingList.addEventListener("drop", (e) => drop(e, "doing"));
doneList.addEventListener("dragover", dragover);
doneList.addEventListener("drop", (e) => drop(e, "done"));

addTodoBtn.addEventListener("click", () => openAddModal("todo"));
addDoingBtn.addEventListener("click", () => openAddModal("doing"));
addDoneBtn.addEventListener("click", () => openAddModal("done"));

delTodoBtn.addEventListener("click", () => clearTasks("todo"));
delDoingBtn.addEventListener("click", () => clearTasks("doing"));
delDoneBtn.addEventListener("click", () => clearTasks("done"));

sortTimeBtn.addEventListener("click", () => sortLists("time"));
sortPriorityBtn.addEventListener("click", () => sortLists("priority"));

confirmModalBtn.addEventListener("click", () => {
  const text = taskTextarea.value.trim();
  if (!text) return;

  if (editTaskId !== null) {
    const task = tasks.find(t => t.id === editTaskId);
    if (task) {
      task.name = text;
      task.priority = prioritySelect.value;
    }
  } else {
    const newTask = {
      id: Date.now(),
      name: text,
      type: currentListType,
      priority: prioritySelect.value,
      time: Date.now(),
    };
    tasks.push(newTask);
  }

  updateLocalStorage();
  renderTasks();
  modalElement.close();
  taskTextarea.value = "";
  editTaskId = null;
});

cancelModalBtn.addEventListener("click", () => {
  modalElement.close();
  taskTextarea.value = "";
  editTaskId = null;
});

renderTasks();
