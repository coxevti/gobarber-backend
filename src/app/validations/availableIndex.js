import * as Yup from 'yup';

export default async (req, res, next) => {
    const schema = Yup.object().shape({
        date: Yup.number().required(),
    });
    try {
        await schema.validate(req.query, { abortEarly: true });
        return next();
    } catch (error) {
        return res
            .status(422)
            .json({ fields: error.errors, message: 'Validation fails' });
    }
};
