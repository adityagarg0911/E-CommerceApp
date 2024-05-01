import React, {useState, useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';

const CategoryProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [cart, setCart] = useCart();
    

    const getProductsByCat = async () => {
        try {
            const {data} = await axios.get(`http://localhost:8080/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong in getting products by category')
        }
    }

    useEffect(() => {
        if(params?.slug) getProductsByCat();
    }, [params?.slug])

    return (
        <Layout>
            <div className="container mt-3">
                <h3 className='text-center'>Category - {category?.name}</h3>
                <h5 className='text-center'>{products?.length} Result Found</h5>

                <div className="row">
                    <div className="col-md-9">
                        <div className="d-flex flex-wrap">
                            {
                                products?.map(p => (
                                    <div key={p._id} className="card m-2" style={{width: '18rem'}}>
                                        <img src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text">{p.description.substring(0, 30)}</p>
                                            <p className="card-text"> $ {p.price}</p>
                                            <button className='btn btn-primary ms-1' onClick={() => navigate(`product/${p.slug}`)}>More Details</button>
                                            <button 
                                                className='btn btn-secondary ms-1' 
                                                onClick={() => {
                                                    setCart([...cart, p]);
                                                    localStorage.setItem('cart', JSON.stringify([...cart, p]))
                                                    toast.success('Item added to cart')
                                                }}
                                            >
                                                Add To Cart
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        {/* <div className='m-2 p-3'>
                            {products && products.length < total && (
                                <Button className='btn btn-warning' 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(page+1);
                                    }}
                                >
                                    {loading ? "Loading..." : "Load More"}
                                </Button>
                            )}
                        </div> */}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct