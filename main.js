const container1 = document.querySelector('.container-1');
const container2 = document.querySelector('.container-2');
const container3 = document.querySelector('.container-3');
let inputValue = document.querySelector('.input');
const add = document.querySelector('.add');
// if(window.localStorage.getItem("todos") == undefined){
//      let todos = [];
//      window.localStorage.setItem("todos", JSON.stringify(todos));
// }
// let todosEX = window.localStorage.getItem("todos");
// let todos = JSON.parse(todosEX);
let todos = [];
class task {
	constructor(object) {
		this.createTask(object.content);
        this.id = object.id;
        this.content = object.content;
        this.state = object.state;
        this.createAt = object.created_at;
        this.updatedAt = object.updated_at;
    }
    
    createTask(name){
    	let taskBox = document.createElement('div');
        taskBox.classList.add('task');
    	let input = document.createElement('input');
    	input.type = "text";
        input.value = name;
    	input.classList.add('task-input');
        
        let doing = document.createElement('button');
        doing.classList.add('doing');
        doing.innerHTML = "DOING";
        doing.state = 2;
    	doing.addEventListener('click', () => this.doing(taskBox, name));
        
        let done = document.createElement('button');
        done.classList.add('done');
        done.innerHTML = "DONE";
        done.state = 3;
        done.addEventListener('click', () => this.done(taskBox, name));
        
        let remove = document.createElement('button');
    	remove.classList.add('remove');
    	remove.innerHTML = "REMOVE";
    	remove.addEventListener('click', () => this.remove(taskBox, name));
        
        container1.appendChild(taskBox);
        taskBox.appendChild(input);
        taskBox.appendChild(doing);
        taskBox.appendChild(done);
        taskBox.appendChild(remove);
    }
    
    doing(taskBox, name){
        taskBox.parentNode.removeChild(taskBox);
        let index = todos.indexOf(name);
        todos.splice(index, 1);
        container2.appendChild(taskBox);
        // window.localStorage.setItem("todos", JSON.stringify(todos));
    }
    
    done(taskBox, name){
        taskBox.parentNode.removeChild(taskBox);
        let index = todos.indexOf(name);
        todos.splice(index, 1);
        container3.appendChild(taskBox);
        // window.localStorage.setItem("todos", JSON.stringify(todos));
    }
    
    remove(taskBox, name){
        taskBox.parentNode.removeChild(taskBox);
        let index = todos.indexOf(name);
        todos.splice(index, 1);
        // window.localStorage.setItem("todos", JSON.stringify(todos));
    }
}

add.addEventListener('click', addNewTask);
window.addEventListener('keydown', (e) => {
	if(e.key === 'Enter'){
		addNewTask();
	}
})

function addNewTask()
{
    let newTaskResponse = httpPost("https://kanban-api-rails.herokuapp.com/todos", inputValue.value, 1);
    todos.unshift(newTaskResponse);
    renderTodos();
    inputValue.value = "";
}


function renderTodos() 
{
    let headline = document.querySelector('.container-1 h2');
    // remove all children

    while (container1.firstChild) {
        container1.removeChild(container1.firstChild);
    }
    container1.appendChild(headline);

    todos.forEach(element => {
        let newTask = new task(element);
    });
}

(function() 
{
    let response = httpGet("https://kanban-api-rails.herokuapp.com/todos");
    response.forEach(element => {
        let newTask = new task(element);
        todos.push(newTask);
    });
    renderTodos();
})();

function httpGet(theUrl)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function httpPost(theUrl, name, state)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", theUrl, false);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify({
        "todo": {
            "state": state,
            "content": name
        }
    }));
    return JSON.parse(xmlHttp.responseText);
}
