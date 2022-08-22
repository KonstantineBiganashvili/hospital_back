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

module.exports.deleteReceptionById = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req;

    if (!id.trim())
        return res.status(422).send({ anwer: 'Invalid ID has been passed' });

    try {
        const remove = await Reception.destroy({
            where: { id, userId: user_id },
        });
        if (remove) return await this.getReceptions(req, res);
        return res.stats(404).send({ message: 'Reception does not exist!' });
    } catch (error) {
        return res.status(422).send({ message: error.message });
    }
};

module.exports.editReceptionById = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req;
    const validFields = {};
    const errorsArray = [];

    const { patient_name, appointment_time, complaints, doctorId } = req.body;

    if (!id.trim()) return errorsArray.push('Invalid ID has been passed!');

    if (!patient_name && !appointment_time && !complaints && doctorId) {
        errorsArray.push('You must change at least one field!');
    } else {
        if (patient_name) {
            if (!validName(patient_name)) {
                errorsArray.push('You must enter a valid patient name!');
            } else {
                validFields.patient_name = patient_name;
            }
        }

        if (appointment_time) {
            if (!appointment_time.trim()) {
                errorsArray.push('Appointment time field is required!');
            } else {
                validFields.appointment_time = appointment_time;
            }
        }

        if (complaints) {
            if (!complaints.trim()) {
                errorsArray.push('Complaints field is required!');
            } else {
                validFields.complaints = complaints;
            }
        }

        if (doctorId) {
            if (!doctorId.trim() || !typeof doctorId === 'number') {
                errorsArray.push(
                    'Doctor ID field is required and must be a nunber'
                );
            } else {
                validFields.doctorId = doctorId;
            }
        }
    }

    if (errorsArray.length)
        return res.status(422).send({ message: errorsArray });

    try {
        const [edit] = await Reception.update(validFields, {
            where: { id, userId: user_id },
        });

        if (edit) return edit && (await this.getReceptions(req, res));

        return res.status(404).send({ answer: 'Reception does not exist!' });
    } catch (error) {
        return res.status(422).send({ message: error.message });
    }
};
