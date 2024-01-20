const { promises: fsPromises, ...fs } = require('fs');
const path = require('node:path');
const {clientId} = require('./config.json')
const server = require('./server.js'); 
const buttonkit = require('./button.js')
server.server();
const userTokenWarningMap = new Map();//Token貼り付け対策
const { google } = require('googleapis');
const API_KEY = process.env['PERSPECTIVE_KEY'];//GoogleCloudのToken
const DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';
const timeouts = new Map();//スパム対策
let messageCount = 0;//スパム対策
const func = require('./func.js');

const {
  REST,
  Routes,
  Client,
  UserFlags,
  Collection,
  GatewayIntentBits,
  ButtonStyle,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
  ]
});//intents設定

if (process.env['DISCORD_BOT_TOKEN'] == undefined) {
  console.error("TOKENが設定されていません。");
  process.exit(0);
}//不正なtoken検知

console.log("起動準備中...")

client.on("ready", () => {


  register()


  function readyLog() { console.log("―――起動完了―――") }
  setTimeout(readyLog, 2500)

});//readyevent

client.login(process.env['DISCORD_BOT_TOKEN']);//ログイン

client.on('interactionCreate', async interaction => {
  try{
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`${interaction.commandName} が見つかりません。`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
  }
  }catch(e){interaction.channel.send("Interationでエラーが発生しました。\n少し時間を開けて再度実行してください。")}
});//スラッシュコマンド設定


function register() {
  client.commands = new Collection();


  const commandsPath = path.join(__dirname, 'commands')
  const commands = [];
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }
  const rest = new REST({ version: '10' }).setToken(process.env['DISCORD_BOT_TOKEN']);
  (async () => {
    try {
      console.log(`${commandFiles}`);
      console.log(`${commands.length}個のアプリケーションコマンドを登録します`);

      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );

      console.log(`${data.length}個のアプリケーションコマンドを登録しました。`);
    } catch (error) {
      console.error(error);
    }
  })();
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`${filePath}に必要な"data"か"execute"がありません`)
    }

  }
}

let bmessage;
let brole;
let bcid;
let bephe;

