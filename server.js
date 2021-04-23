const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const hamster = require('./hamsters/hamster.js')


const PORT = 1339
const staticFolder = path.join(__dirname, 'static')




// Middleware
// Logger - Skriv ut info om inkommande request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} `, req.params);
    next()
})

app.use( express.json() )
app.use( cors() )
app.use( express.static(staticFolder) )



//rest api for tools

app.use('/hamsters', hamster)





// Starta servern
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})