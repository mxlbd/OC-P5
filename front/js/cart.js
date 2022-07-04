// Stocker les informations du localStorage ---------------------------
const cart = [];

retrieveItems();

// Défini une boucle pour appliquer le code à tous les articles -------

cart.forEach((item) => displayItem(item));

const orderButton = document.querySelector('#order');
orderButton.addEventListener('click', (e) => submitForm(e));

// Récupère les informations du localStorage --------------------------

function retrieveItems() {
  for (let i = 0; i < localStorage.length; i++) {
    const item = localStorage.getItem(localStorage.key(i));
    const itemObject = JSON.parse(item);
    cart.push(itemObject);
  }
}

// Affiche le code HTML -----------------------------------------------

function displayItem(item) {
  const article = itemArticle(item);

  const dvImg = divImage(item);
  article.appendChild(dvImg);

  const dvContent = divContent(item);
  article.appendChild(dvContent);

  const dvDescription = divDescription(item);
  dvContent.appendChild(dvDescription);

  const dvSettings = divSettings();
  dvContent.appendChild(dvSettings);

  const dvQuantity = divQuantity(item);
  dvSettings.appendChild(dvQuantity);

  const dvDelete = divDelete(item);
  dvSettings.appendChild(dvDelete);

  displayTotalQuantity();
  displayTotalPrice();
}

// Faire apparaître la quantité total des articles -----------------

function displayTotalQuantity() {
  const totalQuantity = document.querySelector('#totalQuantity');
  const total = cart.reduce((total, item) => total + item.quantity, 0);

  totalQuantity.innerHTML = total;
}

// Faire apparaître le prix total des articles ---------------------

function displayTotalPrice() {
  let total = 0;
  const totalPrice = document.querySelector('#totalPrice');
  cart.forEach((item) => {
    const totalUnitPrice = item.price * item.quantity;
    total = total + totalUnitPrice;
  });
  totalPrice.textContent = total;
}

// Article ---------------------------------------------------------

function itemArticle(item) {
  const article = document
    .querySelector('#cart__items')
    .appendChild(document.createElement('article'));
  article.classList.add('cart__item');
  article.dataset.id = item.id;
  article.dataset.color = item.color;

  return article;
}
// Div Image --------------------------------

function divImage(item) {
  const divImage = document.createElement('div');
  divImage.classList.add('cart__item__img');

  const img = document.createElement('img');
  img.src = item.imageUrl;
  img.alt = item.altTxt;

  divImage.appendChild(img);

  return divImage;
}

// Div Content --------------------------------

function divContent() {
  const divContent = document.createElement('div');
  divContent.classList.add('cart__item__content');

  return divContent;
}

// Div Description --------------------------------------

function divDescription(item) {
  const divDescription = document.createElement('div');
  divDescription.classList.add('cart__item__content__description');

  const name = document.createElement('h2');
  name.textContent = item.name;
  const color = document.createElement('p');
  color.textContent = item.color;
  const price = document.createElement('p');
  price.textContent = item.price + ' €';

  divDescription.appendChild(name);
  divDescription.appendChild(color);
  divDescription.appendChild(price);

  return divDescription;
}

// Div Settings -----------------------------------------------

function divSettings() {
  const divSettings = document.createElement('div');
  divSettings.classList.add('cart__item__content__settings');

  return divSettings;
}

// Div Quantity ---------------------------------------

function divQuantity(item) {
  const divQuantity = document.createElement('div');
  divQuantity.classList.add('cart__item__content__settings__quantity');

  const paragraph = document.createElement('p');
  paragraph.innerHTML = 'Qté : ';

  const input = document.createElement('input');
  input.type = 'number';
  input.classList.add('itemQuantity');
  input.name = 'itemQuantity';
  input.min = '1';
  input.max = '100';
  input.value = item.quantity;
  input.addEventListener('input', () =>
    updateQuantity(item.id, input.value, item)
  );

  divQuantity.appendChild(paragraph);
  divQuantity.appendChild(input);

  return divQuantity;
}

// Mettre à jour les quantités à chaque changement dans le panier

function updateQuantity(id, newValue, item) {
  const updateItem = cart.find((item) => item.id === id);
  updateItem.quantity = Number(newValue);
  displayTotalPrice();
  displayTotalQuantity();
  updateCache(item);
}

// Sauvegarder les nouvelles données dans le cache

function updateCache(item) {
  const newData = JSON.stringify(item);
  localStorage.setItem(item.id + '-' + item.color, newData);
}

// Div Delete --------------------------------------

function divDelete(item) {
  const divDelete = document.createElement('div');
  divDelete.classList.add('cart__item__content__settings__delete');

  divDelete.addEventListener('click', () => deleteItem(item));

  const paragraph = document.createElement('p');
  paragraph.classList.add('deleteItem');
  paragraph.textContent = 'Supprimer';

  divDelete.appendChild(paragraph);

  return divDelete;
}

// Fonction pour supprimer un article du cache -----------------

function deleteItem(item) {
  const deleteItem = cart.find(
    (product) => product.id === item.id && product.color === item.color
  );
  cart.splice(deleteItem, 1);
  displayTotalQuantity();
  displayTotalPrice();
  deleteCache(item);
  deleteArticle(item);
}

function deleteCache(item) {
  localStorage.removeItem(item.id + '-' + item.color);
}

function deleteArticle(item) {
  const deleteArticle = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  );
  deleteArticle.remove();
}

// Envoi du formulaire au backend au clic du bouton commander -------------

function submitForm(e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert('Veuillez selectionner au moins un article avant de passer commande');
    return;
  }

  const body = requestBody();

  const post = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  };

  fetch('http://localhost:3000/api/products/order', post)
    .then((res) => res.json())
    .then((data) => console.log(data));
}

// Corps du formulaire -------------------------------------

function requestBody() {
  const form = document.querySelector('.cart__order__form');

  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const adress = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;

  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      adress: adress,
      city: city,
      email: email,
    },
    products: ['productId'],
  };
  return body;
}
