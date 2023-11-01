import { createCartLine, showCartContent } from './lib/ui.js';
import { formatNumber } from './lib/helpers.js';

/**
 * @typedef {object} Product
 * @property {number} id Auðkenni vöru
 * @property {string} title Titill vöru
 * @property {string} description Lýsing vöru
 * @property {number} price Verð vöru
 */

const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];

/** Bæta vöru í körfu */
/**
 *
 * @param {Product} product 
 * @param {number} quantity
 * 
*/
function addProductToCart(product, quantity) {
  const cartTableBodyElement = document.querySelector('.cart table tbody');

  if (!cartTableBodyElement) {
    console.warn('fann ekki .cart');
    return;
  }
  
  // TODO hér þarf að athuga hvort lína fyrir vöruna sé þegar til
  
  const cartLine = createCartLine(product, quantity);
  // check if cartLine is already in cart and if so update quantity by adding new quantity to old quantity
  const cartLineElement = cartTableBodyElement.querySelector(`[data-cart-product-id="${product.id}"]`);
  if (cartLineElement) {
    const quantityElement = cartLineElement.querySelector('td:nth-child(2)');
    if (!quantityElement) {
      console.warn('fann ekki quantityElement');
      return;
    }
    const quantityElementValue = Number.parseInt(quantityElement.textContent);
    const newQuantity = quantityElementValue + quantity;
    quantityElement.textContent = newQuantity.toString();
    const totalPriceElement = cartLineElement.querySelector('td:nth-child(4) span');
    if (!totalPriceElement) {
      console.warn('fann ekki totalPriceElement');
      return;
    }
    totalPriceElement.textContent = formatNumber(product.price * newQuantity);
    
  } else {
    // append the cart line only if it does not exist
    cartTableBodyElement.appendChild(cartLine);
  }

  // Sýna efni körfu
  showCartContent(true);

  // TODO show/update cart total by taking the quantity of the product and multiplying it with the price of the product and adding it to the total
  const cartTotalElement = document.querySelector('.cart-total');
  if (!cartTotalElement) {
    console.warn('fann ekki .cart-total span');
    return;
  }

  const cartLineElements = cartTableBodyElement.querySelectorAll('tr');
  let totalAmount = 0;
  for (const cartLineElement of cartLineElements) {
    const priceElement = cartLineElement.querySelector('td:nth-child(3)');
    const quantityElement = cartLineElement.querySelector('td:nth-child(2)');
    if (!priceElement || !quantityElement) {
      console.warn('fann ekki priceElement eða quantityElement');
      continue;
    }
    
    const price = Number.parseFloat(priceElement.textContent.replace('ISK', '').replace(',', ''));
    const quantity = Number.parseInt(quantityElement.textContent);
    // add the product of price and quantity to the total amount
    totalAmount += price * quantity;
  }
  
  cartTotalElement.textContent = formatNumber(totalAmount);
}



function submitHandler(event) {
  // Komum í veg fyrir að form submiti
  event.preventDefault();
  
  // Finnum næsta element sem er `<tr>`
  const parent = event.target.closest('tr')

  // Það er með attribute sem tiltekur auðkenni vöru, t.d. `data-product-id="1"`
  const productId = Number.parseInt(parent.dataset.productId);

  // Finnum vöru með þessu productId
  const product = products.find((i) => i.id === productId);

  if (!product) {
    console.warn('fann ekki vöru');
    return;
  }
  // TODO hér þarf að finna fjölda sem á að bæta við körfu með því að athuga
  // á input
  const quantity = Number.parseInt(parent.querySelector('input').value);

  // Bætum vöru í körfu (hér væri gott að bæta við athugun á því að varan sé til)
  addProductToCart(product, quantity);
}

// Finna öll form með class="add"
const addToCartForms = document.querySelectorAll('.add')

// Ítra í gegnum þau sem fylki (`querySelectorAll` skilar NodeList)
for (const form of Array.from(addToCartForms)) {
  // Bæta submit event listener við hvert
  form.addEventListener('submit', submitHandler);
}

// TODO bæta við event handler á form sem submittar pöntun
