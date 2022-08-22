module.exports.validEmail = (email) => {
    const validateEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return validateEmail.test(email);
};

module.exports.validPassword = (password) => {
    const validatePassword =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    return validatePassword.test(password);
};

module.exports.validName = (name) => {
    const validateName = /^[A-Za-z ]+$/;

    return validateName.test(name);
};
