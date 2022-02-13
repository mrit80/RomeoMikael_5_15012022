// récupérer l’URL de la page courante
const lien = window.location.href;

// Récupérer l’id du produit à afficher
let url = new URL(lien);
let id = url.searchParams.get('id');
let currentProduct;
const PRODUCT_URL = 'http://localhost:3000/api/products/' + id;

//-------------------------------------------------------------------------------------
// Requête fetch pour appeler les détails des produits
fetch(PRODUCT_URL)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function ProductDetail(product) {
    currentProduct = product;
    document.querySelector(
      '.item__img'
    ).innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.getElementById('title').textContent = product.name;
    document.getElementById('price').textContent = product.price;
    document.getElementById('description').textContent = product.description;
    document.getElementById('colors');

    for (let i = 0; i < product.colors.length; i++) {
      const color = product.colors[i];

      let element = document.createElement('option');
      element.textContent = color;
      document.getElementById('colors').appendChild(element);
    }
  })

  .catch(function (err) {
    console.log(err);
  });
//-------------------------------------------------------------------------------------
//
let addcart = document.getElementById('addToCart');

addcart.addEventListener('click', () => {
  // Récupérer l'id la couleur et la quantite du produit
  let color = document.getElementById('colors').value;
  let quantity = document.getElementById('quantity').value;
  // Stocker cela dans l'objet produit
  let produit = { id: id, color: color, quantity: quantity };

  if (produit.color && produit.quantity > 0) {
    if (localStorage.getItem('cart')) {
      let found = false;
      let arrayproducts = JSON.parse(localStorage.getItem('cart'));
      // Vérifier si l'id ou la couleur existe déjà dans le local storage et s'il existe j'augmente seulement la quantité
      for (let i in arrayproducts) {
        const productJson = arrayproducts[i];
        if (
          productJson.id == produit.id &&
          productJson.color == produit.color
        ) {
          arrayproducts[i].quantity =
            parseInt(arrayproducts[i].quantity) + parseInt(produit.quantity);
          found = true;
        }
      }

      if (found == false) {
        arrayproducts.push(produit);
      }

      localStorage.setItem('cart', JSON.stringify(arrayproducts));
    } else {
      // Dans le cas ou le produit est mis dans le local storage pour la premiere fois
      let arrayproducts = [];
      arrayproducts.push(produit);
      localStorage.setItem('cart', JSON.stringify(arrayproducts));
    }
  }
});
