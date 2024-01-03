# Users & Roles

-   MongoDB uses a Role Base Access Control approach
-   You create users on databases and then log in with your credentials (against those databases)
-   Users have no rights by default, you need to add roles to allow certain operations
-   Permissiions that are granted by roles "Privileges" are only granted for the database the user was added to, unless you explicitly grant access to other databases
-   You can use "AnyDatabase" roles for cross-database access

# Encryption

-   You can encrypt data during transportation and at res
-   During transportation, you use TLS/SSL to encrypt data
-   For production, you should use SSL certificates issues by a certificate authority not self signed certificates
-   For encryption at rest, you can encrypt both files that hold your data (made simple with MongoDB Enterprise) and the values inside your documents
