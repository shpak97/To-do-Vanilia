const tasks = [
  { id: 1, title: "Go to the cinema", done: false },
  { id: 2, title: "Go to the theatre", done: true },
  { id: 3, title: "Learn Java Script", done: false },
  { id: 4, title: "Finish HTML project", done: false },
];

const createElement = (tagName) => {
  return document.createElement(tagName);
};
const setId = tasks => {
  tasks.forEach((task, index ) => {
    tasks[index].id = index + 1;
  });
  return tasks;
}
const totalChecker = () => {
  const filterSelect = document.querySelector('#filter-tasks');
  const searchInput = document.querySelector('#search-box');
  let selectedFilter = true;

  if(parseInt(filterSelect.value) === 2 || searchInput.value) {
    selectedFilter = false;
  }

  return selectedFilter;
}
const updateTasks = (tasks) => {
  const listOfTasks = document.querySelector('#tasks-box');

  if(!listOfTasks || !tasks) return;
  listOfTasks.innerHTML = '';

  tasks.forEach(({id, title, done}) => {
    const item = createElement('li');
    const taskTitle = createElement('span');
    const iconsBox = createElement('div');
    const iconCheck = createElement('i');
    const iconRemove = createElement('i');

    item.classList.add('list-group-item',  'd-flex');
    done && taskTitle.classList.add('done');
    iconsBox.classList.add('icons-box',  'ml-auto');
    iconCheck.classList.add('fa' , 'fa-check',  'mr-3');
    iconRemove.classList.add('fa' , 'fa-trash');

    item.setAttribute('data-id', id);

    taskTitle.innerText = title;


    iconsBox.appendChild(iconCheck);
    iconsBox.appendChild(iconRemove);

    item.appendChild(taskTitle);
    item.appendChild(iconsBox);

    return listOfTasks.appendChild(item);
  })

}
const updateTasksInfo = (tasks, total = false, done = false, remain = false) => {

  if(total) {
    const total = document.querySelector('#tasks-total');
    total.innerText = tasks.length;
  }
  if(done) {
    const done = document.querySelector( '#tasks-done' );

    let doneCount = 0;
    tasks.forEach( tasks => tasks.done ? doneCount++ : '' );

    done.innerHTML = doneCount;
  }

  if(remain) {
    const remain = document.querySelector('#tasks-remain');

    let remainCount = 0;
    tasks.forEach(tasks => !tasks.done ? remainCount++ : '');

    remain.innerHTML = remainCount;
  }

}
const addTask = (e, tasks, formId) => {
  e.preventDefault();

  const {target} = e;


  if(target.id !== formId) return;

  const input = target.title;
  const inputValue = input.value;

  if(!inputValue) return;

  if(inputValue.length < 5 ) {
    alert('Not Less Then 5 symbols');
    return;
  }

  const newTask = {
    id: tasks.length + 1,
    title: inputValue,
    done: false
  }

  tasks.push(newTask);

  updateTasks(onFilter(onSearch(tasks)));

  // Update info Section
  updateTasksInfo(tasks, totalChecker(), false, true);

  // Clear Value

  input.value = '';

}
const removeTask = ({target}, tasks) => {

  if(!target.classList.contains('fa-trash')) return;

  if(!confirm('Are You Sure?')) return;

  const targetItem = target.closest('li');

  if(!targetItem) return;

  const targetId = parseInt(targetItem.getAttribute('data-id'));

  const indexInArray = tasks.findIndex(item => item.id === targetId);

  tasks.splice(indexInArray, 1);

  setId(tasks);

  updateTasks(onFilter(onSearch(tasks)));
  updateTasksInfo(tasks, true, true, true);

  return tasks;

}
const changeTaskStatus = ({target}, tasks) => {

  if(!target.classList.contains('fa-check')) return;

  const targetItem = target.closest('li');

  if(!targetItem) return;

  const targetId = parseInt(targetItem.getAttribute('data-id'));

  const indexInArray = tasks.findIndex(item => item.id === targetId);


  tasks[indexInArray].done = !tasks[indexInArray].done;


  updateTasks(onFilter(onSearch(tasks)));
  updateTasksInfo(tasks, false, true, true);

  return tasks;

}
const onFilter = (tasks) => {
  const value = parseInt(document.querySelector('#filter-tasks').value);
  let newTasksArr = [];

  if(!value) return;

  if(value === 1) {
    newTasksArr =  tasks;
  } else {
    newTasksArr = tasks.filter(({done}) => {
      return value === 2 ? done : !done;
    });
  }

  updateTasks(newTasksArr);
  updateTasksInfo(newTasksArr, 'total', '#tasks-total');
  updateTasksInfo(newTasksArr, 'done', '#tasks-done');
  updateTasksInfo(newTasksArr, 'remain', '#tasks-remain');

  return newTasksArr;
}
const onSearch = (tasks) => {
  const value = document.querySelector('#search-box').value;
  let filterTasks = [];

  if(!value) {
    filterTasks = tasks;
  } else {

    filterTasks = tasks.filter( task => {
      return task.title.indexOf( value ) > -1;
    });
  }

  updateTasks(filterTasks);
  updateTasksInfo(filterTasks, 'total', '#tasks-total');
  updateTasksInfo(filterTasks, 'done', '#tasks-done');
  updateTasksInfo(filterTasks, 'remain', '#tasks-remain');

  return filterTasks;

}

//Set Default Value
updateTasks(tasks);
updateTasksInfo(tasks, true, true, true);


// Add New Task
document.addEventListener('submit', (e) => {addTask(e, tasks, 'task-form')});
document.addEventListener('click', (e) => {removeTask(e, tasks)});
document.addEventListener('click', (e) => {changeTaskStatus(e, tasks)});
document.querySelector('#filter-tasks').addEventListener('change', ()=> {onFilter(onSearch(tasks))})
document.querySelector('#search-box').addEventListener('keyup', ()=> {onSearch(onFilter(tasks))})