client.on('interactionCreate', async interaction => {
if(interaction.commandName === "button"){
  const subcommand = interaction.options.getSubcommand();
  const bid = Math.floor(1000 + Math.random() * 9000);
  if (subcommand === 'normal設置') {
    const bname = interaction.options.getString('name');
    const btype = interaction.options.getString('type');
    bmessage = interaction.options.getString('sendmessage');
    brole = interaction.options.getRole('role');
    console.log("Role:"+brole)
    let bepheA = interaction.options.getBoolean('ephemeral');
    bephe = `${bepheA}`
    
    console.log("ephe:"+bephe)
    bcid = `${bname}:${bid}` 
   const button = new ButtonBuilder()
      .setCustomId(`${bcid}`)
      .setLabel(`${bname}`)
      .setStyle(`${btype}`)
      
      
  const row = new ActionRowBuilder().setComponents(button)
    interaction.reply({components: [row]})

    if(brole){
    brole = `${brole.name}`
    console.log(brole)
    }else{brole = ""}
    await buttonkit.saveDataToBcid(bcid, bmessage, brole ,bephe)

  }
}
if(interaction.commandName === "button"){
  const subcommand = interaction.options.getSubcommand();
  const bid = Math.floor(1000 + Math.random() * 9000);
  if (subcommand === 'ntsre表記') {
    let stoper =0;
    let b1;
    let b2;
    let b3;
    let b4;
    let b5;
    let buttons = [];
    try{
      b1 = interaction.options.getString('text1');
      //これ以下の変数は設定されていない場合があるのでErrorを回避するためtry catch
      b2 = interaction.options.getString('text2');
      b3 = interaction.options.getString('text3');
      b4 = interaction.options.getString('text4');
      b5 = interaction.options.getString('text5');
    }catch(e){console.log("Error回避")}
   

    const inputString = b1
    const parts = inputString.split(/!(?![^{]*})/);
    const [name, type, message, role , ephe] = parts.map(part => part.replace('{', '').replace('}', ''));

    
    const bcid = `${name}:${bid}`
    const bmessage = message;
    let brole1 = role;
    try{
    const button = new ButtonBuilder()
      .setCustomId(`${bcid}`)
      .setLabel(`${name}`)
      .setStyle(`${type}`)

    buttons.push(button)
    }catch(e){
    stoper = 1
    interaction.channel.send("text1のTypeに正確な値を入力してください。Primary,Success,Danger,Secondaryのいずれかを入力。"+"error:"+`${type}`)
}
    
    if(brole1){
    brole1 = `${brole1.name}`
    }else{brole1 = ""}
    buttonkit.saveDataToBcid(bcid, bmessage, brole1 ,ephe)

    
    if(b2){
      const inputString = b2
      const parts = inputString.split(/!(?![^{]*})/);
      const [name2, type2, message2, role2 , ephe2] = parts.map(part => part.replace('{', '').replace('}', ''));

      
      const bcid = `${name2}:${bid}`
      const bmessage = message2;
      let brole2 = role2;
      try{
      const button2 = new ButtonBuilder()
      .setCustomId(`${bcid}`)
      .setLabel(`${name2}`)
      .setStyle(`${type2}`)
      buttons.push(button2)
      }catch(e){
    stoper = 1
    interaction.channel.send("text2のTypeに正確な値を入力してください。Primary,Success,Danger,Secondaryのいずれかを入力。"+"error:"+`${type}`)
}
      if(brole2){
      brole2 = `${brole2.name}`
      }else{brole2 = ""}
      buttonkit.saveDataToBcid(bcid, bmessage, brole2, ephe2)
    }
    if(b3){
      const inputString = b3
      const parts = inputString.split(/!(?![^{]*})/);
      const [name3, type3, message3, role3, ephe3] = parts.map(part => part.replace('{', '').replace('}', ''));

      
      const bcid = `${name3}:${bid}`
      const bmessage = message3;
      let brole3 = role3;
      try{
      const button3 = new ButtonBuilder()
      .setCustomId(`${bcid}`)
      .setLabel(`${name3}`)
      .setStyle(`${type3}`)
      buttons.push(button3)
      }catch(e){
    stoper = 1
    interaction.channel.send("text3のTypeに正確な値を入力してください。Primary,Success,Danger,Secondaryのいずれかを入力。"+"error:"+`${type}`)
}
      if(brole3){
      brole3 = `${brole3.name}`
      }else{brole3 = ""}
      buttonkit.saveDataToBcid(bcid, bmessage, brole3, ephe3)
    }
    if(b4){
      const inputString = b4
      const parts = inputString.split(/!(?![^{]*})/);
      const [name4, type4, message4, role4, ephe4] = parts.map(part => part.replace('{', '').replace('}', ''));

      
      const bcid = `${name4}:${bid}`
      const bmessage = message4;
      let brole4 = role4;
      try{
      const button4 = new ButtonBuilder()
      .setCustomId(`${bcid}`)
      .setLabel(`${name4}`)
      .setStyle(`${type4}`)
      buttons.push(button4)
      }catch(e){
    stoper = 1
    interaction.channel.send("text4のTypeに正確な値を入力してください。Primary,Success,Danger,Secondaryのいずれかを入力。"+"error:"+`${type}`)
}

      if(brole4){
      brole4 = `${brole4.name}`
      }else{brole4 = ""}
      buttonkit.saveDataToBcid(bcid, bmessage, brole4, ephe4)
    }
    if(b5){
      const inputString = b5
      const parts = inputString.split(/!(?![^{]*})/);
      const [name5, type5, message5, role5, ephe5] = parts.map(part => part.replace('{', '').replace('}', ''));

      
      const bcid = `${name5}:${bid}`
      const bmessage = message5;
      let brole5 = role5;
      try{
      const button5 = new ButtonBuilder()  
      .setCustomId(`${bcid}`)
      .setLabel(`${name5}`)
      .setStyle(`${type5}`)
      buttons.push(button5)
      }catch(e){
    stoper = 1
    interaction.channel.send("text5のTypeに正確な値を入力してください。Primary,Success,Danger,Secondaryのいずれかを入力。"+"error:"+`${type}`)
}
      if(brole5){
      brole5 = `${brole5.name}`
      }else{brole5 = ""}
      buttonkit.saveDataToBcid(bcid, bmessage, brole5, ephe5)
    }
    
    const row = new ActionRowBuilder().setComponents(buttons)
    if(stoper === 0){
    await interaction.reply({components: [row]});
    }
    
    
   
    
}
}
});//スラッシュコマンド設定
let role;

