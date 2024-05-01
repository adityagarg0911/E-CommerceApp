import React, {useState, useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'
import { toast } from 'react-toastify'
import axios from 'axios'

const Profile = () => {

    const [auth, setAuth] = useAuth();


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        const {email, name, phone, address} = auth?.user
        setName(name);
        setEmail(email);
        setPhone(phone)
        setAddress(address);
    }, [auth?.user])

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.put(
                `http://localhost:8080/api/v1/auth/profile`,
                { name, email, password, phone, address }
            );
            if(data?.error){
                toast.error(data?.message);
            }
            else{
                setAuth({...auth, user:data?.updatedUser})
                let ls = localStorage.getItem('auth');
                ls = JSON.parse(ls);
                ls.user = data.updatedUser;
                localStorage.setItem('auth', JSON.stringify(ls));
                toast.success('Profile Updated Successfully');
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong");
        }
    };

    return (
        <Layout title={'Your Profile'}>
            <div className="container-fluid p-3">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="form-container">
                            <form onSubmit={handleSubmit}>
                                <h4 className="title">USER PROFILE</h4>
                                <div className="mb-3">
                                    <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter Your Name"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter Your Email"
                                    disabled
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Your Password"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                    type="text"
                                    className="form-control"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter Your Phone No."
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                    type="text"
                                    className="form-control"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter Your Address"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile