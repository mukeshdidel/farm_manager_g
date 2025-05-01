import express from 'express';
import cors from 'cors'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2';


const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://192.168.1.8:5173'], 
    credentials: true 
}));
app.use(express.urlencoded({ extended: false }));

const pool = mysql.createPool({ 
    host: 'localhost',
    user: 'root',
    password: 'Mukesh@7976',
    database: 'farm',
}).promise();

const jwt_secret_key = 'MuKeSh@sEcReT_kEy_fArM&mAnAgEr';


app.post('/signup', async (req, res)=>{
    try{
        const {username, password} = req.body;
        const [user] = await pool.query('select * from users where username = ?',[username]);
        if(user[0]){
            return res.status(401).json({messege: 'username alreay taken'})

        }
        const hasshedPassword = await bcrypt.hash(password, 10);
        const response = await pool.query('insert into users value (?,?)',[username, hasshedPassword]);
        res.status(201).json({messege: 'Signup successfull'});
    }catch(error){
        console.log(error);
    }

})

app.post('/login', async (req, res)=>{
    try{
        const {username, password} = req.body;        
        
        const [user] = await pool.query('select * from users where username = ?',[username]);
        
        if(!user[0]){
            return res.status(401).json({messege: 'username not found'});
        }
        const is_passMatch = await bcrypt.compare(password, user[0].password);
      
        if(!is_passMatch){
            return res.status(401).json({messege: 'Incorrect password'});
        }
        const userPlayload = {
            username: user[0].username
        }
        const token = jwt.sign(userPlayload, jwt_secret_key);
        res.json({token, user: {username: user[0].username}, messege: 'Login Successful'});
    }catch(error){
        console.log(error)
        res.status(500).json(error);
    }
})

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : undefined;

    if(!token){
        return res.sendStatus(401);
    }

    jwt.verify(token, jwt_secret_key , (err, user)=> {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

app.post('/user-stats',authenticateToken ,async (req, res) => {
    try{
        const user = req.body;
        const [userStats] = await pool.query(`select * from user_stats where username = ?`,[user.username]);
        res.status(201).json({userStats: userStats[0]});
    }
    catch(error){
        console.log(error)
        res.status(500).json(error);
    }


})


app.use((err,req,res,next) => {
    console.error(err.stack)
    res.status(500).send('something went wrong')
})

app.listen(5000, '0.0.0.0', () => {
    console.log('Server is running on port 5000');
});