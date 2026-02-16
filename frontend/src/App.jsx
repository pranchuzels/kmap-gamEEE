
import { useState } from 'react'
import './App.css'
import Register from './components/register.jsx'
import Kmap from './components/Kmap.jsx';
import AnswerCard from './components/AnswerCard.jsx';

function App() {
  const [globalName, setGlobalName] = useState('');
  const [gameState, setGameState] = useState(null);
  const [globalState, setGlobalState] = useState('hide');

  


  return (
    <>
      <div className="flex gap-5 items-center justify-center align-middle bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
        {(globalName === '') ? 
          <Register globalName={globalName} setGlobalName={setGlobalName} setGameState={setGameState}/> :
          <div className='w-180 flex justify-center'>
              <Kmap dont_cares={gameState.q_dont_cares} form={gameState.q_form} num_var={gameState.q_num_var} terms={gameState.q_terms} groupings={gameState.q_groupings} globalState={globalState}/>
          </div>
        }
        {!(globalName === '') &&
        <AnswerCard gameState={gameState} setGlobalState={setGlobalState} globalState={globalState} setGameState={setGameState}/>}
        
       <img
        src="logo.png"
        alt="Logo"
        className="absolute bottom-0 right-0 
                  w-[40vw] max-w-md
                  opacity-10
                  pointer-events-none select-none grayscale invert"
      />
      <div className="absolute bottom-5 left-6 
                      text-slate-400 text-5xl 
                      opacity-20 select-none">
        Kmap GamEEE <span className='text-2xl'>by Francois Abadejos </span>
      </div>

      </div>
    </>
  )
}
// dont_cares, form, num_var, terms
export default App
