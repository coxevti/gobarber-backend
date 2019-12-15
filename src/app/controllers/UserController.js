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

    async update(req, res) {
        const { email, oldPassword } = req.body;
        const user = await User.findByPk(req.userId);
        if (email !== user.email) {
            const emailExist = await User.findOne({ where: { email } });
            if (emailExist) {
                return res.status(400).json({ message: 'User already exists' });
            }
        }
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const { id, name, provider } = await user.update(req.body);
        return res.json({ id, name, email, provider });
    }
}

export default new UserController();
