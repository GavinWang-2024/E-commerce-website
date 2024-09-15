import React, {useEffect, useState} from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';

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
interface DecodedToken {
  user_id:number;
}
const getUserIdFromToken = (token:string):number | null =>{
  try{
    const decoded:DecodedToken = jwtDecode(token);
    return decoded.user_id;
  }
  catch(error){
    console.error('Error decoding tokens:',error);
    return null;
  }
}


const ProductDetails:React.FC = () => {
  const { id } = useParams<{id:string}>();
  const [product,setProduct]=useState<Product | null>(null);
  const [loading,setLoading]=useState<boolean>(true);
  const [error,setError]=useState<string | null>(null);
  const [isLoggedIn,setIsLoggedIn]=useState<boolean>(false);
  const [currentUserId,setCurrentUserId]=useState<number | null>(null);
  const [showEditForm,setShowEditForm]=useState<boolean>(false);
  const navigate=useNavigate();

  useEffect(()=>{
    const fetchProduct=async()=>{
      try{
        const response=await fetch(`http://127.0.0.1:8000/api/products/${id}/`);
        if(!response.ok){
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data:Product = await response.json();
        setProduct(data);
        setLoading(false);
      }catch(err){
        setError('Error fetching product');
        setLoading(false);
      }
    };

    const checkLoginStatus=()=>{
      const token=localStorage.getItem('accessToken');
      if(token){
        setIsLoggedIn(true);
        const userId=getUserIdFromToken(token);
        setCurrentUserId(userId);
      }else{
        setIsLoggedIn(false);
      }
    };
    fetchProduct();
    checkLoginStatus();
  },[id]);

  const handleDelete = async () =>{
    if(confirm('Are you sure you want to delete this product?')){
      try{
        const response=await fetch(`http://127.0.0.1:8000/api/products/${id}/`,{
          method:'DELETE',
          headers:{
            'Authorization':`Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if(!response.ok){
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        alert('Product deleted successfully');
        navigate('/products/');
      }
      catch(err){
        alert('Error deleting product');
      }
    }
  };
  const handleEdit = async (updatedProduct: Partial<Product>) => {
    try{
      const response=await fetch(`http://127.0.0.1:8000/api/products/${id}/`,{
        method:'PATCH',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem('accessToken')}`
        },
        body:JSON.stringify(updatedProduct)
      });

      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data:Product = await response.json();
      setProduct(data);
      setShowEditForm(false);
      alert("Product updated successfully");
    }
    catch (err){
      alert('Error updating product');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if(!product) return <div>No product found</div>;

  return (
    <div>
      {!showEditForm?
      (
        <>
          <h1>{product.name}</h1>
          <p>Price: ${product.price}</p>
          <p>Description: {product.description}</p>
          <p>Stock: {product.stock}</p>
          <p>Rating: {product.rating}</p>
          <p>Active: {product.isActive ? 'Yes' : 'No'}</p>
          <p>Created: {new Date(product.created_at).toLocaleDateString('en-US')}</p>
          {isLoggedIn && currentUserId === product.owner && (
            <>
              <button onClick={()=>setShowEditForm(true)} className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2'>
                Edit Product
              </button>
              <button onClick={handleDelete} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
                Delete Product
              </button>
            </>
          )}
        </>
      ):
      (
        <EditProductForm product={product} onSubmit={handleEdit} onCancel={()=>setShowEditForm(false)} />
      )}
    </div>
  )
}
interface EditProductFormProps{
  product:Product;
  onSubmit:(updatedProduct: Partial<Product>) => void;
  onCancel:()=>void;
}
const EditProductForm:React.FC<EditProductFormProps>=({product,onSubmit,onCancel})=>{
  const [name,setName]=useState(product.name);
  const [description,setDescription]=useState(product.description);
  const [price,setPrice]=useState(product.price);
  const [stock,setStock]=useState(product.stock);
  const [isActive,setIsActive]=useState(product.isActive);
  
  const handleSubmit=(e:React.FormEvent)=>{
    e.preventDefault();
    onSubmit({name,description,price,stock,isActive});
  };
  return(
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e)=>setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" value={description} onChange={(e)=>setDescription(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input type="number" id="price" value={price} onChange={(e)=>setPrice(Number(e.target.value))} required />
      </div>
      <div>
        <label htmlFor="stock">Stock:</label>
        <input type="number" id="stock" value={stock} onChange={(e)=>setStock(Number(e.target.value))} required />
      </div>
      <div>
        <label htmlFor="isActive">Active:</label>
        <input type="checkbox" id="isActive" checked={isActive} onChange={(e)=>setIsActive(e.target.checked)} />
      </div>
      <button type="submit" className="bg-green-500 text-white">Save Changes</button>
      <button type="submit" onClick={onCancel} className='bg-gray-500'>Cancel</button>
    </form>
  );
};


export default ProductDetails