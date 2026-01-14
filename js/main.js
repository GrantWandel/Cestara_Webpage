// CESTARA Website - Main JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

// Initialize year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Modal Elements
const modal = document.getElementById("contactModal");
const openFormBtn = document.getElementById("openFormBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalOverlay = document.getElementById("modalOverlay");
const cancelBtn = document.getElementById("cancelBtn");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

// Check if elements exist
if (!modal || !openFormBtn) {
  console.error('Contact form elements not found');
  return;
}

// Open Modal
openFormBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openModal();
});

// Close Modal
closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
closeSuccessBtn.addEventListener("click", closeModal);

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
    closeModal();
  }
});

function openModal() {
  modal.setAttribute("aria-hidden", "false");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Focus first form field
  setTimeout(() => {
    document.getElementById("name").focus();
  }, 100);
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  modal.style.display = "none";
  document.body.style.overflow = "";

  // Reset form and success message
  contactForm.reset();
  contactForm.style.display = "block";
  formSuccess.style.display = "none";
  clearErrors();
}

// Form Validation
const validators = {
  name: (value) => {
    if (!value.trim()) return "Name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  },
  email: (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  },
  message: (value) => {
    if (!value.trim()) return "Project details are required";
    if (value.trim().length < 10) return "Please provide more details (at least 10 characters)";
    return "";
  }
};

function showError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}Error`);
  const inputElement = document.getElementById(fieldId);

  errorElement.textContent = message;
  errorElement.style.display = message ? "block" : "none";
  inputElement.setAttribute("aria-invalid", message ? "true" : "false");

  if (message) {
    inputElement.classList.add("error");
  } else {
    inputElement.classList.remove("error");
  }
}

function clearErrors() {
  ["name", "email", "message"].forEach(fieldId => {
    showError(fieldId, "");
  });
}

function validateField(fieldId) {
  const input = document.getElementById(fieldId);
  const validator = validators[fieldId];

  if (validator) {
    const errorMessage = validator(input.value);
    showError(fieldId, errorMessage);
    return !errorMessage;
  }

  return true;
}

// Real-time validation on blur
["name", "email", "message"].forEach(fieldId => {
  const input = document.getElementById(fieldId);
  input.addEventListener("blur", () => validateField(fieldId));

  // Clear error on input
  input.addEventListener("input", () => {
    if (input.classList.contains("error")) {
      showError(fieldId, "");
    }
  });
});

// Form Submission
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validate all required fields
  const nameValid = validateField("name");
  const emailValid = validateField("email");
  const messageValid = validateField("message");

  if (!nameValid || !emailValid || !messageValid) {
    // Focus first invalid field
    const firstError = contactForm.querySelector(".error");
    if (firstError) firstError.focus();
    return;
  }

  // Collect form data
  const formData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    projectType: document.getElementById("projectType").value,
    message: document.getElementById("message").value.trim(),
    timestamp: new Date().toISOString()
  };

  // Disable submit button during processing
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Sending...';

  try {
    // TODO: Replace this with your actual form submission endpoint
    // For now, we'll simulate a successful submission
    await simulateFormSubmission(formData);

    // Show success message
    contactForm.style.display = "none";
    formSuccess.style.display = "block";

    // Log to console (for development)
    console.log("Form submission:", formData);

  } catch (error) {
    alert("There was an error sending your enquiry. Please try again or contact us directly.");
    console.error("Form submission error:", error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In production, replace this with:
      // fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      resolve(data);
    }, 1000);
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Skip if it's just "#" or opens the modal
    if (href === "#" || this.id === "openFormBtn") return;

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  });
});

}); // End DOMContentLoaded
