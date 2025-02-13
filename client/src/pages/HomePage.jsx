import React, {useState, useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Button, Checkbox, Radio } from 'antd'
import { Prices } from '../components/Prices'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart'

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [cart, setCart] = useCart();

    const getTotal = async () => {
        try {
            const {data} = await axios.get(`http://localhost:8080/api/v1/product/product-count`);
            setTotal(data?.total)
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong in getting Total Count');
        }
    }

    const loadMore = async () => {
        try {
            setLoading(true);
            const {data} = await axios.get(`http://localhost:8080/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data?.products])
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error('Something Went Wrong in loading more products');
        }
    }

    const handleFilter = (value, id) => {
        let all = [...checked];
        if(value){
            all.push(id)
        }
        else{
            all = all.filter(c => c !== id)
        }
        setChecked(all);
    }


    const getAllProducts = async () => {
        try {
            setLoading(true);
            const {data} = await axios.get(`http://localhost:8080/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products)
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error('Something Went Wrong in getting all products');
        }
    }

    const getAllCategory = async () => {
        try {
            const {data} = await axios.get(`http://localhost:8080/api/v1/category/get-category`)
            if(data?.success){
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong in getting category');
        }
    }

    const filteredProduct = async () => {
        try {
            const {data} = await axios.post(`http://localhost:8080/api/v1/product/product-filters`, {checked, radio})
            setProducts(data.products);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong in filtering products');
        }
    }

    useEffect(() => {
        getTotal();
        getAllCategory();
    }, [])

    useEffect(() => {
        if(page === 1) return;
        loadMore();
    }, [page])

    useEffect(() => {
        if(checked.length || radio.length) filteredProduct();
        if(!checked.length && !radio.length) getAllProducts();
    }, [checked, radio])

    return (
        <Layout title={"All Products - Best Offers"}>
            <div className="row mt-3">
                <div className="col-md-2">
                    <h4 className="text-center">Filter By Category</h4>
                    <div className="d-flex flex-column">
                        {
                            categories?.map(c => (
                                <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id) }>
                                    {c.name}
                                </Checkbox>
                            ))
                        }
                    </div>
                    <h4 className="text-center mt-4">Filter By Price</h4>
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {
                                Prices?.map(p => (
                                    <div key={p._id}>
                                        <Radio value={p.array}>{p.name}</Radio>
                                    </div>
                                ))
                            }
                        </Radio.Group>
                    </div>
                    <div className="d-flex flex-column">
                        <Button className='btn btn-warning' onClick={() => window.location.reload()}>Reset Filters</Button>
                    </div>
                </div>
                <div className="col-md-9">
                    <h1 className="text-center">All Products</h1>
                    <div className="d-flex flex-wrap">
                        {
                            products?.map(p => (
                                <div key={p._id} className="card m-2" style={{width: '18rem'}}>
                                    <img src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description.substring(0, 30)}</p>
                                        <p className="card-text"> $ {p.price}</p>
                                        <button className='btn btn-primary ms-1' onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
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
                    <div className='m-2 p-3'>
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
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage