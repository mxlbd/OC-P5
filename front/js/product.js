const id = new URLSearchParams(document.location.search).get('id');
let numberPrice = 0;
let altText;
let imgUrl;
let nameSofa;

fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((data) => main(data));

function main(data) {
  const { name, imageUrl, description, altTxt, price, colors } = data;
  itemImg(imageUrl, altTxt);
  document.querySelector('#title').textContent = name;
  document.querySelector('#price').textContent = price;
  numberPrice = price;
  document.querySelector('#description').textContent = description;
  colorSelect(colors);
  altText = altTxt;
  imgUrl = imageUrl;
  nameSofa = name;
  buttonAddToCart();
}

function itemImg(imageUrl, altTxt) {
  const image = document
    .querySelector('.item__img')
    .appendChild(document.createElement('img'));
  image.src = imageUrl;
  image.alt = altTxt;
}

function colorSelect(colors) {
  const select = document.querySelector('#colors');
  if (select !== null) {
    colors.forEach((color) => {
      const option = document.createElement('option');
      option.value = color;
      option.textContent = color;
      select.appendChild(option);
    });
  }
}

function buttonAddToCart() {
  const button = document.querySelector('#addToCart');
  button.addEventListener('click', () => {
    const color = document.querySelector('#colors').value;
    const quantity = document.querySelector('#quantity').value;
    if (
      color === null ||
      color === '' ||
      quantity === null ||
      quantity == '0'
    ) {
      alert('Veuillez choissir une quantité et une couleur');
    } else {
      const data = {
        id: id,
        color: color,
        quantity: Number(quantity),
        price: numberPrice,
        imageUrl: imgUrl,
        altTxt: altText,
        name: nameSofa,
      };
      localStorage.setItem(id + '-' + color, JSON.stringify(data));
      window.location.href = 'cart.html';
    }
  });
}
