"use strict";

const pureBloodFamilies = ["Boot", "Cornfoot", "Abbott", "Avery", "Black", "Blishwick", "Brown", "Bulstrode", "Burke", "Carrow",

  "Crabbe", "Crouch", "Fawley", "Flint", "Gamp", "Gaunt", "Goyle", "Greengrass", "Kama", "Lestrange", "Longbottom", "MacDougal", "Macmillan",

  "Malfoy","Max", "Moody", "Nott", "Ollivander", "Parkinson", "Peverell", "Potter", "Prewett", "Prince", "Rosier", "Rowle", "Sayre", "Selwyn",

  "Shacklebolt", "Shafiq", "Slughorn", "Slytherin", "Travers", "Tremblay", "Tripe", "Urquart", "Weasley", "Yaxley", "Bletchley", "Dumbledore",

  "Fudge", "Gibbon", "Gryffindor", "Higgs", "Lowe", "Macnair", "Montague", "Mulciber", "Orpington", "Pyrites", "Perks", "Runcorn", "Wilkes",

  "Zabini",
];

const halfBloodFamilies = ["Abbott", "Bones", "Jones", "Hopkins", "Finnigan", "Potter", "Brocklehurst", "Goldstein", "Corner", "Bulstrode", "Patil", "Li", "Thomas"];

window.addEventListener("DOMContentLoaded", setUp);

let allStudents = [];
let filterStudents;

// let studentBlood = student.blood;
// The prototype for all animals:
const Student = {
  blood: "",
  firstname: "",
  middlename: "",
  lastname: "",
  alias: "",
  house: "",
  status: "",
  prefect: false,
  sqaud: false,
  regStudent: true,
};

function setUp() {
  console.log("ready");
  // TODO: Add event-listeners to filter and sort button

  //FILTERS EVENTS:
  document.querySelectorAll("[data-action='filterB']").forEach((button) => button.addEventListener("click", selectFilterB));
  loadJSON();
  document.querySelectorAll("[data-action='filterH']").forEach((button) => button.addEventListener("click", selectFilterH));
  document.querySelector(".filter-all").addEventListener("click", showAll);


  // SORTING EVENTS:
  document

    .querySelectorAll("[data-action='sort']")

    .forEach((button) => button.addEventListener("click", selectSort));
}

async function loadJSON() {
  const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

//PREPARES OBJECTS:
function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  console.log("allStudents", allStudents);
  filterStudents = allStudents;
  displayList(filterStudents);
  return filterStudents;
}

// PREPARE JSON OBJECTS AND CLEANS STRINGS

function prepareObject(jsonObject) {
  const student = Object.create(Student);
  let cleanFullname = jsonObject.fullname.trim();
  let firstName = cleanFullname.substring(0, cleanFullname.indexOf(" "));
  let middleName = cleanFullname.substring(cleanFullname.indexOf(" "), cleanFullname.lastIndexOf(" "));
  let lastName = cleanFullname.substring(cleanFullname.lastIndexOf(" "));

  let cleanHouse = jsonObject.house.trim();
  let cleanLName = lastName.trim();
  let cleanName = firstName.trim();
  let cleanMName = middleName.trim();

  student.lastname = `${cleanLName.substring(0, 1).toUpperCase()}${cleanLName.substring(1, cleanLName.length).toLowerCase()}`;
  student.middlename = `${cleanMName.substring(0, 1).toUpperCase()}${cleanMName.substring(1, cleanMName.length).toLowerCase()}`;
  if (firstName) {
    student.firstname = `${cleanName.substring(0, 1).toUpperCase()}${cleanName.substring(1, cleanName.length).toLowerCase()}`;
  } else {
    student.firstname = `${cleanMName.substring(0, 1).toUpperCase()}${cleanMName.substring(1, cleanMName.length).toLowerCase()}`;
    student.middlename = "";
  }
  if (cleanMName.startsWith('"')) {
    student.middlename = "";
  }

 // BOOLEAN FOR BLOOD STATUS

  if (pureBloodFamilies.includes(student.lastname)) {
    student.blood = "Pure Blood";
  } else if (halfBloodFamilies.includes(student.lastname)) {
    student.blood = "Half-Blood";
  } else {
    student.blood = "Muggle";
  }
  student.house = `${cleanHouse.substring(0, 1).toUpperCase()}${cleanHouse.substring(1, cleanHouse.length).toLowerCase()}`;

  // BOOLEAN FOR EXPELLED STUDENTS

  if (student.regStudent) {
    student.status = "Regular Student";
  } else {
    student.status = "Expelled Student";
  }

  return student;
}


// SORTING FUNCTIONS AND DISPLAY

function selectSort(event) {
  const sortParam = event.target.dataset.sort;
  console.log(`user select, ${sortParam}`);
  sortList(sortParam);
}

