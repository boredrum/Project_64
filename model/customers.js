import mongoose from "mongoose";

const Schema = mongoose.Schema;

const customersSchema = new Schema({
	name: String,
	product_id: String,
});

const Customer = mongoose.model("customer", customersSchema);

export { Customer, customersSchema };
