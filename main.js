const taskInput = document.getElementById("task-input");
const taskAddBtn = document.getElementById("task-add");
const taskSearchBtn = document.querySelector("#task-search");
const emptyTaskCont = document.querySelector(".empty-task-container");
const taskList = document.querySelector(".task-list");
const taskForm = document.querySelector(".task-form");
const clearBtn = document.querySelector("#clear-task");
let removedTasks = [];
let completedTasks = [];
let tasks;
if (localStorage.getItem("tasks") !== null) {
	tasks = JSON.parse(localStorage.getItem("tasks"));
} else {
	tasks = [];
}
let id = tasks.length <= 0 ? 0 : tasks.length;
// checkId(id);
const COMPLETED_TAB = "completed-tab";
const TASK_TAB = "task-tab";
const TRASH_TAB = "trash-tab";

document.querySelector("#task").classList.add("selected");
const tabContainer = document.querySelector(".task-tab");
tabContainer.addEventListener("click", (e) => {
	const tabs = document.querySelectorAll(".tab");
	tabs.forEach((tab) => {
		if (e.target.id === tab.id) {
			tab.classList.add("selected");
		} else {
			tab.classList.remove("selected");
		}
	});
});

const saveToLocalStorage = (storageName, taskName, item) => {
	if (localStorage.getItem(storageName) !== null) {
		taskName = JSON.parse(localStorage.getItem(storageName));
		taskName.push(item);
		localStorage.setItem(storageName, JSON.stringify(taskName));
	} else {
		taskName.push(item);
		localStorage.setItem(storageName, JSON.stringify(taskName));
	}
};

taskAddBtn.addEventListener("click", (e) => {
	if (taskInput.value.trim()) {
		const task = {
			id: id++,
			task: taskInput.value,
		};
		updateUI(task, TASK_TAB);
		// tasks.push(task);
		taskInput.value = "";
		taskInput.focus();

		saveToLocalStorage("tasks", tasks, task);
		// if (localStorage.getItem('tasks') !== null) {
		//   tasks = JSON.parse(localStorage.getItem('tasks'));
		//   tasks.push(task);
		//   localStorage.setItem('tasks', JSON.stringify(tasks));
		// } else {
		//   tasks.push(task);
		//   localStorage.setItem('tasks', JSON.stringify(tasks));
		// }
	}
});

const updateUI = ({ id, task }, tab) => {
	showUI();
	const li = document.createElement("li");
	li.classList.add("task-item");
	li.setAttribute("data-id", id);
	let item;

	if (tab === TASK_TAB) {
		item = `
    <p class="task">${task}</p>
    <div class="task-control">
        <i class="far fa-edit icon" id="edit-task"></i>
        <i class="far fa-trash-alt icon" id="delete-task"></i>
        <i class="far fa-check-square icon" id="complete-task"></i>
    </div>
    `;
	} else {
		item = `
    <p class="task">${task}</p>
    <div class="task-control">
        <i class="fas fa-history icon" id="restore"></i>
        <i class="far fa-trash-alt icon" id="delete-task"></i>
        <i class="far fa-edit icon" id="edit-task"></i>
    </div>
    `;
	}
	li.innerHTML = item;
	document.querySelector(".task-list").append(li);
};

const showUI = (tab) => {
	taskInput.classList.remove("hide");
	taskSearchBtn.classList.remove("hide");
	taskList.classList.remove("hide");
	emptyTaskCont.classList.add("hide");
	if (tab === TASK_TAB) {
		taskAddBtn.classList.remove("hide");
	}
	if (tab === COMPLETED_TAB || tab === TRASH_TAB) {
		taskAddBtn.classList.add("hide");
	}
};

const hideUI = (tab) => {
	taskSearchBtn.classList.add("hide");
	taskList.classList.add("hide");
	emptyTaskCont.classList.remove("hide");
	if (tab === TASK_TAB) {
		taskInput.classList.remove("hide");
		taskAddBtn.classList.remove("hide");
		document.querySelector("#restore").classList.add("hide");
	}
	if (tab === COMPLETED_TAB || tab === TRASH_TAB) {
		taskInput.classList.add("hide");
		taskAddBtn.classList.add("hide");
	}
};

// changing buttons for different tab
const changeUI = () => {
	document.querySelector(
		".task-control"
	).innerHTML = `<i class="fas fa-history icon" id="restore"></i>
        <i class="far fa-trash-alt icon" id="delete-task"></i>`;
};

