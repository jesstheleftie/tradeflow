const User = require("../models/users");
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getUserByName = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ username: id });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
const login = async (req, res) => {
  try {
    const { username, pin } = req.body;
    const user = await User.findOne({ username: username.toLowerCase() });

    if (user && user.pin === pin) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Invalid username or pin" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(201).json({ user });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    let { id } = req.params;
    let user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (User) {
      return res.status(200).json(user);
    }
    throw new Error("User not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (deleted) {
      return res.status(200).send("User deleted");
    }
    throw new Error("User not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserByName,
  createUser,
  login,
  updateUser,
  deleteUser,
};
