import { useAuth } from "./AuthContext";
import '../styles/plots.css'
import {api} from './Api/Data'
import {useState, useEffect} from 'react'


const imgDir = '/assets/farmassets/';




export default function Plots(){
    const {user, token} = useAuth(); 
    const [userInfo, setUserInfo] = useState({});
    const num = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
    
    useEffect(()=>{
        if(user && token){
            async function fetch(){ 
                const response = await api.post('/user-info',user, { headers: { Authorization: `Bearer ${token}` } });
                setUserInfo(response.data.userStats);
            }
            fetch();            
        }
    },[user, token])

    return (
        <div className='plots'>
            {num.map(i => {
                return (
                <div key={i} className='plot'>
                    {userInfo?.no_of_plots >= i ?
                        <>
                        </> 
                    :
                        <p>locked {i}</p>
                    }
                </div>
                );
            })}
        </div>
    );
}