fetch('http://localhost:3000/api/products')
  .then((res) => res.json())
  .then((data) => main(data));

function main(data) {
  for (let i = 0; i < data.length; i++) {
    const { _id, name, imageUrl, description, altTxt } = data[i];
    const article = document
      .querySelector('#items')
      .appendChild(document.createElement('a'))
      .appendChild(document.createElement('article'));
    article.parentNode.setAttribute('href', 'product.html?id=' + _id);
    const img = image(imageUrl, altTxt);
    const h3 = title(name);
    const p = paragraph(description);

    appendChild(article, [img, h3, p]);
  }
}

function appendChild(article, array) {
  array.forEach((element) => {
    article.appendChild(element);
  });
}

function image(imageUrl, altTxt) {
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = altTxt;
  return img;
}

function title(name) {
  const title = document.createElement('h3');
  title.classList.add('productName');
  title.textContent = name;
  return title;
}

function paragraph(description) {
  const p = document.createElement('p');
  p.classList.add('productDescription');
  p.textContent = description;
  return p;
}
