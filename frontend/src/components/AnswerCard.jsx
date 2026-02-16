import React, { useState } from 'react'

const AnswerCard = ({ onSubmit, gameState, setGlobalState, globalState, setGameState }) => {
    const [answer, setAnswer] = useState('');
    const [errorS, setErrorS] = useState(false);
    const [response, setResponse] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const checkAnswer = async (userData, type = 0) => {
        if (answer === '') {
            setErrorS(true);

        } else {
            try {
                const response = await fetch("https://kmap-gameee-backend.vercel.app/game", {
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
        }
     
    };

    const handleSubmit = async () => {
        // if (answer !== '') {
        //     const userPayload = {...gameState, answer:answer};

        //     const result = await checkAnswer(userPayload, 0);

        //     if (result["result"] == 0 || result["result"] == 1 ) {
        //         setGlobalState("show");
        //         setResponse(result)
        //     } else {
        //         setGlobalState("hide");
        //         setErrorS(true)
        //     }

        //     console.log(result);
        // } else {
        //     setErrorS(true);
        // }
        const userPayload = {...gameState, answer:answer};
        if (globalState === "hide") {
            if (answer !== '') {
                const result = await checkAnswer(userPayload, 0);
                if (result["result"] == 0 || result["result"] == 1 ) {
                    setGlobalState("show");
                    setResponse(result)
                } else {
                    setGlobalState("hide");
                    setErrorS(true)
                    setErrorMessage("Incorrect format (check variables or operators)")
                }
            } else {
                setErrorS(true);
                setErrorMessage("Input something!")
            }
        } else {
            const meow = {...gameState, result: response["result"]};
            setGlobalState("hide");
            const result = await checkAnswer(meow, 1);
            setAnswer("")
            setGameState(result.user)
            console.log(result)
        }
    };



    return (
        <div className='w-[35%] px-20'>
            {(globalState == "show") &&
            <>
                <h1 className={`text-4xl my-5 text-center font-semibold text-shadow-2xs ${response["result"] == 1 ? "text-emerald-500" : "text-red-500 text-shadow-red-400"}`}>{response["result"] == 1 ? "Correct!" : "Wrong!"}</h1>
                <h1 className='text-cyan-400 text-center mb-5 font-bold'>Correct answer(s): {response["answers"].map(value => <a className='text-amber-50 font-normal'>{value}</a>)}</h1>
            </>}
            <div className="w-full p-10 bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-cyan-500/30">
                    <div className="mb-3 flex w-full justify-between">
                        <p className="text-left text-slate-400 text-lg">
                            {gameState.username}
                        </p>
                        
                        <p className="text-right text-slate-400 text-lg">
                            Score: <span className='font-bold text-cyan-400'>{gameState.score}</span>
                        </p>
                    </div>
                    <div className="text-center mb-6">
                        
                        <p className="text-slate-400 text-lg">
                            Find the <span className='font-bold text-cyan-400'>{(gameState.q_form) == "min" ? "SOP" : "POS"}</span> expression
                        </p>
                    </div>

                    <div className="relative my-4">
                         {errorMessage && (
                        <div className="absolute left-0 -top-7 text-xs bg-red-500 text-white px-2 py-1 rounded shadow-md">
                            {errorMessage}
                        </div>
                        )}
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => {
                                setAnswer(e.target.value)
                                setErrorS(false)
                                setErrorMessage("")
                            }}
                            placeholder="e.g., AB+BC'+A'C, (AB)(D')"
                            className={`w-full px-6 py-4 bg-slate-900/50 border-2 ${errorS ? "border-red-400" : "border-slate-400/30"} rounded-xl text-white text-lg placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 shadow-inner ${globalState === "show" ? "pointer-events-none" : ""}`}
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 pointer-events-none"></div>
                    </div>

                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className={`w-full px-8 py-4 bg-gradient-to-r ${globalState === "hide" ? "from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500" : "from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-emerald-500"} text-white font-bold text-lg rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border`}
                    >
                        {globalState === "hide" ? "Submit Answer" : "Next Map"}
                    </button>
                   
                
            </div>
        </div>
    )
}

export default AnswerCard