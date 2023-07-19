exports.run = (client, msg, args) => {
  const answers = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful.",
    "My reply is no.",
  ];
  if (!args[0]) return msg.reply("There is no question to answer.");
  const random = Math.floor(Math.random() * 20); // Picks a number from 0-19
  return msg.reply(`${answers[random]}`);
};

exports.name = "8ball";
