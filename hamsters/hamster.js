const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const router = express.Router()

// rest api

// Whole array
router.get('/', async (req, res) => {
    const hamstersREF = db.collection('hamsters')
    const snapshot = await hamstersREF.get()
    if ( snapshot.empty ) {
        res.status(200).send([])
        return
    }
    let items = []
    snapshot.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        items.push( data )
    })
    res.send(items)
})


// ID 
router.get('/:id', async (req, res) => {
    const id = req.params.id
    const docRef = await db.collection('hamsters').doc(id).get()
    
    if( !docRef.exists ) {
        res.status(404).send('Hamster does not exist')
        return
    }
    const data = docRef.data()
    res.status(200).send(data)
})

// POST 
router.post('/', async (req, res) => {
    const object = req.body
    if( !object ) {
        res.sendStatus(400)
        return
    }
   const docRef = await db.collection('hamsters').add(object)
    res.send(docRef.id)
})

// PUT



module.exports = router