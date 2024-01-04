// new on version 4.0 and above
// you need a replica set to use transactions

// Transactions
session = db.getMongo().startSession();
session.startTransaction();
try {
    session
        .getDatabase('db')
        .accounts.updateOne({ name: 'A' }, { $inc: { balance: -20 } });
    session
        .getDatabase('db')
        .accounts.updateOne({ name: 'B' }, { $inc: { balance: 20 } });
    session.commitTransaction();
} catch (error) {
    session.abortTransaction();
} finally {
    session.endSession();
}
