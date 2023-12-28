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
    var participantList = document
        .getElementById("participantInputs")
        .getElementsByTagName("input");
    for (var i = 0; i < participantList.length; i++) {
        if (participantList[i].value === studentEmail) {
            alert("Student email already added to the list.");
            return;
        }
    }

    // Add the student email input box to the list
    var participantInputs = document.getElementById("participantInputs");
    var newInput = document.createElement("input");
    newInput.type = "email"; // Change the input type to email
    newInput.value = studentEmail;
    newInput.name = "email";
    newInput.readOnly = true;
    participantInputs.appendChild(newInput);

    document.getElementById("sessionName").value = sName;

    studentEmailInput.value = "";
}

function createSession() {
    var participantList = document
        .getElementById("participantInputs")
        .getElementsByTagName("input");

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

var questions = [];

function addQuestion() {
    // Initialize questions array if undefined
    if (typeof questions === "undefined") {
        questions = [];
    }

    var questionText = document.getElementById("question").value;
    var optionsText = document.getElementById("options").value;
    var correctAnswer = document.getElementById("correctAnswer").value;

    // Validate options
    var options = optionsText.split(",").map(function (option) {
        return option.trim();
    });

    if (options.length !== 4) {
        alert("Please provide exactly four options.");
        return;
    }

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
    answerCell.innerText = correctAnswer;

    questions.push({
        question: questionText,
        options: options,
        answer: correctAnswer,
    });

    document.getElementById("question").value = "";
    document.getElementById("options").value = "";
    document.getElementById("correctAnswer").value = "";
}

function saveTest() {
    const sessionID = document.getElementById("sessionSelect").value;
    const subjectName = document.getElementById("testName").value;
    if (!subjectName) {
        alert("Please enter a test name.");
        document.getElementById("testName").focus();
        return;
    }

    if (!Array.isArray(questions) || questions.length === 0) {
        alert("Please provide at least one question.");
        return;
    }

    fetch("http://localhost:3000/users/addTest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            questions: questions,
            sessionId: sessionID,
            subjectName: subjectName,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                console.error("Missing redirect URL in the response data.");
            }
        })
        .catch((error) => console.error("Error:", error));
}

function fetchData() {
    var selectedSession = document.getElementById("viewSessionSelect").value;

    fetch(`/api/fetch-tests?session=${selectedSession}`)
        .then((response) => response.json())
        .then((tests) => {
            // Populate the test dropdown with fetched tests
            var testSelect = document.getElementById("viewTestSelect");
            testSelect.innerHTML = "";
            tests.forEach((test) => {
                var option = document.createElement("option");
                option.value = test._id;
                option.textContent = test.testName;
                testSelect.appendChild(option);
            });
        })
        .catch((error) => console.error("Error fetching tests:", error));
}

function toggleQuestions(selectedTest) {
    const form = document.getElementById('questionsForm');
    const testIdInput = document.getElementById('testId');
    testIdInput.value = selectedTest;
    form.style.display = selectedTest === '0' ? 'none' : 'block';
}
