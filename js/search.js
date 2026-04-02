document.addEventListener("DOMContentLoaded", function () {

function getProducts() {
return JSON.parse(localStorage.getItem("products")) || [];
}

function createProductCard(product) {
return `
<div class="product-card" onclick="goToProduct('${product.id}')">
<img src="${product.image}">
<div class="product-info">
<div class="product-name">${product.name}</div>
<div class="product-price">₹${product.price}</div>
</div>
</div>
`;
}

function getQueryParam() {
const params = new URLSearchParams(window.location.search);
return params.get("q") || "";
}

function loadSearchResults() {

const rawQuery = getQueryParam();
const query = rawQuery.toLowerCase().trim();

const products = getProducts();
const container = document.getElementById("searchResults");
const title = document.getElementById("searchTitle");

if(!query){
title.innerText = "Search something...";
container.innerHTML = "<p>Start typing to search products.</p>";
return;
}

title.innerText = `Results for "${rawQuery}"`;

const results = products.filter(product => 
product.name.toLowerCase().includes(query) ||
(product.tags && product.tags.some(tag => tag.toLowerCase().includes(query))) ||
(product.category && product.category.toLowerCase().includes(query))
);

container.innerHTML = "";

if(results.length === 0){
container.innerHTML = "<p>No products found.</p>";
return;
}

results.forEach(product => {
container.innerHTML += createProductCard(product);
});

}

loadSearchResults();

});