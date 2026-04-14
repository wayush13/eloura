const SUPABASE_URL = "https://thgveowwxdjcvisofske.supabase.co";
const SUPABASE_KEY = "sb_publishable_JN8qHQVTWOLNtRzsTLHT1g_AMKIzfMm";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Create Product Card
function createSearchCard(product){

const imageUrl = supabase
.storage
.from("product-images")
.getPublicUrl(product.image_path).data.publicUrl;

return `
<div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">

<img src="${imageUrl}" alt="${product.name}">

<div class="product-info">
<div class="product-name">${product.name}</div>
<div class="product-price">₹${product.price}</div>
</div>

</div>
`;
}


// Fetch Products
async function fetchProducts(){

const { data , error } = await supabase
.from("products")
.select("*");

if(error){
console.error(error);
return [];
}

return data;
}


// Init Search
async function initSearch(){

if(!searchInput) return;

const products = await fetchProducts();

searchInput.addEventListener("input",(e)=>{

const value = e.target.value.toLowerCase();

if(value === ""){
searchResults.innerHTML = "";
return;
}

const filtered = products.filter(product =>

product.name.toLowerCase().includes(value) ||
(product.description && product.description.toLowerCase().includes(value)) ||
(product.category && product.category.toLowerCase().includes(value))

);

showResults(filtered);

});

}


// Show Results
function showResults(products){

searchResults.innerHTML = "";

products.slice(0,8).forEach(product=>{
searchResults.innerHTML += createSearchCard(product);
});

}

initSearch();