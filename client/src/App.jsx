import { useState } from 'react'
import NewsList from './components/Newslist'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NewsList/>
    </>
  )
}

export default App
