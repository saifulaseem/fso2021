import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const incrementVote = () => {
    const newPoints = [...points];
    newPoints[selected] += 1;
    setPoints(newPoints)
  }

  const mostVoted = () => {
    const maxValue = Math.max(...points);
    return points.indexOf(maxValue);
  }

  const selectRandom = () => {
    const random = Math.floor(Math.random() * anecdotes.length);
    setSelected(random)
  }

  const Anecdote = ({ text }) => <p>{text}</p>
  const Title = ({ text }) => <h2>{text}</h2>
  const Votes = ({ count }) => <p>Has {count} votes</p>
  const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

  return (
    <div>
      <Title text="Anecdote of the day"></Title>
      <Anecdote text={anecdotes[selected]}> </Anecdote>
      <Votes count={points[selected]}></Votes>

      <div>
        <Button handleClick={selectRandom} text="Select Random"></Button>
        <Button handleClick={incrementVote} text="Vote"></Button>
      </div>

      <Title text="Anecdote with the most votes"></Title>
      <Anecdote text={anecdotes[mostVoted()]}> </Anecdote>
      <Votes count={points[mostVoted()]}></Votes>
    </div>
  )
}

export default App