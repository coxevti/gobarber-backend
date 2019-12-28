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
        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date,
        });
        return res.json(appointment);
    }
}

export default new AppointmentController();
