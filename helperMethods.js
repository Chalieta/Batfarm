const { Users } = require("./dbObjects.js");

async function addBalance(currency, id, amount) {
  const user = currency.get(id);

  if (user) {
    user.wallet += Number(amount);
    return user.save();
  }

  const newUser = await Users.create({
    user_id: id,
    wallet: 100 + amount,
    bank: 0,
  });
  currency.set(id, newUser);

  return newUser;
}

async function getBalance(currency, id) {
  const user =
    currency.get(id) ??
    (await Users.create({ user_id: id, wallet: 100, bank: 0 }));
  return { wallet: user.wallet, bank: user.bank };
}

async function deposit(currency, id, amount) {
  // Deposit money from wallet to the bank
  const user = currency.get(id);

  if (user && amount <= user.wallet && amount > 0) {
    user.bank += amount;
    user.wallet -= amount;
    return user.save();
  }

  return null; // Cannot deposit money if user doesn't exist
}

async function withdraw(currency, id, amount) {
  // Withdraw money from bank to wallet
  const user = currency.get(id);

  if (user && amount <= user.bank && amount > 0) {
    user.wallet += amount;
    user.bank -= amount;
    return user.save();
  }

  return null; // Cannot withdraw money if user doesn't exist
}

module.exports = { addBalance, getBalance, deposit, withdraw };
