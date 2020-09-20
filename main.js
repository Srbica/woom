const container1 = document.querySelector('.container-1');
const container2 = document.querySelector('.container-2');
const container3 = document.querySelector('.container-3');
let inputValue = document.querySelector('.input');
const add = document.querySelector('.add');
const url = "https://kanban-api-rails.herokuapp.com/todos";
const todoState = 1;
const progressState = 2;
const doneState = 3;
let todos = [];

class task {
	constructor(object) {
		// this.createTask(object.content);
        this.id = object.id;
        this.content = object.content;
        this.state = object.state;
        this.createAt = object.created_at;
        this.updatedAt = object.updated_at;
    }
}

add.addEventListener('click', addNewTask);
window.addEventListener('keydown', (e) => {
	if(e.key === 'Enter'){
		addNewTask();
	}
})

function addNewTask(){
    var newTaskResponse = httpPost(inputValue.value, todoState);
    todos.unshift(newTaskResponse);
    renderTasks();
    inputValue.value = "";
}

function renderTasks() {
    emptyDomFromTasks();
    todos.forEach(element => {
        if (element.state == todoState) {
            renderTodo(element);
        }
        else if (element.state == progressState) {
            renderInProgress(element);
        }
        else if (element.state == doneState) {
            renderDone(element);
        }
    });
}

function renderTodo(task) {
        let taskBox = document.createElement('div');
        taskBox.classList.add('task');
        
        let input = document.createElement('input');
        input.type = "text";
        // input.disabled = true;
        input.value = task.content;
        input.classList.add('task-input');
        
        let doing = document.createElement('button');
        doing.classList.add('doing');
        doing.innerHTML = "DOING";
        doing.addEventListener('click', () => this.moveTask(task, progressState));
        
        let done = document.createElement('button');
        done.classList.add('done');
        done.innerHTML = "DONE";
        done.addEventListener('click', () => this.moveTask(task, doneState));
        
        let remove = document.createElement('button');
        remove.classList.add('remove');
        remove.innerHTML = "REMOVE";
        remove.addEventListener('click', () => this.deleteTask(task.id));
        
        container1.appendChild(taskBox);
        taskBox.appendChild(input);
        taskBox.appendChild(doing);
        taskBox.appendChild(done);
        taskBox.appendChild(remove);
}

function renderInProgress(task) {
        let taskBox = document.createElement('div');
        taskBox.classList.add('task');
        
        let input = document.createElement('input');
        input.type = "text";
        input.value = task.content;
        input.classList.add('task-input');
        
        let doing = document.createElement('button');
        doing.classList.add('doing');
        doing.innerHTML = "TODO";
        doing.addEventListener('click', () => this.moveTask(task, todoState));
        
        let done = document.createElement('button');
        done.classList.add('done');
        done.innerHTML = "DONE";
        done.addEventListener('click', () => this.moveTask(task, doneState));
        
        let remove = document.createElement('button');
        remove.classList.add('remove');
        remove.innerHTML = "REMOVE";
        remove.addEventListener('click', () => this.deleteTask(task.id));
        
        container2.appendChild(taskBox);
        taskBox.appendChild(input);
        taskBox.appendChild(doing);
        taskBox.appendChild(done);
        taskBox.appendChild(remove);
}

function renderDone(task) {
        let taskBox = document.createElement('div');
        taskBox.classList.add('task');
        
        let input = document.createElement('input');
        input.type = "text";
        input.value = task.content;
        input.classList.add('task-input');
        
        let todo = document.createElement('button');
        todo.classList.add('doing');
        todo.innerHTML = "TODO";
        todo.addEventListener('click', () => this.moveTask(task, todoState));
        
        let doing = document.createElement('button');
        doing.classList.add('done');
        doing.innerHTML = "DOING";
        doing.addEventListener('click', () => this.moveTask(task, progressState));
        
        let remove = document.createElement('button');
        remove.classList.add('remove');
        remove.innerHTML = "REMOVE";
        remove.addEventListener('click', () => this.deleteTask(task.id));
        
        container3.appendChild(taskBox);
        taskBox.appendChild(input);
        taskBox.appendChild(todo);
        taskBox.appendChild(doing);
        taskBox.appendChild(remove);
}

function emptyDomFromTasks(){
    let headline1 = document.querySelector('.container-1 h2');
    // remove all children
    while (container1.firstChild) {
        container1.removeChild(container1.firstChild);
    } 
    container1.appendChild(headline1);
    
    let headline2 = document.querySelector('.container-2 h2');
    while (container2.firstChild) {
        container2.removeChild(container2.firstChild);
    }
    container2.appendChild(headline2);
    
    let headline3 = document.querySelector('.container-3 h2');
    while (container3.firstChild) {
        container3.removeChild(container3.firstChild);
    }
    container3.appendChild(headline3);
}

function deleteTask(id) {
    httpDelete(id);
    todos = todos.filter(function(e) { return e.id !== id });
    renderTasks();
}

function moveTask(task, newState) {
    httpPut(task.id, task.content, newState)
    getTasks();
    renderTasks();
}

function getTasks() {
    todos = [];
    var response = httpGet();
    response.forEach(element => {
        var newTask = new task(element);
        todos.push(newTask);
    });
}

(function() {
    getTasks();
    renderTasks();
})();

function httpGet()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function httpPost(name, state)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url, false);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify({
        "todo": {
            "state": state,
            "content": name
        }
    }));
    return JSON.parse(xmlHttp.responseText);
}

function httpDelete(taskId) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("DELETE", url + "/" + taskId, false);
    xmlHttp.send();
}

function httpPut(taskId, taskName, taskState) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("PUT", url + "/" + taskId, false);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify({
        "todo": {
            "state": taskState,
            "content": taskName
        }
    }));
}