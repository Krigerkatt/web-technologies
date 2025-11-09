function createTask(text, listType) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.className = "task-text";
  span.innerHTML = text.replace(/\\n/g, "<br>");

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
    const newText = prompt("Измените текст задачи:", span.textContent);
    if (newText) span.innerHTML = newText.replace(/\\n/g, "<br>");
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

  deleteBtn.addEventListener("click", () => {
    li.remove();
  });

  return li;
}

function addTask(listElement, listType) {
  const text = prompt("Введите текст задачи (для новой строки используйте \\n):");
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