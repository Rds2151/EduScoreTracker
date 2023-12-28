/*!
 * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector("#sidebarToggle");
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener("click", (event) => {
            event.preventDefault();
            document.body.classList.toggle("sb-sidenav-toggled");
            localStorage.setItem(
                "sb|sidebar-toggle",
                document.body.classList.contains("sb-sidenav-toggled")
            );
        });
    }
});

document.getElementById("userType").addEventListener("change", function () {
    var studentFields = document.getElementById("studentFields");
    var teacherFields = document.getElementById("teacherFields");

    if (this.value === "student") {
        studentFields.style.display = "block";
        teacherFields.style.display = "none";
        enableFields(studentFields);
        disableFields(teacherFields);
    } else if (this.value === "teacher") {
        studentFields.style.display = "none";
        teacherFields.style.display = "block";
        enableFields(teacherFields);
        disableFields(studentFields);
    } else {
        studentFields.style.display = "none";
        teacherFields.style.display = "none";
    }
});

function enableFields(container) {
    var fields = container.querySelectorAll("input, select, textarea");
    fields.forEach(function (field) {
        field.removeAttribute("disabled");
    });
}

function disableFields(container) {
    var fields = container.querySelectorAll("input, select, textarea");
    fields.forEach(function (field) {
        field.setAttribute("disabled", "disabled");
    });
}

function showForm(formId) {
    const forms = document.querySelectorAll('div[id$="Form"]');
    forms.forEach((form) => {
        form.style.display = "none";
    });

    document.getElementById(formId).style.display = "block";
}

function addStudent(selfMail) {
    var studentEmailInput = document.getElementById("studentEmail");
    var sessionNameInput = document.getElementById("sessionNameInput");
    var studentEmail = studentEmailInput.value.trim();
    var sName = sessionNameInput.value.trim();

    // Validate and ensure the input is not empty
    if (studentEmail === "" || studentEmail === selfMail) {
        alert("Please enter a valid student email.");
        return;
    }

    // Check if the student email is already in the list
    var participantList = document.getElementById("participantInputs").getElementsByTagName("input");
    for (var i = 0; i < participantList.length; i++) {
        if (participantList[i].value === studentEmail) {
            alert("Student email already added to the list.");
            return;
        }
    }

    // Add the student email input box to the list
    var participantInputs = document.getElementById("participantInputs");
    var newInput = document.createElement("input");
    newInput.type = "email";  // Change the input type to email
    newInput.value = studentEmail;
    newInput.name = "email";
    newInput.readOnly = true;
    participantInputs.appendChild(newInput);

    document.getElementById('sessionName').value = sName;

    studentEmailInput.value = "";
}

function createSession() {
    var participantList = document.getElementById("participantInputs").getElementsByTagName("input");

    if (participantList.length === 0) {
        alert("Please add at least one student email.");
        return;
    }

    document.getElementById("createSessionForm").submit();
}


var sessions = ["Session 1", "Session 2"];
    var sessionSelect = document.getElementById("sessionSelect");
    sessions.forEach(function (session) {
        var option = document.createElement("option");
        option.value = session;
        option.text = session;
        sessionSelect.appendChild(option);
    });

    function addQuestion() {
        var questionText = prompt("Enter the question:");
        var optionsText = prompt("Enter options separated by commas (e.g., Option 1, Option 2, Option 3):");
        var options = optionsText.split(",").map(function (option) {
            return option.trim();
        });
        var answer = prompt("Enter the correct answer:");

        // Create a table row for the question
        var tableBody = document.getElementById("questionsTableBody");
        var newRow = tableBody.insertRow(tableBody.rows.length);

        // Question
        var questionCell = newRow.insertCell(0);
        questionCell.innerText = questionText;

        // Options
        var optionsCell = newRow.insertCell(1);
        optionsCell.innerText = options.join(", ");

        // Answer
        var answerCell = newRow.insertCell(2);
        answerCell.innerText = answer;
    }

    function saveTest() {
        // Add logic to save the test data
        console.log("Saving test...");
    }