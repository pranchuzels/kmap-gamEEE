
import { useState } from 'react'
import './App.css'
import Register from './components/register.jsx'
import Kmap from './components/Kmap.jsx';

function App() {
  const [globalName, setGlobalName] = useState('');
  const [gameState, setGameState] = useState(null);

  
    const checkAnswer = async (userData, type = 0) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/game", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type: type,
            user: userData,
        }),
        });

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error("Error:", error);
    }
    };

    const handleSubmit = async () => {
      const userPayload = {...gameState, answer:"AB"};

      const result = await checkAnswer(userPayload, 0);

      console.log(result);
    };



  return (
    <>
      {(globalName === '') ? 
        <Register globalName={globalName} setGlobalName={setGlobalName} setGameState={setGameState}/> :
        <Kmap dont_cares={gameState.q_dont_cares} form={gameState.q_form} num_var={gameState.q_num_var} terms={gameState.q_terms} groupings={gameState.q_groupings}/>
      }
      <button onClick={handleSubmit}>asdasd</button>
      
      <h1 className='text-2xl'>Hello {globalName}!</h1>
    </>
  )
}
// dont_cares, form, num_var, terms
export default App
