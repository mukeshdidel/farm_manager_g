import {useState,useEffect} from 'react';
import {api} from './Api/Data';
import { useAuth } from './AuthContext';




export default function Dashboard(){
    const {user, token} = useAuth(); 
    const [userStats, setUserStats] = useState({});
    const num = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
    
    useEffect(()=>{
        if(user && token){
            async function fetch(){ 
                const response = await api.post('/user-stats',user, { headers: { Authorization: `Bearer ${token}` } });
                setUserStats(response.data.userStats);
            }
            fetch();            
        }
    },[user, token])

    

    return (
        <>
            <div className='player-stats'>
                    <div>
                        <h4>Level</h4>
                        <h3>{userStats?.level}</h3>

                    </div>
                    <div>
                        <h4>XP</h4>
                        <h3>{userStats?.xp}</h3>
                    </div>
                    <div>
                        <h4>money</h4>
                        <h3>{userStats?.money}</h3>
                    </div>
                    <div>
                        <h4>plots</h4>
                        <h3>{userStats?.no_of_plots}</h3>
                    </div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
        </>
    );
}