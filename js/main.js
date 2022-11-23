class Task {
    constructor(title, status, id = Date.now()) {
        this.id = id;
        this.title = title;
        this.status = status;
    }
    getHTML() {
        const cssDoneClass = this.status ? ' task-title--done' : ''
        let HTML = `
        <li id="${this.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="task-title${cssDoneClass}">${this.title}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>`;
        return HTML;
    }
}


// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = localStorage.getItem('tasks')? fillTasksArray(JSON.parse(localStorage.getItem('tasks'))) : null;

checkEmptyList();

tasks.forEach(function (task) {
    tasksList.insertAdjacentHTML('afterbegin' ,task.getHTML());
});

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);





function fillTasksArray (obj) {
    let temporalTasks = [];
    if (obj.length > 0) {
        Object.keys(obj).forEach(function (key) {
            temporalTasks[key] = new Task(obj[key].title, obj[key].status, obj[key].id);
        });
    }
    return temporalTasks.sort(function(a, b){return b.id - a.id});
}

function doneTask(event) {
    const button = event.target;

    if (button.dataset.action === "done") {
        const currentListItem = button.closest('li');

        const id = currentListItem.id;
        const task = tasks.find((task) => task.id == id);
        task.status = !task.status;

        const taskText = currentListItem.querySelector('.task-title');
        taskText.classList.toggle("task-title--done");
        saveToLS();
    }
}

function deleteTask(event) {
    const button = event.target;

    if (button.dataset.action === "delete") {
        const currentListItem = button.closest('li');

        const id = currentListItem.id

        tasks = tasks.filter((task) => task.id != id)

        currentListItem.remove();
        checkEmptyList();
        saveToLS();
    }
    
}

function addTask(event) {
    event.preventDefault();

    const task = new Task(taskInput.value, false);
    tasks.push(task);

    const taskHTML = task.getHTML();
    tasksList.insertAdjacentHTML('beforeend', taskHTML);

    taskInput.value = '';
    taskInput.focus();
    checkEmptyList();
    saveToLS();
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
        </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } else {
        const emptyListElement = document.querySelector('#emptyList');
        emptyListElement ? emptyListElement.remove() : null;
    }
}

function saveToLS() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}



