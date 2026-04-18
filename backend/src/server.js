const app =require('./app');
require("./mqtt/subscriber");

const PORT =5000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});