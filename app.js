const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();


app.set("view engine", "ejs");      //ejs setup

app.use(bodyParser.urlencoded({ extended: true }));  //bodyParser setup
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-amal:test2000@cluster0.mnxbmek.mongodb.net/todolistDB")

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("item", itemSchema);

const item1 = new Item({
    name: "Welcome to  your to do list!"
});
const item2 = new Item({
    name: "Hit '+' to add a new item "
});
const item3 = new Item({
    name: "<-- Hit this to mark an item as done"
});

const defaultItems = [item1, item2, item3];


const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", listSchema);


let day = date.getDate();   //executes the code from date.js file




app.get("/", async function (req, res) {    //for root site

    const foundItems = await Item.find({});  //to retrieve items from DB
    if (foundItems.length == 0) {
        Item.insertMany(defaultItems);       //To insert data into DB
        res.redirect("/");
    } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems });         // To pass the value of day variable to tha marker 'kindOfDay' in listen.ejs file
    }
});


app.get("/:customListName", async function (req, res) {            //for dynamic website url
    const customListName = _.capitalize(req.params.customListName);

    const foundList = await List.findOne({ name: customListName });

    if (!foundList) {
        //Create new list
        const list = new List({
            name: customListName,
            items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
    } else {
        //Show existing list
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items })
    }
});



app.post("/", async function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;      //list is the name of the button in list.ejs

    const item = new Item({
        name: itemName
    });

    if (listName == "Today") {
        item.save();
        res.redirect("/");
    } else {
        const foundList = await List.findOne({ name: listName });
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
    }
});

app.post("/delete", async function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName == "Today") {
        await Item.findByIdAndRemove(checkedItemId);
        res.redirect("/");
    } else {
        await List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } });
        res.redirect("/" + listName);
    }
});





app.listen(3000, function () {
    console.log("Server started on port 3000");
});
