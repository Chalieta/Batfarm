const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const Users = require("./models/Users.js")(sequelize, Sequelize.DataTypes);
const Shop = require("./models/Shop.js")(sequelize, Sequelize.DataTypes);
const Inventory = require("./models/Inventory.js")(
  sequelize,
  Sequelize.DataTypes
);

Inventory.belongsTo(Shop, { foreignKey: "item_id", as: "item" });

Reflect.defineProperty(Users.prototype, "addItem", {
  value: async (item) => {
    const userItem = await Inventory.findOne({
      where: { user_id: this.user_id, item_id: item.id }, // Check if the item exists in user's inventory
    });

    if (userItem) {
      // Add to the existing amount
      userItem.amount += 1;
      return userItem.save();
    }

    return Inventory.create({
      // Initialize amount to 1
      user_id: this.user_id,
      item_id: item.id,
      amount: 1,
    });
  },
});

Reflect.defineProperty(Users.prototype, "getItems", {
  value: () => {
    return Inventory.findAll({
      where: { user_id: this.user_id },
      include: ["item"],
    });
  },
});

module.exports = { Users, Shop, Inventory };
