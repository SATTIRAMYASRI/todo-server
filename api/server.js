const express=require('express');
const cors=require('cors');
const helmet=require('helmet');
const server=express();
const testData=require('../testData.js');
const db=require('./dbConfig');

server.use(cors());
server.use(helmet());
server.use(express.json());

server.get("/",(req,res)=>{
    res.send("Welcome to the Todo app server!!")
});

//get all todos
server.get("/todos",async (req,res)=>{
    try{
        const todosresult=await db('todos');
        console.log(todosresult);
        res.json(todosresult);
    }
    catch(err){
        console.log(err);
    }
    
})

//to get particular todo based on id
server.get("/todos/:id",async (req,res)=>{
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
server.post("/todos",async (req,res)=>{
    const {title,status}=req.body;
    if(!title){
        return res.status(400).json({message:'You must include a todo in your request.'});
    }
    try{
        await db('todos').insert({title:title,status:status});
        res.status(201).json({message:'Todo Successfully Stored!'});
    }
    catch(err){
        console.log(err);
    }
})

//to update a todo
server.put("/todos/:id",async (req,res)=>{
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
server.delete("/todos/:id",async (req,res)=>{
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