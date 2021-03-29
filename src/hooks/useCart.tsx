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

  const addProduct = async (productId: number) => {
    try {
      // TODO

      const productIndex = cart.findIndex(product => product.id === productId);
      const product = await api.get<Product>(`products/${productId}`).then(response => response.data);

      
      if(productIndex >= 0) {
        const productStock = await api.get(`stock/${productId}`).then(response => response.data);
        const productAmount = cart[productIndex].amount;

        if(productAmount >= productStock.amount) {
          toast.error('Quantidade solicitada fora de estoque');
        } else{
          const cartUpdated = cart.map((item)=> {
            if(item.id === product.id){
              return {...item, amount: item.amount + 1}
            }

            return item
          })
          setCart(cartUpdated)
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(cartUpdated))
        }
      }else {
        product.amount = 1;
        const newCart = [...cart, product]
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
        setCart([...cart, product])
      }


      
    } catch {
      // TODO
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      const newCart = cart.filter((val)=>val.id !== productId)
      setCart(newCart)
    } catch {
      // TODO
      toast.error('Produto Removido');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO

      const productIndex = cart.findIndex(product => product.id === productId);
      const product = await api.get<Product>(`products/${productId}`).then(response => response.data);

      
      if(productIndex >= 0) {
        const productStock = await api.get(`stock/${productId}`).then(response => response.data);
    
        const cartUpdated = cart.map((item)=> {
          if(item.id === product.id){
            return {...item, amount: amount}
          }

          return item
        })

        const productAmountUpdate = cartUpdated[productIndex].amount;

        if(productAmountUpdate > productStock.amount) {
          toast.error('Quantidade solicitada fora de estoque');
        } else{
          setCart(cartUpdated)
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(cartUpdated))
        }
      }
     

    } catch {
      // TODO
      toast.error('Erro');
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
