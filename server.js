//importing modules
const express = require("express");
const bodyParser = require("body-parser");
const db = require("mongoose");
const app = express();

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());

//dabtabase link
db.connect("mongodb+srv://noamikogofer:bugnheu110890@cluster0.2oexlm3.mongodb.net/svshop").then(console.log("database online"));

//schemas
const userSchema = new db.Schema({
  name: String,
  email: String,
  password: String,
});
const productSchema = new db.Schema({
  id: Number,
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
});
const orderSchema = new db.Schema({
  name: String,
  products: [Number],
});

//models
const userModel = db.model("users", userSchema);
const productModel = db.model("products", productSchema);
const orderModel = db.model("orders", orderSchema);
let currentUserEmail = {};
app.post("/signIn", async (req, res) => {
  const user = await userModel.find({
    email: req.body.email,
    password: req.body.password,
  });
  if (user.length > 0) {
    currentUserEmail = req.body.email;
    res.json({ message: "ok" })
  }else{res.json({message: "no user"})}
});
app.get("/signUp", (req, res) => {
  res.sendFile(__dirname + "/public/signUp.html");
});
app.post("/signUp", async (req, res) => {
  let temp = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const emailCheck = await userModel.find({ email: req.body.email });
  if (emailCheck[0]) {
    res.json({ message: "email exist" });
  } else {
    userModel.insertMany(temp);
    res.json({ message: "ok" });
  }
})
app.get("/shop", (req, res) => {
  res.sendFile(__dirname + "/public/shop.html");
})
app.get("/removeUsers",(req,res)=>{
  userModel.deleteMany({}).then(res.send("users deleted"));
})
app.get("/removeOrders",(req,res)=>{
  orderModel.deleteMany({}).then(res.send("orders deleted"));
})
app.get("/loadProducts",async(req,res)=>{
  let products = await productModel.find({});
  let username = await userModel.find({email:[currentUserEmail]});
  let data = [products,username[0].name]
  res.json(data);
})
app.post("/submitOrder", async(req,res)=>{
  let temp={
    name:req.body.currentUserName,
    products:req.body.idArray
  }
  await orderModel.insertMany(temp)
  res.json({message:"ok"});
})
function adminQuery (req,res,next){
  if(req.query.admin == "true"){next()}
  else{res.status(400).send("denied")}
}
app.use(adminQuery)
app.get("/all", async(req,res)=>{
  let allOrders = await orderModel.find({})
  res.json(allOrders)
})

app.listen("3000", () => {
  console.log("server online");
});