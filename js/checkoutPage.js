document.addEventListener("DOMContentLoaded", function(){

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderItemsDiv = document.getElementById("orderItems");
const totalAmountEl = document.getElementById("totalAmount");

let total = 0;

cart.forEach(item => {

const itemTotal = item.price * item.quantity;
total += itemTotal;

orderItemsDiv.innerHTML += `
<div class="order-item">
<img src="https://thgveowwxdjcvisofske.supabase.co/storage/v1/object/public/product-images/${item.image_path}">
<div>
<p>${item.name}</p>
<p>Qty: ${item.quantity}</p>
<p>₹${item.price}</p>
</div>
</div>
`;

});

totalAmountEl.innerText = "₹" + total;

});

function orderOnWhatsApp(){

const cart = JSON.parse(localStorage.getItem("cart")) || [];

if(cart.length === 0){
alert("Cart is empty");
return;
}

const name = document.getElementById("fullName").value;
const email = document.getElementById("email").value;
const phone = document.getElementById("phone").value;
const address = document.getElementById("address").value;

if(!name || !phone || !address){
alert("Please fill all required fields");
return;
}

let message = `🛍️ *New Order - Eloura* \n\n`;

message += `👤 Name: ${name}\n`;
message += `📞 Phone: ${phone}\n`;
message += `📧 Email: ${email}\n`;
message += `📍 Address: ${address}\n\n`;

message += `📦 *Order Details:*\n`;

let total = 0;

cart.forEach((item, i) => {

const itemTotal = item.price * item.quantity;
total += itemTotal;

message += `\n${i+1}. ${item.name}`;
message += `\n   Qty: ${item.quantity}`;
message += `\n   Price: ₹${item.price}`;
message += `\n   Subtotal: ₹${itemTotal}\n`;

});

message += `\n💰 *Total: ₹${total}*`;

const phoneNumber = "919136334964";// 🔴 YOUR NUMBER

const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

window.open(url, "_blank");

// CLEAR CART AFTER ORDER
localStorage.removeItem("cart");
}