// Stocker les informations du localStorage ---------------------------
const cart = [];

retrieveItems();

// Défini une boucle pour appliquer le code à tous les articles -------

cart.forEach((item) => displayItem(item));

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

  const divGFOne = divGF1(item);
  article.appendChild(divGFOne);

  const divGFTwo = divGF2(item);
  article.appendChild(divGFTwo);

  const divFOne = divF1(item);
  divGFTwo.appendChild(divFOne);

  const divFTwo = divF2();
  divGFTwo.appendChild(divFTwo);

  const divCOne = divC1(item);
  divFTwo.appendChild(divCOne);

  const divCTwo = divC2();
  divFTwo.appendChild(divCTwo);

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
// Première Div (Grand Father 1) --------------------------------

function divGF1(item) {
  const divGrandFather1 = document.createElement('div');
  divGrandFather1.classList.add('cart__item__img');

  const img = document.createElement('img');
  img.src = item.imageUrl;
  img.alt = item.altTxt;

  divGrandFather1.appendChild(img);

  return divGrandFather1;
}

// Deuxième Div (Grand father 2) --------------------------------

function divGF2() {
  const divGrandFather2 = document.createElement('div');
  divGrandFather2.classList.add('cart__item__content');

  return divGrandFather2;
}

// Première Div (Father 1) --------------------------------------

function divF1(item) {
  const divFather1 = document.createElement('div');
  divFather1.classList.add('cart__item__content__description');

  const name = document.createElement('h2');
  name.textContent = item.name;
  const color = document.createElement('p');
  color.textContent = item.color;
  const price = document.createElement('p');
  price.textContent = item.price + ' €';

  divFather1.appendChild(name);
  divFather1.appendChild(color);
  divFather1.appendChild(price);

  return divFather1;
}

// Deuxième Div (Father 2) --------------------------------------

function divF2() {
  const divFather2 = document.createElement('div');
  divFather2.classList.add('cart__item__content__settings');

  return divFather2;
}

// Première Div (Child 1) ---------------------------------------

function divC1(item) {
  const divChild1 = document.createElement('div');
  divChild1.classList.add('cart__item__content__settings__quantity');

  const paragraph = document.createElement('p');
  paragraph.innerHTML = 'Qté : ';

  const input = document.createElement('input');
  input.type = 'number';
  input.classList.add('itemQuantity');
  input.name = 'itemQuantity';
  input.min = '1';
  input.max = '100';
  input.value = item.quantity;

  divChild1.appendChild(paragraph);
  divChild1.appendChild(input);

  return divChild1;
}

// Deuxième Div (Child 2) --------------------------------------

function divC2() {
  const divChild2 = document.createElement('div');
  divChild2.classList.add('cart__item__content__settings__delete');

  const paragraph = document.createElement('p');
  paragraph.classList.add('deleteItem');
  paragraph.textContent = 'Supprimer';

  divChild2.appendChild(paragraph);

  return divChild2;
}
