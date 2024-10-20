const Transaction = require("../models/transactions");

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getTransactionByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.find({ user_id: id });

    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

const createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    return res.status(201).json({ transaction });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    let { id } = req.params;
    let transaction = await Transaction.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (Transaction) {
      return res.status(200).json(transaction);
    }
    throw new Error("Transaction not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.findByIdAndDelete(id);
    if (deleted) {
      return res.status(200).send("Transaction deleted");
    }
    throw new Error("Transaction not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  getAllTransactions,
  getTransactionByUserId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
