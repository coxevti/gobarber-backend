import {
    startOfDay,
    endOfDay,
    setSeconds,
    setMinutes,
    setHours,
    parseISO,
    isAfter,
} from 'date-fns';
import { format, zonedTimeToUtc } from 'date-fns-tz';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';

class AvailableController {
    async index(req, res) {
        const { date } = req.query;
        const searchDate = Number(date);
        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.params.providerId,
                canceled_at: null,
                date: {
                    [Op.between]: [
                        startOfDay(searchDate),
                        endOfDay(searchDate),
                    ],
                },
            },
        });
        const schedule = [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
        ];
        const available = schedule.map(time => {
            const [hour, minute] = time.split(':');
            const value = setSeconds(
                setMinutes(
                    setHours(
                        zonedTimeToUtc(searchDate, 'America/Campo_Grande'),
                        hour
                    ),
                    minute
                ),
                0
            );
            return {
                time,
                date: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx", {
                    timeZone: '-04:00',
                }),
                available:
                    isAfter(
                        parseISO(
                            format(value, "yyyy-MM-dd'T'HH:mm:ssxxx", {
                                timeZone: '-04:00',
                            })
                        ),
                        new Date()
                    ) &&
                    !appointments.find(
                        appointment =>
                            format(appointment.date, 'HH:mm', {
                                timeZone: '-04:00',
                            }) === time
                    ),
            };
        });
        return res.json(available);
    }
}

export default new AvailableController();
