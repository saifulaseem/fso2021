import React, { useState, useEffect } from "react";
import personService from "./services/persons";
import "./app.css";

const Filter = ({ filter, filterChange }) => {
  return (
    <div>
      Filter: <input value={filter} onChange={filterChange} />
    </div>
  );
};

const Form = ({
  newName,
  newNumber,
  nameChange,
  numberChange,
  submitHandler,
}) => {
  return (
    <form onSubmit={submitHandler}>
      <div>
        name: <input value={newName} onChange={nameChange} />
      </div>
      <div>
        phone number: <input value={newNumber} onChange={numberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
const Notification = ({ message }) => {
  if (message === null) {
    return null;
  } else {
    const isError = message.toLowerCase().includes("failed");
    return (
      <div className={isError ? "notification error" : "notification"}>
        {message}
      </div>
    );
  }
};
const Numbers = ({ filter, persons, handleDelete }) => {
  const filteredResult =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  return filteredResult.map((person) => (
    <Person key={person.id} person={person} handleDelete={handleDelete} />
  ));
};
const Person = ({ person, handleDelete }) => (
  <>
    <p>
      {person.name} {person.number}
    </p>
    <button onClick={(e) => handleDelete(e, person.id)}>Delete</button>
  </>
);
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };
  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleDelete = (e, id) => {
    console.log({ e });
    e.preventDefault();
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Are you sure you want to delete ${person.name}`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));

          setNotification(`Deleted the person '${person.name}'`);

          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch((error) => {
          setNotification(
            `Failed to delete. the person '${person.name}' was already deleted from server`
          );

          setTimeout(() => {
            setNotification(null);
          }, 5000);
          setPersons(persons.filter((p) => p.id !== person.id));
        });
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const person = persons.find((person) => person.name === newName);
    if (person != null) {
      if (
        window.confirm(
          `${newName} is already added to the phone book, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...person, number: newNumber };
        personService
          .update(updatedPerson)
          .then((res) => {
            setPersons(persons.map((p) => (p.id === res.id ? res : p)));
            setNotification(`Updated ${newName}`);

            setTimeout(() => {
              setNotification(null);
            }, 5000);
          })
          .catch(({ response }) => {
            console.log(response?.data);
            setNotification(
              response?.data?.error
              // `Failed to update.the person '${person.name}' was already deleted from server`
            );

            setTimeout(() => {
              setNotification(null);
            }, 5000);
            // setPersons(persons.filter((p) => p.id !== person.id));
          });
      } else return;
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      personService
        .create(personObject)
        .then((newPerson) => {
          setPersons(persons.concat(newPerson));
          setNotification(`Added ${newName}`);

          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch(({ response }) => {
          console.log(response?.data);
          setNotification(response?.data?.error);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
    }
    setNewName("");
    setNewNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />

      <Filter filter={filter} filterChange={handleFilterChange} />
      <h2>add a new</h2>
      <Form
        newName={newName}
        newNumber={newNumber}
        nameChange={handleNameChange}
        numberChange={handleNumberChange}
        submitHandler={submitHandler}
      />
      <h2>Numbers</h2>
      <Numbers filter={filter} persons={persons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
