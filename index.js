const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

let products = [{
        id: 1,
        name: "SSD Kingston 1TB M.2",
        price: 25,
        image: "./products/ssd-k-1tb.png",
        stock: 25,
        desc: "PCIe 4.0 - NVme - M.2 - 3500MB/s"
    },
    {
        id: 2,
        name: "SSD Kingston 250GB M.2",
        price: 25,
        image: "./products/ssd-k-250gb.png",
        stock: 25,
        desc: "PCIe 4.0 - NVme - M.2 - 3500MB/s"
    },
    {
        id: 3,
        name: "SSD Kingston 500GB M.2",
        price: 25,
        image: "./products/ssd-k-500gb.png",
        stock: 3,
        desc: "PCIe 4.0 - NVme - M.2 - 3500MB/s"
    },
    {
        id: 4,
        name: "SSD Kingston 1TB M.2",
        price: 25,
        image: "./products/ssd-k-1tb.png",
        stock: 2,
        desc: "PCIe 4.0 - NVme - M.2 - 3500MB/s"
    }
]




app.get('/api/products', (req, res) => {
    res.send(products);
});

app.post("/api/pay", (req, res) => {
    const ids = req.body;
    const productsCopy = products.map((p) => ({
        ...p
    }));

    ids.forEach(id => {
        const product = productsCopy.find((p) => p.id === id);
        if (product.stock > 0) {
            product.stock--;

        } else {
            throw "Sin Stock";
        }

    });
    products = productsCopy;
    res.send(products);
});


app.use("/", express.static("frontend"));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});