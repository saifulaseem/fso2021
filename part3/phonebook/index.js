const express = require('express');
var morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const Person = require('./models/person');

const app = express();
app.use(express.static('build'));
app.use(cors());
app.use(express.json());
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

app.get('/api/persons', (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    });
});

app.get('/info', (req, res) => {
    Person.find({}).then((persons) => {
        const count = persons.length;
        const date = new Date();
        res.send(`Phonebook has info for ${count} people. <br> ${date}`);
    });
});

app.post('/api/persons', (request, response, next) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing',
        });
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing',
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });
    person
        .save()
        .then((savedPerson) => {
            response.json(savedPerson);
        })
        .catch((error) => {
            console.log('error');
            next(error);
        });
});

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findById(id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => {
            console.log('Error');
            next(error);
        });
});

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findByIdAndRemove(id).then(() => {
        return response.status(204).end();
    }).catch(error=>next(error));
});


app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };
    Person.findByIdAndUpdate(request.params.id, person, { new: true,runValidators:true })
        .then((updatedPerson) => {
            response.json(updatedPerson);
        })
        .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
