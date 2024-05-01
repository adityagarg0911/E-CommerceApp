import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import {toast} from 'react-toastify';
import '../../styles/AuthStyles.css'

import Layout from "../../components/Layout/Layout";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(
            `http://localhost:8080/api/v1/auth/register`,
            { name, email, password, phone, address, answer }
        );
        if(res && res.data.success){
            toast.success(res.data && res.data.message);
            navigate('/login');
        }
        else{
            toast.error(res.data.message);
        }
        

    } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong");
    }
  };

  return (
    <Layout title="Register">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
            <h4 className="title">REGISTER FORM</h4>
            <div className="mb-3">
                <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Your Name"
                required
                />
            </div>
            <div className="mb-3">
                <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
                />
            </div>
            <div className="mb-3">
                <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                required
                />
            </div>
            <div className="mb-3">
                <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter Your Phone No."
                required
                />
            </div>
            <div className="mb-3">
                <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Your Address"
                required
                />
            </div>
            <div className="mb-3">
                <input
                type="text"
                className="form-control"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter Your Favourite Song Name"
                required
                />
            </div>
            <button type="submit" className="btn btn-primary">
                Register
            </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
