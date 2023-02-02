const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const detailsSchema = new Schema({
    firstName:String,
    lastName:String,
    email:String,
    phone_no:String,
    address:String,
    profile:String,
    desc:String,
    education:[],
    experience:[],
    hobby:[],
    skills:[],
    userId:String,
}, {timestamps: true});



const detailsModel = mongoose.model('details',detailsSchema)
module.exports = detailsModel;