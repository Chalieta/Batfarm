exports.run = async (client, msg, args) => {
  console.log(
    msg.author.displayAvatarURL({ dynamic: true, size: 4096, format: "png" })
  );
};

exports.name = "jail";
