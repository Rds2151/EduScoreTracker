const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    firstName: "string",
    lastName: "string",
    Email: "string",
    contactPhone: "string",
    Specialization: "string",
    userType: {
        type: String,
        default: "teacher"
    },
    Password: {
        type: String,
        required: true,
    },
    // testScores: [
    //     {
    //         subjectCode: "string",
    //         score: "number",
    //         testDate: "date",
    //     },
    // ],
    // grades: [
    //     {
    //         subjectCode: "string",
    //         grade: "string",
    //     },
    // ],
});

const studentSchema = new mongoose.Schema({
    firstName: "string",
    lastName: "string",
    Email: "string",
    contactPhone: "string",
    Location: "string",
    userType: {
        type: String,
        default: "student"
    },
    Password: {
        type: String,
        required: true,
    },
    // testScores: [
    //     {
    //         subjectCode: "string",
    //         score: "number",
    //         testDate: "date",
    //     },
    // ],
    // grades: [
    //     {
    //         subjectCode: "string",
    //         grade: "string",
    //     },
    // ],
});

const testSchema = new mongoose.Schema({
    subject: { 
        type: String, 
        required: true 
    },
    sessionId: { 
        type: mongoose.Schema.ObjectId, 
        required: true
    },
    questions: [
        {
            question: { type: String, required: true },
            options: {
                option1: { type: String, required: true },
                option2: { type: String, required: true },
                option3: { type: String, required: true },
                option4: { type: String, required: true },
            },
            testDate: { type: Date, required: true },
        },
    ],
});

const sessionSchema = new mongoose.Schema({
    subject: { 
        type: String, 
        required: true 
    },
    teacherId: { 
        type: mongoose.Schema.ObjectId, 
        required: true 
    },
    students: [{ 
        studentMail: {
            type: String, 
            required: true 
        } 
    }],
});

const Teacher = mongoose.model("Teacher", teacherSchema);
const Student = mongoose.model("Student", studentSchema);
const Test = mongoose.model("Test", testSchema);
const Session = mongoose.model('Session', sessionSchema);

module.exports = { Teacher, Student, Test, Session };