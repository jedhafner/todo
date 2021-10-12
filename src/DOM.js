import {isUnique, projectFactory, taskFactory, checkStorage, taskList, completedTasks, projectList, priorities, projectSelect, projectNames} from './index';

console.log(projectList);
console.log(taskList);

//function for creating simple DOM elements
function elementCreator (elementId, tag, parent, elementText, elementClass) {
  const element = document.createElement(tag);
  parent.appendChild(element);
  if (elementText){element.textContent = elementText};
  if (elementClass){element.classList.add(elementClass)};
  if (elementId){element.id = elementId};
};

//removes child nodes
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}
//function that will remove task or project from DOM and associated array.
function removeElement (element, array, storage) {
  let parent = element.parentNode;
  let parentId = parent.id;
  console.log(parentId);
  if (confirm(`Do you really want to delete this? It can't be undone.`)) {
     array.forEach(function(element){
       if (element.name === parentId){
         array.splice(array.indexOf(element), 1);
       }
     });
     console.log(array);
      localStorage.setItem(storage, JSON.stringify(array));
      parent.remove();
      if (array == projectList) {
        //delete all associated tasks in DOM
        let classToRemove = String(parent.replace(/\s/g, '').toLowerCase());
        console.log(classToRemove);
        Array.from(allTasks).forEach(function(element){
          console.log(element.classList[0]);
          if (element.classList[0] === classToRemove) {
            element.remove();
          }
        });
        for (let i = 0; i < taskList.length; i++){
          if (taskList[i].project === parent){
            let newArray = taskList.splice(i,1);
            localStorage.setItem('taskList', JSON.stringify(taskList));
          }
        }
      }
    } else {
      return;
    }
};

// marks task Complete/Incomplete
function completeTask (element, array, storage){
  let parent = element.parentNode;
  console.log(`element: ${element.textContent}`);
  let parentId = parent.id;
  console.log(parentId);
  let value;
  if (element.textContent === 'complete'){
    value = 'incomplete';
  } else { value = 'complete'};
    array.forEach(function(element){
      if (element.name === parentId){
        element.status = value;
      }
      //change colors
    });
    localStorage.setItem(storage, JSON.stringify(array));
    element.textContent = value;
    };
//function to edit task or project in DOM and associated array;


//function to create dropdown menu
function createDropDown (category, options, parent){
  let label = document.createElement('label')
  label.setAttribute('for', category)
  label.textContent = category;
  
  let select = document.createElement('select')
  select.setAttribute('name','project')
  select.id = 'project';
  
  for (let i = 0; i<options.length; i++){
    let option = document.createElement('option')
    option.setAttribute('value',options[i])
    option.textContent = options[i];
    select.appendChild(option);
  }

  parent.appendChild(label);
  parent.appendChild(select);
};

// Let there be a minimal HTML framework! This gives me
//an element onto which I can append DOM elements. I get
//the impressions that if I really understood the DOM, I
//would not need this. #onetogrowon
const body = document.getElementsByTagName('body')[0];
body.style.display = 'flex';

elementCreator('navbar','div', body);
elementCreator('addToProjectList','button',navbar,'Add project');
elementCreator('addToTaskList','button',navbar, 'Add task');
elementCreator('content','div',body,'','content');
elementCreator('projectDisplay','div',content,'','projectDisplay');
elementCreator('taskDisplay','div',content,'','taskDisplay');

//create project and task forms in DOM

elementCreator('projectForm','form', body,'','hidden');
let projectForm = document.getElementById('projectForm');

elementCreator('taskForm','form', body,'','hidden');
let taskForm = document.getElementById('taskForm');

elementCreator('editTask','form', body,'','hidden');
let editTask = document.getElementById('editTask');

//creates form to accept project input
function newProjectForm(fields){
  elementCreator('submit','button', projectForm, 'Save')
  let submit = document.getElementById('submit');
    submit.setAttribute('type','submit');

  elementCreator('Cancel', 'p', projectForm, 'Cancel','cancel');
  createDropDown('priority',priorities, projectForm);
  
  for (let i = 0; i<fields.length; i++) {
        let label = document.createElement('label');
        label.setAttribute('for',fields[i]);
        label.textContent = fields[i];
        projectForm.appendChild(label);
        let input = document.createElement('input');
        //input.value = 'Example Value';
        input.setAttribute('type', 'text');
        input.setAttribute('name', fields[i]);
        input.required = true;
        projectForm.appendChild(input);
    }    
}
newProjectForm(['name','reason']);

