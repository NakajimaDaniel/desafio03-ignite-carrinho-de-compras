import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
       return JSON.parse(storagedCart);
    }

    return [];
  });

  console.log(cart)
  const addProduct = async (productId: number) => {
    try {
      // TODO

      const productIndex = cart.findIndex(product => product.id === productId);
      const product = await api.get<Product>(`products/${productId}`).then(response => response.data);
      console.log(productIndex)
      
      if(productIndex >= 0) {
        const productStock = await api.get(`stock/${productId}`).then(response => response.data);
        const productAmount = cart[productIndex].amount;
        if(productAmount > productStock) {
          toast.error('Quantidade solicitada fora de estoque');
        } else{
          product.amount += 1;
          const addItemCart = [product];
          console.log(addItemCart)
        }
      }else {
        product.amount = 1;
        const newCart = [...cart, product]
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
        setCart([...cart, product])
      }


      
    } catch {
      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
