// =====================
// Elements
// =====================
const form = document.getElementById("registerForm");

const usernameInput = document.getElementById("username");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const submitBtn = document.getElementById("submitBtn");

// Password rules
const strengthItem = document.getElementById("rule-strength");
const strengthText = strengthItem.querySelector(".text");

const rulePersonal = document.querySelector('[data-rule="personal"]');
const ruleLength = document.querySelector('[data-rule="length"]');
const ruleSymbol = document.querySelector('[data-rule="symbol"]');

// =====================
// State
// =====================
const touched = {
  username: false,
  fullName: false,
  email: false,
  password: false
};

// =====================
// Helpers
// =====================
function setError(input, message) {
  const errorEl = input.parentElement.querySelector(".error");
  errorEl.textContent = message;
  input.classList.add("error");
  input.classList.remove("success");
}

function setSuccess(input) {
  const errorEl = input.parentElement.querySelector(".error");
  errorEl.textContent = "";
  input.classList.remove("error");
  input.classList.add("success");
}

// =====================
// Field Validations
// =====================
function validateUsername() {
  const value = usernameInput.value.trim();

  if (!value) {
    setError(usernameInput, "Username is required");
    return false;
  }

  if (value.length < 3) {
    setError(usernameInput, "Username must be at least 3 characters");
    return false;
  }

  setSuccess(usernameInput);
  return true;
}

function validateFullName() {
  const value = fullNameInput.value.trim();
  const nameRegex = /^[A-Za-z]+(\s+[A-Za-z]+)+$/;

  if (!value) {
    setError(fullNameInput, "Full name is required");
    return false;
  }

  if (!nameRegex.test(value)) {
    setError(fullNameInput, "Enter first and last name (letters only)");
    return false;
  }

  setSuccess(fullNameInput);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    setError(emailInput, "Email is required");
    return false;
  }

  if (!emailRegex.test(value)) {
    setError(emailInput, "Enter a valid email address");
    return false;
  }

  setSuccess(emailInput);
  return true;
}

// =====================
// Password Validation
// =====================
function validatePassword() {
  const value = passwordInput.value;
  let score = 0;

  // Rule: length
  const hasLength = value.length >= 8;
  ruleLength.classList.toggle("valid", hasLength);
  if (hasLength) score++;

  // Rule: number or symbol
  const hasSymbol = /[0-9!@#$%^&*]/.test(value);
  ruleSymbol.classList.toggle("valid", hasSymbol);
  if (hasSymbol) score++;

  // Rule: personal info
  const namePart = fullNameInput.value
    .trim()
    .split(" ")[0]
    ?.toLowerCase();

  const emailPart = emailInput.value.split("@")[0]?.toLowerCase();

  const noPersonalInfo =
    (!namePart || !value.toLowerCase().includes(namePart)) &&
    (!emailPart || !value.toLowerCase().includes(emailPart));

  rulePersonal.classList.toggle("valid", noPersonalInfo);
  if (noPersonalInfo) score++;

  // Strength
  let strength = "Weak";
  if (score === 2) strength = "Medium";
  if (score === 3 && value.length >= 10) strength = "Strong";
  else if (score === 3) strength = "Good";

  strengthText.textContent = `Password strength: ${strength}`;
  strengthItem.classList.toggle("valid", strength !== "Weak");

  if (!value) {
    setError(passwordInput, "Password is required");
    return false;
  }

  if (score < 3) {
    setError(passwordInput, "Password does not meet requirements");
    return false;
  }

  setSuccess(passwordInput);
  return true;
}

// =====================
// Form State
// =====================
function updateFormState() {
  const isValid =
    validateUsername() &&
    validateFullName() &&
    validateEmail() &&
    validatePassword();

  submitBtn.disabled = !isValid;
  submitBtn.classList.toggle("enabled", isValid);
}

// =====================
// Input Events
// =====================
usernameInput.addEventListener("input", () => {
  touched.username = true;
  if (touched.username) validateUsername();
  updateFormState();
});

fullNameInput.addEventListener("input", () => {
  touched.fullName = true;
  if (touched.fullName) validateFullName();
  updateFormState();
});

emailInput.addEventListener("input", () => {
  touched.email = true;
  if (touched.email) validateEmail();
  updateFormState();
});

passwordInput.addEventListener("input", () => {
  touched.password = true;
  if (touched.password) validatePassword();
  updateFormState();
});

// =====================
// Submit (REAL)
// =====================
const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const isValid =
    validateUsername() &&
    validateFullName() &&
    validateEmail() &&
    validatePassword();

  if (!isValid) return;

  // ساخت object اطلاعات کاربر
  const userData = {
    username: usernameInput.value.trim(),
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim()
  };

  // لاگ console
  console.log("Account created successfully:", userData);

  // نمایش پیام موفقیت داخل صفحه
  successMessage.textContent = "Account created successfully";
  successMessage.style.display = "block";

  // ریست فرم
  form.reset();
  submitBtn.disabled = true;
  submitBtn.classList.remove("enabled");
});

