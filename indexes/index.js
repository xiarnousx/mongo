// ContactData db
db.contacts.find({ 'dob.age': { $gt: 60 } });
db.contacts.find({ 'dob.age': { $gt: 60 } }).count();
db.contacts
    .explain('executionStats')
    .find({ 'dob.age': { $gt: 60 } })
    .count();
// 1 ascending, -1 descending
db.contacts.createIndex({ 'dob.age': 1 });
// If returning all documents, index is not used not helpful query take more time if index is used
db.contacts.dropIndex({ 'dob.age': 1 });

// createing compound index
// compound index can be used from left to right
db.contacts.createIndex({ 'dob.age': 1, gender: 1 });
//using index for sorting
db.contacts.find({ 'dob.age': { $gt: 60 } }).sort({ gender: 1 });
// Mongodb has threshold for using index of 32mb in memory
// when sorting document u might need index to avoid in memory sorting
// if index is not used for sorting then it will do in memory sorting

// list all indexes
db.contacts.getIndexes();

// configuring indexes
db.contacts.createIndex({ email: 1 }, { unique: true });

// partial filter index
db.contacts.createIndex(
    { 'dob.age': 1 },
    { partialFilterExpression: { 'dob.age': { $gt: 60 } } }
);
// - partial filter expression can be different field than index field

db.useres.createIndex(
    { email: 1 },
    { unique: true, partialFilterExpression: { email: { $exists: true } } }
);

// TTL index
// - self deleting data
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 10 });
// -- TTL index can be used only on date field

// explain takes 3 arguments
// -1) queryPlanner
// -2) executionStats
// -3) allPlansExecution

// What is a covered query?
// - A query is covered when it can be satisfied entirely using an index and does not have to examine any documents.
db.users.createIndex({ name: 1 });
db.users.find({ name: 'Max' }, { _id: 0, name: 1 }); // covered query
db.users.find({ name: 'Max' }, { _id: 0, email: 1, name: 1 }); // not covered query

// Index wining plan
// 1) Try to get first 100 documents from index the fastet to return is set as the wining plan and cached
// 2) chache is cleared after:
// a) 1000 documents are inserted newly
// b) index is rebuilt
// c) index is dropped
// d) other indexes adde/removed
// e) mongod is restarted

// Multi Key Index
// - Index on array of strings or documents
// - Multi key indexes are large in size n*m where n is number of documents and m is number of elements in array
// - Multi key indexes are slow to write
// - Can be added as part of compound index, cannot index parallel arrays n*m is not possible
// - In single index only one array can be included
db.contacts.createIndex({ hobbies: 1 });
db.contacts.createIndex({ addresses: 1 });
db.contacts.createIndex({ 'addresses.city': 1 });

// Text Index
// - Text index is used to search text
// - specail index turns text into tokens (arrays of single key words (stemmed))
db.products.createIndex({ description: 'text' });
db.products.find({ $text: { $search: 'awesome' } });
// - text index is not used for sorting
// - one text index per collection
// - you can merge multiple fields into a text index
// - faster than regex
db.products.createIndex({ description: 'text', name: 'text' });
// - project the score of the search assigned to each document
db.products.find(
    { $text: { $search: 'awesome' } },
    { score: { $meta: 'textScore' } }
);
// - sort by score
db.products
    .find({ $text: { $search: 'awesome' } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
// - drop text index by name
db.products.dropIndex('description_text_name_text');
// - get indexes list
db.products.getIndexes();
// - text index to exclude words
db.products.find({ $text: { $search: 'awesome -cool' } });
// - Multi language text index
db.products.createIndex(
    { description: 'text' },
    { default_language: 'english' }
);
// - default language it assumes english
// - there is a list of supported languages
// - defines how words are stemmed and stop words are removed
// - you can define different waitings for each field
db.products.createIndex(
    { description: 'text', name: 'text' },
    { weights: { name: 10, description: 1 } }
);
// - name would worth 10 times as much as description
db.products.find({
    $text: { $search: 'awesome', $language: 'english', $caseSensitivity: true },
});
// - you can define language per field

// Indexed forground vs background
//- Foreground
// -- blocks read and write operations
// -- faster to build
// - background
// -- does not block read and write operations
// -- slower to build
// - default is foreground background: false
db.ratings.createIndex({ age: 1 }, { background: true });
