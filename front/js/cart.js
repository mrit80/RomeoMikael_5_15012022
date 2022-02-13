// Je verifie si je suis dans la page confirmation
if (document.getElementById('orderId')) {
  const lien = window.location.href;

  // Récupérer l’id du produit à afficher
  let url = new URL(lien);
  let orderId = url.searchParams.get('orderId');

  document.getElementById('orderId').textContent = orderId;
} else {
  // Sinon je suis dans la page panier
  gererPage(JSON.parse(localStorage.getItem('cart')));
}

// Récupérer les informations des produits dans le local storage et le server
function gererPage(products) {
  let elt = document.getElementById('cart__items');
  let productsList = '';
  let totalQuantite = 0;
  let totalPrix = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const PRODUCT_URL = 'http://localhost:3000/api/products/' + product.id;

    fetch(PRODUCT_URL)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then((productApi) => {
        let innerHtml = `
            <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${productApi.imageUrl}" alt="${productApi.alTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${productApi.name}</h2>
                    <p>${product.color}</p>
                    <p>${productApi.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
        productsList = productsList + innerHtml;
        totalQuantite = parseInt(totalQuantite + parseInt(product.quantity));
        totalPrix =
          parseInt(totalPrix) +
          parseInt(product.quantity) * parseInt(productApi.price);
        elt.innerHTML = productsList;
        document.getElementById('totalQuantity').textContent = totalQuantite;
        document.getElementById('totalPrice').textContent = totalPrix;
      });
  }
}

// Changer la quantite du produit
function changeProductQuantity() {
  let elt = event.target.closest('article');
  // Nouvelle quantite
  let nouvelleQte = event.target.value;
  let id = elt.dataset.id;
  let color = elt.dataset.color;
  let productsArrayJson = JSON.parse(localStorage.getItem('cart'));

  let found = false;
  let index;
  for (let i in productsArrayJson) {
    const productJson = productsArrayJson[i];
    if (productJson.id == id && productJson.color == color) {
      found = true;
      index = i;
      break;
    }
  }

  if (index) {
    productsArrayJson[index].quantity = parseInt(nouvelleQte);
    localStorage.setItem('cart', JSON.stringify(productsArrayJson));
  }

  gererPage(productsArrayJson);
}

// Supprimer un produit
function removeProductCart() {
  let element = event.target;
  let productsArrayJson = JSON.parse(localStorage.getItem('cart'));

  // Verifier si le button Supprimer a ete cliquer et si oui, supprimer le produit dans le localStorage
  let deleteItem = element.getAttribute('class');
  if (deleteItem == 'deleteItem') {
    //recuperer l'ID et la couleur de l'article
    let article = element.closest('article');
    let id = article.dataset.id;
    let color = article.dataset.color;

    let found = false;
    let index;
    for (let i in productsArrayJson) {
      const productJson = productsArrayJson[i];
      if (productJson.id == id && productJson.color == color) {
        found = true;
        index = i;
        break;
      }
    }

    if (index) {
      productsArrayJson.splice(index, 1); // suppression du produit dans le localStorage
      localStorage.setItem('cart', JSON.stringify(productsArrayJson));
    }

    if (productsArrayJson.length > 0) {
      gererPage(productsArrayJson);
    } else {
      document.getElementById('cart__items').innerHTML = '';
      document.getElementById('totalQuantity').textContent = '';
      document.getElementById('totalPrice').textContent = '';
    }
  }
}

// Commander
function order() {
  event.preventDefault();
  let submit = true;

  let orderJson = {
    contact: {
      firstName: 'firstName',
      lastName: 'lastName',
      address: 'address',
      city: 'city',
      email: 'mikaelro@live.it',
    },
    products: [],
  };
  // Recuperer les donnees saisies par l'utilisteur
  let firstname = document.getElementById('firstName').value;
  let lastname = document.getElementById('lastName').value;
  let address = document.getElementById('address').value;
  let city = document.getElementById('city').value;
  let email = document.getElementById('email').value;

  // Controle des champs
  if (!validateFistLastName(firstname) || !validateFistLastCity(firstname)) {
    document.getElementById('firstNameErrorMsg').innerText =
      "Le prénom n'est pas valide";
    document.getElementById('firstNameErrorMsg').style.color = 'red';
    submit = false;
  } else {
    document.getElementById('firstNameErrorMsg').innerText = '';
  }
  if (!validateFistLastName(lastname) || !validateFistLastCity(lastname)) {
    document.getElementById('lastNameErrorMsg').innerText =
      "Le nom n'est pas valide";
    document.getElementById('lastNameErrorMsg').style.color = 'red';
    submit = false;
  } else {
    document.getElementById('lastNameErrorMsg').innerText = '';
  }
  if (!validateFistLastName(address)) {
    document.getElementById('addressErrorMsg').innerText = 'Le champ est vide';
    document.getElementById('addressErrorMsg').style.color = 'red';
    submit = false;
  } else {
    document.getElementById('addressErrorMsg').innerText = '';
  }
  if (!validateFistLastName(city) || !validateFistLastCity(city)) {
    document.getElementById('cityErrorMsg').innerText =
      "Le champ n'est pas valide";
    document.getElementById('cityErrorMsg').style.color = 'red';
    submit = false;
  } else {
    document.getElementById('cityErrorMsg').innerText = '';
  }
  if (!validateFistLastName(email)) {
    document.getElementById('emailErrorMsg').innerText = 'Le champ est vide';
    document.getElementById('emailErrorMsg').style.color = 'red';
    submit = false;
  } else {
    document.getElementById('emailErrorMsg').innerText = '';
  }
  if (validationEmail(email)) {
  } else {
    document.getElementById('emailErrorMsg').innerText =
      "L'adresse mail n'est pas valide";
    document.getElementById('emailErrorMsg').style.color = 'red';
    submit = false;
  }

  if (submit) {
    orderJson.contact.firstName = firstname;
    orderJson.contact.lastName = lastname;
    orderJson.contact.address = address;
    orderJson.contact.city = city;
    orderJson.contact.email = email;

    let produits = JSON.parse(localStorage.getItem('cart'));
    for (let j in produits) {
      product = produits[j];
      orderJson.products.push(product.id);
    }

    sendOrder(orderJson);
  }
}

function sendOrder(orderJson) {
  fetch('http://localhost:3000/api/products/order', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderJson),
  })
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      // Recuper orderId
      let orderId = data.orderId;
      // Redirection de l’utilisateur sur la page Confirmation
      window.location.href = './confirmation.html?orderId=' + orderId;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function validationEmail(email) {
  let expressionReguliere =
    /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
  if (!expressionReguliere.test(email) || email == '') {
    return false;
  }
  return true;
}

function validateFistLastCity(name) {
  let expressionReguliere = /^([a-zA-Z ]+)$/;
  if (!expressionReguliere.test(name)) {
    return false;
  }
  return true;
}

function validateFistLastName(name) {
  if (name == '') {
    return false;
  }
  return true;
}

// Changer la quantite
if (document.getElementById('cart__items')) {
  document
    .getElementById('cart__items')
    .addEventListener('change', changeProductQuantity);
}
// Supprimer un produit
if (document.getElementById('cart__items')) {
  document
    .getElementById('cart__items')
    .addEventListener('click', removeProductCart);
}

// Commander
if (document.getElementById('order')) {
  document.getElementById('order').addEventListener('click', order);
}
