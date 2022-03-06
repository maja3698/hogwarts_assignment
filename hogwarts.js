"use strict";

let systemHacked = false;

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let filterStudents;
let expelledStudents = [];
let regStudents;
let squadStudents = [];
let familiesArray = [];
let prefects = [];

const Student = {
  blood: "",
  firstname: "",
  middlename: "",
  lastname: "",
  alias: "",
  house: "",
  status: "",
  prefect: false,
  squad: false,
  regStudent: true,
  siblings: false,
  cantbeExpelled: false,
  hasImg: true,
};

const mella = {
  firstname: "Melania",
  lastname: "Irimia",
  middlename: "Gabriela",
  image: "./students-pics/irimia_m.png",
  house: "Gryffindor",
  status: false,
  blood: "Pure Blood",
  prefect: false,
  squad: false,
  gender: "girl",
  regStudent: true,
  cantbeExpelled: true,
};

const maja = {
  firstname: "Maja",
  lastname: "Berendsen",
  middlename: "",
  image: "./students-pics/irimia_m.png",
  house: "Ravenclaw",
  status: false,
  blood: "Pure Blood",
  prefect: false,
  squad: false,
  gender: "girl",
  regStudent: true,
  cantbeExpelled: true,
};

function start() {
  console.log("ready");
  // TODO: Add event-listeners to filter and sort button

  //FILTERS EVENTS:
  document
    .querySelectorAll("[data-action='filterB']")
    .forEach((button) => button.addEventListener("click", selectFilterB));

  document
    .querySelectorAll("[data-action='filterH']")
    .forEach((button) => button.addEventListener("click", selectFilterH));

  document
    .querySelectorAll("[data-action='filterS']")
    .forEach((button) => button.addEventListener("click", selectFilterS));

  document
    .querySelector("[data-action='filterP']")
    .addEventListener("click", selectFilterP);

  document
    .querySelector("[data-action='filterI']")
    .addEventListener("click", selectFilterI);
  document.querySelector(".searchbar").addEventListener("input", searchBar);

  document.querySelector(".filter-all").addEventListener("click", showAll);

  // SORTING EVENTS:
  document

    .querySelectorAll("[data-action='sort']")

    .forEach((button) => button.addEventListener("click", selectSort));

  document.querySelector(".searchbar").addEventListener("input", searchBar);

  document.querySelector(".hack").addEventListener("click", hackSystem);
  document.querySelector(".hack").addEventListener("click", hackTheSystemPU);
  // document.querySelector(".hack").addEventListener("click", openHackedPU);
  runJSON();
}

function searchBar(e) {
  const searchString = e.target.value.toLowerCase();
  const searchedStudents = allStudents.filter((student) => {
    return (
      student.firstname.toLowerCase().includes(searchString) ||
      student.lastname.toLowerCase().includes(searchString) ||
      student.house.toLowerCase().includes(searchString)
    );
  });
  displayList(searchedStudents);
}

