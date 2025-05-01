const { v4: uuidv4 } = require('uuid');
const transactionRepository = require('../repository/transaction.repository');
const baseResponse = require('../utils/baseResponse.util');

exports.createTransaction = async (req, res) => {
  const { item_id, quantity, user_id } = req.body;

  if (!item_id || !quantity || !user_id) {
    return baseResponse(res, false, 400, "Item ID, quantity, and user ID are required");
  }

  if (quantity <= 0) {
    return baseResponse(res, false, 400, "Quantity must be larger than 0");
  }

  try {
    const newTransaction = {
      id: uuidv4(),
      item_id,
      quantity,
      user_id,
      total: 100000, // Example total, you should calculate this based on item price and quantity
      status: 'pending',
      created_at: new Date().toISOString()
    };

    await transactionRepository.createTransaction(newTransaction);
    return baseResponse(res, true, 201, "Transaction created", newTransaction);
  } catch (error) {
    return baseResponse(res, false, 500, "Error creating transaction", error);
  }
};

exports.payTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await transactionRepository.getTransactionById(id);
    if (!transaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }

    transaction.status = 'paid';
    await transactionRepository.updateTransaction(transaction);

    return baseResponse(res, true, 200, "Payment successful", transaction);
  } catch (error) {
    return baseResponse(res, false, 500, "Failed to pay", error);
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await transactionRepository.getTransactionById(id);
    if (!transaction) {
      return baseResponse(res, false, 404, "Transaction not found", null);
    }

    await transactionRepository.deleteTransaction(id);
    return baseResponse(res, true, 200, "Transaction deleted", transaction);
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting transaction", error);
  }
};