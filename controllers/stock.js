import StockListModel from "../models/stocksAvil.js"

//add new stock
// export const addStock = async(req,res)=>{
//     try {
//         const { stocks } = req.body; // Assuming req.body.stocks is an array of stock objects you want to update
//         if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
//         return res.status(400).json({
//             stat:"OK",
//             error: "Missing data",
//             Verified:true,
//             message: 'Invalid or empty stock list provided.',
//         });
//         }
//        // Create an array of stock objects to be inserted
//         const stockObjects = stocks.map((stockName) => ({
//             stock: stockName,
//             subscriber: 0, // You can get this value from req.body or any other source
//             price: 0, // You can get this value from req.body or any other source
//         }));
    
//         // Insert the new stock objects into the database
//         const result = await StockListModel.insertMany(stockObjects);
    
//         if (result) {
//             return res.status(201).json({
//             stat:"OK",
//             error: "",
//             Verified:true,
//             message: 'Stocks added successfully.',
//             insertedStocks: result,
//             });
//         } else {
//             return res.status(500).json({
//             stat:"OK",
//             error: "",
//             Verified:true,
//             message: 'Failed to add stocks.',
//             });
//         }
        
//     } catch (error) {
//         console.log(error.message)
//         return res.status(500).json({
//             stat:"OK",
//             error:error.message,
//             Verified:true,
//             message:"Internal Server Problem"})
//     }
// }

export const stockList = async (req, res) => {
  try {
    // List of all stocks
    const stocks = await StockListModel.find({});

    if (stocks) {
      return res.status(200).json({
          stat:"OK",
          error: "",
          Verified:true,
          message: 'Stocks retrieved successfully.',
          stocks: stocks,
      });
    } else {
      return res.status(404).json({
          stat:"OK",
          error: "",
          Verified:true,
          message: 'No stocks found.',
          stocks: {}
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      stat:"OK",
      error:error.message,
      Verified:true,
      message: 'An error occurred while retrieving stocks.',
    });
  }
};


export const subscriberUpdate = async(req,res)=>{
  try {
      // update the Number of the suscriber, We should use lock mechanism here for the data safe and correct data
      const stock = req.body.stock;
      const newvalue = req.body.newSubscriber;
      console.log(stock, newvalue);
       // Find the existing subscriber by the identifier
      const existingSubscriber = await StockListModel.findOne({ stock: stock });



       // Update the subscriber's stock information
       existingSubscriber.subscriber+=newvalue;

       // Save the updated subscriber
       const update=await existingSubscriber.save();

       res.status(201).json({ 
          stat:"OK",
          error:'',
          Verified:true,
          message: 'Subscriber updated successfully',
          stock:update 
      });
  } catch (error){
      console.error(error);
      return res.status(500).json({
        stat:"OK",
        error: error.message,
        Verified:true,
        message: 'An error occurred while retrieving stocks.',
      });
    }
}

// export const priceUpdate = async(req,res)=>{
//     try {
//         const stock = req.body.stock;
//         const newPrice = req.body.newPrice;
//         const updateddata = await StockListModel.findOneAndUpdate(
//             { stock: stock },
//             { $set: { price: newPrice } }, // Set the new price
//             { new: true } // Return the updated document
//         );


//          res.status(201).json({ 
//             stat:"OK",
//             error:'',
//             Verified:true,
//             message: 'Pice updated successfully',
//             stock:updateddata
//         });
//     } catch (error){
//         console.error(error);
//         return res.status(500).json({
//           stat:"OK",
//           error: error.message,
//           Verified:true,
//           message: 'An error occurred while retrieving stocks.',
//         });
//       }
// }