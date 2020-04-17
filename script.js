const tabContainer = document.querySelector(".task-tab");
const taskInput = document.querySelector("#task-input");
const taskAddBtn = document.querySelector("#task-add");
const taskSearchBtn = document.querySelector("#task-search");
const taskList = document.querySelector(".task-list");
const emptyCard = document.querySelector(".empty-card");
const taskTab = document.querySelector("#task");
const completedTab = document.querySelector("#completed");
const trashTab = document.querySelector("#trash");
const formContainer = document.querySelector(".task-form-container");
const menuIcon = document.querySelector("#setting-icon");

const task = new Task();

let {
	tasks,
	completedTasks,
	trashTasks,
	saveToLocalStorage,
	removeFromLocalStorage,
	moveToLocalStorage,
} = task;

const getTasks = () => {};

// Selecting the tab
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

// shoing the empty task area
if (tasks.length <= 0) {
	taskAddBtn.classList.remove("hide");
	taskInput.classList.remove("hide");
	taskSearchBtn.classList.add("hide");
}

const hideUI = (e) => {
	if (e.target.id === "task") {
		taskInput.classList.remove("hide");
		taskAddBtn.classList.remove("hide");
		taskSearchBtn.classList.add("hide");
		formContainer.classList.remove("hide");
	}
	if (e.target.id !== "task") {
		formContainer.classList.add("hide");
	}
	taskList.classList.add("hide");
	emptyCard.classList.remove("hide");
};

// show UI
const showUI = (e) => {
	taskList.classList.remove("hide");
	emptyCard.classList.add("hide");
	formContainer.classList.remove("hide");
	taskSearchBtn.classList.remove("hide");

	if (e) {
		if (e.target.id === "task") {
			taskInput.classList.remove("hide");
			taskAddBtn.classList.remove("hide");
			// taskSearchBtn.classList.remove("hide");
		} else {
			taskSearchBtn.classList.remove("hide");
			taskAddBtn.classList.add("hide");
		}
	}
};

// rendring tasks for different tabs
taskTab.addEventListener("click", (e) => {
	if (tasks.length <= 0) {
		hideUI(e);
	} else {
		renderUI(tasks);
		showUI(e);
	}
	document.querySelector(".setting-menu").classList.add("hide");
});
completedTab.addEventListener("click", (e) => {
	if (completedTasks.length <= 0) {
		hideUI(e);
	} else {
		renderUI(completedTasks);
		showUI(e);
		changeUI();
	}
	document.querySelector(".setting-menu").classList.add("hide");
});
trashTab.addEventListener("click", (e) => {
	if (trashTasks.length <= 0) {
		hideUI(e);
	} else {
		renderUI(trashTasks);
		showUI(e);
		changeUI();
	}
	document.querySelector(".setting-menu").classList.add("hide");
});

let interval;
// display error and success message
const displayMsg = (className, text) => {
	clearInterval(interval);
	const message = document.querySelector(".msg-container .msg");
	message.classList.add(className);
	message.innerHTML = text;
	interval = setInterval(() => {
		message.classList.remove(className);
	}, 2000);
};

// updating the UI
const updateUI = (task) => {
	const li = document.createElement("li");
	li.classList.add("task-item");
	li.setAttribute("data-id", task.id);
	const item = `
		<p class="task">${task.value}</p>
		<div class="task-control">
			<i class="far fa-edit icon" id="edit-task"></i>
			<i class="far fa-trash-alt icon" id="delete-task"></i>
			<i class="far fa-check-square icon" id="complete-task"></i>
		</div>
	`;
	li.innerHTML = item;
	taskList.append(li);
	showUI();
};

// clear input
const clearInput = () => {
	taskInput.value = "";
	taskInput.focus();
};

// save to local storage
// const saveToLocalStorage = (storageName, task) => {
// 	let tasks = JSON.parse(localStorage.getItem(storageName));
// 	if (tasks !== null) {
// 		tasks.push(task);
// 		localStorage.setItem(storageName, JSON.stringify(tasks));
// 	} else {
// 		tasks = [task];
// 		localStorage.setItem(storageName, JSON.stringify(tasks));
// 	}
// };

// Move form local storage
// const moveToLocalStorage = (from, to, id) => {
// 	const tasks = JSON.parse(localStorage.getItem(from));
// 	let updatedTasks;
// 	let removedTask;
// 	if (tasks !== null) {
// 		updatedTasks = tasks.filter((task) => {
// 			if (task.id === id) {
// 				removedTask = task;
// 			}
// 			return task.id !== id;
// 		});
// 	}
// 	localStorage.setItem(from, JSON.stringify(updatedTasks));
// 	saveToLocalStorage(to, removedTask);
// 	return removedTask;
// };

