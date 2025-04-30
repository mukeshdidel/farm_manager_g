import {useState, useEffect} from 'react';
import {api} from './Api/Data.jsx'
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {useAuth} from './AuthContext.jsx';
import userIcon from '../assets/icons/circle-user-solid.svg';
import passIcon from '../assets/icons/lock-solid.svg'


export default function Login(){
    const navigate = useNavigate();
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const{setToken, setUser} = useAuth();


    async function handleLogin(e){
        try{
            e.preventDefault();
            const response = await api.post('/login', {username , password});
            setUsername('');
            setPassword('');

            toast.success(response?.data?.messege);
            localStorage.removeItem("auth_token"); 
            localStorage.setItem('auth_token', response?.data?.token);
            
            setToken(response?.data?.token);
            setUser(jwtDecode(response?.data?.token));
            navigate('/', { replace: true })
        
        }
        catch(error){
            console.log(error);
            toast.error(error.response.data.messege)
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
                
                <button type='submit'>Login</button>
                <ToastContainer position="top-right" autoClose={3000} />
            </form>
        </>
    );
}