//creates form to accept task input
function newTaskForm(fields){
  let parent = taskForm;
  elementCreator('submitTask','button',parent,'Save')
  let submitTask = document.getElementById('submitTask');
  submitTask.setAttribute('type','submit');
    
  elementCreator('Cancel', 'p', parent, 'Cancel','cancel');
  createDropDown('project', projectNames(projectList), parent);
  
  for (let i = 0; i<fields.length; i++) {
      let label = document.createElement('label');
      label.setAttribute('for',fields[i]);
      label.textContent = fields[i];
      parent.appendChild(label);
      let input = document.createElement('input');
      //input.value = 'Example Value';
      input.setAttribute('type', 'text');
      input.setAttribute('name', fields[i]);
      input.required = true;
      parent.appendChild(input);
  }
  let dueDateLabel = document.createElement('label');
  dueDateLabel.textContent = 'due date';
  parent.appendChild(dueDateLabel);

  elementCreator('dueDate','input', parent);
  let dueDate = document.getElementById('dueDate');
  dueDate.setAttribute('type','date');
  dueDate.setAttribute('name','dueDate');
  dueDate.required = true;
}
newTaskForm(['name','description']);

//function to edit task
function editTaskForm(fields){
  let parent = editTask;
  elementCreator('submitTask','button',parent,'Save')
  let submitTask = document.getElementById('submitTask');
  submitTask.setAttribute('type','submit');
    
  elementCreator('Cancel', 'p', parent, 'Cancel','cancel');
  createDropDown('project', projectNames(projectList), parent);
  
  for (let i = 0; i<fields.length; i++) {
      let label = document.createElement('label');
      label.setAttribute('for',fields[i]);
      label.textContent = fields[i];
      parent.appendChild(label);
      let input = document.createElement('input');
      //input.value = 'Example Value';
      input.setAttribute('type', 'text');
      input.setAttribute('name', fields[i]);
      input.required = true;
      parent.appendChild(input);
  }
  let dueDateLabel = document.createElement('label');
  dueDateLabel.textContent = 'due date';
  dueDateLabel.setAttribute('for','dueDate');
  parent.appendChild(dueDateLabel);

  let editDueDate = document.createElement('input');
  editDueDate.setAttribute('type','text');
  editDueDate.setAttribute('name','editDueDate');
  editDueDate.required = true;
  parent.appendChild(editDueDate);
}
editTaskForm(['name','description']);

//function to create object and add to taskList
function addToTaskList() {
  console.log('submit triggers addtoTaskList');
  let taskName = taskForm.querySelectorAll('[name="name"]')[0].value.toLowerCase();
  let taskDesc = taskForm.querySelectorAll('[name="description"]')[0].value.toLowerCase();
  let taskDue = taskForm.querySelectorAll('[name="dueDate"]')[0].value.toLowerCase();
  let taskProj = taskForm.querySelectorAll('[name="project"]')[0].value.toLowerCase();

  let newTask = taskFactory(taskName, taskDesc, taskDue, 'incomplete', taskProj);
  taskList.push(newTask);
  localStorage.setItem('taskList', JSON.stringify(taskList));
};

//function to create object and add to projectList
function addToProjectList() {
    let projectName = projectForm.querySelectorAll('[name="name"]')[0].value.toLowerCase();
    let projectReason = projectForm.querySelectorAll('[name="reason"]')[0].value.toLowerCase();
    let projectPriority = projectForm.querySelectorAll('[name="project"]')[0].value.toLowerCase();

    if (isUnique(projectName, projectNames(projectList))){
        let newProject = projectFactory(projectName, projectReason, projectPriority);
        projectList.push(newProject);
        localStorage.setItem('projectList', JSON.stringify(projectList));
    } else {
        console.log('ERROR: project name already added');
    }
  };

//function to add task/project to DOM and display it
function addTaskToDom(parent, array){
  for (let i = 0; i < array.length; i++){
    elementCreator(Object.values(array[i])[0],'div',parent,'',String(Object.values(array[i])[4]).replace(/\s/g, ''));
    let item = document.getElementById(Object.values(array[i])[0]);
    for (let j = 0; j<4; j++){
      elementCreator('','p', item, Object.values(array[i])[j],Object.keys(array[i])[j]);
    }
    elementCreator('','p',item,'remove','remove');
    elementCreator('','p',item,'edit','edit');
    item.classList.add('hidden');
  }
}

function addProjectToDom(parent, array){
  for (let i = 0; i < array.length; i++){
    console.log(`class: ${String(Object.values(array[i])[3]).replace(/\s/g)}`);
    elementCreator(Object.values(array[i])[0],'div', parent,Object.values(array[i])[0],'project');
    let projDOM = document.getElementById(Object.values(array[i])[0]);
    elementCreator('','p',projDOM,'remove','remove');
  }
}
let taskIndex;

