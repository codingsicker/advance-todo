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

const uiControl = {
	hideUI(e) {
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
	},
	showUI(e) {
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
	},
};
