const { Teacher, Student, Test, Session } = require("../models/Model");

class Server {
    isMailPresent = async (email) => {
        try {
            const [student, teacher] = await Promise.all([
                this.getStudentMail(email),
                this.getTeacherMail(email),
            ]);

            return student !== null || teacher !== null;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error checking email presence");
        }
    };

    getUser = async (email) => {
        try {
            const [student, teacher] = await Promise.all([
                this.getStudentMail(email),
                this.getTeacherMail(email),
            ]);

            if (student !== null) return student;
            if (teacher !== null) return teacher;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error checking email presence");
        }
    };

    getUserById = async (id) => {
        try {
            const [student, teacher] = await Promise.all([
                Student.findOne({ _id: id }),
                Teacher.findOne({ _id: id }),
            ]);

            if (student !== null) return student;
            if (teacher !== null) return teacher;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error checking email presence");
        }
    };

    getTeacherById = async (id) => {
        try {
            const teacher = await Teacher.findOne({ _id: id });
            if (teacher !== null) return teacher;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error checking email presence");
        }
        return null;
    };

    getStudentMail = async (email) => {
        try {
            const student = await Student.findOne({ Email: email });
            return student;
        } catch (error) {
            throw error;
        }
    };

    getTeacherMail = async (email) => {
        try {
            const teacher = await Teacher.findOne({ Email: email });
            return teacher;
        } catch (error) {
            throw error;
        }
    };

    createStudentAccount = async (
        fName,
        lName,
        email,
        phoneNo,
        loc,
        password
    ) => {
        try {
            const student = new Student({
                firstName: fName,
                lastName: lName,
                Email: email,
                contactPhone: phoneNo,
                Location: loc,
                Password: password,
            });

            const savedStudent = await student.save();
            return savedStudent;
        } catch (error) {
            throw error;
        }
    };

    createTeacherAccount = async (
        fName,
        lName,
        email,
        phoneNo,
        spec,
        password
    ) => {
        try {
            const teacher = new Teacher({
                firstName: fName,
                lastName: lName,
                Email: email,
                contactPhone: phoneNo,
                Specialization: spec,
                Password: password,
            });

            const savedTeacher = await teacher.save();
            return savedTeacher;
        } catch (error) {
            throw error;
        }
    };

    createSession = async (studentsId, sname, teacherId) => {
        try {
            const session = new Session({
                teacherId: teacherId,
                sessionName: sname,
                studentData: studentsId,
            });

            const savedSession = await session.save();
            return savedSession;
        } catch (error) {
            throw error;
        }
    };

    fetchAllSession = async (id) => {
        try {
            const session = await Session.find({ teacherId: id }).populate(
                "studentData"
            );
            return session;
        } catch (error) {
            throw error;
        }
    };

    createTest = async (questions, session, subjectName) => {
        try {
            const testInstance = new Test({
                subject: subjectName,
                sessionId: session,
                questions: questions.map((q) => ({
                    question: q.question,
                    options: {
                        option1: q.options[0],
                        option2: q.options[1],
                        option3: q.options[2],
                        option4: q.options[3],
                    },
                    answer: q.answer,
                })),
            });
    
            await testInstance.save();
            return { "message": "Test Created successfully" };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = Server;
