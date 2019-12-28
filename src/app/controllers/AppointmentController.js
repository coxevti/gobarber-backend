import { startOfHour, parseISO, isBefore } from 'date-fns';

import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
    async store(req, res) {
        const { provider_id, date } = req.body;
        const isProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });
        if (!isProvider) {
            return res.status(401).json({
                message: 'You can only create appointments with providers',
            });
        }
        if (provider_id === req.userId) {
            return res.status(401).json({ message: 'Action not allowed' });
        }
        const startHour = startOfHour(parseISO(date));
        if (isBefore(startHour, new Date())) {
            return res
                .status(401)
                .json({ message: 'Past dates are not permitted' });
        }
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: startHour,
            },
        });
        if (checkAvailability) {
            return res.status(400).json({
                message: 'Appoinment date is not available',
            });
        }
        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date: startHour,
        });
        return res.json(appointment);
    }
}

export default new AppointmentController();
