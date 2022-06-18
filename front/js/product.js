const url = new URLSearchParams(document.location.search).get('id');

fetch(`http://localhost:3000/api/products/${url}`)
  .then((response) => response.json())
  .then((data) => main(data));

function main(data) {
  const { _id, name, imageUrl, description, altTxt, price, colors } = data;
  itemImg(imageUrl, altTxt);
  document.querySelector('#title').textContent = name;
  document.querySelector('#price').textContent = price;
  document.querySelector('#description').textContent = description;
  colorSelect(colors);
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
