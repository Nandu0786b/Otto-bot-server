import StockListModel from "../models/stocksAvil.js"

//add new stock
export const addStock = async(req,res)=>{
    try {
        const { stocks } = req.body; // Assuming req.body.stocks is an array of stock objects you want to update
        if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
        return res.status(400).json({
            stat:"OK",
            error: "Missing data",
            Verified:true,
            message: 'Invalid or empty stock list provided.',
        });
        }
       // Create an array of stock objects to be inserted
        const stockObjects = stocks.map((stockName) => ({
            stock: stockName,
            subscriber: 0, // You can get this value from req.body or any other source
            price: 0, // You can get this value from req.body or any other source
        }));
    
        // Insert the new stock objects into the database
        const result = await StockListModel.insertMany(stockObjects);
    
        if (result) {
            return res.status(201).json({
            stat:"OK",
            error: "",
            Verified:true,
            message: 'Stocks added successfully.',
            insertedStocks: result,
            });
        } else {
            return res.status(500).json({
            stat:"OK",
            error: "",
            Verified:true,
            message: 'Failed to add stocks.',
            });
        }
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            stat:"OK",
            error:error.message,
            Verified:true,
            message:"Internal Server Problem"})
    }
}
