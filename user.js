import Sequelize from "sequelize";
const sequelize = new Sequelize("shop", "root", "password", {
	host: "localhost",
	dialect: "mysql",
});
const Customer = sequelize.define(
	"customer",
	{
		id: {
			type: Sequelize.INTEGER.UNSIGNED,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		name: Sequelize.STRING(128),
		productID: Sequelize.MEDIUMINT.UNSIGNED,
	},
	{ tableName: "customer", timestamps: false }
);
const Product = sequelize.define(
	"product",
	{
		id: {
			type: Sequelize.INTEGER.UNSIGNED,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		title: Sequelize.STRING(128),
		price: Sequelize.MEDIUMINT.UNSIGNED,
		rating: Sequelize.DECIMAL(3, 2),
		category: Sequelize.STRING(128),
		brand: Sequelize.STRING(64),
	},
	{ tableName: "product", timestamps: false }
);

Customer.hasOne(Product, { foreignKey: "id", sourceKey: "productID" });
Product.belongsTo(Customer, { foreignKey: "productID", targetKey: "id" });

sequelize
	.sync()
	.then(() => {
		return Customer.findAll({
			where: { name: "Mike" },
			include: [
				{
					model: Product,
					attributes: ["title", "price"],
				},
			],
		});
	})
	.then((users) => {
		const content = [];
		users.forEach((user) => {
			const userContent = `
      <div style="border: 1px solid #000; 
      width: fit-content;
      display: flex;
      align-items: center;
      height: 20px;
      margin: 0 0 20px 0; 
      padding: 0 10px;">
      <p style="font-size: 16px; line-height: 5px;"
        >${user.dataValues.name}:       ${user.dataValues.product.title}       Price: ${user.dataValues.product.price}</p>
      </div>
            `;
			content.push(userContent);
		});
		console.log(content);
	});
