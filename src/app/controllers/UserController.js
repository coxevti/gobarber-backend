import User from '../models/User';

class UserController {
    async store(req, res) {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({
            where: { email },
        });
        if (userExists) {
            return res.json({ message: 'User already exists' });
        }
        const { id, provider } = await User.create({ name, email, password });
        return res.json({ id, name, email, provider });
    }
}

export default new UserController();
