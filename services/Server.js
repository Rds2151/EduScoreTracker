const { Teacher, Student, Test, Session } = require("../models/Model");

class Server 
{
    isMailPresent = async (email) => {
        try {
            const [student, teacher] = await Promise.all([
                this.getStudentMail(email),
                this.getTeacherMail(email)
            ]);
    
            return student !== null || teacher !== null;
        } catch (error) {
            console.error(error.message);
            throw new Error('Error checking email presence');
        }
    }

    getUser = async (email) => {
        try {
            const [student, teacher] = await Promise.all([
                this.getStudentMail(email),
                this.getTeacherMail(email)
            ]);
            
            if (student !== null) return student
            if (teacher !== null) return teacher
        } catch (error) {
            console.error(error.message);
            throw new Error('Error checking email presence');
        }
    }

    getUserById = async (id) => {
        try {
            const [student, teacher] = await Promise.all([
                Student.findOne({ _id: id }),
                Teacher.findOne({ _id: id })
            ]);
    
            if (student !== null) return student;
            if (teacher !== null) return teacher;
        } catch (error) {
            console.error(error.message);
            throw new Error('Error checking email presence');
        }
    }   

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

    createStudentAccount = async (fName, lName, email, phoneNo, loc, password) => {
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

    createTeacherAccount = async (fName, lName, email, phoneNo, spec, password) => {
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

    addStudent = async (user,itemName,quantity) => {
        try {
            const storage = new Storage({
                RestaurantId: user._id,
                ingredientName:itemName,
                ingredientNo:quantity
            })

            const savedIngredient = await storage.save();
            return savedIngredient;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Server;