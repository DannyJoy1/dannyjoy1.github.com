const express = require('express')
const bodyParser = require('body-parser');
const repository = require('./repository');

///////////
const path = require('path');

/////////////

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


// Ruta para la búsqueda
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

// app.post("/api/pay", async (req, res) => {
//   const order = req.body;
//   const ids = order.items.map(p => p.id);
//   const productsCopy = await repository.read();

//   let error = false;
//   ids.forEach((id) => {
//     const product = productsCopy.find((p) => p.id === id);
//     if (product.stock > 0) {
//       product.stock--;
//     } else {
//       error = true;
//     }
//   });

//   if (error) {
//     res.send("Sin stock").statusCode(400);
//   } else {
//     await repository.write(productsCopy);

//     // guardar datos en shipping
//     order.date = new Date().toISOString();
//     order.status = "pendiente";
//     const orders = [order]; // Solo la orden actual, ya que no estás leyendo las órdenes existentes
//     await repository.writeOrders(orders);




//     res.send(productsCopy);
//   }
// });

/********************** */
app.post("/api/pay", async (req, res) => {
  const order = req.body;
  const items = order.items; // Obtener los productos del carrito
  const productsCopy = await repository.read(); // Leer los productos de la hoja de cálculo

  let error = false;

  // Iterar sobre cada producto en el carrito
  for (const item of items) {
    const product = productsCopy.find((p) => p.id === item.id); // Buscar el producto correspondiente en la hoja de cálculo

    if (product && product.stock >= item.quantity) {
      // Verificar si el producto existe y hay suficiente stock
      product.stock -= item.quantity; // Descontar la cantidad del producto en el stock
    } else {
      error = true;
      break; // Si hay algún error, salir del bucle
    }
  }

  if (error) {
    res.status(400).send("Sin stock"); // Enviar respuesta de error si hay productos sin stock suficiente
  } else {
    await repository.write(productsCopy); // Guardar los cambios en la hoja de cálculo

    // guardar datos en shipping
    order.date = new Date().toISOString();
    order.status = "pendiente";
    const orders = [order]; // Solo la orden actual, ya que no estás leyendo las órdenes existentes
    await repository.writeOrders(orders);

    res.send(productsCopy); // Enviar los productos actualizados como respuesta
  }
});

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});