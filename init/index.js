import mongoose from "mongoose";
// import initdata from "./data.js";
import Listing from '../models/listing.js';
import initdata from "../init/data.js";


//Creating database
main()
    .then(()=>{
        console.log("Connection successful");
    })
    .catch((err) => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

//insert data into Listing collection
const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner:"68013c36cdf4d13b299cd704"}));
    await Listing.insertMany(initdata.data);
    console.log(initdata.data);
    console.log("Data is initialise");
};

initDB();
