let socket = io();
let chatInput = document.getElementById('chatInput');
let chatLog = document.getElementById('chatLog');
let productForm = document.getElementById('productForm');
let productLog = document.getElementById('productLog');

/*ALERT DE IDENTIFICACIÓN*/
Swal.fire({
    title: "Ingrese su nombre",
    input: 'text',
    allowOutsideClick: false,
    inputValidator: (value) => {
        return !value && '¡Debe ingresar su nombre!';
    }
}).then(result=>{
    user = result.value;
});

//PRODUCTS
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let product = {
        name: productForm.name.value,
        price: productForm.price.value,
        thumbnail: productForm.thumbnail.value
    }
    socket.emit('new product', product);
    productForm.reset();
})

socket.on('products log', (products) => {
    let tbody = '';
    products.forEach(product => {
        tbody+= `
            <tr class='align-middle'>
              <td>${product.name}</td>
              <td>${product.price}</td>
              <td><img src="${product.thumbnail}" alt="${product.name}" width="100"></td>
            </tr>
        `;
    });
    productLog.innerHTML = tbody;
});


//CHAT
chatInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if(chatInput.value.trim().length > 0){
            socket.emit('chat message', {user: user, message: chatInput.value.trim(), date: new Date().toLocaleString()});
            chatInput.value = '';
        }
    }
})
socket.on('chat log', data => {
    let messages = "";
    data.forEach(element => {
        messages = messages + `${element.user}[${element.date}]: ${element.message}</br>`;
    }
    );
    chatLog.innerHTML = messages;
})
