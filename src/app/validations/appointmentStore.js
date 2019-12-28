import * as Yup from 'yup';

export default async (req, res, next) => {
    const schema = Yup.object().shape({
        provider_id: Yup.number().required(),
        date: Yup.date().required(),
    });
    try {
        await schema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return res
            .status(422)
            .json({ fields: error.errors, message: 'Validation fails' });
    }
};
