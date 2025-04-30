import {useState, useEffect} from 'react';
import {api} from './Api/Data.jsx'
import { toast, ToastContainer } from 'react-toastify';

import userIcon from '../assets/icons/circle-user-solid.svg';
import passIcon from '../assets/icons/lock-solid.svg'


export default function Signup(){

    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');


    async function handleLogin(e){
        try{
            e.preventDefault();
            const response = await api.post('/signup', {username , password});
            setUsername('');
            setPassword('');
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
                
                <div className='login-input-container'>
                    <span><img className='login-icon' src={userIcon} alt="icon" /></span>
                    <input type="text" value={username} placeholder='username' onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className='login-input-container'>
                    <span><img src={passIcon} className='login-icon'  alt="icon" /></span>
                    <input type="text" value={password} placeholder='password' onChange={e => setPassword(e.target.value)} required />   
                </div>
                
                <button type='submit'>signup</button>
                <ToastContainer position="top-right" autoClose={3000} />
            </form>
        </>
    );
}