document.addEventListener("DOMContentLoaded", async function () {

const SUPABASE_URL = "https://thgveowwxdjcvisofske.supabase.co";
const SUPABASE_KEY = "sb_publishable_JN8qHQVTWOLNtRzsTLHT1g_AMKIzfMm";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if(!productId){
showToast("Product ID missing","error");
return;
}

const { data } = await supabase
.from("products")
.select("*")
.eq("id", productId)
.single();

if(!data){
showToast("Product not found","error");
return;
}

const product = data;

const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${product.image_path}`;

// Set product details
detailImage.src = imageUrl;
detailName.innerText = product.name;
detailPrice.innerText = "₹"+product.price;
detailDescription.innerText = product.description;

// ✅ HANDLE STOCK UI
if(product.in_stock === false){
  
  addToCartBtn.disabled = true;
  addToCartBtn.innerText = "Out of Stock";
  addToCartBtn.style.background = "#ccc";

  // Optional: show toast or badge
  showToast("This product is currently out of stock ❌");

}

// CART FUNCTIONS
function getCart(){
return JSON.parse(localStorage.getItem("cart"))||[];
}

function saveCart(c){
localStorage.setItem("cart",JSON.stringify(c));
}

// ✅ ADD TO CART (WITH SAFETY CHECK)
addToCartBtn.onclick = ()=>{

// 🔒 Extra safety (very important)
if(product.in_stock === false){
showToast("This product is out of stock ❌","error");
return;
}

let cart = getCart();

const existing = cart.find(p=>p.id===product.id);

if(existing){
existing.quantity++;
}else{
cart.push({...product, quantity:1});
}

saveCart(cart);
showToast("Added to cart 🛒");

};

// WhatsApp button
whatsappBtn.onclick = ()=>{
window.open(`https://wa.me/919136334964`);
};

});