async function runJSON() {
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const jsonData = await response.json();
  const familiesData = await fetch(
    "https://petlatkea.dk/2021/hogwarts/families.json"
  );
  familiesArray = await familiesData.json();

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
  let middleName = cleanFullname.substring(
    cleanFullname.indexOf(" "),
    cleanFullname.lastIndexOf(" ")
  );
  let lastName = cleanFullname.substring(cleanFullname.lastIndexOf(" "));

  let cleanHouse = jsonObject.house.trim();
  let cleanLName = lastName.trim();
  let cleanName = firstName.trim();
  let cleanMName = middleName.trim();

  student.lastname = `${cleanLName.substring(0, 1).toUpperCase()}${cleanLName
    .substring(1, cleanLName.length)
    .toLowerCase()}`;
  student.middlename = `${cleanMName.substring(0, 1).toUpperCase()}${cleanMName
    .substring(1, cleanMName.length)
    .toLowerCase()}`;
  if (firstName) {
    student.firstname = `${cleanName.substring(0, 1).toUpperCase()}${cleanName
      .substring(1, cleanName.length)
      .toLowerCase()}`;
  } else {
    student.firstname = `${cleanMName.substring(0, 1).toUpperCase()}${cleanMName
      .substring(1, cleanMName.length)
      .toLowerCase()}`;
    student.middlename = "";
  }
  if (cleanMName.startsWith('"')) {
    student.middlename = "";
    student.alias = cleanMName;
  }

  if (student.lastname === "Leanne") {
    student.hasImg = false;
  }

  // BOOLEAN FOR BLOOD STATUS
  let pureBloodFamilies = familiesArray.pure;
  let halfBloodFamilies = familiesArray.half;
  if (pureBloodFamilies.includes(student.lastname)) {
    student.blood = "Pure Blood";
  } else if (halfBloodFamilies.includes(student.lastname)) {
    student.blood = "Half-Blood";
  } else {
    student.blood = "Muggle";
  }
  student.house = `${cleanHouse.substring(0, 1).toUpperCase()}${cleanHouse
    .substring(1, cleanHouse.length)
    .toLowerCase()}`;

  // BOOLEAN FOR EXPELLED STUDENTS
  student.cantbeExpelled = false;
  student.regStudent = true;

  // if (student.regStudent) {
  //   student.status = "Regular Student";
  // } else {
  //   student.status = "Expelled Student";
  // }

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

  buildList(filterStudents);
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

function selectFilterS(event) {
  const filter = event.target.dataset.filter;
  console.log(`user select, ${filter}`);
  filterSList(filter);
}

function selectFilterP(event) {
  const filter = event.target.dataset.filter;
  console.log(`user select, ${filter}`);
  filterPList(filter);
}

function selectFilterI(event) {
  const filter = event.target.dataset.filter;
  console.log(`user select, ${filter}`);
  filterIList(filter);
}

function filterIList(filter) {
  filterStudents = allStudents;
  if (filter === "squad") {
    filterStudents = filterStudents.filter((student) => student.squad === true);
  } else {
    filterStudents = filterStudents.filter(
      (student) => student.squad === false
    );
  }
  console.log("status", filterStudents);
  buildList(filterStudents);
}

function filterPList(filter) {
  filterStudents = allStudents;
  if (filter === "pref") {
    filterStudents = filterStudents.filter(
      (student) => student.prefect === true
    );
  } else {
    filterStudents = filterStudents.filter(
      (student) => student.prefect === false
    );
  }
  console.log("status", filterStudents);
  buildList(filterStudents);
}

function filterSList(filter) {
  filterStudents = allStudents;
  if (filter === "n-expelled") {
    filterStudents = filterStudents.filter(
      (student) => student.regStudent === true
    );
  } else {
    filterStudents = filterStudents.filter(
      (student) => student.regStudent === false
    );
  }
  console.log("status", filterStudents);
  buildList(filterStudents);
}

function filterHList(house) {
  filterStudents = allStudents;
  if (house === "Gryffindor") {
    filterStudents = filterStudents.filter(
      (student) => student.house === "Gryffindor"
    );
  } else if (house === "Hufflepuff") {
    filterStudents = filterStudents.filter(
      (student) => student.house === "Hufflepuff"
    );
  } else if (house === "Ravenclaw") {
    filterStudents = filterStudents.filter(
      (student) => student.house === "Ravenclaw"
    );
  } else if (house === "Slytherin") {
    filterStudents = filterStudents.filter(
      (student) => student.house === "Slytherin"
    );
  }
  console.log(filterStudents);
  //   let purestudents = filterStudents.filter(isPure);

  //   let muggleStudents = filterStudents.filter(isMuggle);
  buildList(filterStudents);
}

function filterBList(blood) {
  filterStudents = allStudents;

  if (blood === "Pure Blood") {
    filterStudents = filterStudents.filter(
      (student) => student.blood === "Pure Blood"
    );
  } else if (blood === "Half-Blood") {
    filterStudents = filterStudents.filter(
      (student) => student.blood === "Half-Blood"
    );
  } else {
    filterStudents = filterStudents.filter(
      (student) => student.blood === "Muggle"
    );
  }

  console.log(filterStudents);

  // let purestudents = filterStudents.filter(isPure);

  // let muggleStudents = filterStudents.filter(isMuggle);

  buildList(filterStudents);
}

function showAll() {
  filterStudents = allStudents;
  buildList(allStudents);
}

//build list
function buildList() {
  console.log("buildList");

  displayList(filterStudents);
}

function displayList(students) {
  document.querySelector("#list tbody").innerHTML = "";
  console.log("displayList");

  // build a new list
  students.forEach(displayStudent);
}

//DISPLAY EACH STUDENT AND PRINT
///
////
function displayStudent(student) {
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=fname]").textContent = student.firstname;
  //   clone.querySelector("[data-field=middle-name]").textContent =
  //     student.middlename;
  clone.querySelector("[data-field=mname]").textContent = student.middlename;

  clone.querySelector("[data-field=lname]").textContent = student.lastname;

  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=blood-status]").textContent = student.blood;

  if (student.regStudent) {
    clone.querySelector("[data-field=status]").textContent = "Regular Student";
  } else {
    clone.querySelector("[data-field=status]").textContent = "Expelled Student";
    clone.querySelector("#student-line").classList.add("grey");
  }

  if (student.prefect) {
    clone.querySelector(".pref-badge").classList.remove("grey");
  } else {
    clone.querySelector(".pref-badge").classList.add("grey");
  }

  if (student.squad) {
    clone.querySelector(".i-badge").classList.remove("grey");
  } else {
    clone.querySelector(".i-badge").classList.add("grey");
  }

  //SET COUNTER

  document.querySelector(
    "#all-counter"
  ).textContent = `(${allStudents.length})`;
  document.querySelector("#pref-counter").textContent = `(${prefects.length})`;
  document.querySelector(
    "#squad-counter"
  ).textContent = `(${squadStudents.length})`;
  document.querySelector(
    "#expell-counter"
  ).textContent = `(${expelledStudents.length})`;

  let countingPrefects = allStudents.filter(
    (student) => student.prefect === true
  );

  let countingRegStudents = allStudents.filter(
    (student) => student.regStudent === true
  );

  document.querySelector(
    "#pref-counter"
  ).textContent = `(${countingPrefects.length})`;

  document.querySelector(
    "#reg-counter"
  ).textContent = `(${countingRegStudents.length})`;

  let countingPureBloods = allStudents.filter(
    (student) => student.blood === "Pure Blood"
  );
  document.querySelector(
    "#pureb-counter"
  ).textContent = `(${countingPureBloods.length})`;

  let countingHalfBloods = allStudents.filter(
    (student) => student.blood === "Half-Blood"
  );
  document.querySelector(
    "#halfb-counter"
  ).textContent = `(${countingHalfBloods.length})`;

  let countingMuggles = allStudents.filter(
    (student) => student.blood === "Muggle"
  );
  document.querySelector(
    "#muggle-counter"
  ).textContent = `(${countingMuggles.length})`;

  // EVENTLISTENERS FOR POPUP BOX
  clone.querySelector("[data-field='lname'").addEventListener("click", openPU);
  clone.querySelector("[data-field='fname'").addEventListener("click", openPU);
  clone
    .querySelector("[data-field=pref]")
    .addEventListener("click", prefClicked);
  clone
    .querySelector("[data-field=squad]")
    .addEventListener("click", squadClicked);

  ////FUNCTIONS FOR CLICK

  function prefClicked() {
    if (student.regStudent === true) {
      if (student.prefect === true) {
        student.prefect = false;
        const index = prefects.indexOf(student);
        prefects.splice(index, 1);
        console.log("taking out of the array");
      } else {
        console.log("its your student");
        student.prefect = true;
        //   prefects.push(student);
        checkPref(student);
      }
    } else {
      student.prefect = false;
    }
    buildList();
  }

  function checkPref(student) {
    const prefectsHouse = prefects.filter(
      (stud) => stud.house === student.house
    );
    console.log(prefectsHouse);
    const nrHouse = prefectsHouse.length;

    if (student.prefect === true) {
      if (nrHouse >= 2) {
        console.log("you can have only 2 per house", prefectsHouse[1].house);
        student.prefect = false;
        document.querySelector(
          "#pref-text"
        ).textContent = `Remove a student from ${prefectsHouse[1].house} to continue`;
        document.querySelector("#pref-popup").classList.remove("hidden");
        document.querySelector("#pref-btn").addEventListener("click", closePU);
      } else {
        makeToPref(student);
        console.log("make prefect");
      }
    }
  }

  function makeToPref(student) {
    student.prefect = true;

    prefects.push(student);

    buildList();
  }

  function squadClicked() {
    console.log("squad is clicked");

    if (systemHacked === false) {
      if (student.regStudent === true) {
        if (student.blood === "Pure Blood" || student.house === "Slytherin") {
          if (student.squad === true) {
            student.squad = false;

            const index = squadStudents.indexOf(student);

            squadStudents.splice(index, 1);
          } else {
            student.squad = true;
            squadStudents.push(student);
            console.log(squadStudents);
          }
        } else {
          console.log("you cant be squad");
          // student.squad = true;

          //     squadStudents.push(student);
          // console.log(squadStudents);
          document.querySelector("#squad-popup").classList.remove("hidden");

          document
            .querySelector("#squad-btn")
            .addEventListener("click", closePU);
        }
      } else {
        student.squad = false;
      }
    } else {
      squadHacked();
    }
    buildList();
  }

  ////  WHEN SYSTEM IS HACKED

  function squadHacked() {
    console.log("kali");
    if (student.blood === "Pure Blood" || student.house === "Slytherin") {
      squadStudents.push(student);
      student.squad = true;
      setTimeout(hackingSquad, 5000);
    } else {
      console.log("you cant be squad");
      document.querySelector("#squad-popup").classList.remove("hidden");
      document.querySelector("#squad-btn").addEventListener("click", closePU);
    }
    buildList();
  }

  function hackingSquad() {
    student.squad = false;
    const index = squadStudents.indexOf(student);
    squadStudents.splice(index, 1);

    buildList();
  }

  function openPU() {
    console.log("show student info", student.lastname);
    document.querySelector("#student-popup").classList.remove("hidden");
    if (student.alias) {
      document.querySelector("#popup-name").textContent =
        student.firstname + " " + student.alias + " " + student.lastname;
    } else {
      document.querySelector("#popup-name").textContent =
        student.firstname + " " + student.middlename + " " + student.lastname;
    }

    if (student.regStudent) {
      document.querySelector("#popup-status").textContent = "Regular Student";
    } else {
      document.querySelector("#popup-status").textContent = "Expelled Student";
      // document.querySelector("#popup-status").classList.add("red");
      document.querySelector("#popup-expell").classList.add("hidden");
    }

    if (student.squad) {
      // Member of the Inquisitory Squad
      document.querySelector("#popup-sq").textContent =
        "Member of the Inquisitory Squad";
    } else {
      document.querySelector("#popup-sq").textContent =
        "Not Member of the Inquisitory Squad";
    }
    if (student.prefect) {
      // Member of the Inquisitory Squad
      document.querySelector("#popup-pref").textContent = "Prefect";
    } else {
      document.querySelector("#popup-pref").textContent = "Not a Prefect";
    }

    //FOR HOUSE IMG

    // document.querySelector(
    //   "#house-flag"
    // ).src = `/assets/${student.house}-flag.svg`;
    // document.querySelector("#house-logo").src = `/assets/${student.house}.png`;


    document.querySelector(
      "#house-logo"
    ).src = `./house-flags/${student.house}.svg`;
    

    document.querySelector("#popup-house").textContent = student.house;

    document.querySelector("#popup-blood").textContent = student.blood;

    if (student.lastname.includes("-")) {
      let urlImage;
      let imglastName = student.lastname.substring(
        student.lastname.indexOf("-") + 1
      );
      urlImage =
        imglastName + "_" + student.firstname.charAt(0).toLowerCase() + ".png";
      console.log(urlImage);
      document.querySelector("#student-pic").src = `./students-pics/${urlImage}`;
    } else {
      document.querySelector("#student-pic").src = `./students-pics/${
        student.lastname
      }_${student.firstname}.png`;
    }

    if (student.lastname === "Patil") {
      document.querySelector(
        "#student-pic"
      ).src = `./students-pics/${student.lastname}_${student.firstname}.png`;
    }

    if (student.hasImg === false) {
      document.querySelector("#student-pic").src = `./students-pics/no_img.png`;
    }

    document.querySelector(
      "#house-logo"
    ).src = `./house-flags/${student.house}.svg`;

    // document.querySelector("#house-logo").src = `/icons/${student.house}.png`;

    document.querySelector("#popup-close").addEventListener("click", closePU);

    // FOR EXPELLED STUDENT
    document
      .querySelector("#popup-expell")
      .addEventListener("click", expellStudent);

    buildList();

    function expellStudent() {
      if (student.cantbeExpelled === true) {
        document
          .querySelector("#popup-expell")
          .addEventListener("click", cantExpell);
      } else {
        expelledStudents.push(student);

        student.regStudent = false;
        document
          .querySelector("#popup-expell")
          .removeEventListener("click", expellStudent);
        document.querySelector("#popup-status").textContent =
          "Expelled Student";

        console.log(student.firstname + " is expelled");
      }

      buildList();
    }
  }
  document.querySelector("#list tbody").appendChild(clone);
}

