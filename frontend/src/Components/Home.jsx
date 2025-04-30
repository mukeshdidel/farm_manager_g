import { useAuth } from "./AuthContext";
import '../styles/home.css'
import {api} from './Api/Data'
import {useState, useEffect} from 'react'


export default function Home(){

    const {user, token} = useAuth(); 
    useEffect(()=>{
        async function fetch(){
            const response = await api.get('/user-stats', { headers: { Authorization: `Bearer ${token}` } });
        }
        fetch();
    })

    return (
        <>
            <div className='home'>
                <div className='player-stats'></div>
            </div>
        </>
    );
}