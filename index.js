const express = require('express')
const bodyParser = require('body-parser');
const repository = require('./repository');

const path = require('path');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());



app.get('/api/search', async (req, res) => {
  const searchTerm = req.query.term; // Obtener el término de búsqueda del parámetro de consulta

  // Realiza la lógica de búsqueda aquí utilizando el término de búsqueda
  const searchResults = await repository.search(searchTerm);

  // Devuelve los resultados de búsqueda como respuesta
  res.json(searchResults);
});

app.get('/api/products', async (req, res) => {
  res.send(await repository.read());
});


app.get('/api/productdetails/', async (req, res) => {
  res.send(await repository.readDetails());
})




app.post("/api/pay", async (req, res) => {
  const order = req.body;
  const items = order.items;
  const productsCopy = await repository.read();
  let error = false;


  for (const item of items) {
    const product = productsCopy.find((p) => p.id === item.id);

    if (product && product.stock >= item.quantity) {

      product.stock -= item.quantity;
    } else {
      error = true;
      break;
    }
  }

  if (error) {
    res.status(400).send("Sin stock");
  } else {
    await repository.write(productsCopy);

    order.date = new Date().toISOString();
    order.status = "pendiente";
    const orders = [order];
    await repository.writeOrders(orders);

    res.send(productsCopy);
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html', 'style.css'));
});

//app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});