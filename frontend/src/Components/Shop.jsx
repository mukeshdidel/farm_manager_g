import {useState, useEffect} from 'react';
import {api} from './Api/Data';
import { useAuth} from './AuthContext';
import '../styles/shop.css'
import { toast, ToastContainer } from 'react-toastify';

const imgDer = 'assets/farmassets/'
export default function Shop(){
    const {user, token} = useAuth();
    const [seedShop, setSeedShop] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    useEffect(()=>{
        if(user && token){
            async function fetch(){
                const response = await api.post('/shop', user, {headers: { Authorization: `Bearer ${token}` }});
                console.log(response.data);
                setSeedShop(response.data);
            }
            fetch();
        }
    },[user, token])


    async function handleAddCart(item){
        
        setCart(c => {
            
            const exist = c.find(i => {
                return i.name === item.name });
            if(exist) {
                return c.map(i => i.name === item.name ? {...i, quantity: i.quantity + 1} : i )           
            }else {
                return [...c, {name : item.name, price: item.price, quantity : 1}] 
            }

        });
        setTotalCost(cost => cost + item.price );
    }

    function handleRemoveCart(item) {
        setCart(c => {
          const exist = c.find(i => i.name === item.name);
      
          if (exist.quantity > 1) {
            return c.map(i =>
              i.name === item.name
                ? { ...i, quantity: i.quantity - 1 }
                : i
            );
          } else {
            return c.filter(i => i.name !== item.name);
          }
        });
        setTotalCost(cost => cost - item.price );
    }

    async function handlePurchase(){
        try{
            const response = await api.post('/purchase',{cart,user, totalCost} , {headers: { Authorization: `Bearer ${token}`}});
            setCart([])
            toast.success(response?.data?.messege);            
        }
        catch(error){
            console.log(error);
            toast.error(error.response.data.messege)
        }

    }

    return (
        <>
        <div className='shop'>

            <div className='cart'>
            <h2 style={{textAlign: 'center', color: 'white', width: '100%'}}>Cart</h2>
                {   
                    cart.length === 0 ? <h1 style={{color: 'white', textAlign: 'center', width: '100%' }}>cart is empty</h1> : 
                    <h2 style={{textAlign: 'center', color: 'white', width: '100%'}}>total: {totalCost}</h2>
                }
                {  
                    cart?.map(item => {
                        return (
                            <button key={item.name} onClick={()=>handleRemoveCart(item)}>
                                <h4>{item.name}</h4>
                                <p>price: {item.price}</p>
                                <p>quantity: {item.quantity}</p>
                            </button>
                        );
                    })
                }
                { cart.length === 0 ? null :
                <div className='purchase-button-div'>
                    <button className='purchase-button' onClick={handlePurchase} >purchase</button> 
                </div>
  
                }
            </div>

            <div className='seed-shop'>
                <h2 style={{textAlign: 'center', color: 'white', width: '100%'}}>Seeds</h2>
                {seedShop?.map( seed => {
                    const img = `${imgDer}${seed.seed_url}`;
                    const item = {name : seed.seed_name, price: seed.price};
                    return (
                      <div key={seed.seed_name}>
                            <img src={img} alt={seed.seed_name}/>
                            <div>
                                <h4>{seed.seed_name}</h4>
                                <p>price: {seed.price}</p>
                                <button  onClick={() => handleAddCart(item)}>Add To Cart</button>
                            </div>
                        </div>
                        
                    );
                } )}
                
            </div>
        </div>
        </>
    );
}