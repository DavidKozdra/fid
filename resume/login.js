
const loginBtn = document.getElementById('login-btn');
const emailInput = document.querySelector('input#email');
const passwordInput = document.querySelector('input#password');

const loginSection = document.getElementById('login-section') 
const loginStatus = document.getElementById('login-status');

loginBtn.disabled = true;

function checkInputs() {
  loginBtn.disabled = !(emailInput.value && passwordInput.value);
}

emailInput.addEventListener('input', checkInputs);
passwordInput.addEventListener('input', checkInputs);

loginBtn.addEventListener('click', login);

async function login() {
  const email = emailInput.value;
  const password = passwordInput.value;

  loginStatus.textContent = 'Logging in...⏳';

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email, password
  });

  if (error) {
    loginStatus.textContent = '❌ Incorrect credentials';

    return;
  }

  loginStatus.textContent = '✅ Logged in!';
  uploadSection.style.display = 'block';
}

// Load gallery on page load
window.addEventListener('DOMContentLoaded', fetchImages);
