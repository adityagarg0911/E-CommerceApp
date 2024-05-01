import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(200).send({
                message: 'Name is required'
            })
        }
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success: false,
                message: 'Category already exists'
            })
        }

        const category = await new categoryModel({name, slug:slugify(name)}).save();
        return res.status(201).send({
            success: true,
            message: 'New category created',
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating category"
        })
    }
}

export const updateCategoryController = async (req, res) => {
    try {
        const {name} = req.body;
        const {id} = req.params;
        if(!name){
            return res.status(200).send({
                message: 'Name is required'
            })
        }
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug: slugify(name)}, {new: true});
        res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in updating category"
        })
    }
}

export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All categories List",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting all category"
        })
    }
}

export const singleCategoryController = async (req, res) => {
    try {
        const {slug} = req.params;
        const category = await categoryModel.find({slug});
        res.status(200).send({
            success: true,
            message: "Getting single category successfull",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting single category"
        })
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Category deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while deleting category"
        })
    }
}