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

  if (firstNameInvalid()) return;
  if (lastNameInvalid()) return;
  if (addressInvalid()) return;
  if (cityInvalid()) return;
  if (emailInvalid()) return;

  // const body = requestBody();

  // fetch('http://localhost:3000/api/products/order', {
  //   method: 'POST',
  //   body: JSON.stringify(body),
  //   headers: { 'Content-Type': 'application/json' },
  // })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     const orderId = data.orderId;
  //     window.location.href = '/html/confirmation.html' + '?orderId=' + orderId;
  //   })
  //   .catch((err) => console.error(err));
}

// véfirication du formulaire ------------------------------

function firstNameInvalid() {
  const regex = /^[a-zA-Z-]+$/;
  const firstName = document.querySelector('#firstName');
  console.log(regex.test(firstName.value));

  if (regex.test(firstName.value) == false) {
    firstName.nextElementSibling.textContent =
      'Doit contenir uniquement des lettres';
    return;
  }
}

function lastNameInvalid() {
  const regex = /^[a-zA-Z-]+$/;
  const lastName = document.querySelector('#lastName');
  console.log(regex.test(lastName.value));

  if (regex.test(lastName.value) == false) {
    lastName.nextElementSibling.textContent =
      'Doit contenir uniquement des lettres';
    return;
  }
}

function addressInvalid() {
  const regex = /^[#.0-9a-zA-Z\s,-]+$/;
  const address = document.querySelector('#address');
  console.log(regex.test(address.value));

  if (regex.test(address.value) == false) {
    address.nextElementSibling.textContent =
      'Doit contenir uniquement des chiffres et des lettres';
    return;
  }
}

function cityInvalid() {
  const regex = /^[a-zA-Z-]+$/;
  const city = document.querySelector('#city');
  console.log(regex.test(city.value));

  if (regex.test(city.value) == false) {
    city.nextElementSibling.textContent =
      'Doit contenir uniquement des lettres, sans caractères spéciaux';
    return false;
  }
  return true;
}

// Vérification si l'email est valide ----------------------

function emailInvalid() {
  const regex = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
  const email = document.querySelector('#email');
  console.log(regex.test(email.value));

  if (regex.test(email.value) == false) {
    email.nextElementSibling.textContent = 'Renseigner un email valide';
    return false;
  }
  return true;
}

// Corps du formulaire -------------------------------------

function requestBody() {
  const form = document.querySelector('.cart__order__form');

  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;

  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: idsToCache(),
  };
  return body;
}

// Donne à requestBody tous les ids du panier --------------

function idsToCache() {
  const numberItems = localStorage.length;
  const ids = [];
  for (let i = 0; i < numberItems; i++) {
    const key = localStorage.key(i);
    const id = key.split('-')[0];
    ids.push(id);
  }
  return ids;
}
