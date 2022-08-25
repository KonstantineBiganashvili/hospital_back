const Doctor = require('../model/Doctor');

module.exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll();

        return res.send(doctors);
    } catch (error) {
        return res.send({ message: error.message });
    }
};
