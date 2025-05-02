import { useAuth } from "./AuthContext";
import '../styles/plots.css'
import {api} from './Api/Data'
import {useState, useEffect} from 'react'


const imgDir = '/assets/farmassets/';




export default function Plots(){
    const {user, token} = useAuth(); 
    const [userInfo, setUserInfo] = useState([]);
    const [userFarmInfo, setUserFarmInfo] = useState([]);
    const num = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
    const [selectedPlot, setSelectedPlot] = useState(-1);
    
    useEffect(()=>{
        if(user && token){
            async function fetch(){ 
                const response = await api.post('/user-info',user, {headers: {Authorization: `Bearer ${token}`}});
                setUserInfo(response.data.userInfo);
                console.log(response.data.userInfo)
                setUserFarmInfo(response.data.userFarmInfo);
                console.log(response.data.userFarmInfo)
            }
            fetch();            
        }
    },[user, token])


    function handleCultivate(i){
        setSelectedPlot(i);
        const popUpCropDiv = document.getElementsByClassName('pop-up-culivation')[0];
        popUpCropDiv.style.display = 'flex';
    }

    async function handleSelectSeed(seed){
        try{
            const popUpCropDiv = document.getElementsByClassName('pop-up-culivation')[0];
            popUpCropDiv.style.display = 'none';
            
            const plot = {
                crop_name: seed.crop_name,
                plot_no : selectedPlot,
                item_name : seed.item_name,
            }
    
            const response = await api.post('/cultivate', {plot, user}, {headers: {Authorization: `Bearer ${token}`}});

            const response1 = await api.post('/user-info',user, {headers: {Authorization: `Bearer ${token}`}});
            
            setUserInfo(response1.data.userInfo);
            console.log(response1.data.userInfo);
            setUserFarmInfo(response1.data.userFarmInfo);
            console.log(response1.data.userFarmInfo)


        }
        catch(error){
            console.log(error)
        }
    }


    async function handleWater(i){
        try{
            const response = await api.post('/water-plot', {plot_no: i, user}, {headers: {Authorization: `Bearer ${token}`}});

            setUserFarm(pFarms => {
                return pFarms.map((farm, index) => {
                  if (index === i -1) {
                    return {
                      ...farm,
                      last_watered: new Date().toISOString(), 
                      game_days_since_watering: 0 
                    };
                  }
                  return farm;
                });
            });
        }
        catch(error){
            console.log(error);
        }
    }

    return (
        <div className='plots'>
            {num.map(i => {
                const plot = userFarmInfo?.[i-1];
                if(plot?.plot_no === i ) 
                {
                    return (
                        <div key={i} className='plot'>
                            {
                            plot.status === 'empty' ? 
                                (<>
                                    <h1>empty</h1>
                                    <button onClick={()=>handleCultivate(i)}>cultivate</button>
                                </>)
                            :
                                (<>
                                    <img src={`${imgDir}${plot.field_url}`} alt="" />  
                                    <div>
                                        <h3>{plot.crop_name}</h3>
                                        <h4>{plot.status}</h4>
                                        <p><span>progress </span><br /> {plot.game_days_passed}/{plot.total_growth_days}</p>
                                        <p><span>water in </span><br />{7 - plot.game_days_since_watering} days</p>
                                        {
                                           7 - plot.game_days_since_watering < 0 ? <button onClick={()=> handleWater(i)}>water</button> : null 
                                        }
                                        
                                    </div>                                  
                                </>)
                            }
                        </div>
                    );
                }
                else{

                    return <div key={i} className = 'plot'><h1>locked</h1></div>
                }

            })}
            <div className='pop-up-culivation'>
                <button id="closeButt" onClick={()=>{ document.getElementsByClassName('pop-up-culivation')[0].style.display ='none'}}>X</button>
                {
                    
                    userInfo?.map( seed => 
                    <div key={seed.item_name}>
                        <h3>{seed.item_name}</h3>
                        <button onClick={()=>handleSelectSeed(seed)}>select</button>
                    </div>
                )}
            </div>
        </div>
    );
}