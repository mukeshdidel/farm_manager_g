import { NavLink, useNavigate} from "react-router-dom";
import { useAuth } from './AuthContext.jsx';
import '../styles/navbar.css';

export default function Navbar(){
    const { token, setToken, user, setUser} = useAuth();
    const navigate = useNavigate();
    console.log("navbar",user)
    console.log(user?.username)
    console.log(user?.username?.[0]?.toUpperCase());
    const handleLogout = () => {

        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        navigate('/login');
    
    };

    return (
        <>
        
            {token ? (
                <>  
                <div className="navbar">
                    <ul >
                        <li><NavLink to="/" className={({isActive})=> isActive ? "active-link" : "" }>home</NavLink></li><hr />
                        <li><NavLink to="/about" className={({isActive})=> isActive ? "active-link" : "" }>about</NavLink></li><hr />
                        <li><NavLink to="/contact" className={({isActive})=> isActive ? "active-link" : "" }>contact</NavLink></li><hr />
                        <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                    </ul>
                    <div className='profile'>
                        <div><h2>{user?.username?.[0]?.toUpperCase()}</h2></div>
                        <h3>{user.username}</h3>
                    </div>
                </div>

                </>
                           
            ) : (
                <>
                <ul className="navbar-login">
                    <li><NavLink to="/login" className={({isActive}) => isActive ? "login-active-link " : ""}>Login</NavLink></li>
                    <li><NavLink to="/signup" className={({isActive}) => isActive ? "login-active-link " : ""}>Signup</NavLink></li>
                </ul>
                </>
            )}
        </>
    );
}