let projectList = [{name: 'Just do it', why: 'get it done', priority:'low'}];
let taskList = [];
let completedTasks = [];
let priorities = ['high','medium','low'];

function isUnique(value, body){
  let lowerValue = value.toLowerCase();
  let x = 0;
  for (let i = 0; i < body.length; i++){
    if (lowerValue === body[i].toLowerCase()){
      x+=1
    }
    console.log(x);
  }
  if (x>0){
    return false;
  } else {
    return true;
  }
}
  
function projectFactory(name, why, priority){
  return {name, why, priority};
};

function taskFactory(name, description, dueDate, status, project){
  return {name, description, dueDate, status, project};
};

//Checks storage for data from previous sessions, makes it available in arrays.
const projectStorage = JSON.parse(localStorage.getItem('projectList'));
if (projectStorage !== null){
projectList = projectStorage;
};

const taskStorage = JSON.parse(localStorage.getItem('taskList'));
if (taskStorage !== null){
taskList = taskStorage;
};

function checkStorage (array, storage){
  JSON.parse(localstorage.getItem('${array}'));
  if (storage !== null){
    array = storage;
  }
};

//create list of project names
function projectNames (array) {
  let nameArray = [];
  array.forEach( element => {
    nameArray.push(element.name)
  })
  return nameArray;
}

function projectSelect (array, value) {
  let targetArray = [];
  value = value.toLowerCase();
  array.forEach (element => {
    if (element.project === value) {
      targetArray.push(element);
    };
  });
  return targetArray;
};

export {isUnique, projectFactory, taskFactory, checkStorage, taskList, completedTasks, projectList, priorities, projectSelect, projectNames};