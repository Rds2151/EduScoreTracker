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
