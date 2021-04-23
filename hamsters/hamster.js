const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const router = express.Router()

// REST api with express 
// small but functional 

// GET ARRAY, get the whole db(all hamsters)
router.get('/', async (req, res) => {
    try {
        const hamstersREF = db.collection('hamsters')
        const snapshot = await hamstersREF.get()
        if (snapshot.empty) {
            res.status(200).send([])
            return
        }
        let items = []
        snapshot.forEach(doc => {
            const data = doc.data()
            data.id = doc.id
            items.push(data)
        })
        res.send(items)
    } catch (e) {
        res.status(400).send("Error occuring while getting document")
    }
})

//RANDOM, Get a random hamster(id) 
router.get('/random', async (req, res) => {
    try {
        const docSnapshot = await db.collection('hamsters').get();
        if (docSnapshot.size) {
            let random = Math.floor(Math.random() * docSnapshot.size);
            res.send(docSnapshot.docs[random].data())
        }
        else res.status(200).send({});
    } catch (e) {
        res.status(400).send("Error occuring while getting random document")
    }
})

// GET ID, Get a specific hamster with (id)
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const docRef = await db.collection('hamsters').doc(id).get()
        if (!docRef.exists) {
            res.status(404).send('The id provided did not match any hamster in our db')
            return
        }
        const data = docRef.data()
        res.status(200).send(data)
    } catch (e) {
        res.status(400).send("Error occuring while getting document")
    }
})

// POST, post a new document(hamster) in db
router.post('/', async (req, res) => {
    try {
        const object = req.body
        if ( !object || !object.name || !object.age || !object.favFood || !object.imgName ) {
            res.status(400).send("Invaild argruments please check the json body and try again")
            return
        }
        const docRef = await db.collection('hamsters').add(object)
        const message = "Successfully added new hamster with id: " + docRef.id
        res.status(200).send(message)
    } catch (e) {
        res.status(400).send("Error occuring while adding document")
    }
})

// PUT, Change exisiting data in DB
router.put('/:id', async (req, res) => {
    try {
        const object = req.body
        const id = req.params.id
        const docRef = await db.collection('hamsters').doc(id).get()
        if ( !id || !docRef.exists ) {
            res.status(400).send("The id provided did not match any hamster in our db")
            return
        }
        await db.collection('hamsters').doc(id).update(object)
        const message  = "Successfully updated document " + id
        res.status(200).send(message)
    } catch (e) {
        res.status(400).send("Error occuring while updating document")
    }
})



//Delete, Delete a document(hamster) from DB
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const docRef = await db.collection('hamsters').doc(id).get()
        if ( !id || !docRef.exists ) {
            res.status(400).send("Document does not exist")
            return
        }
        await db.collection('hamsters').doc(id).delete()
        res.status(200).send("Successfully deleted document")
    } catch (e) {
        res.status(400).send("Error occuring while deleting document")
    }
})


module.exports = router