const express = require('express');
const app = express()
const port = 5000
const cors = require("cors");
const path = require("path");

const stripe = require("stripe")("sk_test_51N94gySA5ZcPgQCJIALDFZgNRFghGfdgDuxzbU9R0KGZEyDicomtMjmxGEiE7b9A8B9LvxRlQ3C4eKqHu7IzLoIN00GIPkZYYa")

const mongoDB = require("./db")
mongoDB();



app.use(express.static(path.join(__dirname, "./frontend/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./frontend/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json())
app.use(cors())

app.use('/api', require("./Routes/CreateUser"))
app.use('/api', require("./Routes/DisplayData"))
app.use('/api', require("./Routes/OrderData"))

app.post("/api/create-checkout-session", async(req,res)=>{
  const {products} = req.body;
  //  console.log(products)
  const lineitems = products.map((product)=>({
    price_data:{
      currency:"inr",
      product_data:{
        name:product.name
      },
      unit_amount:product.price * 100,
    },
    quantity:product.qty
  }))
  const session = await stripe.checkout.sessions.create({
    payment_method_types:["card"],
    line_items:lineitems,
    mode: "payment",
    success_url:"/success",
    cancel_url:"/cancel"
  })

  res.json({id:session.id})

})


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
