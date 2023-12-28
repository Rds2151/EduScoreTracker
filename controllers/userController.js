const server = require("../services/Server");
const bcrypt = require("bcrypt");
const sobj = new server();
const { Student, Test } = require("../models/Model");

exports.register = async (details) => {
    const { email, contactPhone, firstName, lastName, password } = details;
    let diffData;
    try {
        if (await sobj.isMailPresent(email))
            return {
                error: "Email is already associated with another account",
                hasError: true,
            };

        const hashpassword = bcrypt.hashSync(password, 10);

        if (details.userType === "teacher") {
            diffData = details.specialization;
            await sobj.createTeacherAccount(
                firstName,
                lastName,
                email,
                contactPhone,
                diffData,
                hashpassword
            );
        } else {
            diffData = details.location;
            await sobj.createStudentAccount(
                firstName,
                lastName,
                email,
                contactPhone,
                diffData,
                hashpassword
            );
        }
        return { message: "Account created successfully", hasError: false };
    } catch (err) {
        console.error("Unexpected error during account creation:", err);
        throw { error: "Unexpected error occurred", hasError: true };
    }
};

exports.createSession = async (mails, sessionName, id) => {
    let error = "Email not found in Student Database: ";
    let hasError = false;
    let studentsId = [];

    try {
        for (let email of mails) {
            const result = await sobj.getStudentMail(email);
            if (result === null) {
                error += email + "\n";
                hasError = true;
            } else {
                studentsId.push(result._id);
            }
        }
        
        if (hasError) return { "error": error, hasError: true };
    
        const user = await sobj.getTeacherById(id);
        if (user === null)
            return {
                error: "Something went wrong! Please refresh the tab",
                hasError: true,
            };

        const result = await sobj.createSession(studentsId,sessionName, user._id);
    
        return { message: "Session created successfully", hasError: false };
    } catch (err) {
        console.error("Unexpected error during account creation:", err);
        throw { error: `Unexpected error: ${err.message}`, hasError: true };
    }
};

exports.fetchAllSession = async (id) => {
    try {
        const teacher = await sobj.getTeacherById(id);
        if (teacher === null)
            return {
                error: "Something went wrong! Please refresh the tab",
                hasError: true,
            };
    
        let result = await sobj.fetchAllSession(id);
        return { session: result , hasError: false };
    } catch (err) {
        console.error("Unexpected error during account creation:", err);
        throw { error: `Unexpected error: ${err.message}`, hasError: true };
    }
};

exports.addTest = async (questions, sessionId, subjectName) => {
    try {        
        const result = await sobj.createTest(questions, sessionId, subjectName);
        return { message: result.message };
    } catch (err) {
        console.error("Unexpected error during account creation:", err);
        throw { message: "Failed to tranfer ingredient." };
    }
}

exports.fetchTest = async (id) => {
    try {        
        const result = await sobj.fetchTest(id);
        return { "testData" : result };
    } catch (err) {
        console.error("Unexpected error during account creation:", err);
        throw { message: err.message };
    }
}

const calculateScore = (test, selectedOptions) => {
    let score = 0;

    for (let i = 0; i < test.questions.length; i++) {
        const question = test.questions[i];
        const selectedOption = selectedOptions[`q${i + 1}`];

        if (question.answer === selectedOption) {
            score++;
        }
    }

    return score;
};

exports.updateScore = async (testId, studentId, selectedOptions) => {
    try {
        const test = await Test.findById(testId);
        if (!test) {
            throw new Error('Test not found');
        }

        // Find the student by their ID
        const student = await Student.findById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }

        const score = calculateScore(test, selectedOptions);

        const scoreIndex = test.scores.findIndex((s) => s.studentId.toString() === studentId.toString());

        if (scoreIndex === -1) {
            test.scores.push({
                studentId: studentId,
                score: score,
            });
        } else {
            test.scores[scoreIndex].score = score;
        }
        await test.save();

        return { message: 'Test submitted successfully', score: score };
    } catch (error) {
        throw error;
    }
};
exports.fetchTestResult = async (sessions) => {
    try {
        const topTwoScoresArray = [];
        for (session of sessions) {
            let sessionId = session._id
            let topTwoScores = await sobj.findTopTwoScores(sessionId);
            const totalScore = topTwoScores.reduce((sum, entry) => sum + entry.Score, 0);
            const averageScore = totalScore / topTwoScores[0].numberOfQuestions;
            topTwoScoresArray.push({ topTwoScores , averageScore });
        }   

        return { message: 'Test submitted successfully', topTwoScores: topTwoScoresArray };
    } catch (error) {
        throw error;
    }
}
