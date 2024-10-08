const express = require('express')
const cors = require('cors')
const publisher = require('./publisher')
const app = express()
const port = 3000

app.use(express.json());

app.use(cors())

const subscribers = new Map()

app.post('/addSubscriber', function(req, res) {
    const pushSubscription = req.body
    console.log(pushSubscription.keys.auth);
    const id = pushSubscription.keys.auth
    subscribers.set(id, pushSubscription)
    console.log(`New subscriber added. Total Subscribers: ${subscribers.size}`)
    res.send("Ok!")
})

app.post('/removeSubscriber', function(req, res) {
    const id = req.body.id;
    console.log({id});
    subscribers.delete(id)
    console.log(`Subscriber unsubscribed. Total Subscribers: ${subscribers.size}`)
    res.send("Ok!")
})

setInterval(() => publisher.notify(subscribers), 5000)

app.listen(port, () => console.log(`Server App is running at http://localhost:${port}`))