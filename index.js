const server=require("./api/server");
const HOST="localhost";
const PORT=8888;


server.listen(PORT,()=>console.log(`server running at ${HOST}:${PORT}`))