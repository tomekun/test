const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('button')
    .setDescription('ボタンを生成します.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('normal設置')
        .setDescription('ボタン一つを生成します')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('名前を入力')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('ボタンの種類をセットします')
            .setRequired(true)
            .addChoices(
              { name: `bule`, value: "Primary" },
              { name: `green`, value: "Success" },
              { name: `red`, value: "Danger" },
              { name: `gray`, value: "Secondary" },
            )
        )
        .addStringOption((option) =>
          option
            .setName('sendmessage')
            .setDescription('ボタンを押した際に送信するメッセージ')
            .setRequired(false)
        )
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('付与するロール')
            .setRequired(false)
        )
        .addBooleanOption((option) =>
          option
            .setName('ephemeral')
            .setDescription('一時メッセージにするか')
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('ntsre表記')
        .setDescription('ntsr表記で複数個のボタンを生成します。')
        .addStringOption((option) =>
          option
            .setName('text1')
            .setDescription('1つ')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('text2')
            .setDescription('2つ')
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName('text3')
            .setDescription('3つ')
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName('text4')
            .setDescription('4つ')
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName('text5')
            .setDescription('5つ')
            .setRequired(false)
        )
    ),
  execute: async function (interaction) {
   
    
  }
};
