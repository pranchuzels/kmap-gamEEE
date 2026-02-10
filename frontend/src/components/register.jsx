
import React, { useState } from 'react'

const Register = ({ globalName, setGlobalName, setGameState }) => {


    const createUser = async (username, difficulty) => {
        try {
            const response = await fetch("http://localhost:8000/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, difficulty }),
            });

            const data = await response.json();
            console.log("New user:", data);
            setGlobalName(username);
            setGameState(data);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const [name, setName] = useState('')

    return (
    <div>
        <label>Name: <input name="Name" onChange={e => setName(e.target.value)} className='border'></input></label>
        <button className='border hover:bg-neutral-500 cursor-pointer' onClick={() => {createUser(name, 'easy')}}>Hello</button>
        
    </div>
    )
}

export default Register