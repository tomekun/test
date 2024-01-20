const { promises: fsPromises, ...fs } = require('fs');
const path = require('node:path');
const {clientId,guildId} = require('./config.json');
let count = 0;
const {
  //SlashCommand
  REST,
  Routes,
  Collection,
  //BOT本体設定
  Client,
  GatewayIntentBits,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
  ]
});//intents設定




function checkTime() {

  const japanTime = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const japanDate = new Date(japanTime);
  const hours = japanDate.getHours();
  const minutes = japanDate.getMinutes();

  const nowtime = `${hours}:${String(minutes).padStart(2, '0')}`;
  const time = fs.readFileSync('data/time.txt', 'utf-8');

  if(count === 0){
    if (time === nowtime) {

        count++;
        bump();
    }
  }

}
function bump (){

  const cid = fs.readFileSync('data/cid.txt', 'utf-8');
  const oid = fs.readFileSync('data/oid.txt', 'utf-8');
  const channel = client.channels.cache.get(cid);
  const owner = client.users.cache.get(oid);
  channel.send(`${owner}bumpの時間です！`);

}

module.exports = {
  checkTime,
  bump,
};