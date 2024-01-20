const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('メンバー取得')
    .setDescription('現在のメンバー情報を更新します。'),
  execute: async function(interaction) {

  },

};
