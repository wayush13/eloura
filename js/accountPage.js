import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const SUPABASE_URL = "https://thgveowwxdjcvisofske.supabase.co";
const SUPABASE_KEY = "sb_publishable_JN8qHQVTWOLNtRzsTLHT1g_AMKIzfMm";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// ================= CHECK LOGIN =================

onAuthStateChanged(auth, async (user)=>{

if(!user){
window.location.href="login.html";
return;
}

loadOrders(user.email);

});


// ================= LOAD ORDERS =================

async function loadOrders(email){

const container = document.getElementById("ordersList");

container.innerHTML = "Loading orders...";

try{

const { data: orders, error } = await supabase
.from("orders")
.select("*")
.eq("user_email", email)
.order("created_at",{ascending:false});

if(error){
console.error(error);
container.innerHTML = "<div class='empty'>Error loading orders</div>";
return;
}

if(!orders || orders.length === 0){
container.innerHTML = "<div class='empty'>You have no orders yet.</div>";
return;
}

container.innerHTML = "";

// LOOP ORDERS

for(const order of orders){

const { data: items, error: itemError } = await supabase
.from("order_items")
.select("*")
.eq("order_id", order.id);

if(itemError){
console.error(itemError);
continue;
}

let itemsHTML = "";

if(items && items.length > 0){

items.forEach(item => {

itemsHTML += `

<div class="order-item">
<span>${item.product_name}</span>
<span>₹${item.price} × ${item.quantity}</span>
</div>

`;

});

}

container.innerHTML += `

<div class="order-card">

<h3>Order #${order.id.slice(0,8)}</h3>

${itemsHTML}

<div class="status">
Status: ${order.status}
</div>

</div>

`;

}

}catch(err){

console.error(err);
container.innerHTML = "<div class='empty'>Failed to load orders.</div>";

}

}