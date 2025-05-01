const bcrypt = require('bcrypt');
const userRepository = require("../repository/user.repository");
const baseResponse = require("../utils/baseResponse.util");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; 

exports.userRegister = async (req, res) => {
  const { name, email, password } = req.query;

  if (!name || !email || !password) {
    return baseResponse(res, false, 400, "Name, email, and password are required");
  }

  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format");
  }

  if (!passwordRegex.test(password)) {
    return baseResponse(res, false, 400, "Password must be at least 8 characters long and contain at least one letter and one number");
  }

  const user = await userRepository.getUserByEmail(email);
  if (user) {
    return baseResponse(res, false, 400, "Email already exists", null);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.userRegister({ ...req.query, password: hashedPassword });
    console.log(newUser);
    return baseResponse(res, true, 201, "User registered", newUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error registering user", error);
  }
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    return baseResponse(res, false, 400, "Email dan password diperlukan");
  }

  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 404, "Email atau password tidak valid", null);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return baseResponse(res, false, 404, "Email atau password tidak valid", null);
    }

    return baseResponse(res, true, 200, "User berhasil login", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Terjadi kesalahan saat login", error);
  }
};

exports.getUserByEmail = async (req, res) => {
  if (!req.params.email) {
    return baseResponse(res, false, 400, "Email is required");
  }

  try {
    const user = await userRepository.getUserByEmail(req.params.email);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    return baseResponse(res, true, 200, "User found", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error getting user", error);
  }
};

exports.updateUser = async (req, res) => {
  const { id, name, email, password } = req.body;

  if (!id || !name || !email || !password) {
    return baseResponse(res, false, 400, "Id, name, email, and password are required");
  }

  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format");
  }

  if (!passwordRegex.test(password)) {
    return baseResponse(res, false, 400, "Password must be at least 8 characters long and contain at least one letter and one number");
  }

  const existingUser = await userRepository.getUserByEmail(email);
  if (existingUser && existingUser.id !== id) {
    return baseResponse(res, false, 400, "Email already exists", null);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await userRepository.updateUser(id, { ...req.body, password: hashedPassword });
    return baseResponse(res, true, 200, "User updated", updatedUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating user", error);
  }
};

exports.deleteUser = async (req, res) => {
  if (!req.params.id) {
    return baseResponse(res, false, 400, "Id is required");
  }

  try {
    const user = await userRepository.deleteUser(req.params.id);

    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    return baseResponse(res, true, 200, "User deleted", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting user", error);
  }
};

exports.topUpUser = async (req, res) => {
  const { id, amount } = req.query;
  console.log(req.query);

  if (!id || !amount) {
    return baseResponse(res, false, 400, "Id and amount are required");
  }

  if (amount <= 0) {
    return baseResponse(res, false, 400, "Amount must be larger than 0");
  }

  try {
    const user = await userRepository.getUserById(id);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    user.balance += parseFloat(amount);
    const updatedUser = await userRepository.updateUser(id, user);
    return baseResponse(res, true, 200, "Top up successful", updatedUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error topping up user", error);
  }
};
