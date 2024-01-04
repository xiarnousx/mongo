// Capped Collection
// Replica sets
// Sharding

// What influences performance?
// As developer:
// - Efficient queries
// - Indexes
// - Data model
// AS DB Admin:
// - Hardware and Network
// - Sharding
// - Replica sets

// Understanding Capped Collection
// - Fixed size collections
// - Docuement deleted when size is reached
// - Fast insertion order
// - usage cache, log, etc
db.createCollection('log', { capped: true, size: 10000, max: 3 });
// - the order always the same as the insertion order
// - the size is in bytes
// - the max is the number of documents
// - the size and max are optional
// - inserting new record will delete the oldest record

// Replica Sets
// - Primary nodes and secondary nodes groupped together in a replica set
// - Primary node is the main node
// - When primary node goes done the replica set elect a new primary node from secondary nodes
// - The primary node is the only node that can write data
// - The secondary nodes can only read data

// Sharding
// - Split data across multiple machines
// - Horizontal scaling
// - Queries are run accross shards
// - mongos router is used to route queries to the correct shard
// - Sharding is transparent to the application
// - shard key added to every document to determine which shard to store the document
// - you want to make sure that documents are evenly distributed accross shards
// - you can shard a collection or a database
// - you should choose a shard key that is frequently used in queries

// Deployment
// - Manage Shards
// - Manage Replica Sets
// - Secure Authentication
// - Backup and Restore
// - Monitoring and Alerts
// - Performance Tuning
// - Scaling
// - Upgrades
// - Encryption
// - Security
// - Disaster Recovery
// - High Availability
