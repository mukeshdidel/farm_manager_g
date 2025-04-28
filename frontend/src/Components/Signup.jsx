import {useState, useEffect} from 'react';
import {api} from './Api/Data.jsx'
import { toast, ToastContainer } from 'react-toastify';

export default function Signup(){

    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');

    async function handleLogin(e){
        try{
            e.preventDefault();
            const response = await api.post('/signup', {username , password});
            toast.success(response?.data?.messege);
        }
        catch(error){
            console.log(error);
            toast.error(error.messege)
        }
    }

    return(
        <>
            
            <form action="login" className='user-credential' onSubmit={e => handleLogin(e)}>
                <h2>Create Account</h2>
                <input type="text" value={username} placeholder='username' onChange={e => setUsername(e.target.value)} required />
                <input type="text" value={password} placeholder='password' onChange={e => setPassword(e.target.value)} required />
                <button type='submit'>Create Account</button>
                <ToastContainer position="top-right" autoClose={3000} />
            </form>
        </>
    );
}