client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  console.log(interaction.customId)
  

  try {
    //await interaction.deferReply();
    // ボタンデータの読み込み
     const buttonData = await loadButtonData(); // 非同期に変更
    console.log(buttonData.hasOwnProperty(interaction.customId))

    // interaction.customIdが保存されていたJsonのbcidと一致した場合
    if (buttonData.hasOwnProperty(interaction.customId)) {
      console.log("pong")
      const data = buttonData[interaction.customId];

      // メッセージがある場合はそれを送信
      if (data.message) {
        if(data.ephe === "true"){
          
         
          await interaction.reply({ content: `${data.message}`, ephemeral: true });
          
          
        }
        else{
          console.log(data.message)
          await interaction.reply(data.message);
        }
        
      }

      // ロールがある場合はそれを付与
      if (data.role) {
        console.log("pong!!")
        role = interaction.guild.roles.cache.find(role => role.name === data.role);
        
        if (role) {
          try{
            
          if(interaction.member.roles.cache.has(role.id)){await interaction.member.roles.remove(role);}
          else  await interaction.member.roles.add(role)
            
          }catch(e){
          interaction.channel.send("ロールの付与に失敗しました。\nロール管理の権限がないか、このBOTのロールより上位のロールまたは無効なロールを付与しようとしています。")
          console.log(e)
}
        }
      }
    }
  } catch (error) {
    console.error('Error handling button interaction:', error);
    await interaction.channel.send("Buttonの情報が正しく読み取れませんでした。")
  }
});

// ボタンデータの読み込み
async function loadButtonData() {
  try {
    const data = await fs.readFileSync('data/buttonData.json', 'utf8');
    console.log("ボタンデータ読み込み完了")
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading button data:', error);
    return {};
  }
}

client.on('interactionCreate', async interaction => {


  if(interaction.commandName === 'メンバー取得'){
    const guild = interaction.guild;

    if (!interaction.isCommand()) return;

    await guild.members.fetch();
    const membersDatas = [];

    /* メンバー情報を取得し、必要な情報を抽出して配列に格納
    const membersData = guild.members.cache.map(member => ({
      id: member.user.id,
      username: member.user.username,
    }));
    membersDatas.push(...membersData);
    */

    const membersData = guild.members.cache
      .filter(member => !member.user.bot)
      .map(member => ({
        id: member.user.id,
        username: member.user.username,
      }));
    membersDatas.push(...membersData);



    // 配列をJSON形式に変換
    const membersDataJson = JSON.stringify(membersDatas,null,2);
    // JSONファイルに保存
    fs.writeFileSync('data/members.json', membersDataJson);
    interaction.reply('メンバー情報を取得しました。');
  }


});//メンバー更新

client.on('guildMemberAdd', member => {
  console.log('ギルド参加イベント発火')
  const userFlags = member.user.flags;
  console.log(userFlags)
  if (userFlags.has(UserFlags.VerifiedBot)) { console.log('認証済') }

  if (member.user.bot && member.permissions.has('ADMINISTRATOR') && !userFlags.has(UserFlags.VerifiedBot)) {
    member.guild.owner.send("高権限未認証BOTが追加されました。")


  }
});//ギルド参加イベント=>BOT認証済 確認

client.on('messageCreate', (message) => {
  const { content, author, guild } = message;
  const tokenPattern = /[a-zA-Z0-9_-]{23,28}\.[a-zA-Z0-9_-]{6,7}\.[a-zA-Z0-9_-]{27}/;

  if (tokenPattern.test(content)) {
    message.delete();
    const userId = author.id;

    let userWarnings = userTokenWarningMap.get(userId) || 0;

    if (userWarnings === 0) {
      message.channel.send('警告：トークンを公開しないでください。再度繰り返された場合あなたをBANします。\nWarning: do not reveal tokens. If repeated again you will be blocked.');
      userWarnings++;
      userTokenWarningMap.set(userId, userWarnings);
    } else if (userWarnings === 1) {
      const member = guild.members.cache.get(userId);
      if (member) {
        member.ban({
          reason: 'トークンの公開が続いたため対象のユーザーをBANしました。',
        }).then(() => {
          message.channel.send('トークンの公開が続いたため、BANされました。\nYou have been blocked.Because you ignored warnings and issued tokens');
        }).catch((error) => {
          console.error('BANエラー:', error);
        });
      }
      userTokenWarningMap.delete(userId);
    }
  }
});//Token検知