taskList.addEventListener("click", (e) => {
	if (e.target.id === "delete-task") {
		const element = e.target.parentElement.parentElement;
		e.target.parentElement.parentElement.remove();
		const ls = JSON.parse(localStorage.getItem("tasks"));
		ls.forEach((task, index) => {
			if (task.id === parseInt(element.dataset.id)) {
				const task = ls.splice(index, 1);
				saveToLocalStorage("trash-tasks", removedTasks, task);
				localStorage.setItem("tasks", JSON.stringify(ls));
			}
		});
	}

	if (e.target.id === "complete-task") {
		const element = e.target.parentElement.parentElement;
		e.target.parentElement.parentElement.remove();
		const ls = JSON.parse(localStorage.getItem("tasks"));
		ls.forEach((task, index) => {
			if (task.id === parseInt(element.dataset.id)) {
				const task = ls.splice(index, 1);
				saveToLocalStorage("completed-tasks", completedTasks, task);
				localStorage.setItem("tasks", JSON.stringify(ls));
			}
		});
	}

	// if (e.target.id === 'restore') {
	//   console.log(e.target.parentElement.parentElement);
	// }
});

const renderUI = () => {
	tasks.forEach((task) => {
		updateUI(task, TASK_TAB);
	});
};
renderUI();

document.querySelector("#task").addEventListener("click", () => {
	if (localStorage.getItem("tasks") !== null) {
		showUI(TASK_TAB);
		const tasks = JSON.parse(localStorage.getItem("tasks"));
		// console.log(tasks);
		document.querySelector(".task-list").innerHTML = "";
		tasks.forEach((task) => {
			updateUI(task, TASK_TAB);
		});
	} else {
		hideUI(TASK_TAB);
	}
});

document.querySelector("#completed").addEventListener("click", () => {
	if (localStorage.getItem("completed-tasks") !== null) {
		showUI(COMPLETED_TAB);
		const tasks = JSON.parse(localStorage.getItem("completed-tasks"));
		// console.log(tasks);
		document.querySelector(".task-list").innerHTML = "";
		tasks.forEach((task) => {
			updateUI(task[0]);
		});
		taskList.addEventListener("click", (e) => {
			if (e.target.id === "restore") {
				console.log("restoring");
			}
			if (e.target.id === "delete-task") {
				console.log("deleting");
			}
		});
	} else {
		hideUI(COMPLETED_TAB);
	}
});

document.querySelector("#trash").addEventListener("click", () => {
	if (localStorage.getItem("trash-tasks") !== null) {
		showUI(TRASH_TAB);
		const tasks = JSON.parse(localStorage.getItem("trash-tasks"));
		document.querySelector(".task-list").innerHTML = "";
		tasks.forEach((task) => {
			updateUI(task[0]);
		});
		taskList.addEventListener("click", (e) => {
			if (e.target.id === "restore") {
				tasks.forEach((task) => {
					task.forEach((mainTask) => {
						if (
							mainTask.id === +e.target.parentElement.parentElement.dataset.id
						) {
							console.log(mainTask);
						}
						// console.log(+e.target.parentElement.parentElement.dataset.id);
					});
				});
			}
			if (e.target.id === "delete-task") {
				console.log("deleting");
			}
		});
	} else {
		hideUI(TRASH_TAB);
	}
});

const clearTasks = () => {
	console.log("clear");
};

clearBtn.addEventListener("click", () => {
	const dialogContainer = document.querySelector(".confirm-dialog-container");
	dialogContainer.classList.remove("hide");
	const dialog = document.querySelector(".confirm-dialog");
	const confirmBtn = document.querySelector("#clear-btn");
	const cancelBtn = document.querySelector("#cancel-btn");
	dialog.addEventListener("click", (e) => {
		if (e.target.id === "clear-btn") {
			clearTasks();
		} else if (e.target.id === "cancel-btn") {
			dialogContainer.classList.add("hide");
		}
	});
});

const checkId = (id1) => {
	const mainTask = JSON.parse(localStorage.getItem("tasks"));
	const trashTask = JSON.parse(localStorage.getItem("trash-tasks"));
	const completedTask = JSON.parse(localStorage.getItem("completed-tasks"));

	for (let task of mainTask) {
		if (id1 === task.id) {
			id1++;
			console.log(id1);
		}
	}
	id = id1;
	for (let task of trashTask) {
		for (let mainTask of task) {
			if (id1 === mainTask.id) {
				id1++;
				console.log(id1);
			}
		}
	}
	id = id1;
	for (let task of completedTask) {
		for (let mainTask of task) {
			if (id1 === mainTask.id) {
				id1++;
				console.log(id1);
			}
		}
	}
	id = id1;

	// console.log(id1);
};

checkId(id);
