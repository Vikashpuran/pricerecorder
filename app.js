const express = require('express');
const app = express();
const Item = require("./models/items.js");
const mongoose = require('mongoose')
const mongodb = "mongodb://localhost:27017";

mongoose.connect(mongodb).then(() => console.log("database connected")).
    catch((err) => console.log(err));
app.set('view engine', 'ejs')
app.listen(3000);


app.use(express.urlencoded({ extend: true }));

app.get('/', (req, res) => {
    res.redirect('/get-items')
})

app.get('/get-items', (req, res) => {
    Item.find().then(result => {

        res.render('index', { items: result })
    }).catch(err => console.log(err))
})

app.get('/add-item', (req, res) => {
    res.render("add-item");
})


app.post('/items',(req,res) => {
    console.log(req.body)
    const item = Item(req.body);
    item.save().then(() => {
        res.redirect('/get-items')
    }).catch(err => console.log(err))
})

app.get('/items/:id',(req,res) => {
    
    const id = req.params.id;
    Item.findById(id).then(result => {
        console.log("result",result)
        res.render('item-detail', {item: result})
    })
})

app.delete('/items/:id',(req,res) => {
    
    const id = req.params.id;
    Item.findByIdAndDelete(id).then(result => {
        res.json({redirect:'/'})
    })
})

app.put('/items/:id',(req,res) => {
    
    const id = req.params.id;
    Item.findByIdAndUpdate(id,req.body).then(result => {
        
        res.json({msg:'Updated Successfully'});
    })
})

app.use((req, res) => {
    res.render('error');
})
