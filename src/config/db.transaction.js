const mongoose = require('mongoose');

const dbTransaction = async (session, callback) => {
  const transaction = await mongoose.startSession();
  transaction.startSession();
  try {
    const result = await callback(transaction);
    await transaction.commitTransaction();
    return result;
  } catch (e) {
    await transaction.abortTransaction();
    throw e;
  } finally {
    transaction.endSession();
  }
};

module.exports = dbTransaction;
