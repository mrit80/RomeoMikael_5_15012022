let url = 'http://localhost:3000/api/products';
let productsList = '';
// Récupérer les produits dans le server
fetch(url)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (products) {
    let elt = document.getElementById('items');

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      let innerHtml = `
            <a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
            </a>`;
      productsList += innerHtml;
    }

    elt.innerHTML = productsList;
  })

  .catch(function (err) {
    console.log(err);
  });
