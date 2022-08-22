/* eslint-disable camelcase */
const Reception = require('../model/Reception');
const Doctor = require('../model/Doctor');

const { validName } = require('../helpers/validator');

module.exports.postReception = async (req, res) => {
    const { patient_name, appointment_time, complaints, doctorId } = req.body;
    const { user_id } = req;

    const errorsArray = [];

    if (!validName(patient_name))
        errorsArray.push('You must enter a valid patient name!');
    if (!appointment_time.trim())
        errorsArray.push('Appointment time field is required!');
    if (!complaints.trim()) errorsArray.push('Complaints field is required!');
    if (!doctorId || Number.isNaN(doctorId))
        errorsArray.push('Doctor ID field is required and must be a number!');

    if (errorsArray.length) return res.status(422).send(errorsArray);

    try {
        const reception = await Reception.create({
            patient_name,
            appointment_time,
            complaints,
            userId: user_id,
            doctorId,
        });

        return reception && (await this.getReceptions(req, res));
    } catch (error) {
        return res.send({ message: error.message });
    }
};

module.exports.getReceptions = async (req, res) => {
    const { user_id } = req;

    try {
        const reception = await Reception.findAll({
            where: { userId: user_id },
            include: [
                {
                    model: Doctor,
                    attributes: ['doctor_name', 'specialization'],
                },
            ],
        });

        return res.send(reception);
    } catch (error) {
        return res.send({ message: error.message });
    }
};
