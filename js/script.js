import { auth } from "./firebase.js";
import {
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ================= SUPABASE =================

const SUPABASE_URL = "https://thgveowwxdjcvisofske.supabase.co";
const SUPABASE_KEY = "sb_publishable_JN8qHQVTWOLNtRzsTLHT1g_AMKIzfMm";

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
nav.innerHTML = `
<span onclick="goToAdmin()">Admin Panel</span>
<span onclick="goToCart()">🛒</span>
<span onclick="logout()">Logout</span>
`;
}else{
nav.innerHTML = `
<span onclick="goToAccount()">My Profile</span>
<span onclick="goToCart()">🛒</span>
<span onclick="logout()">Logout</span>
`;
}
}

// ================= LOGOUT =================

function logout(){
signOut(auth).then(()=>{
window.location.href = "index.html";
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
}else{
wishlist.push(productId);
element.classList.add("active");
}

saveWishlist(wishlist);
}

window.toggleWishlist = toggleWishlist;

// ================= PRODUCT CARD =================

function createProductCard(product){

const wishlist=getWishlist();
const isWishlisted=wishlist.includes(product.id);
const imageUrl=getImageUrl(product.image_path);

return `

<div class="product-card" data-id="${product.id}">

<div class="wishlist ${isWishlisted ? "active" : ""}"
onclick="event.stopPropagation(); toggleWishlist('${product.id}', this)">
♥
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

trending.slice(0,4).forEach(product=>{
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
return;
}

container.innerHTML="";

data.slice(0,4).forEach(product=>{
container.innerHTML+=createProductCard(product);
});
}

// ================= NAVIGATION =================

function goToCart(){ window.location.href="cart.html"; }
function goToAdmin(){ window.location.href="admin/add-products.html"; }
function goToLogin(){ window.location.href="login.html"; }
function goToAccount(){ window.location.href="account.html"; }

window.goToCart=goToCart;
window.goToAdmin=goToAdmin;
window.goToLogin=goToLogin;
window.goToAccount=goToAccount;
window.logout=logout;

// ================= INIT =================

document.addEventListener("DOMContentLoaded",async()=>{

onAuthStateChanged(auth,(user)=>{
loadNavbar(user);
});

await loadTrendingSection();

await loadCategorySection("necklaceSection","necklace");
await loadCategorySection("earringsSection","earrings");
await loadCategorySection("braceletsSection","bracelets");
await loadCategorySection("kadaSection","kada");
await loadCategorySection("ringsSection","rings");
await loadCategorySection("setsSection","sets");
await loadCategorySection("watchesSection","watches");
await loadCategorySection("bestsellerSection","bestseller");
await loadCategorySection("mensSection","mens-collection");
await loadCategorySection("jewelleryBoxSection","jewellery-box");

});