// ================= FIREBASE AUTH =================

import { auth } from "./firebase.js";
import {
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ================= SUPABASE =================

const SUPABASE_URL = "https://thgveowwxdjcvisofske.supabase.co";
const SUPABASE_KEY = "sb_publishable_JN8qHQVTWOLNtRzsTLHT1g_AMKIzfMm";

// 🔥 SAFE INIT (prevents crash if CDN not loaded yet)
let supabase = null;
if (window.supabase) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// ================= STORAGE =================

const BUCKET_NAME = "product-images";

function getImageUrl(fileName){
if(!supabase) return "";
const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
return data.publicUrl;
}

// ================= ADMIN =================

const ADMIN_EMAIL = "admineloura@gmail.com";

// ================= TOAST =================

function showToast(message, type = "success") {

let toast = document.getElementById("globalToast");

if (!toast) {
toast = document.createElement("div");
toast.id = "globalToast";
toast.className = "toast";

toast.innerHTML = `
<span id="toastIcon" class="toast-icon"></span>
<span id="toastText" class="toast-text"></span>
`;

document.body.appendChild(toast);
}

const text = toast.querySelector("#toastText");
const icon = toast.querySelector("#toastIcon");

text.innerText = message;

if (type === "success") icon.innerText = "✔️";
else if (type === "error") icon.innerText = "❌";
else icon.innerText = "ℹ️";

toast.className = "toast show " + type;

setTimeout(() => {
toast.className = "toast";
}, 3000);
}

// 🔥 GLOBAL ACCESS
window.showToast = showToast;

// ================= NAVBAR =================

function loadNavbar(user){

const nav = document.getElementById("navActions");
if(!nav) return;

if(!user){
nav.innerHTML = `<span onclick="goToLogin()">Login</span> <span onclick="goToCart()">🛒</span>`;
return;
}

const email = (user.email || "").trim().toLowerCase();

if(email === ADMIN_EMAIL){
nav.innerHTML = `<span onclick="goToAdmin()">Admin Panel</span> <span onclick="goToCart()">🛒</span> <span onclick="logout()">Logout</span>`;
}else{
nav.innerHTML = `<span onclick="goToAccount()">My Profile</span> <span onclick="goToCart()">🛒</span> <span onclick="logout()">Logout</span>`;
}
}

// ================= LOGOUT =================

function logout(){

signOut(auth).then(()=>{
showToast("Logged out successfully");

setTimeout(()=>{
window.location.href = "index.html";
},800);

}).catch((error)=>{
console.error("Logout error:", error);
showToast("Logout failed","error");
});
}

// ================= WISHLIST =================

function getWishlist(){
return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(list){
localStorage.setItem("wishlist",JSON.stringify(list));
}

function toggleWishlist(productId,element){

let wishlist=getWishlist();

if(wishlist.includes(productId)){
wishlist=wishlist.filter(id=>id!==productId);
element.classList.remove("active");
element.innerHTML="♡";
showToast("Removed from wishlist","error");
}else{
wishlist.push(productId);
element.classList.add("active");
element.innerHTML="♥";
showToast("Added to wishlist ❤️","success");
}

saveWishlist(wishlist);
}

// ================= PRODUCT CARD =================

function createProductCard(product){

const wishlist=getWishlist();
const isWishlisted=wishlist.includes(product.id);
const imageUrl=getImageUrl(product.image_path);

return `
<div class="product-card" data-id="${product.id}">

<div class="wishlist ${isWishlisted ? "active" : ""}"
onclick="event.stopPropagation(); toggleWishlist('${product.id}', this)">
${isWishlisted ? "♥" : "♡"}
</div>

<img src="${imageUrl}" alt="${product.name}">

<div class="product-info">
<div class="product-name">${product.name}</div>
<div class="product-price">₹${product.price}</div>
</div>

</div>
`;
}

// ================= PRODUCT CLICK =================

document.addEventListener("click",(e)=>{

const card = e.target.closest(".product-card");

if(card){
const id = card.getAttribute("data-id");
if(id){
window.location.href="product.html?id="+id;
}
}

});

// ================= FETCH PRODUCTS =================

async function fetchProducts(){

if(!supabase) return [];

const {data,error}=await supabase
.from("products")
.select("*")
.order("created_at",{ascending:false});

if(error){
console.error("Fetch error:",error);
showToast("Error loading products","error");
return [];
}

return data;
}

// ================= TRENDING =================

async function loadTrendingSection(){

const container=document.getElementById("trendingSection");
if(!container) return;

const products=await fetchProducts();
const trending=products.filter(p=>p.is_trending===true);

container.innerHTML="";

trending.forEach(product=>{
container.innerHTML+=createProductCard(product);
});

}

// ================= CATEGORY =================

async function loadCategorySection(sectionId,category){

const container=document.getElementById(sectionId);
if(!container) return;

if(!supabase) return;

const {data,error}=await supabase
.from("products")
.select("*")
.eq("category",category)
.order("created_at",{ascending:false});

if(error){
console.error("Category error:",error);
showToast("Error loading category","error");
return;
}

container.innerHTML="";

data.forEach(product=>{
container.innerHTML+=createProductCard(product);
});
}

// ================= NAVIGATION =================

function goToCart(){ window.location.href="cart.html"; }
function goToAdmin(){ window.location.href="admin/add-products.html"; }
function goToLogin(){ window.location.href="login.html"; }
function goToAccount(){ window.location.href="account.html"; }

// ================= GLOBAL =================

window.goToCart=goToCart;
window.goToAdmin=goToAdmin;
window.goToLogin=goToLogin;
window.goToAccount=goToAccount;
window.logout=logout;
window.toggleWishlist=toggleWishlist;

// ================= INIT =================

document.addEventListener("DOMContentLoaded",async()=>{

onAuthStateChanged(auth,(user)=>{
loadNavbar(user);
});

// Only run on homepage
await loadTrendingSection();

await loadCategorySection("neckchainSection","neckchain");
await loadCategorySection("earringSection","earring");
await loadCategorySection("kadaBraceletSection","kada-bracelet");
await loadCategorySection("chainBraceletSection","chain-bracelet");
await loadCategorySection("ringSection","ring");

});