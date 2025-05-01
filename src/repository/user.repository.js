const db = require("../database/pg.database");

exports.registerUser = async (user) => {
  try {
    // Check if email already exists
    const emailCheck = await db.query("SELECT * FROM users WHERE email = $1", [
      user.email,
    ]);
    if (emailCheck.rows.length > 0) {
      throw new Error("Email already exists");
    }

    const res = await db.query(
      "INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING *",
      [user.name, user.email, user.password, user.balance]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Failed to Register", error);
    throw error;
  }
};

exports.loginUser = async (email, password) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (res.rows.length === 0) {
      throw new Error("Invalid email or password");
    }
    return res.rows[0];
  } catch (error) {
    console.error("Failed to login", error);
    throw error;
  }
};

exports.getAll = async () => {
  try {
    const res = await db.query("SELECT * FROM users");
    return res.rows;
  } catch (error) {
    console.error("Failed to get all users", error);
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (res.rows.length === 0) {
      throw new Error("User not found");
    }
    return res.rows[0];
  } catch (error) {
    console.error("Failed to get user by email", error);
    throw error;
  }
};

exports.updateUser = async (userId, user) => {
  try {
    const res = await db.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [user.name, user.email, user.password, userId]
    );

    if (res.rows.length === 0) {
      throw new Error("User not found");
    }
    return res.rows[0];
  } catch (error) {
    console.error("Failed to update user", error);
    throw error;
  }
};

exports.deleteUserById = async (userId) => {
  try {
    const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [
      userId,
    ]);
    return res.rows[0];
  } catch (error) {
    console.error("Failed to delete user", error);
  }
};

exports.getUserById = async (id) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Failed to get user by ID", error);
    throw error;
  }
};

exports.updateBalance = async (id, amount) => {
  try {
    const res = await db.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *",
      [amount, id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Failed to update balance", error);
    throw error;
  }
};