function sortList(sortParam) {
  filterStudents = filterStudents.sort(sortByParam);

  function sortByParam(studentA, studentB) {
    if (studentA[sortParam] < studentB[sortParam]) {
      return -1;
    } else {
      return 1;
    }
  }

  displayList(filterStudents);
}

//FILTERING FUNCTIONS AND DISPLAY

function selectFilterB(event) {
  const filter = event.target.dataset.filter;

  console.log(`user select, ${filter}`);

  filterBList(filter);
}

function selectFilterH(event) {
  const filter = event.target.dataset.filter;
  console.log(`user select, ${filter}`);
  filterHList(filter);
}

function filterHList(house) {
  filterStudents = allStudents;
  if (house === "Gryffindor") {
    filterStudents = filterStudents.filter((student) => student.house === "Gryffindor");
  } else if (house === "Hufflepuff") {
    filterStudents = filterStudents.filter((student) => student.house === "Hufflepuff");
  } else if (house === "Ravenclaw") {
    filterStudents = filterStudents.filter((student) => student.house === "Ravenclaw");
  } else if (house === "Slytherin") {
    filterStudents = filterStudents.filter((student) => student.house === "Slytherin");
  }
  console.log(filterStudents);
  //   let purestudents = filterStudents.filter(isPure);

  //   let muggleStudents = filterStudents.filter(isMuggle);
  displayList(filterStudents);
}

function filterBList(blood) {
  filterStudents = allStudents;

  if (blood === "Pure Blood") {
    filterStudents = filterStudents.filter((student) => student.blood === "Pure Blood");
  } else if (blood === "Half-Blood") {
    filterStudents = filterStudents.filter((student) => student.blood === "Half-Blood");
  } else {
    filterStudents = filterStudents.filter((student) => student.blood === "Muggle");
  }

  console.log(filterStudents);

  // let purestudents = filterStudents.filter(isPure);

  // let muggleStudents = filterStudents.filter(isMuggle);

  displayList(filterStudents);
}

function showAll() {
  filterStudents = allStudents;
  displayList(allStudents);
}

function displayList(students) {
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}


//DISPLAY EACH STUDENT AND PRINT
///
////
function displayStudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=fname]").textContent = student.firstname;
  //   clone.querySelector("[data-field=middle-name]").textContent =
  //     student.middlename;
  clone.querySelector("[data-field=mname]").textContent = student.middlename;

  clone.querySelector("[data-field=lname]").textContent = student.lastname;

  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=blood-status]").textContent = student.blood;

  // EVENTLISTENERS FOR POPUP BOX
  clone.querySelector("[data-field='lname'").addEventListener("click", openPU);
  clone.querySelector("[data-field='fname'").addEventListener("click", openPU);
  function openPU() {
    console.log("show student info", student.lastname);
    document.querySelector("#student-popup").classList.remove("hidden");
    document.querySelector("#popup-name").textContent = student.firstname + " " + student.middlename + " " + student.lastname;
    document.querySelector("#popup-house").textContent = student.house;
    document.querySelector("#popup-blood").textContent = student.blood;
    document.querySelector("#popup-status").textContent = student.status;
    if (student.lastname.includes("-")) {
      let urlImage;
      let imglastName = student.lastname.substring(student.lastname.indexOf("-") + 1);
      urlImage = imglastName + "_" + student.firstname.charAt(0).toLowerCase() + ".png";
      console.log(urlImage);
      document.querySelector("#student-pic").src = `/students-pics/${urlImage}`;
    } else {
      document.querySelector("#student-pic").src = `/students-pics/${student.lastname}_${student.firstname.charAt(0)}.png`;
    }

    document.querySelector("#popup-close").addEventListener("click", closePU);

    //     <div id="popup-header">
    //     <div id="popup-title">
    //         <h2 id="popup-name">Harry Potter</h2>
    //         <h3 id="popup-house">House <span id="stud-house">Griffindor</span></h3>
    //     </div>
    //     <div id="popup-house-logo">G</div>
    // </div>
    // <p id="popup-pref">Prefect</p>
    // <p id="popup-p-blood">Pure Blood</p>
    // <p id="popup-h-blood">Half Blood</p>
    // <p id="popup-muggle">Muggle</p>
    // <p id="popup-sq"><span id="popup-squad">Not </span>Member of the Inquisitory Squad</p>
    // <p id="popup-stud-st">Student Status: <span id="poup-status">Regular</span></p>
    // <div id="popup-btns">
    //     <button id="popup-expell">Expell Student</button>
    //     <button id="popup-close">Close Window</button>
    // </div>
  };
  document.querySelector("#list tbody").appendChild(clone);
};

function closePU() {
  document.querySelector("#student-popup").classList.add("hidden");
  document.querySelector("#pref-popup").classList.add("hidden");
  document.querySelector("#squad-popup").classList.add("hidden");
}
