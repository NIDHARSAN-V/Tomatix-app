const UserModel = require("../models/User.js");

const Signup = async function(req, res) {
    const { name, email, password, picture } = req.body;
    console.log(req.body);

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send("User already exists");
        }

        const user = new UserModel({ name, email, password, picture });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.log(error);

        let msg;
        if (error.code === 11000) {
            msg = "User already exists";
        } else {
            msg = error.message;
        }
        return res.status(400).send(msg);
    }
};

module.exports = { Signup };
