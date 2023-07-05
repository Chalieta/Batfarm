const { Users } = require("./dbObjects.js");

async function addBalance(currency, id, amount) {
  const user = currency.get(id);

  if (user) {
    user.balance += Number(amount);
    return user.save();
  }

  const newUser = await Users.create({ user_id: id, balance: 100 + amount });
  currency.set(id, newUser);

  return newUser;
}

function getBalance(currency, id) {
  const user = currency.get(id);
  return user ? user.balance : 0;
}

module.exports = { addBalance, getBalance };
