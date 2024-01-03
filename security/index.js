// - AuthN: defines who a user is
// - AuthZ: defines what a user can do
// - a user can be a person or a service

// Mongo db eploys a role-based access control (RBAC) model
// - roles are defined at the database level
// - roles are grouped of previliges
// - privileges are defined at the collection level
// - groups of resouces and actions

// Why roles?
// - different types of users

// creating and editing users
// - createUser() / updateUser()
// - with at least one role
// - the role can be attached with multiple privileges
db.auth('admin', 'admin');
// - when connecting using localhost, the user is automatically authenticated
// use admin
db.createUser({
    user: 'userAdmin',
    pwd: 'userAdmin',
    roles: ['userAdminAnyDatabase'], // special role
});

// Built in Roles
// - database user: read / readWrite
// - database admin: dbAdmin / userAdmin / dbOwner
// - database roles: readAnyDatabase / readWriteAnyDatabase / userAdminAnyDatabase / dbAdminAnyDatabase
// - cluster admin: clusterAdmin / clusterManager / clusterMonitor / hostManager
// - backup and restore: backup / restore
// - super user : dbOwner (admin) / userAdmin (admin) / userAdminAnyDatabase / root

// Assigning Roles to Users and Databases
// use shop
db.createUser({ user: 'shopper', pwd: 'shopper', roles: ['readWrite'] });
// authenticate using shopper cli
// mongo -u shopper -p shopper --authenticationDatabase shop
// use shop
db.products.insertOne({ name: 'A Book', price: 12.99 });
db.updateUser('shopper', {
    roles: ['readWrite', { role: 'readWrite', db: 'blog' }],
});
db.getUser('shopper');

// Encryption at Rest
// - MongoDB Enterprise only
