// Patch pour s'assurer que la ferme et la catégorie sont pré-remplies lors de l'édition
(function() {
  'use strict';

  // Fonction pour pré-remplir les champs après que les selects soient peuplés
  function ensureFieldsPreFilled(product) {
    if (!product) return;

    const categorySelect = document.getElementById("productCategory");
    const farmSelect = document.getElementById("productFarm");

    if (!categorySelect || !farmSelect) return;

    // Fonction pour définir la valeur avec retry
    function setSelectValue(select, value, maxRetries = 10) {
      if (!select || !value) return;

      let retries = 0;
      const trySet = () => {
        // Vérifier si l'option existe
        const optionExists = Array.from(select.options).some(
          opt => opt.value === value
        );

        if (optionExists) {
          select.value = value;
          return true;
        } else if (retries < maxRetries) {
          retries++;
          setTimeout(trySet, 100);
          return false;
        }
        return false;
      };

      trySet();
    }

    // Pré-remplir la catégorie
    if (product.category) {
      setSelectValue(categorySelect, product.category);
    }

    // Pré-remplir la ferme
    if (product.farm) {
      setSelectValue(farmSelect, product.farm);
    }
  }

  // Patcher openProductModal
  if (window.openProductModal) {
    const originalOpenProductModal = window.openProductModal;
    window.openProductModal = function(product) {
      // Appeler la fonction originale
      const result = originalOpenProductModal.apply(this, arguments);

      // Si on édite un produit, s'assurer que les champs sont pré-remplis
      if (product) {
        // Attendre que les selects soient peuplés
        setTimeout(() => {
          ensureFieldsPreFilled(product);
        }, 100);

        // Retry après un délai plus long au cas où
        setTimeout(() => {
          ensureFieldsPreFilled(product);
        }, 500);
      }

      return result;
    };
  }

  // Observer le modal pour détecter quand il s'ouvre
  const productModal = document.getElementById("productModal");
  if (productModal) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isHidden = productModal.classList.contains("hidden");
          
          if (!isHidden) {
            // Le modal vient de s'ouvrir
            // Essayer de récupérer le produit depuis editingProductId
            if (window.editingProductId !== null && window.editingProductId !== undefined) {
              // Charger les produits et trouver celui qui correspond
              setTimeout(async () => {
                try {
                  if (window.Products && window.Products.loadProducts) {
                    await window.Products.loadProducts();
                  }
                  
                  // Essayer d'obtenir les produits depuis window.products ou BackendData
                  let products = [];
                  if (window.products && Array.isArray(window.products)) {
                    products = window.products;
                  } else if (window.BackendData) {
                    products = await window.BackendData.loadData("products") || [];
                  }

                  const product = products.find(p => p.id === window.editingProductId);
                  if (product) {
                    ensureFieldsPreFilled(product);
                  }
                } catch (e) {
                  console.error("Erreur lors du pré-remplissage:", e);
                }
              }, 200);
            }
          }
        }
      });
    });

    observer.observe(productModal, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
  }

  console.log("✅ Patch de pré-remplissage des champs activé");
})();

