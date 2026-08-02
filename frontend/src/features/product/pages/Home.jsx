import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct';

const Home = () => {

  const {handleGetAllProducts} = useProduct();
  const products = useSelector((state) => state.product.products);


  useEffect(() => {
    handleGetAllProducts();
  },[]);
  console.log(products);


  return (
    <div>Home</div>
  )
}

export default Home