"use strict";
/*
Goals: 
to have a list of current tasks 
to have a list of completed tasks 
to be able to add items to the lists by text input 
to be able to drag tasks between the two lists 
to have tasks be auto sorted within their designated list by due date 
*/

//loader
document.addEventListener("DOMContentLoaded", function () {

  //current date
  let date = new Date();

  const currentDate =
    date.getFullYear().toString() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, 0) +
    "-" +
    date.getDate().toString().padStart(2, 0);

  //immutable date
  const immutableDate = "1999-12-31";

  //theme button
  const themeSwitcher = document.querySelector(".themeBtn");

  themeSwitcher.addEventListener("click", function () {
    document.body.classList.toggle("light-theme");
    document.body.classList.toggle("dark-theme");

    const className = document.body.className;
    if (className == "light-theme") {
      this.textContent = "Dark";
    } else {
      this.textContent = "Light";
    }

    console.log("current theme: " + className);
  });

  //function for removing array items
  function removeObjectWithId(arr, id) {
    const objWithIdIndex = arr.indexOf(id);

    if (objWithIdIndex > -1) {
      arr.splice(objWithIdIndex, 1);
    }

    return arr;
  }

  class List{
    constructor({id, name}) {
      //list name
      this.listName = name;
      //DOM Element
      this.listInTheDOM = document.getElementById(id);
      //lists's inputs
      this.listOfInputs = [];
      //store lists
      this.listStorage = [];
    }
  };

  const currentTasks = new List({id : "current_tasks", name : "currentTasks"});

  const completedTasks = new List({id : "completed_tasks", name : "completedTasks"});

  const listOfLists = [currentTasks, completedTasks];

  //start function

  //input
  let input = document.getElementById("task-input");
  let submitButton = document.getElementById("submit-button");

  let currentIndex = 0;
  let randomTasks = [
    "Fight a Bear!",
    "Beat Minecraft",
    "Tell a Lie",
    "Flex on the Haters",
    "Watch Shrek",
  ]

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    //resets random list
    if (currentIndex > randomTasks.length - 1){
      currentIndex = 0;
    }
    //pushes something to the tasks list
    let taskToAdd = input.value;
    if (input.value == ""){
      taskToAdd = randomTasks[currentIndex];
      currentIndex++;
    }
    currentTasks.listOfInputs.push(taskToAdd);
    input.value = "";
    console.log(input);
    populateEmptyArrays();
  });
  
  populateEmptyArrays();

  function populateEmptyArrays() {
    console.log(currentTasks);
    //checks if lists are empty and if not removes filler items
    if (Array.isArray(currentTasks.listOfInputs) || currentTasks.listOfInputs.length) {
      removeObjectWithId(currentTasks.listOfInputs, "Current Tasks Go Here");
      console.log("full");
    }
    if (Array.isArray(completedTasks.listOfInputs) || completedTasks.listOfInputs.length) {
      removeObjectWithId(completedTasks.listOfInputs, "Completed Tasks Go Here");
      console.log("full");
    }

    //checks whether lists are empty and adds filler items
    if (!Array.isArray(currentTasks.listOfInputs) || !currentTasks.listOfInputs.length) {
      currentTasks.listOfInputs.push("Current Tasks Go Here");
      console.log("empty");
    }
    if (!Array.isArray(completedTasks.listOfInputs) || !completedTasks.listOfInputs.length) {
      completedTasks.listOfInputs.push("Completed Tasks Go Here");
      console.log("empty");
    }

    createLists();
  }

  //insert lists into DOM
  function createLists() {
    function createList(list, task, index) {
      const { listName, listStorage, listInTheDOM } = list;
      const listItem = document.createElement("li");
      let immutable = false;
      if (task == `Current Tasks Go Here` || task == `Completed Tasks Go Here`){
        immutable = true;
      }
      listItem.setAttribute("id", task);
      listItem.setAttribute("name", `${listName}`);
      listItem.setAttribute("class", "draggable");
      listItem.setAttribute(
        "draggable",
        immutable ? "false" : "true"
      );

      listItem.innerHTML = `
          <p class="number">${index + 1}</p>
          <p for="${task}">${task}</p>
          <input value="${currentDate}"
          class="${
            immutable
              ? "hidden"
              : ""
          }" 
          type="date" min="2022-04-01" ${
            immutable ? "readonly" : NaN
          }/>
          <button class="
          ${(immutable) ? "hidden" : "deleteBtn"}
          ">
          ${(listName == "currentTasks") ? "Complete" : "Delete"}
          </button>
        `;

      listStorage.push(listItem);

      listInTheDOM.appendChild(listItem);
    }
    //clearing list storage and dom elements
    currentTasks.listStorage = [];
    currentTasks.listInTheDOM.innerHTML = "";
    completedTasks.listStorage = [];
    completedTasks.listInTheDOM.innerHTML = "";
    
    [...currentTasks.listOfInputs].forEach((task, index) => {
      createList(currentTasks, task, index);
      console.log(task);
      console.log(index);
    });

    [...completedTasks.listOfInputs].forEach((task, index) => {
      createList(completedTasks, task, index);
    });

    addEventListeners();
  }

  function dragStart(draggable) {
    console.log("start");
    draggable.dataTransfer.setData(
      "text",
      JSON.stringify({ id: this.id, name: this.getAttribute("name") })
    );
    console.log(this.id);
    console.log(this);
  }

  function dragOver(zone) {
    console.log("over");
    zone.preventDefault();
    this.classList.add("over");
  }

  function dragDrop(zone) {
    console.log("drop");
    zone.preventDefault();

    var data = JSON.parse(event.dataTransfer.getData("text"));

    if (this.id == "completed_tasks" && data.name == "currentTasks") {
      completedTasks.listOfInputs.push(data.id);
      removeObjectWithId(currentTasks.listOfInputs, data.id);
    }
    if (this.id == "current_tasks" && data.name == "completedTasks") {
      currentTasks.listOfInputs.push(data.id);
      removeObjectWithId(completedTasks.listOfInputs, data.id);
    }
    if (this.id == "completed_tasks" && data.name == "completedTasks") {
      console.log("that was useless");
    }
    if (this.id == "current_tasks" && data.name == "currentTasks") {
      console.log("that was useless");
    }

    this.classList.remove("over");

    populateEmptyArrays();

    console.log(currentTasks.listOfInputs);
    console.log(currentTasks.listInTheDOM);
    console.log(data.name);
    console.log(data.id);
  }

  function dragEnter(zone) {
    console.log("enter");
    this.classList.add("over");
  }

  function dragLeave(zone) {
    console.log("leave");
    this.classList.remove("over");
  }

  function addEventListeners() {
    let dragged = null;

    const draggables = document.querySelectorAll(".draggable"); //everything with the class draggable : all the li
    const dragZones = document.querySelectorAll(".draggable-list"); //the lists

    draggables.forEach((draggable) => {
      console.log(draggable);
      draggable.addEventListener("dragstart", dragStart);
    });

    dragZones.forEach((zone) => {
      zone.addEventListener("dragover", dragOver);
      zone.addEventListener("drop", dragDrop);
      zone.addEventListener("dragenter", dragEnter);
      zone.addEventListener("dragleave", dragLeave);
    });

    //delete button
    let deleteButtons = document.querySelectorAll(".deleteBtn");
    if (deleteButtons) {
      deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener("click", function () {
          let listItem = deleteButton.parentElement
          console.log("name " + listItem.getAttribute("name"));

          console.log(deleteButton.textContent);
          
          
          if (listItem.getAttribute("name") == "completedTasks") {
            removeObjectWithId(completedTasks.listOfInputs, listItem.id);

          } else if (listItem.getAttribute("name") == "currentTasks") {
            removeObjectWithId(currentTasks.listOfInputs, listItem.id);
            completedTasks.listOfInputs.push(listItem.id)
          } else { console.log("no match");
          }

          populateEmptyArrays();
        });
      });
    }
    
  }
});
