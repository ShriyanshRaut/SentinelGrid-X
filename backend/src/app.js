const express =(require('express'));

const app= express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("SentineGrid Backend Running");
});

module.exports=app;

