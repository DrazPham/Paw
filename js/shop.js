const headers = new Headers({
    "Content-Type": "application/json",
    "x-api-key": "live_vrQtGb5gCjN1PgsyykkOXB9gMbFEwg8OEuSugRDKr9Jb5n1M6BnPKDPkeCH2eSQR"
});

var requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
};

// Fetch cat images and assign them dynamically
fetch("https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=8", requestOptions)
    .then(response => response.json())
    .then(data => {
        data.forEach((catImage, index) => {
            const imageElement = document.getElementById(`pic${index + 1}`);
            if (imageElement) {
                imageElement.src = catImage.url;
            }
        });
    })
    .catch(error => console.log('error', error));



// Cart and product functionality
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    if (products.length > 0) {
        products.forEach((product, index) => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img id="pic${index + 1}" alt="Image ${index + 1}" class="feature-box-image">
                <h2>${product.name}</h2>
                <p class="random-number">Number here</p>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
        generateAndDisplayRandomNumbers();
    }
}


listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;   
    if(positionClick.classList.contains('addCart')){
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    let product = products.find((p) => p.id == product_id); // Find the product by ID
    
    if(cart.length <= 0){
        cart = [{ product_id: product_id, image: product.image, quantity: 1 }];
    } else if(positionThisProductInCart < 0){
        cart.push({ product_id: product_id, image: product.image, quantity: 1 });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
}




listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});



// Initialize the app
const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
}
initApp();


// Function to generate and display random numbers
function generateRandomNumbers(n) {
    const randomNumbers = [];
    for (let i = 0; i < n; i++) {
        const randomNumber = Math.floor(Math.random() * 900) + 100;
        randomNumbers.push(randomNumber);
    }
    return randomNumbers;
}

function generateAndDisplayRandomNumbers() {
    const numberElements = document.querySelectorAll('.random-number');
    const randomNumbers = generateRandomNumbers(numberElements.length);
    numberElements.forEach((element, index) => {
        element.textContent = `${randomNumbers[index]}$`;
    });
}



// Event listener for the "Remove All" button
document.querySelector('.removeAll').addEventListener('click', () => {
    clearCart();
});



// Event listener for the "Check Out" button
document.querySelector('.checkOut').addEventListener('click', () => {
    showOrderCompletedNotification();
    clearCart();  // Optionally, clear the cart after checkout
});

// Function to show "Order Completed!" notification
const showOrderCompletedNotification = () => {
    const notification = document.querySelector('.notification');
    notification.style.display = 'block';  // Show the notification
    setTimeout(() => {
        notification.style.display = 'none';  // Hide the notification after 3 seconds
    }, 3000);  // Hide notification after 3 seconds
}

// Function to clear the cart and update the UI
const clearCart = () => {
    cart = [];  // Empty the cart array
    addCartToHTML();  // Update the cart display
    addCartToMemory();  // Update the local storage
}

// Function to add cart to local storage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update the cart display in HTML and calculate total price
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';  // Clear the cart HTML
    let totalQuantity = 0;  // Initialize total quantity counter
    let totalPrice = 0;  // Initialize total price counter

    if (cart.length > 0) {
        cart.forEach((item) => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];

            // Calculate total price of this item (price * quantity)
            totalPrice += info.price * item.quantity;

            newItem.innerHTML = `
                <div class="name">${info.name}</div>  <!-- Product name -->
                <div class="totalPrice">$${info.price * item.quantity}</div>  <!-- Total price for this item -->
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>`;
                
            // Append the new item to the cart HTML
            listCartHTML.appendChild(newItem);
        });
    }

    // Update the cart icon's total quantity display
    iconCartSpan.innerText = totalQuantity;

    // Update the total price in the .totalPriceCart div
    document.querySelector('.totalPriceCart').innerText = `Total Price: $${totalPrice.toFixed(2)}`;
};

// Event listener to handle cart item quantity changes (plus/minus buttons)
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        if (type === 'plus') {
            cart[positionItemInCart].quantity += 1;
        } else {
            let changeQuantity = cart[positionItemInCart].quantity - 1;
            if (changeQuantity > 0) {
                cart[positionItemInCart].quantity = changeQuantity;
            } else {
                cart.splice(positionItemInCart, 1);
            }
        }
    }
    addCartToHTML();
    addCartToMemory();
}

