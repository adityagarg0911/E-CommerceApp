import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {toast} from 'react-toastify';

import logo from '/images/logo.png';
import { useAuth } from '../../context/auth';
import SearchInput from '../Form/SearchInput';

import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';

import { Badge } from 'antd';

const Header = () => {
    const [auth, setAuth] = useAuth();
    const [cart] = useCart();
    const categories = useCategory();

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: ''
        })
        localStorage.removeItem('auth');
        toast.success('Logged Out succesfully');
    }

    return (
        <>
           <nav className="navbar navbar-expand-lg bg-body-tertiary pt-2">
                <div className="container-fluid">
                    <button className="navbar-toggler" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#navbarTogglerDemo01" 
                            aria-controls="navbarTogglerDemo01" 
                            aria-expanded="false" 
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <Link to='/' className="navbar-brand"> <img src={logo} alt="" /> Shopping Stop</Link>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <SearchInput />
                            <li className="nav-item">
                                <NavLink to='/' className="nav-link" >Home</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to={'/categories'} data-bs-toggle="dropdown">
                                    Categories
                                </Link>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link className="dropdown-item" to={`/categories`}>
                                            All Categories
                                        </Link>
                                    </li>
                                {
                                    categories?.map(c => (
                                        <li key={c._id}>
                                            <Link className="dropdown-item" to={`/category/${c.slug}`}>{c.name}</Link>
                                        </li>
                                    ))
                                }
                                </ul>
                            </li>
                            {
                                !auth.user ? (
                                    <>
                                        <li className="nav-item">
                                            <NavLink to='/register' className="nav-link" >Register</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to='/login' className="nav-link" >Login</NavLink>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item dropdown">
                                            <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown" >
                                                {auth?.user?.name}
                                            </Link>
                                            <ul className="dropdown-menu">
                                                <li><NavLink to={`/dashboard/${(Number)(auth?.user?.role) === (Number)(1) ? 'admin' : 'user'}`} className="dropdown-item">Dashboard</NavLink></li>
                                                <li><NavLink onClick={handleLogout} to='/login' className="dropdown-item" >Logout</NavLink></li>
                                            </ul>
                                        </li>
                                    </>
                                )
                            }
                            <li className="nav-item">
                                <Badge count={cart?.length} showZero>
                                    <NavLink style={{fontSize: "1.1rem", fontWeight: "900"}} to="/cart" className="nav-link">
                                        Cart
                                    </NavLink>
                                </Badge>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header