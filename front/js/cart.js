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

let itemAndPrice = [];
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
  let article = elementArticle(item);
  let img = elementImg(item);
  article.appendChild(img);

  let content = elementContent();
  article.appendChild(content);

  let description = elementDescription(item);
  content.appendChild(description);

  let settings = elementSettings();
  content.appendChild(settings);

  let quantity = elementQuantity(item);
  settings.appendChild(quantity);

  let deleteItem = elementDelete(item);
  settings.appendChild(deleteItem);

  displayTotalQuantity();
  displayTotalPrice(item);
}

function displayTotalQuantity() {
  let totalQuantity = document.querySelector('#totalQuantity');

  let value = document.querySelectorAll('.itemQuantity');
  let total = 0;
  for (let i = 0; i < value.length; i++) {
    total += Number(value[i].value);
  }

  totalQuantity.textContent = total;
}

function displayTotalPrice() {
  let totalPrice = document.querySelector('#totalPrice');
  let total = 0;
  for (let i = 0; i < itemAndPrice.length; i++) {
    total += itemAndPrice[i].price * itemAndPrice[i].quantity;
  }
  totalPrice.textContent = total;
}

function elementArticle(item) {
  let article = document
    .querySelector('#cart__items')
    .appendChild(document.createElement('article'));
  article.classList.add('cart__item');
  article.setAttribute('data-id', item.id);
  article.setAttribute('data-color', item.color);
  return article;
}

function elementImg(item) {
  let div = document.createElement('div');
  let img = document.createElement('img');
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
  let div = document.createElement('div');
  div.classList.add('cart__item__content');
  return div;
}

function elementDescription(item) {
  let div = document.createElement('div');
  div.classList.add('cart__item__content__description');
  let h2 = document.createElement('h2');
  h2.textContent = item.name;
  let p1 = document.createElement('p');
  p1.textContent = item.color;
  let p2 = document.createElement('p');
  p2.textContent = item.price + ' €';

  div.appendChild(h2);
  div.appendChild(p1);
  div.appendChild(p2);

  return div;
}

function elementSettings() {
  let div = document.createElement('div');
  div.classList.add('cart__item__content__settings');
  return div;
}

function elementQuantity(item) {
  let div = document.createElement('div');
  div.classList.add('cart__item__content__settings__quantity');
  let p = document.createElement('p');
  p.textContent = 'Qté : ';
  let input = document.createElement('input');
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
  let itemToUpdate = itemAndPrice.find((item) => item.id === id);
  itemToUpdate.quantity = Number(newQuantity);

  let newItem = {
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
}

function elementDelete(item) {
  let div = document.createElement('div');
  div.classList.add('cart__item__content__settings__delete');
  div.addEventListener('click', () => deleteItem(item));
  let p = document.createElement('p');
  p.classList.add('deleteItem');
  p.textContent = 'Supprimer';
  div.appendChild(p);
  return div;
}

function deleteItem(item) {
  let deleteItem = item;
  let article = document.querySelector(
    `article[data-id="${deleteItem.id}"][data-color="${deleteItem.color}"]`
  );
  article.remove();
  localStorage.removeItem(`${deleteItem.id}-${deleteItem.color}`);
  displayTotalQuantity();
  displayTotalPrice();
  location.reload();
}

// Envoi du formulaire au backend au clic du bouton commander -------------

let orderButton = document.querySelector('#order');
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
    let body = requestBody();

    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        let orderId = data.orderId;
        window.location.href =
          '/html/confirmation.html' + '?orderId=' + orderId;
      })
      .catch((err) => console.error(err));
  }
}

// véfirication du formulaire ------------------------------

function firstNameValid() {
  let regex = /^[a-zA-Z-]+$/;
  let firstName = document.querySelector('#firstName');

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
  let regex = /^[a-zA-Z-]+$/;
  let lastName = document.querySelector('#lastName');

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
  let regex = /^[#.0-9a-zA-Z\s,-]+$/;
  let address = document.querySelector('#address');

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
  let regex = /^[a-zA-Z-]+$/;
  let city = document.querySelector('#city');

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
  let regex = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
  let email = document.querySelector('#email');

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
  let form = document.querySelector('.cart__order__form');

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
  let numberItems = localStorage.length;
  const ids = [];
  for (let i = 0; i < numberItems; i++) {
    let key = localStorage.key(i);
    let id = key.split('-')[0];
    ids.push(id);
  }
  return ids;
}
