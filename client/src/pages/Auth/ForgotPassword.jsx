import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import {toast} from 'react-toastify';

import '../../styles/AuthStyles.css'
import Layout from "../../components/Layout/Layout";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `http://localhost:8080/api/v1/auth/forgot-password`,
                { email, newPassword, answer}
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
        <Layout title={'Forgot Password'}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h4 className="title">RESET PASSWORD</h4>
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
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter Your New Password"
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
                        Reset
                    </button>
                </form>
            </div>
        </Layout>
    )
}

export default ForgotPassword