import React from 'react'; 
import { useState, useEffect } from "react";
import axios from 'axios';

export default function useCategory() {
    const [categories, setCategories] = useState([]);

    const getCategories = async () => {
        try {
            const {data} = await axios.get(`http://localhost:8080/api/v1/category/get-category`);
            setCategories(data?.category);
            // console.log(categories);
            // console.log('hi')
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    return categories;
}