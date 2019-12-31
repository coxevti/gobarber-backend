import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../mongodb/schemas/Notification';

import Mail from '../../lib/Mail';

class AppointmentController {
    async index(req, res) {
        const { page = 1 } = req.query;
        const appointment = await Appointment.findAll({
            where: { user_id: req.userId, canceled_at: null },
            order: ['date'],
            limit: 20,
            offset: (page - 1) * 20,
            attributes: ['id', 'date'],
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                },
            ],
        });
        return res.json(appointment);
    }

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
        const user = await User.findByPk(req.userId);
        const formatDate = format(
            startHour,
            "'dia' dd 'de' MMMM', às ' HH:mm'h'",
            {
                locale: ptBR,
            }
        );
        await Notification.create({
            user: provider_id,
            content: `Novo agendamento de ${user.name} para ${formatDate}`,
        });
        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date: startHour,
        });
        return res.json(appointment);
    }

    async delete(req, res) {
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['name', 'email'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                },
            ],
        });
        if (appointment.user_id !== req.userId) {
            return res.status(401).json({
                message: 'You don´t have permission to cancel this appoinment.',
            });
        }
        const dateWithSub = subHours(appointment.date, 2);
        if (isBefore(dateWithSub, new Date())) {
            return res.status(401).json({
                message:
                    'You can only cancel appointments 2 hours in advanced.',
            });
        }
        appointment.canceled_at = new Date();
        await appointment.save();
        await Mail.sendMail({
            to: `${appointment.provider.name} <${appointment.provider.email}>`,
            subject: 'Agendamento cancelado',
            template: 'cancellation',
            context: {
                provider: appointment.provider.name,
                user: appointment.user.name,
                date: format(
                    appointment.date,
                    "'dia' dd 'de' MMMM', às' H:mm'h'",
                    {
                        locale: ptBR,
                    }
                ),
            },
        });
        return res.json(appointment);
    }
}

export default new AppointmentController();
