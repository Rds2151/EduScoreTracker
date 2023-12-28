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

function validateSession(event) {
    event.preventDefault();

    // Ensure that the list is not empty before submitting
    var participantList = document.getElementById("participantInputs").getElementsByTagName("input");
    if (participantList.length === 0) {
        alert("Please add at least one student before creating the session.");
        return;
    }

    // Add any additional validation logic here if needed

    // Submit the form
    document.getElementById("createSessionForm").submit();
}

function addStudent(selfMail) {
    var studentEmailInput = document.getElementById("studentEmail");
    var studentEmail = studentEmailInput.value.trim();

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

    // Clear the input field
    studentEmailInput.value = "";
}

function createSession() {
    // Trigger the form submission
    document.getElementById("createSessionForm").submit();
}

// function createSession() {
//     var studentEmail = document.getElementById("studentEmail").value;

//     if (!studentEmail || !isValidEmail(studentEmail)) {
//         alert("Please enter a valid student email.");
//         return;
//     }

//     // Append the student name to the table
//     var tableBody = document
//         .getElementById("sessionParticipants")
//         .getElementsByTagName("tbody")[0];
//     var newRow = tableBody.insertRow(tableBody.rows.length);
//     var cell = newRow.insertCell(0);
//     cell.innerHTML = studentEmail;
// }

// function addStudent() {
//     var studentEmail = document.getElementById("studentEmail").value;
//     var tableBody = document.getElementById("sessionParticipants").getElementsByTagName('tbody')[0];
//     var newRow = tableBody.insertRow(tableBody.rows.length);
//     var cell = newRow.insertCell(0);
//     cell.innerHTML = studentEmail;
// }

// // Basic email validation function
// function isValidEmail(email) {
//     var emailRegex = /\S+@\S+\.\S+/;
//     return emailRegex.test(email);
// }

// function validateSession() {
//     var table = document.getElementById("sessionParticipants");
//     if (table.rows.length === 0) {
//         alert("Please add at least one student to the session.");
//         return false;
//     }
// }