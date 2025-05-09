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

app.post('/user-info',authenticateToken ,async (req, res) => {
    try{
        const user = req.body;
        const [userInventory] = await pool.query(`select user_inventory.username, user_inventory.item_name, user_inventory.quantity, crops.price, crops.season, crops.crop_name 
                                            from user_inventory 
                                            join crops on user_inventory.item_name = crops.seed_name
                                            where user_inventory.username = ?;`,[user.username]);
        const [userStat] = await pool.query(`select * from user_stats where username = ?`,[user.username]);
        
        const userInfo =  {userInventory, userStat: userStat[0]}
        res.status(201).json(userInfo);
    }
    catch(error){
        console.log(error)
        res.status(500).json({error});
    }
})


app.post('/user-farms',authenticateToken ,async (req, res) => {
    try{
        const user = req.body;

        const [userFarmInfo] =await pool.query(`select u.username, u.password, uf.plot_no, uf.crop_name, uf.cultivation_date, uf.last_watered, uf.status, uf.yield_collected, c.price, c.season, c.growth_time_weeks, c.crop_url, c.field_url, c.seed_name,
                                                    c.growth_time_weeks * 7 as total_growth_days,
                                                    timestampdiff(hour, uf.cultivation_date, now()) as game_days_passed,
                                                    greatest(0, (c.growth_time_weeks * 7) - timestampdiff(hour, uf.cultivation_date, now())) as game_days_remaining,
                                                    timestampdiff(hour, uf.last_watered, now()) as game_days_since_watering
                                                from users u join user_farms uf on u.username = uf.username left join  crops c on uf.crop_name = c.crop_name
                                                where  u.username = ?
                                                order by  uf.plot_no asc;`,[user.username]);
        
        res.status(201).json(userFarmInfo);
    }
    catch(error){
        console.log(error)
        res.status(500).json({error});
    }
})

app.post('/cultivate', authenticateToken ,async (req, res)=>{
    try{
        const {plot, user} = req.body;

        await pool.query('update user_farms set crop_name = ? , cultivation_date = now(), last_watered = now(), status = "growing", yield_collected = 0 where username = ? and plot_no = ?;',[plot.crop_name,user.username, plot.plot_no])
        
        await pool.query('call reduce_user_inventory(?, ?);',[user.username, plot.item_name]);

        res.status(201).json({messege: 'cultivation successful'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({messege: 'cultivation unsuccessful'});
    }
})

app.post('/water-plot', authenticateToken ,async (req, res)=>{
    try{
        const {plot_no, user} = req.body;
        await pool.query('call water_crop(?, ?);',[user.username, plot_no]);
        res.status(201).json({messege: 'water successfuul'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({messege: 'water unsuccessful'});
    }
})


app.post('/shop',authenticateToken ,async (req, res)=>{
    try{
        const [seedShop] = await pool.query('select * from seeds');
        res.status(201).json(seedShop);
    }
    catch(error){
        console.log(error)
        res.status(500).json({error})
    }
})

app.post('/purchase',authenticateToken ,async (req, res)=>{
    try{
        const {cart, user, totalCost} = req.body;
        cart.forEach( async (item) => {
           await pool.query(`insert into user_inventory (username, item_name, quantity)
                            values (?, ?, ?)
                            on duplicate key update quantity = quantity + ?;
                            `,[user.username, item.name, item.quantity, item.quantity]) 
        });
        await pool.query(`update user_stats set money = money - ? where username = ?`,[totalCost, user.username]);
        res.status(201).json({messege: 'purchase successful'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({messege: 'purchase unsuccessful'})
    }
})

app.post('/purchase-plot',authenticateToken ,async (req, res)=>{
    try{
        const {userInfo} = req.body;
        if(userInfo.userStat.money < 5000000 && userInfo.userStat.no_of_plots >= 16){
            return res.status(500).json({messege: "pruchase unsuccessful"});
        }
        await pool.query('update user_stats set no_of_plots = ?, money = money - 5000000 where username = ?',[userInfo.userStat.no_of_plots +1, userInfo.userStat.username]);

        await pool.query('insert into user_farms values (?,?,null,null,null,"empty",1,0)',[userInfo.userStat.username, userInfo.userStat.no_of_plots +1]);

        res.status(201).json({messege: "purchase successful"});
    }
    catch(error){
        console.log(error)
        res.status(500).json({messege: "purchase unsuccessfull"});
    }
})

app.use((err,req,res,next) => {
    console.error(err.stack)
    res.status(500).send('something went wrong')
})

app.listen(5000, '0.0.0.0', () => {
    console.log('Server is running on port 5000');
});