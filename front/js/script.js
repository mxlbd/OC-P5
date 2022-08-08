fetch('http://localhost:3000/api/products')
  .then((res) => res.json())
  .then((data) => main(data));

function main(data) {
  const container = document.querySelector('#items');

  data.forEach((item) => {
    const object = `
        <a href="./product.html?id=${item._id}">
            <article>
                  <img src="${item.imageUrl}" alt="${item.altTxt}">
                  <h3 class="productName">${item.name}</h3>
                  <p class="productDescription">${item.description}</p>
            </article>
        </a>
        `;
    container.innerHTML += object;
  });
}