// remove from LS
// const removeFromLocalStorage = (storageName, id) => {
// 	const tasks = JSON.parse(localStorage.getItem(storageName));
// 	const remaningTasks = tasks.filter((task) => {
// 		if (task.id === id) {
// 			removedTask = task;
// 		}
// 		return task.id !== id;
// 	});

// 	localStorage.setItem(storageName, JSON.stringify(remaningTasks));
// };

// remove from ui
const removeFromUI = (tasks, id) => {
	return tasks.filter((task) => task.id !== id);
};

// Adding tasks
taskAddBtn.addEventListener("click", () => {
	if (!taskInput.value.trim()) {
		return displayMsg("error", "Task field can not be empty!");
	}

	const task = {
		id: new Date().getTime(),
		value: taskInput.value,
	};
	tasks.push(task);
	displayMsg("success", "Task added successfully.");
	saveToLocalStorage("tasks", task);
	updateUI(task);
	emptyCard.classList.add("hide");
	clearInput();
});

const getElement = (e) => {
	return e.target.parentElement.parentElement;
};

// changing buttons for different tab
const changeUI = () => {
	const btnContainers = document.querySelectorAll(".task-control");
	btnContainers.forEach((container) => {
		container.innerHTML = `
			<i class="fas fa-history icon" id="restore"></i>
			<i class="far fa-trash-alt icon" id="remove-task"></i>
			`;
	});
};

// move to trash
const moveToTrash = (e) => {
	if (e.target.id === "delete-task") {
		const element = getElement(e);
		element.remove();
		const id = +element.dataset.id;
		const removedTask = moveToLocalStorage("tasks", "trash-tasks", id);
		trashTasks.push(removedTask);
		displayMsg("success", "Task moved to the trash.");
		tasks = removeFromUI(tasks, id);
	}
};

// completing task
const completeTask = (e) => {
	if (e.target.id === "complete-task") {
		const element = getElement(e);
		element.remove();
		const id = +element.dataset.id;
		const removedTask = moveToLocalStorage("tasks", "completed-tasks", id);
		completedTasks.push(removedTask);
		tasks = removeFromUI(tasks, id);
	}
};

// Removing task
const removeTask = (e) => {
	if (e.target.id === "remove-task") {
		const element = getElement(e);
		element.remove();
		const id = +element.dataset.id;
		if (completedTab.classList.contains("selected")) {
			removeFromLocalStorage("completed-tasks", id);
			completedTasks = removeFromUI(completedTasks, id);
		}
		if (trashTab.classList.contains("selected")) {
			removeFromLocalStorage("trash-tasks", id);
			trashTasks = removeFromUI(trashTasks, id);
		}
	}
};

// restore task
const restoreTask = (e) => {
	if (e.target.id === "restore") {
		const element = getElement(e);
		element.remove();
		const id = +element.dataset.id;
		if (completedTab.classList.contains("selected")) {
			const removedTask = moveToLocalStorage("completed-tasks", "tasks", id);
			tasks.push(removedTask);
			completedTasks = removeFromUI(completedTasks, id);
		}
		if (trashTab.classList.contains("selected")) {
			const removedTask = moveToLocalStorage("trash-tasks", "tasks", id);
			tasks.push(removedTask);
			trashTasks = removeFromUI(trashTasks, id);
		}
	}
};

// edit task
const editTask = (e) => {
	if (e.target.id === "edit-task") {
		const taskEditContainer = document.querySelector(".task-edit-container");
		const taskEditInput = document.querySelector(".edit-form input");
		const element = getElement(e);
		const editId = document.querySelector("#edit-id");
		editId.value = element.dataset.id;
		taskEditContainer.classList.remove("hide");
		taskEditInput.value = element.innerText;
		taskEditInput.select();
	}
};

