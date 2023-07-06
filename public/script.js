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


let productList = [];
let carrito = [];
let total = 0;
let order = {
  items: []
};

function saveDataToLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('total', total.toString());
  localStorage.setItem('order', JSON.stringify(order));
}

function loadDataFromLocalStorage() {
  const carritoData = localStorage.getItem('carrito');
  if (carritoData) {
    carrito = JSON.parse(carritoData);
  }
  const totalData = localStorage.getItem('total');
  if (totalData) {
    total = parseFloat(totalData);
  }
  const orderData = localStorage.getItem('order');
  if (orderData) {
    order = JSON.parse(orderData);
  }
}



function add(productId, price) {
  const product = productList.find(p => p.id === productId);
  const existingItem = order.items.find(item => item.id === productId);
  product.stock--;
  if (existingItem) {
    existingItem.quantity++;
  } else {

    order.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: 1
    });
    carrito.push(productId);
  }

  total = total + price;
  document.getElementById("checkout").innerHTML = ` $${total}`;
  displayProducts();
  saveDataToLocalStorage();
}


function removeItem(productId, price) {
  const existingItem = order.items.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity--;

    if (existingItem.quantity === 0) {
      const index = carrito.indexOf(productId);
      if (index !== -1) {
        carrito.splice(index, 1);
      }
      order.items = order.items.filter(item => item.id !== productId);
    }
  }

  total -= price;
  document.getElementById("order-total").innerHTML = `$${total.toFixed(2)}`;
  saveDataToLocalStorage();
}





async function pay() {
  try {

    order.shipping = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      tel: document.getElementById('tel').value,
      province: document.getElementById('province').value,
      city: document.getElementById('city').value,
      address1: document.getElementById('address1').value,
      address2: document.getElementById('address2').value,
      postal: document.getElementById('postal').value,

    }

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const telInput = document.getElementById('tel');

    function isFormFilled() {
      return (
        nameInput.value !== '' &&
        emailInput.value !== '' &&
        telInput.value !== ''

      );

    }


    if (order.items.length === 0 || !isFormFilled()) {
      alert('Por favor complete los datos de envío');

      document.getElementById('checkout').disabled = true;
      return


    }

    document.getElementById('name').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('tel').disabled = true;
    document.getElementById('province').disabled = true;
    document.getElementById('city').disabled = true;
    document.getElementById('address1').disabled = true;
    document.getElementById('address2').disabled = true;
    document.getElementById('postal').disabled = true;

    const productList = await (await fetch("/api/pay", {
      method: "post",
      body: JSON.stringify(order),
      headers: {
        "Content-Type": "application/json"
      }
    })).json();

  } catch {
    window.alert("Sin Stock");
  }
  console.log(order.shipping);



  carrito = [];
  total = 0;
  order = {
    items: []
  };

  await fetchProducts();

  saveDataToLocalStorage();
  localStorage.removeItem('carrito');
  localStorage.removeItem('total');
  localStorage.removeItem('order');

  const mensajeCompra = document.getElementById('mensaje');
  mensajeCompra.classList.add('visible');

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
            <a href="/sproduct.html" class="product-cart-link">
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


// const searchForm = document.getElementById('searchForm');
// const searchResultsContainer = document.getElementById('searchResults');

// searchForm.addEventListener('submit', async (event) => {
//   event.preventDefault();

//   const searchTerm = document.getElementById('searchInput').value;


//   try {
//     const response = await fetch(`/api/search?term=${encodeURIComponent(searchTerm)}`);
//     const searchResults = await response.json();

//     // Limpiar los resultados anteriores
//     searchResultsContainer.innerHTML = '';

//     // Mostrar los resultados de búsqueda
//     if (searchResults.length > 0) {

//       searchResults.forEach((product) => {
//         const productElement = document.createElement('div');
//         let buttonHTML = `<a onClick="add(${product.id}, ${product.price})" class="card-button">
//           <i class="fas fa-cart-plus"></i></a>`;

