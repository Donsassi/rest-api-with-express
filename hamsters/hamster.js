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

//Random


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
    if( !isHamsterObject(object) ) {
        res.status(400).send("obj should include 'name, age, favFood, loves, imgName, wins, defeats, games'")
        return
    }
   const docRef = await db.collection('hamsters').add(object)
    res.send(docRef.id)
})

// PUT
router.put('/:id', async (req, res) => { 
    const object = req.body   
    const id = req.params.id
    
    if ( !object || !id ) {
        res.sendStatus(400)
        return
    }

    const docRef = db.collection('hamsters').doc(id)
    await docRef.set(object, { merge: true })
    res.sendStatus(200)

})


function isHamsterObject(maybeObject) {
    if( !maybeObject )
         return false
    else if (  !maybeObject.name || !maybeObject.age | !maybeObject.favFood || !maybeObject.loves || !maybeObject.imgName || !maybeObject.wins || !maybeObject.games )
         return false

    return true
}

//Delete
router.delete('/:id', async (req, res) => {
    const id = req.params.id
    const docRef = await db.collection('hamsters').doc(id).get()

    if( !docRef.exists ) {
        res.sendStatus(400)
        return
    }
       await db.collection('hamsters').doc(id).delete()
       res.sendStatus(200)
})

module.exports = router