//finds index of task in taskList.
function getListIndex(taskName,taskProject){
  for (let i = 0; i<taskList.length; i++){
    if (taskList[i].name === taskName){
      if(String(taskList[i].project.replace(/\s/g, '')) === taskProject){
        taskIndex = i;
      };
    };
  }
}

addTaskToDom(taskDisplay, taskList);
addProjectToDom(projectDisplay, projectList);

//Event listeners
navbar.addEventListener('click', function(event) {
	let clicked = event.target;
  if (clicked.id === "addToTaskList"){
    taskForm.classList.toggle('hidden');
  } else if (clicked.id === 'addToProjectList'){
    projectForm.classList.toggle('hidden');
  }
});

taskForm.addEventListener('submit', addToTaskList);
taskForm.addEventListener('click', function(event){
  let clicked = event.target;
  if (clicked.textContent === 'Cancel'){
    taskForm.classList.toggle('hidden');
  }
})

projectForm.addEventListener('submit', addToProjectList);
projectForm.addEventListener('click', function(event){
  let clicked = event.target;
  if (clicked.textContent === 'Cancel'){
    projectForm.classList.toggle('hidden');
  }
})
taskDisplay.addEventListener('click', function(event){
  let clicked = event.target;
  if (clicked.textContent === 'remove'){
    removeElement(clicked, taskList, 'taskList');
  } else if (clicked.textContent === 'incomplete' || clicked.textContent === 'complete'){
    completeTask(clicked, taskList, 'taskList');
  } else if (clicked.textContent === 'edit'){
    console.log(clicked.parentNode.id);
    editTask.classList.remove('hidden');
    let taskName = clicked.parentNode.id;
    //will this next line work?
    let taskProject = clicked.parentNode.className;
    getListIndex(taskName, taskProject);

    let eForm = document.getElementById('editTask');
    let eTaskName = editTask.querySelectorAll('[name="name"]')[0];
    let eTaskDesc = editTask.querySelectorAll('[name="description"]')[0];
    let eTaskDue = editTask.querySelectorAll('[name="editDueDate"]')[0];
    console.log('eTaskDue: '+eTaskDue);
    let eTaskProj = editTask.querySelectorAll('[name="project"]')[0];

    eTaskName.value = taskList[taskIndex].name;
    eTaskDesc.value = taskList[taskIndex].description;
    eTaskDue.value = taskList[taskIndex].dueDate;
    eTaskProj.value = taskList[taskIndex].project;
}
})

function editTaskList() {
  console.log('event listener triggered!');
  let taskName = editTask.querySelectorAll('[name="name"]')[0].value.toLowerCase();
  let taskDesc = editTask.querySelectorAll('[name="description"]')[0].value.toLowerCase();
  let taskDue = editTask.querySelectorAll('[name="editDueDate"]')[0].value.toLowerCase();
  let taskProj = editTask.querySelectorAll('[name="project"]')[0].value.toLowerCase();

  let newTask = taskFactory(taskName, taskDesc, taskDue, 'incomplete', taskProj);
  console.log(`taskIndex" ${taskIndex}`);
  console.log(`new Task: ${newTask}`);
  taskList.splice(taskIndex,1,newTask);
  localStorage.setItem('taskList', JSON.stringify(taskList));
};

editTask.addEventListener('submit', editTaskList);
editTask.addEventListener('click', function(event){
  let clicked = event.target;
  if (clicked.textContent === 'Cancel'){
    editTask.classList.toggle('hidden');
  }
})

projectDisplay.addEventListener('click', function(event) {
	let clicked = event.target;
      //define project DOM items and task DOM items
      let allProjects = projectDisplay.children;
      let allTasks = taskDisplay.children;
  
  if (clicked.textContent === 'remove'){
    //delete project in array and DOM
    removeElement(clicked, projectList, 'projectList');
    } else if (clicked.id !== 'projectDisplay') {
      //this conditional should highlight the project clicked and
      //display its tasks (and only its tasks). 
      
      

      //hides/makes inactive ALL project and task DOM items
      Array.from(allTasks).forEach(function(element){
        element.classList.add('hidden');
      });
      Array.from(allProjects).forEach(function(element){
        element.classList.remove('active');
      });
      let clickedId = clicked.id;
      console.log(clicked.id);

      let projectClicked = document.getElementById(clicked.id);
      projectClicked.classList.add('active');

    //select and display tasks in DOM to display based on the project name of clicked
    let projectClass = String(clicked.id.replace(/\s/g, '').toLowerCase());
    let tasksToDisplay = document.getElementsByClassName(projectClass);
    Array.from(tasksToDisplay).forEach(function (element) {
      element.classList.toggle('hidden');
    });
    }
  });




