import { auth } from "./firebase.js";

import {
signInWithEmailAndPassword,
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ================= LOGIN =================

async function login(){

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();
const btn = document.querySelector(".login-btn");

// VALIDATION
if(!email || !password){
showToast("Please enter email and password", "error");
return;
}

try{

btn.innerText = "Logging in...";
btn.disabled = true;

await signInWithEmailAndPassword(auth, email, password);

showToast("Welcome back ✨");

setTimeout(()=>{
window.location.href = "index.html";
},1000);

}catch(error){

console.error(error);

let msg = "Login failed";

if(error.code === "auth/invalid-credential"){
msg = "Invalid email or password";
}
else if(error.code === "auth/user-not-found"){
msg = "User not found";
}
else if(error.code === "auth/wrong-password"){
msg = "Wrong password";
}

showToast(msg, "error");

}finally{

btn.innerText = "Login";
btn.disabled = false;

}

}

// ================= REGISTER =================

async function register(){

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();
const btn = document.querySelector(".login-btn");

if(!email || !password){
showToast("Please enter email and password", "error");
return;
}

try{

btn.innerText = "Creating account...";
btn.disabled = true;

await createUserWithEmailAndPassword(auth, email, password);

showToast("Account created successfully 🎉");

setTimeout(()=>{
window.location.href = "index.html";
},1000);

}catch(error){

console.error(error);

let msg = "Signup failed";

if(error.code === "auth/email-already-in-use"){
msg = "Email already registered";
}
else if(error.code === "auth/weak-password"){
msg = "Password should be at least 6 characters";
}

showToast(msg, "error");

}finally{

btn.innerText = "Login";
btn.disabled = false;

}

}

// ================= EVENT BINDING (🔥 FIX) =================

document.addEventListener("DOMContentLoaded", () => {

document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("registerBtn").addEventListener("click", register);

});