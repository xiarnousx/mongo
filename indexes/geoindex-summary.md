# Storing Geospatial Data

-   You store geospatial data next to your other data in yur documents
-   Geospatial data has to follow special GeoJSON format and respect the types supported by MongoDB
-   Coordinates are in the form of [longitude, latitude]

# Geospatial Indexes

-   You can add an inded to geospatial data "2dsphere"
-   Some opertaions like $near require such an index

# Geospatial Queries

-   $near, $geoWithin, $geoIntersect get you very far
-   Geospatial queryies work with GeoJSON data
