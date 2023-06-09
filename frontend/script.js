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
    document.getElementById("checkout").innerHTML = `Pagar $${total}`
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
     await fecthProducts();
     document.getElementById("checkout").innerHTML = `Pagar $${total}`
   
  //  window.alert(products.join(", \n"));
    

}

function displayProducts() {
    let productsHTML = ''
    productList.forEach(p => {
                
                let buttonHTML = `<a onClick="add(${p.id}, ${p.price})" class="card-button">

                <i class="fas fa-cart-plus"></i></a>
                 </a>`
        if(p.stock <= 0){
             buttonHTML = `<a onClick="add(${p.id}, ${p.price})" class="disabled">
             Sin Stock</a>
             </a>`
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
                <p class="product-price">$${p.price}</p></span>
                ${buttonHTML}
            </div>

        </div>`

    });
    document.getElementById('featured-products').innerHTML = productsHTML;
}

async function fecthProducts(){
 productList = await (await fetch("/api/products")).json();
 displayProducts();

}

window.onload = async () => {

   await fecthProducts();
}