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
            // Create a new session
            const session = new Session({
                teacherId: teacherId,
                sessionName: sname,
                studentData: studentsId,
            });

            // Save the session
            const savedSession = await session.save();

            await Student.updateMany(
                { _id: { $in: studentsId } },
                { $push: { sessionIds: savedSession._id } }
            );

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
            return { message: "Test Created successfully" };
        } catch (error) {
            throw error;
        }
    };

    fetchTest = async (studentId) => {
        try {
            const student = await Student.findById(studentId);

            if (!student) {
                throw new Error("Student not found");
            }

            const sessionIds = student.sessionIds;

            const tests = await Test.find({ sessionId: { $in: sessionIds } });

            if (!tests || tests.length === 0) {
                throw new Error("Tests not found");
            }

            return tests;
        } catch (error) {
            throw error;
        }
    };

    findTopTwoScores = async (id) => {
        try {
            const result = await Test.aggregate([
                { $match: { sessionId: id } },
                { $unwind: "$scores" },
                { $sort: { "scores.score": -1 } },
                {
                  $lookup: {
                    from: 'students',
                    localField: 'scores.studentId',
                    foreignField: '_id',
                    as: 'student',
                  },
                },
                {
                  $unwind: '$student',
                },
                {
                  $project: {
                    _id: 0,
                    subject: 1,
                    Score: '$scores.score',
                    student: {
                      _id: '$student._id',
                      fname: '$student.firstName',
                      lname: '$student.lastName',
                    },
                    questions: { $ifNull: ['$questions', []] },
                  },
                },
                {
                  $addFields: {
                    numberOfQuestions: { $size: "$questions" },
                  },
                },
              ]);
            return result;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = Server;
