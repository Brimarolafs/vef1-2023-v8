import { formatNumber } from './helpers.js';

/**
 *
 * @param {import('../main.js').Product} product 
 * @param {number} quantity
 * @returns {HTMLTableRowElement}
 * 
 * 
*/
export function createCartLine(product, quantity) {

 
  const cartLineElement = document.createElement('tr');
  // cartLineElement.setAttribute('data-cart-product-id', product.id);
  cartLineElement.dataset.cartProductId = product.id.toString();
  const titleElement = document.createElement('td');
  titleElement.textContent = product.title;
  cartLineElement.appendChild(titleElement);

  const quantityElement = document.createElement('td');
  quantityElement.textContent = quantity.toString();
  cartLineElement.appendChild(quantityElement);

  const priceElement = document.createElement('td');
  const priceSpanElement = document.createElement('span');
  priceSpanElement.classList.add('price');
  priceSpanElement.textContent = formatNumber(product.price);
  priceElement.appendChild(priceSpanElement);
  cartLineElement.appendChild(priceElement);

  const totalPriceElement = document.createElement('td');
  const totalPriceSpanElement = document.createElement('span');

  totalPriceSpanElement.classList.add('price');
  totalPriceSpanElement.textContent = formatNumber(product.price * quantity);
  totalPriceElement.appendChild(totalPriceSpanElement);
  cartLineElement.appendChild(totalPriceElement);

  const formTDElement = document.createElement('td');
  const formElement = document.createElement('form');
  const buttonElement = document.createElement('button');
  buttonElement.textContent = 'Eyða';
  formElement.appendChild(buttonElement);
  formTDElement.appendChild(formElement);
  cartLineElement.appendChild(formTDElement);


  // TODO hér þarf að búa til eventListener sem leyfir að eyða línu úr körfu

  const removeButton = cartLineElement.querySelector('button');
  removeButton.addEventListener('click', (e) => {
    e.preventDefault();
    // remove the cart line element
    cartLineElement.remove();
    const cartTableBodyElement = document.querySelector('.cart table tbody');


    // TODO update the cart total element after removing the product
    // get the cart total element
    const cartTotalElement = document.querySelector('.cart-total');
    if (!cartTotalElement) {
      console.warn('fann ekki .cart-total span');
      return;
    }
    // get all the cart line elements
    const cartLineElements = cartTableBodyElement.querySelectorAll('tr');
    // initialize a variable to store the new total amount
    let newTotalAmount = 0;
    // loop through each cart line element and get the product price and quantity
    for (const cartLineElementTotal of cartLineElements) {
      const priceElement = cartLineElementTotal.querySelector('td:nth-child(3)');
      const quantityElement = cartLineElementTotal.querySelector('td:nth-child(2)');
      if (!priceElement || !quantityElement) {
        console.warn('fann ekki priceElement eða quantityElement');
        continue;
      }
      // parse the price and quantity as numbers
      const price = Number.parseFloat(priceElement.textContent.replace('ISK', '').replace(',', ''));
      const quantity = Number.parseInt(quantityElement.textContent);
      // add the product of price and quantity to the new total amount
      newTotalAmount += price * quantity;
    }
    showCartContent(newTotalAmount > 0);

    // update the cart total element with the formatted new total amount
    cartTotalElement.textContent = formatNumber(newTotalAmount);
    
  });


  return cartLineElement;
}


/**
 * Sýna efni körfu eða ekki.
 * @param {boolean} show Sýna körfu eða ekki
 */
export function showCartContent(show = true) {
  // Finnum element sem inniheldur körfuna
  const cartElement = document.querySelector('.cart');

  if (!cartElement) {
    console.warn('fann ekki .cart');
    return;
  }

  const emptyMessage = cartElement.querySelector('.empty-message');
  const cartContent = cartElement.querySelector('.cart-content');

  if (!emptyMessage || !cartContent) {
    console.warn('fann ekki element');
    return;
  }

  if (show) {
    emptyMessage.classList.add('hidden');
    cartContent.classList.remove('hidden');
  } else {
    emptyMessage.classList.remove('hidden');
    cartContent.classList.add('hidden');
  }
}

/**
 * Búa til element fyrir körfu
 * @returns {HTMLDivElement}
 * @param {string} name
 * @param {string} address
*/
// TODO hér þarf að búa til export fyrir ganga frá kaupum
export function createReceipt(name, address) {
  const Receipt = document.createElement('div');
  Receipt.classList.add('receipt');
  const nameElement = document.createElement('td');
  nameElement.textContent = name;
  Receipt.appendChild(nameElement);
  const addressElement = document.createElement('td');
  addressElement.textContent = address;
  Receipt.appendChild(addressElement);
  
  return Receipt;


}


