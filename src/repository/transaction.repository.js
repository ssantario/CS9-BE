const transactions = [];

exports.createTransaction = async (transaction) => {
  transactions.push(transaction);
  return transaction;
};

exports.getTransactionById = async (id) => {
  return transactions.find(transaction => transaction.id === id);
};

exports.updateTransaction = async (updatedTransaction) => {
  const index = transactions.findIndex(transaction => transaction.id === updatedTransaction.id);
  if (index !== -1) {
    transactions[index] = updatedTransaction;
  }
  return updatedTransaction;
};

exports.deleteTransaction = async (id) => {
  const index = transactions.findIndex(transaction => transaction.id === id);
  if (index !== -1) {
    const deletedTransaction = transactions.splice(index, 1);
    return deletedTransaction[0];
  }
  return null;
};