// removing and completing tasks
taskList.addEventListener("click", (e) => {
	// if (e.target.id === "delete-task") {
	// 	const element = getElement(e);
	// 	element.remove();
	// 	const id = +element.dataset.id;
	// 	const removedTask = moveToLocalStorage("tasks", "trash-tasks", id);
	// 	trashTasks.push(removedTask);
	// 	displayMsg("success", "Task moved to the trash.");
	// 	tasks = removeFromUI(tasks, id);
	// }
	moveToTrash(e);
	// if (e.target.id === "complete-task") {
	// 	const element = getElement(e);
	// 	element.remove();
	// 	const id = +element.dataset.id;
	// 	const removedTask = moveToLocalStorage("tasks", "completed-tasks", id);
	// 	completedTasks.push(removedTask);
	// 	tasks = removeFromUI(tasks, id);
	// }
	completeTask(e);
	// if (e.target.id === "remove-task") {
	// 	const element = getElement(e);
	// 	element.remove();
	// 	const id = +element.dataset.id;
	// 	if (completedTab.classList.contains("selected")) {
	// 		removeFromLocalStorage("completed-tasks", id);
	// 		completedTasks = removeFromUI(completedTasks, id);
	// 	}
	// 	if (trashTab.classList.contains("selected")) {
	// 		removeFromLocalStorage("trash-tasks", id);
	// 		trashTasks = removeFromUI(trashTasks, id);
	// 	}
	// }
	removeTask(e);
	// if (e.target.id === "restore") {
	// 	const element = getElement(e);
	// 	element.remove();
	// 	const id = +element.dataset.id;
	// 	if (completedTab.classList.contains("selected")) {
	// 		const removedTask = moveToLocalStorage("completed-tasks", "tasks", id);
	// 		tasks.push(removedTask);
	// 		completedTasks = removeFromUI(completedTasks, id);
	// 	}
	// 	if (trashTab.classList.contains("selected")) {
	// 		const removedTask = moveToLocalStorage("trash-tasks", "tasks", id);
	// 		tasks.push(removedTask);
	// 		trashTasks = removeFromUI(trashTasks, id);
	// 	}
	// }

	restoreTask(e);
	// edit tasks
	// if (e.target.id === "edit-task") {
	// 	const taskEditContainer = document.querySelector(".task-edit-container");
	// 	const taskEditInput = document.querySelector(".edit-form input");
	// 	const element = getElement(e);
	// 	const editId = document.querySelector("#edit-id");
	// 	editId.value = element.dataset.id;
	// 	taskEditContainer.classList.remove("hide");
	// 	taskEditInput.value = element.innerText;
	// 	taskEditInput.select();
	// }

	editTask(e);
});

// task edit form submit event
const taskEditForm = document.querySelector(".edit-form");
taskEditForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const input = taskEditForm.querySelector("input");
	const taskEditContainer = document.querySelector(".task-edit-container");
	const { value: id } = document.querySelector("#edit-id");
	if (input.value.trim()) {
		const task = tasks.find((task) => task.id === +id);
		task.value = input.value.trim();
		localStorage.setItem("tasks", JSON.stringify(tasks));
		taskEditContainer.classList.add("hide");
		renderUI(tasks);
	} else {
		taskEditContainer.classList.add("hide");
	}
});

// close edit task
document
	.querySelector(".task-edit-container")
	.addEventListener("click", (e) => {
		if (e.target.classList.contains("task-edit-container")) {
			e.target.classList.add("hide");
		}
	});

const renderUI = (tasksToRender) => {
	if (tasksToRender.length > 0) {
		taskList.innerHTML = "";
		for (let task of tasksToRender) {
			updateUI(task);
		}
		showUI();
	}
};

renderUI(tasks);

taskSearchBtn.addEventListener("click", () => {
	if (taskInput.value.trim()) {
		const text = taskInput.value.trim();
		if (taskTab.classList.contains("selected")) {
			searchTask(tasks, text);
		}
		if (completedTab.classList.contains("selected")) {
			searchTask(completedTasks, text);
			changeUI();
		}
		if (trashTab.classList.contains("selected")) {
			searchTask(trashTasks, text);
			changeUI();
		}
	} else {
		displayMsg("error", "Search field can not be empty!");
	}
});
const searchTask = (tasks, text) => {
	const results = tasks.filter((task) =>
		task.value.toLowerCase().includes(text.toLowerCase())
	);
	if (results.length > 0) {
		renderUI(results);
	} else {
		displayMsg("error", "Not foud!");
	}
};

const clearTasks = (storageName) => {
	let tasks = JSON.parse(localStorage.getItem(storageName));
	tasks = [];
	localStorage.setItem(storageName, JSON.stringify(tasks));
};

menuIcon.addEventListener("click", () => {
	document.querySelector(".setting-menu").classList.toggle("hide");
});
document.querySelector("#task-clear-link").addEventListener("click", () => {
	if (taskTab.classList.contains("selected")) {
		clearTasks("tasks");
		tasks = [];
		taskList.innerHTML = "";
	}
	if (completedTab.classList.contains("selected")) {
		clearTasks("completed-tasks");
		completedTasks = [];
		taskList.innerHTML = "";
	}
	if (trashTab.classList.contains("selected")) {
		clearTasks("trash-tasks");
		trashTasks = [];
		taskList.innerHTML = "";
	}
});
