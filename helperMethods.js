const { Users } = require("./dbObjects.js");
const {
  MessageMentions: { USERS_PATTERN },
} = require("discord.js");

function getUserFromMention(mention) {
  // The id is the first and only match found by the RegEx.
  const matches = mention.matchAll(USERS_PATTERN).next().value;

  // If supplied variable was not a mention, matches will be null instead of an array.
  if (!matches) return;

  // The first element in the matches array will be the entire mention, not just the ID,
  // so use index 1.
  const id = matches[1];

  return client.users.cache.get(id);
}

async function addBalance(currency, id, amount) {
  const user = currency.get(id);

  if (user) {
    user.wallet += Number(amount);
    return user.save();
  }

  const newUser = await Users.create({ user_id: id, wallet: 100 + amount });
  currency.set(id, newUser);

  return newUser;
}

function getBalance(currency, id) {
  const user = currency.get(id);
  return user ? { wallet: user.wallet, bank: user.bank } : 0;
}

async function deposit(currency, id, amount) {} // Deposit money from wallet to the bank

module.exports = { addBalance, getBalance };
