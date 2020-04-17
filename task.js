class Task {
	constructor() {
		this.tasks = this.getTasks('tasks');
		this.completedTasks = this.getTasks('completed-tasks');
		this.trashTasks = this.getTasks('trash-tasks');
	}

	getTasks(taskName) {
		let tasks = JSON.parse(localStorage.getItem(taskName));
		if (tasks === null) {
			tasks = [];
		}
		return tasks;
	}
	saveToLocalStorage(storageName, task) {
		let tasks = JSON.parse(localStorage.getItem(storageName));
		if (tasks !== null) {
			tasks.push(task);
			// localStorage.setItem(storageName, JSON.stringify(tasks));
		} else {
			tasks = [task];
		}
		localStorage.setItem(storageName, JSON.stringify(tasks));
	}
	removeFromLocalStorage(storageName, id) {
		const tasks = JSON.parse(localStorage.getItem(storageName));
		// const remaningTasks = tasks.filter((task) => task.id !== id);
		const remaningTasks = tasks.filter(task => {
			// if (task.id === id) {
			// 	removedTask = task;
			// }
			return task.id !== id;
		});

		localStorage.setItem(storageName, JSON.stringify(remaningTasks));
	}
	moveToLocalStorage(from, to, id) {
		const tasks = JSON.parse(localStorage.getItem(from));
		let updatedTasks;
		let removedTask;
		if (tasks !== null) {
			updatedTasks = tasks.filter(task => {
				if (task.id === id) {
					removedTask = task;
				}
				return task.id !== id;
			});
		}
		localStorage.setItem(from, JSON.stringify(updatedTasks));
		saveToLocalStorage(to, removedTask);
		return removedTask;
	}
}
