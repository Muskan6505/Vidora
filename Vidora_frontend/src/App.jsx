import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='w-full h-screen flex flex-col justify-center items-center bg-gray-800'>
        <h1 className= "text-4xl text-center text-blue-500 py-8"> Let's start building Vidora</h1>
      </div>
    </>
  )
}

export default App
