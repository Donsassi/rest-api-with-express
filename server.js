const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const hamster = require('./hamsters/hamster.js')

const PORT = process.env.PORT || 1337
const staticFolder = path.join(__dirname, 'static');
const imgFolder = path.join(__dirname, 'img');


// Middleware
// Logger - Skriv ut info om inkommande request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} `, req.params);
    next()
})

app.use( express.json() )
app.use( cors() )

//Static folders
app.use(express.static(staticFolder));
app.use("/img", express.static(imgFolder));

//rest api for tools

app.use('/hamsters', hamster)





// Starta servern
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})