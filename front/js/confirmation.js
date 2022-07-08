const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');

displayOrder();
clearCache();

function displayOrder() {
  const order = document.querySelector('#orderId');
  order.textContent = orderId;
}

function clearCache() {
  window.localStorage.clear();
}
