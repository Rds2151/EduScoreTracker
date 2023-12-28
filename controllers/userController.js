const server = require("../services/Server");
const bcrypt = require("bcrypt");
const sobj = new server();

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
