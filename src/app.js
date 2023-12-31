const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customer');

const app = express();
mongoose.set('strictQuery', false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;


const customers = [
  {
    "name": "Caleb",
    "industry": "music"
  },
  {
    "name": "John",
    "industry": "networking"
  },
  {
    "name": "Sal",
    "industry": "sport"
  }
];

const customer = new Customer({
  name: 'John',
  industry: 'marketing'
});

app.get('/', (req, res) => {
  res.send("Welcome!");
});

app.get('/api/customers', async (req, res) => {
  try {
    const result = await Customer.find();
  
    res.json({'customer': result});
  } catch(e) {
    res.status(500).json({error: e.message});
  }
});

app.get('/api/customers/:id', async (req, res) => {
  console.log({
    requestParams: req.params,
    requestQuery: req.query
  });
  try {
    const {id: customerId} = req.params;
    console.log(customerId);
    const customer = await Customer.findById(customerId);
    console.log(customer);
    if (!customer) {
      res.status(404).json({error: "user not found"})
    } else {
      res.json({customer});
    }
  } catch(e) {
    res.status(500).json({error: 'Something went wrong'});
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({_id: customerId});
    res.json({updatedCount: result.deletedCount});
  } catch(e) {
    res.status(500).json({error: 'Something went wrong'});
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.replaceOne({ _id: customerId}, req.body);
    console.log(result);
    res.json({updatedCount: result.modifiedCount});
  } catch(e) {
    res.status(500).json({error: 'Something went wrong'});
  }
});

app.post('/api/customers', async (req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body);
  try {
    await customer.save();
    res.status(201).json({customer});
  } catch(e) {
    res.status(400).json({error: e.message});
  }
});

app.post('/', (req, res) => {
  res.send('This is a post request');
})

app.listen(+PORT,'localhost', () => {
  console.log(`app start http://localhost:${PORT}`)
})

const start = async() => {
  try {
    await mongoose.connect(CONNECTION);

    app.listen (PORT, () => {
      console.log("App listenisng on port " + PORT);
    });
  } catch(e) {
    console.log(e.message);
  }
}

start();