function closePU() {
  document.querySelector("#student-popup").classList.add("hidden");
  document.querySelector("#pref-popup").classList.add("hidden");
  document.querySelector("#squad-popup").classList.add("hidden");
  document.querySelector("#hack-popup").classList.add("hidden");
}

function closeSquad() {
  document.querySelector("#squad-popup").classList.add("hidden");
}

//hacking
let clicked = true;
document.querySelector(".hack").removeEventListener("click", hackSystem);

function hackSystem() {
  console.log("hackpopup");
  systemHacked = true;
  allStudents.forEach(randomBlood);
  allStudents.push(mella);
  allStudents.push(maja);
  buildList();
}

function hackTheSystemPU() {
  document.querySelector("#hackedsystem-popup").classList.remove("hidden");
  setTimeout(hackTheSystemClosePU, 2000);
}

function hackTheSystemClosePU() {
  document.querySelector("#hackedsystem-popup").classList.add("hidden");
}

function cantExpell() {
  document.querySelector("#hack-popup").classList.remove("hidden");
  document.querySelector("#hack-btn").addEventListener("click", closePU);
}

function randomBlood(student) {
  console.log(student);
  if (student.blood === "Pure Blood") {
    const types = ["Muggle", "Half-Blood"];
    const randomNumber = Math.floor(Math.random() * 2);
    student.blood = types[randomNumber];
    console.log(student.blood);
  } else {
    student.blood = "Pure Blood";
    console.log(student.blood);
  }
}
