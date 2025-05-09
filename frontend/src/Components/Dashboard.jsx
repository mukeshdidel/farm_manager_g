import {useState,useEffect} from 'react';
import {api} from './Api/Data';
import { useAuth } from './AuthContext';
import '../styles/dashboard.css'




export default function Dashboard(){
    const {user, token, userInfo} = useAuth(); 
    const [userStats, setUserStats] = useState({});
    

    return (
        <>
            <div className='dashboard'>
            <div className='player-stats'>
                    <div>
                        <h4>Level</h4>
                        <h3>{userInfo?.userStat?.level}</h3>

                    </div>
                    <div>
                        <h4>XP</h4>
                        <h3>{userInfo?.userStat?.xp}</h3>
                    </div>
                    <div>
                        <h4>money</h4>
                        <h3>{userInfo?.userStat?.money}</h3>
                    </div>
                    <div>
                        <h4>plots</h4>
                        <h3>{userInfo?.userStat?.no_of_plots}</h3>
                    </div>
                </div>
            </div>
        </>
    );
}