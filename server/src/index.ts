import express from 'express'
import bodyParser from 'body-parser'
import { listings } from './listings'

const app = express()
const port = 9000

app.use(bodyParser.json())

app.get('/', (_req, res) => res.send('hello world!'))

app.get('/listings', (_req, res) => res.send(listings))

app.post('/delete-listing', (req, res) => {
  const id : string = req.body.id
  const idx = listings.findIndex(x => x.id === id)
  if (idx !== -1) {
    return res.send(listings.splice(idx, 1))
  } else {
    return res.send('failed to delete listing')
  }
})

app.listen(port)

console.log(`[app]: httpL//localhost:${port}`)