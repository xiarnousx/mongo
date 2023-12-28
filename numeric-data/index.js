// integers Longs and double
// - int32 short full number
// - int64 long full nunber
// - double 64-bit floating point number
// - double high precsion 128-bit floating point number
// when using mongo shell numbers are stored as double 64 bit by default because it is based on javascript

// int32
// - 32 bits
db.numbers.insertOne({ a: NumberInt('1') });
// - you need a module when working with driver or mongoose

// int64
db.numbers.insertOne({ b: NumberLong('1') });

// Doing Math
db.numbers.insertOne({ c: NumberInt('1') });
db.numbers.updateOne({ c: { $exists: true } }, { $inc: { c: 1 } });
// - c will converted to double 64 bit becuase $inc incremeneted by default mongo shell double 64 bit
// - in order to maintain type
db.numbers.updateOne({ c: { $exists: true } }, { $inc: { c: NumberInt('1') } });
// - same goes for NumberLong

// What's wrong with Normal Doubles
// - 0.4 + 0.2 = 0.6000000000000001 due to low level computation hardware
// - imprecsion is not a problem for most applications

// working with High Precision Doubles 128 bit
db.numbers.insertOne({ d: NumberDecimal('0.4'), e: NumberDecimal('0.2') });
// - shell constructor for 128 bit floating point number
db.numbers.aggregate([{ $project: { result: { $add: ['$d', '$e'] } } }]);
// - result  0.6 no impression
// - this precsion comes at a price of storage size and computation time
