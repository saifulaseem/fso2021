import { useState } from "react"


const Button = ({ text, handleClick }) => <button onClick={handleClick}>{text}</button>
const Statistics = ({ good, bad, neutral }) => {
  const total = good + bad + neutral;
  const avg = (good - bad) / total; //Assuming the average is the average of Effective Good Ratings compared to Total Ratings
  const positive = good / total * 100;
  if (!total) {

    return (<p>No feedback given </p>)
  }
  else {
    return (
      <table>
        <StatisticLine text="good" count={good}></StatisticLine>
        <StatisticLine text="neutral" count={neutral}></StatisticLine>
        <StatisticLine text="bad" count={bad}></StatisticLine>
        <StatisticLine text="all" count={total}></StatisticLine>
        <StatisticLine text="avg" count={avg}></StatisticLine>
        <StatisticLine text="positive" count={positive + " %"}></StatisticLine>
      </table>
    )
  }
}
const StatisticLine = ({ text, count }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{count}</td>
    </tr>
  )
}
function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h2>Give Feedback</h2>
      <Button text="good" handleClick={() => setGood(good + 1)}></Button>
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)}></Button>
      <Button text="bad" handleClick={() => setBad(bad + 1)}></Button>
      <h2>Statistics</h2>
      <Statistics good={good} bad={bad} neutral={neutral}></Statistics>
    </>
  )
}

export default App;
