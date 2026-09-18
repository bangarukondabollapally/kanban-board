let tasksData = {};

// Columns
const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

// Toggle Modal
const toggleModal = document.querySelector(".toggle-modal");
const modal = document.querySelector(".modal");
const cancelBtn = document.querySelector(".cancel-btn");

// New Task
const addTaskBtn = document.querySelector(".add-task-btn");
const taskTitle = document.querySelector("#task-title");
const taskDescription = document.querySelector("#task-description");

const columns = [todo, progress, done];
let dragged=null;


document.querySelector(".board").addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("task")) {
        dragged = e.target;
    }
});


function addTask(title, desc, column){
    const div = document.createElement("div");
    div.classList.add("card","task");
    div.draggable = true;
    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <div class="buttons">
            <button class="del-btn">Delete</button>
        </div>
    `;
    column.appendChild(div);

    const delBtn = div.querySelector(".del-btn");

    delBtn.addEventListener("click",()=>{
        div.remove();
        updateTasksData();
    })
}


if(localStorage.getItem("tasks")){
    const data = JSON.parse(localStorage.getItem("tasks")); 
    
    for(const col in data){
        const column = document.querySelector(`#${col}`);
        
        data[col].forEach(task=>{
            addTask(task.title, task.desc, column);
        })
    }
}


function updateTasksData(){
    columns.forEach(column => {
        const tasks = column.querySelectorAll(".task");
        const count = column.querySelector(".count");

        tasksData[column.id]=Array.from(tasks).map(task=>{
            return{
                title:task.querySelector("h2").textContent,
                desc:task.querySelector("p").textContent
            };
        });
        localStorage.setItem("tasks",JSON.stringify(tasksData));
        count.textContent=tasks.length;
    });
}
updateTasksData();


function addDragEvents(col){
    let counter = 0;

    col.addEventListener("dragenter",(e)=>{
        e.preventDefault();
        counter++;
        col.classList.add("hover");
    })

    col.addEventListener("dragleave",(e)=>{
        e.preventDefault();
        counter--;
        if (counter === 0) {
            col.classList.remove("hover");
        }
    })

    col.addEventListener("dragover",(e)=>{
        e.preventDefault();
    })

    col.addEventListener("drop",(e)=>{
        counter = 0;
        col.appendChild(dragged);
        col.classList.remove("hover");
        dragged=null;
        updateTasksData();
    })
}

addDragEvents(todo);
addDragEvents(progress);
addDragEvents(done);


toggleModal.addEventListener("click", () => {
    modal.classList.toggle("active");
});

cancelBtn.addEventListener("click", () => {
    modal.classList.remove("active");
});


addTaskBtn.addEventListener("click",(e)=>{
    const title = taskTitle.value;
    const desc = taskDescription.value;

    addTask(title, desc, todo);
    updateTasksData();
    modal.classList.remove("active");
    taskTitle.value="";
    taskDescription.value="";
})
