import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();


  const cartFormatted = cart.map(product => (
    {
      id: product.id,
      priceFormatted: formatPrice(product.price),
      subTotal: formatPrice(product.price * product.amount)
    }
  ))


  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
         // TODO
         sumTotal += product.price*product.amount
         return sumTotal 
       }, 0)
     )
  
 

  function handleProductIncrement(product: Product) {
    // TODO 
    const itemUpdate = {...product, amount: product.amount+1}
    updateProductAmount({productId:itemUpdate.id, amount:itemUpdate.amount});
  }

  function handleProductDecrement(product: Product) {
    // TODO
    const itemUpdate = {...product, amount: product.amount-1}
    
    updateProductAmount({productId:itemUpdate.id, amount:itemUpdate.amount});
  }

  function handleRemoveProduct(productId: number) {
    // TODO
     removeProduct(productId);
  }


  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cart.map((cart)=>{
            return (
              <tr data-testid="product" key={cart.id}>
              <td>
                <img src={cart.image} alt={cart.title} />
              </td>
              <td>
                <strong>{cart.title}</strong>
                <span>{formatPrice(cart.price)}</span>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    data-testid="decrement-product"
                    disabled={cart.amount <= 1}
                    onClick={() => handleProductDecrement(cart)}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </button>
                  <input
                    type="text"
                    data-testid="product-amount"
                    readOnly
                    value={cart.amount}
                  />
                  <button
                    type="button"
                    data-testid="increment-product"
                    onClick={() => handleProductIncrement(cart)}
                  >
                    <MdAddCircleOutline size={20} />
                  </button>
                </div>
              </td>
              <td>
                <strong>{cartFormatted.map((val)=>{
                  if(val.id === cart.id){
                    return val.subTotal
                  }
                })}</strong>
              </td>
              <td>
                <button
                  type="button"
                  data-testid="remove-product"
                  onClick={() => handleRemoveProduct(cart.id)}
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
            )
          })}

        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
