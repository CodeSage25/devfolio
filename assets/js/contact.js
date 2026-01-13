(function () {
  "use strict";

  // ============================================
  // 🔧 CONFIGURATION - Remplacez ces valeurs !
  // ============================================
  const CONFIG = {
    publicKey: "SiyX2k7r8ZAoFySVP", // Depuis Account > API Keys
    serviceId: "service_g4yk6yp", // Depuis Email Services
    templateId: "template_2m7kgf5", // Depuis Email Templates
  };
  // ============================================

  // Initialisation
  emailjs.init(CONFIG.publicKey);

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Éléments UI
      const loading = form.querySelector(".loading");
      const errorMessage = form.querySelector(".error-message");
      const sentMessage = form.querySelector(".sent-message");
      const submitBtn = form.querySelector('button[type="submit"]');

      // 🛡️ Anti-spam honeypot
      const honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value !== "") {
        sentMessage.style.display = "block";
        return;
      }

      // Récupération des valeurs
      const formData = {
        name: form.querySelector('input[name="name"]').value.trim(),
        email: form.querySelector('input[name="email"]').value.trim(),
        subject: form.querySelector('input[name="subject"]').value.trim(),
        message: form.querySelector('textarea[name="message"]').value.trim(),
      };

      // ✅ Validation
      if (
        !formData.name ||
        !formData.email ||
        !formData.subject ||
        !formData.message
      ) {
        showError("Veuillez remplir tous les champs.");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showError("Adresse email invalide.");
        return;
      }

      // 📤 Envoi
      showLoading(true);

      emailjs
        .send(CONFIG.serviceId, CONFIG.templateId, formData)
        .then(function () {
          showLoading(false);
          sentMessage.style.display = "block";
          form.reset();

          // Masquer le message après 5 secondes
          setTimeout(() => {
            sentMessage.style.display = "none";
          }, 5000);
        })
        .catch(function (error) {
          console.error("Erreur EmailJS:", error);
          showLoading(false);
          showError("Erreur lors de l'envoi. Réessayez plus tard.");
        });

      // Fonctions utilitaires
      function showLoading(show) {
        loading.style.display = show ? "block" : "none";
        errorMessage.style.display = "none";
        sentMessage.style.display = "none";
        submitBtn.disabled = show;
        submitBtn.textContent = show ? "Envoi en cours..." : "Envoyer";
      }

      function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.style.display = "block";
      }
    });
  });
})();