//         if (product.stock <= 0) {
//           buttonHTML = `<a onClick="add(${product.id}, ${product.price})" class="disabled">
//             Sin Stock</a>`;
//         }
//         productElement.innerHTML =
//           `
//         <div class="card">
//         <a href="/sproduct.html" class="product-cart-link">
//             <img class="card-img" src="${product.image}" alt="${product.name}">
//             <div class="card-info">
//                 <p class="text-title">${product.name}</p>
//                 <p class="text-body">${product.desc}</p>
//             </div>
//         </a>
//         <div class="card-footer">
//             <p class="product-price">$${product.price}</p>
//             ${buttonHTML}
//         </div>
//     </div>`;
//         searchResultsContainer.appendChild(productElement);
//       });
//     } else {
//       searchResultsContainer.innerHTML = '<p style="color:white"> :( No se encontraron resultados.</p>';
//     }
//   } catch (error) {
//     console.error('Error en la solicitud de búsqueda:', error);
//   }
// });


async function fetchProducts() {
  productList = await (await fetch("/api/products")).json();
  displayProducts();
  saveDataToLocalStorage();
}

async function goToCart() {
  const button = document.getElementById('cart-btn');

  button.addEventListener('click', () => {
    saveDataToLocalStorage();
    window.location.href = '/cart.html';
  });
}

window.onload = async () => {
  loadDataFromLocalStorage();
  await fetchProducts();

  const currentPage = window.location.pathname;

  if (currentPage === '/cart.html') {
    document.getElementById("order-total").innerHTML = ` $${total}`;
    // document.getElementById("order-subtotal").innerHTML = ` $${total}`;

    let productsHTML = '';
    order.items.forEach(p => {
      productsHTML += `
            <tr>
            <td><a href="" onClick="removeItem(${p.id}, ${p.price})"><i class="far fa-times-circle"></i></a></td>
            <td><img src="${p.image}" alt=${p.name}></td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td>${p.quantity}</td>
                <td>${p.price * p.quantity}</td>
            </tr>`;
    });



    document.getElementById('order-table').innerHTML = productsHTML;



    console.log(carrito);

    console.log(order.items);


  }
  if (currentPage === '/' || '/index.html') {

    const searchForm = document.getElementById('searchForm');
    const searchResultsContainer = document.getElementById('searchResults');

    searchForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const searchTerm = document.getElementById('searchInput').value;


      try {
        const response = await fetch(`/api/search?term=${encodeURIComponent(searchTerm)}`);
        const searchResults = await response.json();

        // Limpiar los resultados anteriores
        searchResultsContainer.innerHTML = '';

        // Mostrar los resultados de búsqueda
        if (searchResults.length > 0) {

          searchResults.forEach((product) => {
            const productElement = document.createElement('div');
            let buttonHTML = `<a onClick="add(${product.id}, ${product.price})" class="card-button">
              <i class="fas fa-cart-plus"></i></a>`;

            if (product.stock <= 0) {
              buttonHTML = `<a onClick="add(${product.id}, ${product.price})" class="disabled">
                Sin Stock</a>`;
            }
            productElement.innerHTML =
              `
            <div class="card">
            <a href="/sproduct.html" class="product-cart-link">
                <img class="card-img" src="${product.image}" alt="${product.name}">
                <div class="card-info">
                    <p class="text-title">${product.name}</p>
                    <p class="text-body">${product.desc}</p>
                </div>
            </a>
            <div class="card-footer">
                <p class="product-price">$${product.price}</p>
                ${buttonHTML}
            </div>
        </div>`;
            searchResultsContainer.appendChild(productElement);
          });
        } else {
          searchResultsContainer.innerHTML = '<p style="color:white"> :( No se encontraron resultados.</p>';
        }
      } catch (error) {
        console.error('Error en la solicitud de búsqueda:', error);
      }
    });
  }
}