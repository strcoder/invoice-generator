import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBU5omdfu-3aa04NgmQIhIp4sgzNybUc5U',
  authDomain: 'invoice-generator-cbb07.firebaseapp.com',
  projectId: 'invoice-generator-cbb07',
  storageBucket: 'invoice-generator-cbb07.appspot.com',
  messagingSenderId: '648307851518',
  appId: '1:648307851518:web:4587ad24f312af8e1d65af',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getProducts = async () => {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  const productList = productSnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id }
  });
  return productList;
};

const cart = [];

const addItem = (el, count) => {
  if (count >= 10) {
    el.innerText = count;
    return count;
  }
  el.innerText = count + 1;
  return count + 1;
}

const removeItem = (el, count) => {
  if (count <= 1) {
    el.innerText = count;
    return count;
  }
  el.innerText = count - 1;
  return count - 1;
}

const addToCart = ({ product, quantity }) => {
  const isInCart = cart.find((item) => item.id === product.id)
  if (isInCart) {
    isInCart.quantity += quantity;
    return;
  }
  cart.push({ ...product, quantity });
}

const removeToCart = ({ id }) => {
  
}

const productCard = ({ id, product, src, price }) => {
  let count = 1;
  const obj = { id, name: product, price, image: src };
  const container = document.createElement('div');
  const body = document.createElement('div');
  const counterContainer = document.createElement('div');
  const counter = document.createElement('p');
  const footer = document.createElement('div');
  const imageContainer = document.createElement('figure');
  const image = document.createElement('img');
  const nameContainer = document.createElement('p');
  const name = document.createElement('strong');
  const priceEl = document.createElement('p');
  const cta = document.createElement('button');
  const add = document.createElement('button');
  const remove = document.createElement('button');

  container.className = 'ProductCard';
  body.className = 'ProductCard__body';
  footer.className = 'ProductCard__footer';
  imageContainer.className = 'ProductCard__image';
  nameContainer.className = 'single-line';
  cta.className = 'btn-outline';
  add.className = 'btn-link';
  remove.className = 'btn-link';
  counterContainer.className = 'ProductCard__body--counter';

  image.src = src;
  image.alt = product;
  image.loading= 'lazy';

  name.innerText = product;
  priceEl.innerHTML = `Price: $${price}`;
  cta.type = 'button';
  cta.innerText = 'Add to cart';
  add.type = 'button';
  add.innerText = '+';
  remove.type = 'button';
  remove.innerText = '-';
  counter.innerHTML = count;

  counterContainer.appendChild(remove)
  counterContainer.appendChild(counter)
  counterContainer.appendChild(add)
  imageContainer.appendChild(image);
  nameContainer.appendChild(name);
  body.appendChild(nameContainer);
  body.appendChild(priceEl);
  body.appendChild(counterContainer)
  footer.appendChild(cta);
  container.appendChild(imageContainer);
  container.appendChild(body);
  container.appendChild(footer);

  add.addEventListener('click', () => count = addItem(counter, count));
  remove.addEventListener('click', () => count = removeItem(counter, count));
  cta.addEventListener('click', () => addToCart({ product: obj, quantity: count }))

  return container;
};

const list = document.getElementById('List');
const modal = document.getElementById('Modal');
const btnCard = document.getElementById('CartBtn');

const products = getProducts();

products.then((data) => {
  if (Array.isArray(data)) {
    data.map((item) => {
      list.appendChild(productCard({
        id: item.id,
        src: item.image,
        price: item.price,
        product: item.name,
      }));
      return item;
    });
  } else {
    list.innerHTML = 'No hay elementos'
  }
});

const showModal = () => {
  modal.style.display = 'grid';
}

const invoiceHeader = () => {
  const component = document.createElement('div');
  const item = document.createElement('p');
  const total = document.createElement('p');
  const count = document.createElement('p');
  const cost = document.createElement('p');

  component.className = 'InvoiceModal__body--header'

  item.innerText = 'Product';
  count.innerText = 'Quantity';
  cost.innerText = 'Price';
  total.innerText = 'Total';

  component.appendChild(item);
  component.appendChild(cost);
  component.appendChild(count);
  component.appendChild(total);
  return component;
}

const invoiceItem = ({ product, quantity, price }) => {
  const component = document.createElement('div');
  const item = document.createElement('p');
  const total = document.createElement('p');
  const count = document.createElement('p');
  const cost = document.createElement('p');

  component.className = 'InvoiceModal__body--item'

  item.innerText = product;
  count.innerText = quantity;
  cost.innerText = `$${price}`;
  total.innerText = `$${price * quantity}`;

  component.appendChild(item);
  component.appendChild(cost);
  component.appendChild(count);
  component.appendChild(total);
  return component;
}

const invoiceFooter = () => {
  const container = document.createElement('div');
  const total = document.createElement('p');
  const list = cart.map((item) => item.price * item.quantity);
  const sum = list.reduce((a, b) => a + b);

  container.className = 'InvoiceModal__body--footer';

  console.log(sum);
  total.innerText = `Total to pay: $${sum}`;

  container.appendChild(total);
  return container;
}

const showInvoice = () => {
  const container = document.createElement('section');
  const header = document.createElement('section');
  const body = document.createElement('section');
  const headerTitle = document.createElement('p');
  const headerClose = document.createElement('button');

  container.className = 'InvoiceModal';
  header.className = 'InvoiceModal__header';
  body.className = 'InvoiceModal__body';
  headerClose.className = 'btn-link';

  headerTitle.innerText = 'Factura';
  headerClose.innerText = 'x';

  body.appendChild(invoiceHeader());
  cart.map((item) => {
    body.appendChild(invoiceItem({
      price: item.price,
      product: item.name,
      quantity: item.quantity,
    }));
    return item;
  });
  body.appendChild(invoiceFooter());

  headerClose.addEventListener('click', () => modal.removeChild(container));

  header.appendChild(headerTitle);
  header.appendChild(headerClose);
  container.appendChild(header);
  container.appendChild(body);
  modal.appendChild(container);
  showModal();
}

btnCard.addEventListener('click', showInvoice)
modal.addEventListener('click', () => modal.style.display = 'none')

