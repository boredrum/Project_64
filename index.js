import express from "express";
import mongoose from "mongoose";
import { productSchema } from "./model/product.js";
import { customersSchema } from "./model/customers.js";

const url = "mongodb://localhost:27017/shop";

const connection = mongoose.createConnection(url, { maxPoolSize: 10 });

const PORT = 3000;

const app = express();

const Product = connection.model("product", productSchema);
const Customer = connection.model("customer", customersSchema);

app.get("/", (req, res) => {
	Promise.all([Product.find(), Customer.find()])
		.then(([products, customers]) => {
			let sortedHtml = "";
			customers.forEach((customer) => {
				products.forEach((product) => {
					if (customer.product_id === product.id) {
						sortedHtml += `
          <div style="border: 1px solid #000; 
          width: fit-content;
          display: flex;
          align-items: center;
          height: 20px;
          margin: 0 0 20px 0; 
          padding: 0 10px;">
          <p style="font-size: 16px; line-height: 5px;"
            >${customer.name}:       ${product.title}       Price: ${product.price}</p>
          </div>
                `;
					}
				});
			});
			const html = `<h1>Users purchases:</h1> ${sortedHtml}`;
			res.send(html);
		})
		.catch((error) => {
			console.error(error);
		});
});

connection.on("open", () => {
	console.log("Connected to the database!");
	app.listen(PORT, () => {
		console.log(`Server started on http://localhost:${PORT}`);
	});
});

connection.on("error", (err) => {
	console.error(`Database connection error: ${err}`);
});
