/*
const bar = document.getElementById('bar-icon');
const close = document.getElementById('close');

const nav = document.getElementById('nav-bar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

let productList =[];
let carrito = [];
let total = 0;

function add(productId, price) {

    const product = productList.find(p => p.id === productId);
    product.stock--;




    console.log(productId, price);
    carrito.push(productId);
    total = total + price;
    document.getElementById("checkout").innerHTML = ` $${total}`
    displayProducts();

}


//boton pagar
async function pay() {

    try{
        const productList = await (await fetch("/api/pay", {
            method: "post",
            body: JSON.stringify(carrito),
            headers: {
                "Content-Type": "application/json"
            }
        })).json();
    }
    catch{
        window.alert("Sin Stock");
    }

     carrito = [];
     total = 0;
     await fetchProducts();
     document.getElementById("checkout").innerHTML = ` $${total}`
   
  //  window.alert(products.join(", \n"));
}


function displayProducts() {
    const productsContainer = document.getElementById('featured-products');
    if (productsContainer) {
        let productsHTML = '';
        productList.forEach(p => {
            let buttonHTML = `<a onClick="add(${p.id}, ${p.price})" class="card-button">
                <i class="fas fa-cart-plus"></i></a>`;

            if (p.stock <= 0) {
                buttonHTML = `<a onClick="add(${p.id}, ${p.price})" class="disabled">
                    Sin Stock</a>`;
            }

            productsHTML +=
                `<div class="card">
                    <a href="./sproduct.html" class="product-cart-link">
                        <img class="card-img" src="${p.image}" alt="">
                        <div class="card-info">
                            <p class="text-title">${p.name}</p>
                            <p class="text-body">${p.desc}</p>
                        </div>
                    </a>
                    <div class="card-footer">
                        <p class="product-price">$${p.price}</p>
                        ${buttonHTML}
                    </div>
                </div>`;
        });

        productsContainer.innerHTML = productsHTML;
    }
}

async function goToCart(){
    const button = document.getElementById('cart-btn');

button.addEventListener('click', () => {
  window.location.href = '/cart.html';
});

}



async function fetchProducts(){
 productList = await (await fetch("/api/products")).json();
 displayProducts();

}



window.onload = async () => {
    await fetchProducts();
    // Verificar la página actual y realizar acciones específicas
    const currentPage = window.location.pathname;
    if (currentPage === '/cart.html') {
        console.log("carrito")
        // Código para la página del carrito
     document.getElementById("order-total").innerHTML = ` $${total}`;

        
    } else if (currentPage === '/other-page.html') {
        // Código para otra página
        // ...
    } else {
        // Código para otras páginas
        // ...
    }
};
*/

// ...

let productList = [];
let carrito = [];
let total = 0;

// Función para guardar los datos en el almacenamiento local
function saveDataToLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('total', total.toString());
}

// Función para cargar los datos desde el almacenamiento local
function loadDataFromLocalStorage() {
  const carritoData = localStorage.getItem('carrito');
  if (carritoData) {
    carrito = JSON.parse(carritoData);
  }
  const totalData = localStorage.getItem('total');
  if (totalData) {
    total = parseFloat(totalData);
  }
}

function add(productId, price) {
    const product = productList.find(p => p.id === productId);
    product.stock--;

    console.log(productId, price);
    carrito.push(productId);
    total = total + price;
    document.getElementById("checkout").innerHTML = ` $${total}`
    displayProducts();

  saveDataToLocalStorage();
}

async function pay() {
  
    try{
        const productList = await (await fetch("/api/pay", {
            method: "post",
            body: JSON.stringify(carrito),
            headers: {
                "Content-Type": "application/json"
            }
        })).json();
    }
    catch{
        window.alert("Sin Stock");
    }

     carrito = [];
     total = 0;
     await fetchProducts();
     document.getElementById("checkout").innerHTML = ` $${total}`
   
  //  window.alert(products.join(", \n"));
  saveDataToLocalStorage();
}

function displayProducts() {
    const productsContainer = document.getElementById('featured-products');
    if (productsContainer) {
        let productsHTML = '';
        productList.forEach(p => {
            let buttonHTML = `<a onClick="add(${p.id}, ${p.price})" class="card-button">
                <i class="fas fa-cart-plus"></i></a>`;

            if (p.stock <= 0) {
                buttonHTML = `<a onClick="add(${p.id}, ${p.price})" class="disabled">
                    Sin Stock</a>`;
            }

            productsHTML +=
                `<div class="card">
                    <a href="./sproduct.html" class="product-cart-link">
                        <img class="card-img" src="${p.image}" alt="">
                        <div class="card-info">
                            <p class="text-title">${p.name}</p>
                            <p class="text-body">${p.desc}</p>
                        </div>
                    </a>
                    <div class="card-footer">
                        <p class="product-price">$${p.price}</p>
                        ${buttonHTML}
                    </div>
                </div>`;
        });

        productsContainer.innerHTML = productsHTML;
    }

  saveDataToLocalStorage();
}

async function fetchProducts() {
    productList = await (await fetch("/api/products")).json();
    displayProducts();

  saveDataToLocalStorage();
}

async function goToCart(){
    const button = document.getElementById('cart-btn');

button.addEventListener('click', () => {
  window.location.href = '/cart.html';
});

}

window.onload = async () => {
  loadDataFromLocalStorage();

  await fetchProducts();

  // Verificar la página actual y realizar acciones específicas
  const currentPage = window.location.pathname;
  if (currentPage === '/cart.html') {
    console.log("carrito");
    // Código para la página del carrito
    document.getElementById("order-total").innerHTML = ` $${total}`;


    let productsHTML = '';
        productList.forEach(p => {
            let buttonHTML = `<a onClick="add(${p.id}, ${p.price})" class="card-button">
                <i class="fas fa-cart-plus"></i></a>`;

            if (p.stock <= 0) {
                buttonHTML = `<a onClick="add(${p.id}, ${p.price})" class="disabled">
                    Sin Stock</a>`;
            }

            productsHTML +=
                `<div class="card">
                    <a href="./sproduct.html" class="product-cart-link">
                        <img class="card-img" src="${p.image}" alt="">
                        <div class="card-info">
                            <p class="text-title">${p.name}</p>
                            <p class="text-body">${p.desc}</p>
                        </div>
                    </a>
                    <div class="card-footer">
                        <p class="product-price">$${p.price}</p>
                        ${buttonHTML}
                    </div>
                </div>`;
        });

        productsContainer.innerHTML = productsHTML;


  } else if (currentPage === '/other-page.html') {
    // Código para otra página
    // ...
  } else {
    // Código para otras páginas
    // ...
  }
};
