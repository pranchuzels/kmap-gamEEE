import { useState, useEffect } from 'react';

function KmapGame({ username }) {
  const [gameState, setGameState] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:8000';

  // Start new game
  const startGame = async (difficulty) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, difficulty })
      });
      const data = await response.json();
      setGameState(data);
      setAnswer('');
      setFeedback(null);
      setShowAnswer(false);
      setCorrectAnswers([]);
    } catch (error) {
      console.error('Error starting game:', error);
    }
    setLoading(false);
  };

  // Check answer
  const checkAnswer = async () => {
    if (!answer.trim()) return;
    
    setLoading(true);
    try {
      // First check if answer is correct
      const checkResponse = await fetch(`${API_URL}/game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 0,
          user: { ...gameState, answer }
        })
      });
      const checkData = await checkResponse.json();
      setCorrectAnswers(checkData.answers);
      
      // Then get next question
      const nextResponse = await fetch(`${API_URL}/game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 1,
          user: { ...gameState, result: checkData.result }
        })
      });
      const nextData = await nextResponse.json();
      
      setFeedback({
        result: checkData.result,
        message: getFeedbackMessage(checkData.result)
      });
      
      // Update game state after showing feedback
      setTimeout(() => {
        setGameState(nextData.user);
        setAnswer('');
        setFeedback(null);
        setShowAnswer(false);
        setCorrectAnswers([]);
      }, 2000);
      
    } catch (error) {
      console.error('Error checking answer:', error);
    }
    setLoading(false);
  };

  const getFeedbackMessage = (result) => {
    switch(result) {
      case 1: return '✓ Correct!';
      case 0: return '✗ Incorrect';
      case -1: return '⚠ Invalid characters';
      case -2: return '⚠ Wrong form (SOP/POS)';
      case -3: return '⚠ Format error';
      default: return '⚠ Unknown error';
    }
  };

  // Generate K-map grid
  const generateKmap = () => {
    if (!gameState) return null;

    const { q_num_var, q_terms, q_dont_cares } = gameState;
    
    if (q_num_var === 2) {
      return generate2VarKmap();
    } else if (q_num_var === 3) {
      return generate3VarKmap();
    } else if (q_num_var === 4) {
      return generate4VarKmap();
    }
  };

  const generate2VarKmap = () => {
    const { q_terms, q_dont_cares } = gameState;
    const grayCode = ['0', '1'];
    
    return (
      <div className="inline-block border-2 border-gray-800">
        <div className="flex">
          <div className="w-12"></div>
          <div className="w-12 h-8 flex items-center justify-center font-semibold border-b border-gray-400">B</div>
          <div className="flex">
            {grayCode.map((b, i) => (
              <div key={i} className="w-16 h-8 flex items-center justify-center border-b border-l border-gray-400 bg-gray-100 font-mono">
                {b}
              </div>
            ))}
          </div>
        </div>
        <div className="flex">
          <div className="w-12 h-8 flex items-center justify-center font-semibold border-r border-gray-400">A</div>
          <div className="w-12"></div>
          <div>
            {grayCode.map((a, rowIdx) => (
              <div key={rowIdx} className="flex">
                <div className="w-16 h-16 flex items-center justify-center border-l border-t border-gray-400 bg-gray-100 font-mono">
                  {a}
                </div>
                {grayCode.map((b, colIdx) => {
                  const value = parseInt(a + b, 2);
                  const isMinterm = q_terms.includes(value);
                  const isDontCare = q_dont_cares.includes(value);
                  
                  return (
                    <div
                      key={colIdx}
                      className={`w-16 h-16 flex items-center justify-center border-l border-t border-gray-400 font-bold text-lg
                        ${isMinterm ? 'bg-green-200' : isDontCare ? 'bg-yellow-200' : 'bg-white'}`}
                    >
                      {isDontCare ? 'X' : isMinterm ? '1' : '0'}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const generate3VarKmap = () => {
    const { q_terms, q_dont_cares } = gameState;
    const grayCode = ['00', '01', '11', '10'];
    
    return (
      <div className="inline-block border-2 border-gray-800">
        <div className="flex">
          <div className="w-12"></div>
          <div className="w-12 h-8 flex items-center justify-center font-semibold border-b border-gray-400">BC</div>
          <div className="flex">
            {grayCode.map((bc, i) => (
              <div key={i} className="w-16 h-8 flex items-center justify-center border-b border-l border-gray-400 bg-gray-100 font-mono">
                {bc}
              </div>
            ))}
          </div>
        </div>
        <div className="flex">
          <div className="w-12 h-8 flex items-center justify-center font-semibold border-r border-gray-400">A</div>
          <div className="w-12"></div>
          <div>
            {['0', '1'].map((a, rowIdx) => (
              <div key={rowIdx} className="flex">
                <div className="w-16 h-16 flex items-center justify-center border-l border-t border-gray-400 bg-gray-100 font-mono">
                  {a}
                </div>
                {grayCode.map((bc, colIdx) => {
                  const value = parseInt(a + bc, 2);
                  const isMinterm = q_terms.includes(value);
                  const isDontCare = q_dont_cares.includes(value);
                  
                  return (
                    <div
                      key={colIdx}
                      className={`w-16 h-16 flex items-center justify-center border-l border-t border-gray-400 font-bold text-lg
                        ${isMinterm ? 'bg-green-200' : isDontCare ? 'bg-yellow-200' : 'bg-white'}`}
                    >
                      {isDontCare ? 'X' : isMinterm ? '1' : '0'}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const generate4VarKmap = () => {
    const { q_terms, q_dont_cares } = gameState;
    const grayCode = ['00', '01', '11', '10'];
    
    return (
      <div className="inline-block border-2 border-gray-800">
        <div className="flex">
          <div className="w-12"></div>
          <div className="w-12 h-8 flex items-center justify-center font-semibold border-b border-gray-400">CD</div>
          <div className="flex">
            {grayCode.map((cd, i) => (
              <div key={i} className="w-16 h-8 flex items-center justify-center border-b border-l border-gray-400 bg-gray-100 font-mono">
                {cd}
              </div>
            ))}
          </div>
        </div>
        <div className="flex">
          <div className="w-12 h-8 flex items-center justify-center font-semibold border-r border-gray-400">AB</div>
          <div className="w-12"></div>
          <div>
            {grayCode.map((ab, rowIdx) => (
              <div key={rowIdx} className="flex">
                <div className="w-16 h-16 flex items-center justify-center border-l border-t border-gray-400 bg-gray-100 font-mono">
                  {ab}
                </div>
                {grayCode.map((cd, colIdx) => {
                  const value = parseInt(ab + cd, 2);
                  const isMinterm = q_terms.includes(value);
                  const isDontCare = q_dont_cares.includes(value);
                  
                  return (
                    <div
                      key={colIdx}
                      className={`w-16 h-16 flex items-center justify-center border-l border-t border-gray-400 font-bold text-lg
                        ${isMinterm ? 'bg-green-200' : isDontCare ? 'bg-yellow-200' : 'bg-white'}`}
                    >
                      {isDontCare ? 'X' : isMinterm ? '1' : '0'}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            K-Map Quiz
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Welcome, {username}! Choose your difficulty:
          </p>
          <div className="space-y-3">
            {['easy', 'medium', 'hard', 'adaptive'].map((diff) => (
              <button
                key={diff}
                onClick={() => startGame(diff)}
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">K-Map Quiz</h1>
            <p className="text-gray-600">Player: {username}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">{gameState.score}</div>
            <div className="text-sm text-gray-500">Score</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Question Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-semibold">Variables:</span> {gameState.q_num_var}
              </div>
              <div>
                <span className="font-semibold">Form:</span> {gameState.q_form === 'min' ? 'SOP (Sum of Products)' : 'POS (Product of Sums)'}
              </div>
              <div>
                <span className="font-semibold">Terms:</span> {gameState.q_terms.join(', ')}
              </div>
              {gameState.q_dont_cares.length > 0 && (
                <div>
                  <span className="font-semibold">Don't Cares:</span> {gameState.q_dont_cares.join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* K-map */}
          <div className="flex justify-center mb-8">
            {generateKmap()}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-200 border border-gray-400"></div>
              <span>1 (Minterm/Maxterm)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-200 border border-gray-400"></div>
              <span>X (Don't Care)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white border border-gray-400"></div>
              <span>0</span>
            </div>
          </div>

          {/* Input Instructions */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg text-sm">
            <p className="font-semibold mb-2">Input Format:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>SOP: Use + for OR, no operator for AND. Example: AB + A'C</li>
              <li>POS: Use parentheses for terms. Example: (A+B)(A'+C)</li>
              <li>Use ' (apostrophe) for complement. Variables: A, B, C, D</li>
            </ul>
          </div>

          {/* Answer Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Your Answer:
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              placeholder={gameState.q_form === 'min' ? "e.g., AB + A'C" : "e.g., (A+B)(A'+C)"}
              disabled={loading || feedback}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none font-mono text-lg disabled:bg-gray-100"
            />
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`mb-4 p-4 rounded-lg font-semibold ${
              feedback.result === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {feedback.message}
              {feedback.result !== 1 && correctAnswers.length > 0 && (
                <div className="mt-2 font-normal">
                  Correct answer(s): {correctAnswers.join(' or ')}
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={checkAnswer}
              disabled={loading || !answer.trim() || feedback}
              className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Checking...' : 'Submit Answer'}
            </button>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="px-6 py-3 rounded-lg font-semibold text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 transition-all"
            >
              {showAnswer ? 'Hide' : 'Show'} Answer
            </button>
          </div>

          {/* Show Answer */}
          {showAnswer && correctAnswers.length > 0 && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
              <p className="font-semibold text-indigo-900 mb-2">Correct Answer(s):</p>
              <div className="font-mono text-lg text-indigo-800">
                {correctAnswers.map((ans, i) => (
                  <div key={i}>{ans}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KmapGame;