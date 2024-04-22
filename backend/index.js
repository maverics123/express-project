const express = require("express");
const fileUpload = require('express-fileupload');
const app = express();
const cors = require("cors"); // Import the cors middleware

require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(express.urlencoded({extended:true}));
app.use(cors())

require("./config/database").connect();

const user = require("./routes/User.js")



app.use("/api/v1/", user);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log("Server is started");
})
