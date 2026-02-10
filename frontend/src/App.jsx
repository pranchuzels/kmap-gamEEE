
import { useState } from 'react'
import './App.css'
import Register from './components/register.jsx'
import KmapGame from './components/KmapGame.jsx';
import Kmap from './components/Kmap.jsx';

function App() {
  const [globalName, setGlobalName] = useState('');
  const [gameState, setGameState] = useState(null);

  return (
    <>
      {(globalName === '') ? 
        <Register globalName={globalName} setGlobalName={setGlobalName} setGameState={setGameState}/> :
        <Kmap dont_cares={gameState.q_dont_cares} form={gameState.q_form} num_var={gameState.q_num_var} terms={gameState.q_terms}/>
      }
      
      <h1 className='text-2xl'>Hello {globalName}!</h1>
    </>
  )
}
// dont_cares, form, num_var, terms
export default App
