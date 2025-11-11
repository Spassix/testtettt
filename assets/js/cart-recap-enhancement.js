// Patch pour améliorer le récapitulatif avec emojis et utiliser le nom de la boutique
(function() {
  'use strict';

  // Fonction pour obtenir le nom de la boutique depuis la config
  function getShopName() {
    try {
      const configStr = localStorage.getItem("site_config");
      if (configStr) {
        const config = JSON.parse(configStr);
        // Essayer shopName d'abord, puis heroBrand, puis fallback
        return config.shopName || config.heroBrand || config.heroTitle || "Boutique";
      }
    } catch (e) {
      console.error("Erreur lecture config:", e);
    }
    return "Boutique";
  }

  // Fonction pour améliorer le récapitulatif avec emojis et formatage
  function enhanceRecap() {
    const copyRecapBtn = document.getElementById("copyRecapBtn");
    if (!copyRecapBtn) return;

    // Vérifier si déjà patché
    if (copyRecapBtn._recapEnhanced) return;
    copyRecapBtn._recapEnhanced = true;

    const newBtn = copyRecapBtn.cloneNode(true);
    copyRecapBtn.parentNode.replaceChild(newBtn, copyRecapBtn);

    newBtn.addEventListener("click", async function(e) {
      e.preventDefault();
      e.stopPropagation();

      const recapService = document.getElementById("recapService");
      const recapHoraire = document.getElementById("recapHoraire");
      const recapTimeslot = document.getElementById("recapTimeslot");
      const recapAddress = document.getElementById("recapAddress");
      const recapItems = document.getElementById("recapItems");
      const cartTotal = document.getElementById("cartTotal");

      const service = recapService ? recapService.textContent.trim() : "—";
      const horaire = recapHoraire ? recapHoraire.textContent.trim() : "—";
      const timeslot = recapTimeslot ? recapTimeslot.textContent.trim() : "—";
      const address = recapAddress ? recapAddress.textContent.trim() : "—";
      const items = recapItems ? recapItems.textContent.trim() : "—";

      // Obtenir le mode de paiement
      let paymentMethod = "—";
      const selectedPaymentBtn = document.querySelector(".paiement-btn.selected");
      if (selectedPaymentBtn) {
        paymentMethod = selectedPaymentBtn.dataset.paymentName || 
                       selectedPaymentBtn.getAttribute("data-payment-name") || 
                       selectedPaymentBtn.textContent.trim() || "—";
      }

      // Obtenir le nom de la boutique
      const shopName = getShopName();

      // Construire le récapitulatif avec emojis et formatage
      let recap = `🛒 Commande ${shopName}\n`;
      recap += `${"=".repeat(30)}\n\n`;
      
      // Articles
      recap += `📦 Articles :\n`;
      if (items && items !== "—") {
        recap += `   ${items}\n`;
      } else {
        recap += `   Aucun article\n`;
      }
      recap += `\n`;

      // Service
      recap += `🚚 Service :\n`;
      recap += `   ${service !== "—" ? service : "Non sélectionné"}\n`;
      recap += `\n`;

      // Créneau
      recap += `⏰ Créneau :\n`;
      recap += `   ${timeslot !== "—" ? timeslot : "Non sélectionné"}\n`;
      recap += `\n`;

      // Adresse
      recap += `📍 Adresse :\n`;
      recap += `   ${address !== "—" ? address : "Non renseignée"}\n`;
      recap += `\n`;

      // Mode de paiement
      recap += `💳 Mode de paiement :\n`;
      recap += `   ${paymentMethod !== "—" ? paymentMethod : "Non sélectionné"}\n`;
      recap += `\n`;

      // Code promo et prix
      let promoText = "";
      let finalPrice = "";
      
      if (window.currentPromo && window.cart) {
        const promo = window.currentPromo;
        const discountType = promo.discountType || 
                            (promo.type === "percent" ? "percentage" : 
                             promo.type === "fixed" ? "fixed" : "percentage");
        const discount = promo.discount !== undefined ? promo.discount : promo.value;
        
        promoText = discountType === "percentage" 
          ? `🎟️ Code promo : ${promo.code} (-${discount}%)`
          : `🎟️ Code promo : ${promo.code} (-${discount}€)`;
        
        const total = window.cart.reduce((sum, item) => sum + (item.price || 0), 0);
        let discountAmount = 0;
        discountAmount = discountType === "percentage" 
          ? total * (discount / 100) 
          : discount;
        
        finalPrice = `💰 Prix final : ${Math.max(0, total - discountAmount).toFixed(2)}€`;
      } else if (cartTotal) {
        finalPrice = `💰 Total : ${cartTotal.textContent}`;
      }

      if (promoText) {
        recap += `${promoText}\n`;
        recap += `\n`;
      }
      
      if (finalPrice) {
        recap += `${finalPrice}\n`;
      }

      recap += `\n${"=".repeat(30)}\n`;
      recap += `✨ Merci pour votre commande ! ✨`;

      // Copier dans le presse-papier
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(recap);
          alert("✅ Récap copié dans le presse-papier !");
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = recap;
          textarea.style.position = "fixed";
          textarea.style.left = "-999999px";
          textarea.style.top = "-999999px";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          
          try {
            const successful = document.execCommand("copy");
            document.body.removeChild(textarea);
            if (!successful) throw new Error("execCommand failed");
            alert("✅ Récap copié dans le presse-papier !");
          } catch (err) {
            document.body.removeChild(textarea);
            throw err;
          }
        }
      } catch (err) {
        console.error("Erreur copie récap:", err);
        alert("Impossible de copier automatiquement. Voici le récapitulatif :\n\n" + recap);
      }
    });
  }

  // Initialiser
  function init() {
    setTimeout(() => {
      enhanceRecap();
    }, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Réinitialiser si le bouton est recréé
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        const copyRecapBtn = document.getElementById("copyRecapBtn");
        if (copyRecapBtn && !copyRecapBtn._recapEnhanced) {
          enhanceRecap();
        }
      }
    });
  });

  const cartPanel = document.querySelector('[data-panel="envoi"]');
  if (cartPanel) {
    observer.observe(cartPanel, { childList: true, subtree: true });
  }

  console.log("✅ Amélioration du récapitulatif activée");
})();

