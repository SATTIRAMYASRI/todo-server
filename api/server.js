const authenticate=require("./middleware");
const express=require('express');
const cors=require('cors');
const helmet=require('helmet');
const server=express();
const testData=require('../testData.js');
const db=require('./dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

server.use(cors());
server.use(helmet());
server.use(express.json());

server.get("/",(req,res)=>{
    res.send("Welcome to the Todo app server!!")
});


const JWT_SECRET = 'ramya_secretkey';

// Signup route
server.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db('users').insert({ email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user.' });
  }
});

// Login route
server.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await db('users').where({ email }).first();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful!', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in.' });
  }
});


// Get all todos
server.get("/todos", authenticate, async (req, res) => {
    const {userId}=req;
    console.log(`testing ${userId}`);
    try {
        const todosResult = await db('todos').where({ userId: userId }); // Fetch todos for the authenticated user
        console.log(`testing ${todosResult}`);
        res.json(todosResult);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Error retrieving todos.', error: err.message });
    }
});


//to get particular todo based on id
server.get("/todos/:id",authenticate,async (req,res)=>{
    const {id}=req.params;
    try{
        const todoresult=await db('todos').where({id});
        todoresult.length===0?
        res.status(404).json({message:'Todo not found'})
        :
        res.status(200).json(todoresult);
    }
    catch(err){
        console.log(err);
    }
    
})

//to add a todo
server.post("/todos",authenticate,async (req,res)=>{
    const {title,status}=req.body;
    if(!title){
        return res.status(400).json({message:'You must include a todo in your request.'});
    }
    try{
        await db('todos').insert({title:title,status:status,userId: req.userId});
        res.status(201).json({message:'Todo Successfully Stored!'});
    }
    catch(err){
        console.log(err);
    }
})

//to update a todo
server.put("/todos/:id",authenticate,async (req,res)=>{
   const {id}=req.params;
   const {title,status}=req.body;
   if(!title){
    return res.status(400).json({message:'You must include a todo in your request.'});
}
   try{
    await db('todos').where({id}).update({title:title,status:status})
    res.status(200).json({mesage:'Update Successful!!'})
   }
   catch(err){
    console.log(err);
   }
})

//to delete a todo
server.delete("/todos/:id",authenticate,async (req,res)=>{
    const {id}=req.params;
    
    try{
     await db('todos').where({id}).del()
     res.status(200).json({mesage:'Delete Successful!!'})
    }
    catch(err){
     console.log(err);
    }
})

module.exports=server;