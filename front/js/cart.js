// Récupère les informations du localStorage --------------------------
const cart = [];

retrieveItems();

function retrieveItems() {
  for (let i = 0; i < localStorage.length; i++) {
    const item = localStorage.getItem(localStorage.key(i));
    const itemObject = JSON.parse(item);
    cart.push(itemObject);
  }
}

fetch(`http://localhost:3000/api/products/`)
  .then((response) => response.json())
  .then((data) => retreiveItemsAndPrice(data));

const itemAndPrice = [];
function retreiveItemsAndPrice(data) {
  for (let i = 0; i < cart.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (cart[i]._id === data[j]._id) {
        const itemObjectAndPrice = {
          id: cart[i]._id,
          color: cart[i].color,
          quantity: cart[i].quantity,
          imageUrl: cart[i].imageUrl,
          altTxt: cart[i].altTxt,
          name: cart[i].name,
          price: data[j].price,
        };
        itemAndPrice.push(itemObjectAndPrice);
      }
    }
  }
  itemAndPrice.forEach((item) => {
    displayItems(item);
  });
}

function displayItems(item) {
  const article = elementArticle(item);
  const img = elementImg(item);
  article.appendChild(img);

  const content = elementContent();
  article.appendChild(content);

  const description = elementDescription(item);
  content.appendChild(description);

  const settings = elementSettings();
  content.appendChild(settings);

  const quantity = elementQuantity(item);
  settings.appendChild(quantity);

  const deleteItem = elementDelete(item);
  settings.appendChild(deleteItem);

  displayTotalQuantity();
  displayTotalPrice(item);
}

function displayTotalQuantity() {
  const totalQuantity = document.querySelector('#totalQuantity');
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    console.log(cart[i]);
    total += cart[i].quantity;
  }
  totalQuantity.textContent = total;
}

function displayTotalPrice() {
  const totalPrice = document.querySelector('#totalPrice');
  let total = 0;
  for (let i = 0; i < itemAndPrice.length; i++) {
    total += itemAndPrice[i].price * itemAndPrice[i].quantity;
  }
  totalPrice.textContent = total;
}

function elementArticle(item) {
  const article = document
    .querySelector('#cart__items')
    .appendChild(document.createElement('article'));
  article.classList.add('cart__item');
  article.setAttribute('data-id', item.id);
  article.setAttribute('data-color', item.color);
  return article;
}

function elementImg(item) {
  const div = document.createElement('div');
  const img = document.createElement('img');
  div.appendChild(img);

  div.classList.add('cart__item__img');
  img.src = item.imageUrl;
  img.alt = item.altTxt;
  return div;
}

// altTxt: "Photo d'un canapé bleu, deux places"
// color: "Blue"
// id: "107fb5b75607497b96722bda5b504926"
// imageUrl: "http://localhost:3000/images/kanap01.jpeg"
// name: "Kanap Sinopé"
// price: 1849
// quantity: 1

function elementContent() {
  const div = document.createElement('div');
  div.classList.add('cart__item__content');
  return div;
}

function elementDescription(item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__content__description');
  const h2 = document.createElement('h2');
  h2.textContent = item.name;
  const p1 = document.createElement('p');
  p1.textContent = item.color;
  const p2 = document.createElement('p');
  p2.textContent = item.price + ' €';

  div.appendChild(h2);
  div.appendChild(p1);
  div.appendChild(p2);

  return div;
}

function elementSettings() {
  const div = document.createElement('div');
  div.classList.add('cart__item__content__settings');
  return div;
}

function elementQuantity(item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__content__settings__quantity');
  const p = document.createElement('p');
  p.textContent = 'Qté : ';
  const input = document.createElement('input');
  input.classList.add('itemQuantity');
  input.type = 'number';
  input.name = 'itemQuantity';
  input.min = '1';
  input.max = '100';
  input.value = item.quantity;
  div.appendChild(p);
  div.appendChild(input);

  input.addEventListener('input', () =>
    updateQuantity(item.id, input.value, item)
  );

  return div;
}

function updateQuantity(id, newQuantity, item) {
  const itemToUpdate = itemAndPrice.find((item) => item.id === id);
  itemToUpdate.quantity = Number(newQuantity);

  const newItem = {
    altTxt: itemToUpdate.altTxt,
    color: itemToUpdate.color,
    _id: itemToUpdate.id,
    imageUrl: itemToUpdate.imageUrl,
    name: itemToUpdate.name,
    quantity: itemToUpdate.quantity,
  };

  localStorage.setItem(id + '-' + item.color, JSON.stringify(newItem));
  displayTotalQuantity();
  displayTotalPrice(item);
  location.reload();
}

function elementDelete(item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__content__settings__delete');
  div.addEventListener('click', () => deleteItem(item));
  const p = document.createElement('p');
  p.classList.add('deleteItem');
  p.textContent = 'Supprimer';
  div.appendChild(p);
  return div;
}

function deleteItem(item) {
  const deleteItem = item;
  const article = document.querySelector(
    `article[data-id="${deleteItem.id}"][data-color="${deleteItem.color}"]`
  );
  article.remove();
  localStorage.removeItem(`${deleteItem.id}-${deleteItem.color}`);
  location.reload();
}

// Envoi du formulaire au backend au clic du bouton commander -------------

const orderButton = document.querySelector('#order');
orderButton.addEventListener('click', (e) => submitForm(e));

function submitForm(e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert('Veuillez selectionner au moins un article avant de passer commande');
    return;
  }

  if (
    firstNameValid() &&
    lastNameValid() &&
    addressValid() &&
    cityValid() &&
    emailValid()
  ) {
    const body = requestBody();

    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        const orderId = data.orderId;
        window.location.href =
          '/html/confirmation.html' + '?orderId=' + orderId;
      })
      .catch((err) => console.error(err));
  }
}

// véfirication du formulaire ------------------------------

function firstNameValid() {
  const regex = /^[a-zA-Z-]+$/;
  const firstName = document.querySelector('#firstName');

  if (!regex.test(firstName.value)) {
    firstName.nextElementSibling.textContent =
      'Doit contenir uniquement des lettres';
    return false;
  } else {
    firstName.nextElementSibling.textContent = '';
    return true;
  }
}

function lastNameValid() {
  const regex = /^[a-zA-Z-]+$/;
  const lastName = document.querySelector('#lastName');

  if (!regex.test(lastName.value)) {
    lastName.nextElementSibling.textContent =
      'Doit contenir uniquement des lettres';
    return false;
  } else {
    lastName.nextElementSibling.textContent = '';
    return true;
  }
}

function addressValid() {
  const regex = /^[#.0-9a-zA-Z\s,-]+$/;
  const address = document.querySelector('#address');

  if (!regex.test(address.value)) {
    address.nextElementSibling.textContent =
      'Doit contenir uniquement des chiffres et des lettres';
    return false;
  } else {
    address.nextElementSibling.textContent = '';
    return true;
  }
}

function cityValid() {
  const regex = /^[a-zA-Z-]+$/;
  const city = document.querySelector('#city');

  if (!regex.test(city.value)) {
    city.nextElementSibling.textContent =
      'Doit contenir uniquement des lettres, sans caractères spéciaux';
    return false;
  } else {
    city.nextElementSibling.textContent = '';
    return true;
  }
}

// Vérification si l'email est valide ----------------------

function emailValid() {
  const regex = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
  const email = document.querySelector('#email');

  if (!regex.test(email.value)) {
    email.nextElementSibling.textContent = 'Renseigner un email valide';
    return false;
  } else {
    email.nextElementSibling.textContent = '';
    return true;
  }
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
