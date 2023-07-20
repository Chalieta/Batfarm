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
const Garden = require("./models/Garden.js")(sequelize, Sequelize.DataTypes);

Inventory.belongsTo(Shop, { foreignKey: "item_id", as: "item" });
Garden.belongsTo(Shop, { foreignKey: "item_id", as: "item" });

Reflect.defineProperty(Users.prototype, "addItem", {
  value: async (id, item, quantity) => {
    const userItem = await Inventory.findOne({
      where: { user_id: id, item_id: item.id }, // Check if the item exists in user's inventory
    });

    if (userItem) {
      // Add to the existing amount
      userItem.amount += quantity;
      return userItem.save();
    }

    return Inventory.create({
      // Initialize amount to 1
      user_id: id,
      item_id: item.id,
      amount: quantity,
      counter: item.counter,
    });
  },
});

Reflect.defineProperty(Users.prototype, "removeItem", {
  value: async (id, item, quantity) => {
    const userItem = await Inventory.findOne({
      where: { user_id: id, item_id: item.id }, // Check if the item exists in user's inventory
    });

    if (userItem && userItem.amount > quantity) {
      // Subtract from the existing amount
      userItem.amount -= quantity;
      return userItem.save();
    }

    if (userItem && userItem.amount <= quantity) {
      return Inventory.destroy({ where: { user_id: id, item_id: item.id } });
    }
  },
});

Reflect.defineProperty(Users.prototype, "getItems", {
  value: (id) => {
    return Inventory.findAll({
      // where: { user_id: this.user_id },
      where: { user_id: id },
      include: ["item"],
    });
  },
});

Reflect.defineProperty(Users.prototype, "addPlant", {
  value: (id, plant, quantity) => {
    for (var i = 0; i < quantity; ++i) {
      Garden.create({
        user_id: id,
        item_id: plant.id,
        counter: plant.counter,
      });
    }
    return;
  },
});

Reflect.defineProperty(Users.prototype, "removePlant", {
  value: async (id, plant, quantity) => {
    const plants = await Garden.findAll({
      where: { user_id: id, item_id: plant.id, counter: 0 },
      include: ["item"],
    });

    plants.forEach((p) => {
      if (quantity > 0) {
        p.destroy();
        quantity--;
      }
    });
  },
});

Reflect.defineProperty(Users.prototype, "getPlants", {
  value: (id) => {
    return Garden.findAll({
      // where: { user_id: this.user_id },
      where: { user_id: id },
      include: ["item"],
    });
  },
});

// Harvest - from Garden to Inventory

module.exports = { Users, Shop, Inventory, Garden };