client.on('messageCreate', async (message) => {
  // ボット自身のメッセージは無視
  if (message.author.bot) return;

  // メッセージの解析リクエストを作成
  const analyzeRequest = {
    comment: {
      text: message.content     
    },
    requestedAttributes: {
      TOXICITY: {}
    }
  };

  try {
    const googleClient = await google.discoverAPI(DISCOVERY_URL);

    // コメントの解析リクエストを送信
    const response = await googleClient.comments.analyze({
      key: API_KEY,
      resource: analyzeRequest,
    });

    // 解析結果を Discord に送信
    //const resultMessage = `Analysis Result:\n${JSON.stringify(response.data, null, 2)}`;
    //message.reply(resultMessage);

    // 評価点数が一定以上の場合に "Pong" を送信
    const toxicityScore = response.data.attributeScores.TOXICITY.summaryScore.value;
    const threshold = 0.7; // この値は適切な閾値に調整してください
    if (toxicityScore >= threshold) {

      message.channel.send(`<@!${message.member.user.id}>相手を不愉快にするメッセージを送信しないでください`);

    }
    if (toxicityScore >= threshold) {
      message.delete();
    }
  } catch (err) {
    console.error(err);
    console.log('An error occurred while analyzing the message.');
  }
});//誹謗中傷防止

client.on('messageCreate', async (message) => {
  let time;
  const japanTime = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const japanDate = new Date(japanTime);
  const hours = japanDate.getHours();
  const minutes = japanDate.getMinutes();

  if(hours + 2 >= 24){
     time = `${hours + 2 - 24}:${String(minutes).padStart(2, '0')}`;
  }else{
     time = `${hours + 2}:${String(minutes).padStart(2, '0')}`;
  }
  

  
  if(message.embeds.length === 0)return;
  
  if (message.embeds[0].title === 'DISBOARD: Discordサーバー掲示板') {
    
  try {
    await message.channel.send('/bumpを検知しました！');
    await message.channel.send('2時間後にお知らせしますね！');
    
    await Promise.all([
      fsPromises.writeFile('data/time.txt', time),
      fsPromises.writeFile('data/cid.txt', message.channel.id),
      fsPromises.writeFile('data/oid.txt', message.guild.ownerId),
    ]);

  } catch (error) {
    console.error('Error processing /bump:', error);
  }
    
  }
});//bump検知

client.on('messageCreate', (message) => {
  const { author, content } = message;

  if (author.bot) return;
  

  // ユーザーごとにカウントを追跡
  const userTimeouts = timeouts.get(author.id) || { count: 0, timeout: null };

  // 直近のメッセージと比較して同じであればカウントを増やす
  if (userTimeouts.lastMessage === content) {
    userTimeouts.count++;
  } else {
    userTimeouts.count = 1;
  }
try{
  // 5秒以内に3回以上同じメッセージを送信した場合
  if (userTimeouts.count >= 3 && userTimeouts.count < 7) {
    if (!userTimeouts.timeout) {
      // タイムアウトを設定
      message.member.timeout(10 * 1000);

      // タイムアウトをユーザーに通知
      message.channel.send(`<@!${author.id}>`+"同じメッセージを連続して3回以上送信したため、10秒間のタイムアウトを適用しました。");
    }

  }
  if (userTimeouts.count >= 7) {
    if (!userTimeouts.timeout) {
      // タイムアウトを設定
      message.member.timeout(20 * 1000);

      // タイムアウトをユーザーに通知
      message.channel.send(`<@!${author.id}>`+"同じメッセージを連続して7回以上送信したため、20秒間のタイムアウトを適用しました。");
    }

  }  
  else {
    clearTimeout(userTimeouts.timeout);
    userTimeouts.timeout = null;

  }
  }catch(e){console.log("エラー。権限が不足してないか等を確認してください\nerror:"+e)}
  userTimeouts.lastMessage = content;
  timeouts.set(author.id, userTimeouts);
  console.log(userTimeouts.count)
  setTimeout(() => {
    userTimeouts.count = 0;
  }, "5000");


});//スパム対策

client.on('messageCreate', (message) => {

    // メッセージのカウントを増やす
    messageCount++;

    // 10秒ごとにカウントをリセット
    if (messageCount === 1) {
      setTimeout(() => {
        if (messageCount >= 11) {
          // スパムとみなす条件を満たす場合、スパム検知メッセージを送信
          message.author.kick('スパムが続いたため');
        }
        // カウントをリセット
        messageCount = 0;
      }, 10000); // 10秒間待つ
    }

});//スパム対策2
