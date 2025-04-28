import { NavLink, useNavigate} from "react-router-dom";
import { useAuth } from './AuthContext.jsx';

export default function Navbar(){
    const { token, setToken} = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {

        localStorage.removeItem('token');
        setToken('');
        navigate('/login');
    
    };

    return (
        <>
        <ul>
            {token ? (
                <>
                    <li><NavLink to="/" className={({isActive})=> isActive ? "active-link" : "" }>home</NavLink></li>
                    <li><NavLink to="/about" className={({isActive})=> isActive ? "active-link" : "" }>about</NavLink></li>
                    <li><NavLink to="/contact" className={({isActive})=> isActive ? "active-link" : "" }>contact</NavLink></li>
                    <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                </>
                           
            ) : (
                <>
                    <li><NavLink to="/login" className={({isActive}) => isActive ? "active-link" : ""}>Login</NavLink></li>
                    <li><NavLink to="/signup" className={({isActive}) => isActive ? "active-link" : ""}>Signup</NavLink></li>
                </>
            )}

        </ul>
        </>
    );
}