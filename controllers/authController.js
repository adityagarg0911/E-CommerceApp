import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from 'jsonwebtoken';

export const registerController = async (req, res) => {
    try {
        const {name, email, password, phone, address, answer} = req.body;

        // VALIDATIONS
        if(!name) return res.send({message: 'Name is Required'});
        if(!email) return res.send({message: 'Email is Required'});
        if(!password) return res.send({message: 'Password is Required'});
        if(!phone) return res.send({message: 'Phone No. is Required'});
        if(!address) return res.send({message: 'Address is Required'});
        if(!answer) return res.send({message: 'Answer is Required'});
        
        //CHECK FOR EXISTING USER
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(200).send({
                success: false,
                message: 'Already Registered, Please login'
            })
        }

        // REGISTER USER
        const hashedPassword = await hashPassword(password);

        // SAVE
        const user = new userModel({name, email, phone, address, password: hashedPassword, answer});
        await user.save();
        
        res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        })
    }
};

export const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(200).send({
                success: false,
                message: 'Email is not registered'
            })
        }
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(200).send({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // TOKEN
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.status(200).send({
            success: true,
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error
        })
    }
};

export const forgotPasswordController = async (req, res) => {
    try {
        const {email, answer, newPassword} = req.body;
        if(!email){
            res.status(200).send({message: "Email is required"})
        }
        if(!answer){
            res.status(200).send({message: "Answer is required"})
        }
        if(!newPassword){
            res.status(200).send({message: "New Password is required"})
        }

        const user = await userModel.findOne({email, answer});
        if(!user){
            return res.status(200).send({
                success: false,
                message: 'Wrong Email or Answer'
            })
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password: hashed});
        res.status(200).send({
            success: true,
            message: 'Password Reset Successful'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something Went Wrong",
            error
        })
    }
};

export const testController = (req, res) => {
    try {
        res.send(`protected route`)
    } catch (error) {
        console.log(error);
        res.send({error});
    }
}

export const updateProfileController = async (req, res) => {
    try {
        const {name, email, password, address, phone} = req.body;
        const user = await userModel.findById(req.user._id);
        if(password && password.length < 3){
            return res.json({error: 'Password is required and must be atleast 3 characters long'})
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, {new: true})

        res.status(200).send({
            success: true,
            message: `Profile Updated Successfully`,
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while updating profile'
        });
    }
}

export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({buyer: req.user._id})
                                .populate("products", "-photo")
                                .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in getting user's orders"
        });
    }
}

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({})
                                .populate("products", "-photo")
                                .populate("buyer", "name")
                                .sort({createdAt: -1});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in getting all orders'
        });
    }
}

export const orderStatusController = async (req, res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId, {status}, {new: true})
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Updating Order Status'
        });
    }
}
