// create database admin user
db.createUser({ user: 'admin', pwd: 'admin', roles: ['userAdminAnyDatabase'] });

// create user admin
db.createUser({
    user: 'userAdmin',
    pwd: 'userAdmin',
    roles: ['dbAdminAnyDatabase'],
});

// create developer user
db.createUser({
    user: 'dev',
    pwd: 'dev',
    roles: [
        { role: 'readWrite', db: 'Customers' },
        { role: 'readWrite', db: 'Sales' },
    ],
});
