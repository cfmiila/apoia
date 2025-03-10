import express from 'express'


const app = express()

const port = 3100

const users= []



app.get('/usuarios', (req, res) => {

  res.send('Hello World!')

})

app.post ('/usuarios', (req, res)=>{
  console.log(re)
  res.send('ok post')
})

app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)

})


