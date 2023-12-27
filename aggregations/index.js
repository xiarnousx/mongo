// - the find method
// - built in stages
// - and piped througout the stages
// - the aggreate method returns a cursor

// Match Stage
db.persons.aggregate([{ $match: { gender: 'female' } }]);

// - Match Stage
// - Group Stage
// - Sort Stage
[
    { $match: { gender: 'female' } },
    {
        $group: {
            _id: { state: '$location.state' },
            totalPersons: { $sum: 1 },
        },
    },
    { $sort: { totalPersons: -1 } },
];
// - $group is the group stage
// -- _id is the value to group the field by
// -- $sum is the accumulator operator supported by the group stage

// - Transforming documents with $project
// - $concat operator
[
    {
        $project: {
            _id: 0,
            gender: 1,
            fullName: {
                $concat: [
                    { $toUpper: { $substrCP: ['$name.first', 0, 1] } },
                    {
                        $substrCP: [
                            '$name.first',
                            1,
                            { $subtract: [{ $strLenCP: '$name.first' }, 1] },
                        ],
                    },
                    ' ',
                    { $toUpper: '$name.last' },
                ],
            },
        },
    },
];

// - Turning location into GeoJSON document
[
    {
        $project: {
            _id: 0,
            name: 1,
            email: 1,
            location: {
                type: 'Point',
                coordinates: [
                    {
                        $convert: {
                            input: '$location.coordinates.longitude',
                            to: 'double',
                            onError: 0.0,
                            onNull: 0.0,
                        },
                    },
                    {
                        $convert: {
                            input: '$location.coordinates.latitude',
                            to: 'double',
                            onError: 0.0,
                            onNull: 0.0,
                        },
                    },
                ],
            },
        },
    },
];

// Transforming date
[
    {
        $project: {
            _id: 0,
            name: 1,
            email: 1,
            age: '$dob.age',
            birthdate: {
                $convert: {
                    input: '$dob.date',
                    to: 'date',
                },
            },
        },
    },
];

// Transformation shortcuts for converting types
[
    {
        $project: {
            _id: 0,
            name: 1,
            email: 1,
            birthdate: {
                $toDate: '$dob.date',
            },
        },
    },
];
// - $toDate is a shortcut for the $convert operator
// - $to* operators are available for all types

// Understanding $isoWeekYear Operator
[
    {
        $group: {
            _id: { birthYear: { $isoWeekYear: '$birthdate' } },
            numPersons: { $sum: 1 },
        },
    },
];

// $group vs $project
// - $group is used to group documents n:1 sum, count, avg, build array etc...
// - $project is used to transform documents 1:1

// Pusing elements into created arrays
// on friends collection
[
    {
        $group: {
            _id: { age: '$age' },
            allHobbies: { $push: '$hobbies' },
        },
    },
];
// two operators helps in combining arrays
// - $push
// - $addToSet
// - allHobbies is array of arrays

// $unwind operator
[{ $unwind: '$hobbies' }];
// - $unwind operator is used to unwind arrays foreach element it creates a document
// - removing duplicate values
[
    { $unwind: '$hobbies' },
    { $group: { _id: { age: '$age' }, allHobbies: { $addToSet: '$hobbies' } } },
];

// Projection with Arrays
// - $slice operator
[
    {
        $project: {
            _id: 0,
            examScore: { $slice: ['$examScores', 1] },
        },
    },
];

// getting length of array
// - $size operator
[
    {
        $project: {
            _id: 0,
            numScores: { $size: '$examScores' },
        },
    },
];

// $filter operator
[
    {
        $project: {
            _id: 0,
            examScore: {
                $filter: {
                    input: '$examScores',
                    as: 'sc', // alias / local variable
                    cond: { $gt: ['$$sc.score', 60] }, // 1 $ sign for field in document 2 signs for local variable
                },
            },
        },
    },
];

// Applying multiple array operators
[
    { $unwind: '$examScores' },
    { $sort: { 'examScores.score': -1 } },
    {
        $group: {
            _id: '$_id',
            name: { $first: '$name' },
            maxScore: { $max: '$examScores.score' },
        },
    },
    { $sort: { maxScore: -1 } },
];

[
    { $unwind: '$examScores' },
    { $project: { _id: 1, name: 1, age: 1, score: '$examScores.score' } },
    { $sort: { score: -1 } },
    {
        $group: {
            _id: '$_id',
            name: { $first: '$name' },
            maxScore: { $max: '$score' },
        },
    },
    { $sort: { maxScore: -1 } },
];

// understanding bucket stages
// persons collection
[
    {
        $bucket: {
            groupBy: '$dob.age',
            boundaries: [18, 30, 40, 50, 60, 120],
            output: {
                numPersons: { $sum: 1 },
                averageAge: { $avg: '$dob.age' },
                names: { $push: '$name.first' }, // not best ides to get names / long list
            },
        },
    },
];
// - $bucket operator is used to group documents into buckets
// - groupBy is the field to group by
// - boundaries is the array of values to group by "categories"
// - output is the fields to output in each bucket group
// - bucket is used for summary statistics
// - gives us idea about distribution of data

[
    {
        $bucketAuto: {
            groupBy: '$dob.age',
            buckets: 5,
            output: {
                numPersons: { $sum: 1 },
                averageAge: { $avg: '$dob.age' },
            },
        },
    },
];
// - auto define the distribution buckets

// find the 10th first male persons with the highest age
[
    { $match: { gender: 'male' } },
    {
        $project: {
            _id: 0,
            name: { $concat: ['$name.first', ' ', '$name.last'] },
            birthdate: { $toDate: '$dob.date' },
        },
    },
    { $sort: { birthdate: 1 } },
    { $skip: 0 },
    { $limit: 10 },
];

// Writing pipeline results into a new collection
[
    {
        $project: {
            _id: 0,
            name: { $concat: ['$name.first', ' ', '$name.last'] },
            birthdate: { $toDate: '$dob.date' },
            location: {
                type: 'Point',
                coordinates: [
                    {
                        $convert: {
                            input: '$location.coordinates.longitude',
                            to: 'double',
                            onError: 0.0,
                            onNull: 0.0,
                        },
                    },
                    {
                        $convert: {
                            input: '$location.coordinates.latitude',
                            to: 'double',
                            onError: 0.0,
                            onNull: 0.0,
                        },
                    },
                ],
            },
        },
    },
    {
        $out: 'transformedPersons', // collection name to wirte to
    },
];

// working with geoNear Stage
// transformedPersons collection
db.transformedPersons.createIndex({ location: '2dsphere' }); // create index on location field
// - 2dsphere index is used for geo queries and required for $geoNear stage

[
    {
        $geoNear: {
            near: {
                type: 'Point',
                coordinates: [-18.4, -42.8],
            },
            maxDistance: 700000, // 700 km
            distanceField: 'distance', // field to add to document the calculated distance
            num: 10, // limit to 10 locations
            query: { age: { $gt: 30 } }, // filter documents similar to match stage
        },
    },
];
// - $geoNear has to be the first element in the pipeline
