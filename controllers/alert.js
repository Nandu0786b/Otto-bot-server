import AlertModel  from "../models/alert.js";
import StockListModel from "../models/stocksAvil.js"

export const createAlert = async(req,res)=>{
    try {
        const {stock, price, type} = req.body;
        const _id = req._id;
        console.log(stock, price, type, _id);
        // Also check if stock exist in the redis data base or not
        if(!stock || !price|| !type ||!_id){
            return res.status(400).json({
                stat:"OK",
                error: "Missing data",
                Verified:true,
                message:"Access Denied, Please send all data"
            })
        }
        if(!(type=='greater' || type== 'lesser' || type== 'equal')){
            return res.status(400).json({
                stat:"OK",
                error: "wrong alert type",
                Verified:true,
                message:"Send the correct alert type"
            })
        }
        // Search for an existing alert with the specified criteria
        const isAlertExist = await AlertModel.findOne({
            user:_id,
            stock: stock,
            price: price,
            status: 'pending',
            type: type,
        });

        if (isAlertExist) {
            // Alert already exists
            return res.status(409).json({
                stat: "OK",
                error: "Alert already exists",
                Verified: true,
                message: "Alert with the same criteria already exists",
                alert: isAlertExist
            });
        }


        const newAlert = new AlertModel({stock:stock, price:price, type:type, user:_id, status:'pending', notifyStatus:'Not filled'});
        const savenewAlert = await newAlert.save();
        const update = await StockListModel.findOneAndUpdate(
            { stock: stock },
            { $inc: { subscriber: 1 } },
            { new: true } // To return the updated document
        );
        if (!update) {
            return res.status(404).json({
                stat: "Not Found",
                error: 'Stock not found',
                Verified: true,
                message: 'Stock not found.',
            });
        }


        return res.status(201).json({
            stat:"OK",
            error: "",
            Verified:true,
            message:"New Alert created",
            alert:savenewAlert
        })
        // Also check if stock is not exist then also return error 
        // if exist and all done then return the final update



    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            stat:OK,
            Error:error.message,
            Verified:false,
            message:"Internal Server Problem"})
    }
}
