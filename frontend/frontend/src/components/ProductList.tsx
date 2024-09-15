import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
interface Product {
    id:number;
    name:string;
    description:string;
    price:number;
    stock:number;
    created_at:string;
    updated:string;
    isActive:boolean;
    rating:number;
    owner:number;
}

const ProductList: React.FC = () => {
    const [products,setProducts]=useState<Product[]>([]);
    const [loading,setLoading]=useState<boolean>(true);
    const [error,setError]=useState<string | null>(null);

    useEffect(()=>{
        const fetchProducts = async () => {
            try{
                const response = await fetch ('http://127.0.0.1:8000/api/products/');
                if (!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data:Product[]=await response.json();
                setProducts(data);
                setLoading(false);
            }
            catch(err){
                setError('Error fetching products');
                setLoading(false);
            }
        };
        fetchProducts();
    },[]);
    
    const addToCart = async (productId:number) => {
        try{
            const response= await fetch('http://127.0.0.1:8000/api/add-to-cart/',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${localStorage.getItem('accessToken')}` //maybe getItem('token')
                },
                body: JSON.stringify({product_id:productId,quantity:1})
            });
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data=await response.json();
            alert('Product added to cart');
        }
        catch(err){
            console.error('Error adding product to cart:', err);
            alert('Failed to add product to cart. Please try again.');
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>


    
    return (
        <div className=''>
            <h2 className='text-center'>Products</h2>
            {products.map((item)=>(
                <div key={item.id} className='py-4'>
                    <h3>{item.name}</h3>
                    <p>Price: ${item.price}</p>
                    <p>Rating: {item.rating}</p>
                    <p>Created: {new Date(item.created_at).toLocaleDateString('en-US')}</p>

                    <p>Owner_id:{item.owner}</p>
                    <Link to={`/products/${item.id}`} className='text-blue-500 hover:underline'>View Details</Link>
                    <button onClick={()=>addToCart(item.id)} className='ml-4'>
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    )
}

export default ProductList