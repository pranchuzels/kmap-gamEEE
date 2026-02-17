import React, { useState, useEffect } from 'react'

const AnswerCard = ({ onSubmit, gameState, setGlobalState, globalState, setGameState }) => {
    const [answer, setAnswer] = useState('');
    const [errorS, setErrorS] = useState(false);
    const [response, setResponse] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [resultVisible, setResultVisible] = useState(false);

    // Animate the result banner in whenever globalState flips to "show"
    useEffect(() => {
        if (globalState === 'show') {
            setResultVisible(false);
            // tiny delay so the CSS transition fires from the hidden state
            const t = setTimeout(() => setResultVisible(true), 30);
            return () => clearTimeout(t);
        } else {
            setResultVisible(false);
        }
    }, [globalState]);

    const checkAnswer = async (userData, type = 0) => {
        if (answer === '') {
            setErrorS(true);
        } else {
            try {
                const response = await fetch("https://kmap-gameee-backend.vercel.app/game", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: type, user: userData }),
                });
                const data = await response.json();
                console.log(data);
                return data;
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    const handleSubmit = async () => {
        const userPayload = { ...gameState, answer: answer };
        if (globalState === "hide") {
            if (answer !== '') {
                const result = await checkAnswer(userPayload, 0);
                if (result["result"] == 0 || result["result"] == 1) {
                    setGlobalState("show");
                    setResponse(result);
                } else {
                    setGlobalState("hide");
                    setErrorS(true);
                    setErrorMessage("Incorrect format (check variables or operators)");
                }
            } else {
                setErrorS(true);
                setErrorMessage("Input something!");
            }
        } else {
            const meow = { ...gameState, result: response["result"] };
            setGlobalState("hide");
            const result = await checkAnswer(meow, 1);
            setAnswer("");
            setGameState(result.user);
            console.log(result);
        }
    };

    const isCorrect = response && response["result"] == 1;

    return (
        <div className='w-full px-2 sm:px-4 md:px-6 mx-auto'>

            <div
                className="overflow-hidden transition-all duration-500 ease-out"
                style={{
                    maxHeight: globalState === 'show' && resultVisible ? '160px' : '0px',
                    opacity: globalState === 'show' && resultVisible ? 1 : 0,
                    transform: globalState === 'show' && resultVisible
                        ? 'translateY(0) scale(1)'
                        : 'translateY(-12px) scale(0.97)',
                }}
            >
                <div className={`mb-4 px-5 py-4 rounded-2xl border-2 text-center
                    ${isCorrect
                        ? 'bg-emerald-900/30 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                        : 'bg-red-900/30 border-red-500/50 shadow-lg shadow-red-500/20'
                    }`}
                >
                    <h1 className={`text-2xl sm:text-3xl md:text-4xl font-semibold mb-2
                        ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                        {isCorrect ? 'Correct!' : 'Wrong!'}
                    </h1>
                    <p className='text-cyan-400 font-bold text-sm sm:text-base'>
                        Correct answer(s):{' '}
                        <span className='text-amber-50 font-normal'>
                            {response && response["answers"].join(', ')}
                        </span>
                    </p>
                </div>
            </div>

            <div className="w-full p-5 sm:p-8 md:p-10 from-slate-800 via-slate-900 to-slate-800 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-cyan-500/95">
                
                <div className="mb-3 flex w-full justify-between items-center">
                    <p className="text-left text-slate-400 text-sm sm:text-base md:text-lg truncate max-w-[50%]">
                        {gameState.username}
                    </p>
                    <p className="text-right text-slate-400 text-sm sm:text-base md:text-lg">
                        Score: <span className='font-bold text-cyan-400'>{gameState.score}</span>
                    </p>
                </div>

                <div className="text-center mb-5 sm:mb-6">
                    <p className="text-slate-400 text-sm sm:text-base md:text-lg">
                        Find the{' '}
                        <span className='font-bold text-cyan-400'>
                            {gameState.q_form == "min" ? "SOP" : "POS"}
                        </span>{' '}
                        expression
                    </p>
                </div>

                <div className="relative my-4">
                    {errorMessage && (
                        <div className="absolute left-0 -top-7 text-xs bg-red-500 text-white px-2 py-1 rounded shadow-md z-10 whitespace-nowrap">
                            {errorMessage}
                        </div>
                    )}
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => {
                            setAnswer(e.target.value);
                            setErrorS(false);
                            setErrorMessage("");
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && globalState !== 'show') handleSubmit();
                        }}
                        placeholder="e.g., AB+BC'+A'C, (AB)(D')"
                        className={`w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-900/50 border-2
                            ${errorS ? "border-red-400" : "border-slate-400/30"}
                            rounded-xl text-white text-sm sm:text-base md:text-lg placeholder-slate-500
                            focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                            transition-all duration-200 shadow-inner
                            ${globalState === "show" ? "pointer-events-none opacity-60" : ""}`}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 pointer-events-none"></div>
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className={`w-full px-6 sm:px-8 py-3 sm:py-4 font-bold text-sm sm:text-base md:text-lg
                        rounded-xl shadow-lg transition-all duration-200 transform
                        hover:scale-[1.02] active:scale-[0.98] border text-white
                        ${globalState === "hide"
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/30 hover:shadow-cyan-500/50"
                            : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-emerald-500 shadow-emerald-500/30 hover:shadow-emerald-500/50"
                        }`}
                >
                    {globalState === "hide" ? "Submit Answer" : "Next Map"}
                </button>
            </div>
        </div>
    );
};

export default AnswerCard