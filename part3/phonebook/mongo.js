const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

// const password = process.argv[2];

const url = 'mongodb+srv://safeuser:safe00@acm.xjwep.mongodb.net/phonetest?retryWrites=true&w=majority'; //process.env.MONGODB_URI;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const newName = process.argv[3];
const newNumber = process.argv[4];

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
    name: newName,
    number: newNumber,
});

if (newName && newNumber) {
    person.save().then((response) => {
        console.log(
            `added ${response.name} number ${response.number} to phonebook`
        );
        mongoose.connection.close();
    });
} else {
    Person.find({}).then((result) => {
        console.log('phonebook:');
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
}
