//Переменные WSH
var fs = WScript.CreateObject("Scripting.FileSystemObject");
var shell = WScript.CreateObject("WScript.Shell");

//Аргументы
var argsa = app.commandLine.split("/");
argsa.shift();
argsa.forEach(function(v, n, a){ a[n] = a[n].replaceAll(" ", "") });
var args = {};
for(var i in argsa){
    var a = argsa[i].split(":");
    args[a[0]] = a[1]
};
for(var i in args){
  switch(i){
    case("level"): {
      window.alevel = +args[i];
      break;
    }
    case("debugmode"): {
      window.debugMode = !!args[i];
      break;
    }
    case("exec"): {
      setTimeout(function(){
        eval(args[i]);
      }, 500);
      break;
    }
    default: {
      window.debugMode = false;
      window.alevel = null;
    }
  }
}

//Уровень
var level;
if(window.alevel){
  level = alevel;
}else{
  try{ level = +fs.OpenTextFile("config\\level.dat", 1).ReadAll(); }catch(e){
    level = 1;
    var f = fs.CreateTextFile("config\\level.dat");
    f.Write("1");
    f.Close();
  }
}
ttl.innerHTML += " - Уровень " + level;

//Просто переменные и функции
function getStruct(name){
  return fs.OpenTextFile("structures/" + name + ".txt", 1).ReadAll()
}

var money = +fs.OpenTextFile("config\\money.dat", 1).ReadAll();

function setMoney(){
  var m = fs.OpenTextFile("config\\money.dat", 2);
  m.Write(money);
  m.Close();
}

window.onload = function(){
  window.balance = document.getElementById("balance");
  balance.innerHTML = money;
}

function shop(){
  clearInterval(securityGuard.entmiid);

  createWindow("Магазин", "<div id='shopDiv'></div><br><br><button id='okBtn'>OK</button>");

  var items = JSON.parse(fs.OpenTextFile("config\\shop.json", 1).ReadAll());
  for(var i in items){
    var item = items[i];

    eval("window.BuyItem" + i + " = function(){" + item.onbuy + "}");

    var html = "<div style='border: solid 1px black; padding: 2px; margin: 2px;'>";
    html += "<img src='" + item.icon + "' width=20 height=20>&nbsp;&nbsp;" + item.name + "&nbsp;&nbsp;&nbsp;" + item.price + " руб.&nbsp;&nbsp;&nbsp;";
    html += "<button onclick='if(money >= " + item.price + "){window.money -= " + item.price + "; setMoney();balance.innerHTML = money; BuyItem" + i + "()}else{alert(\"Деняк нету!\")}'>Купить</button>";

    shopDiv.innerHTML += html;
  }

  okBtn.onclick = function(){
    securityGuard.goto("player", 500 - level, function(){
      player.kill();
      alert("Вы проиграли");
      location.reload();
    });
    bclib.util.close();
  }
}

//блок gamelib
gamelib.init(14, 10, 50, "block.default", "textures");

//сущности
var player = new gamelib.entity("entity.player", 0, 0, "player");
var securityGuard = new gamelib.entity("entity.security_guard", 7, 5, "securityGuard");

player.bind("w", "s", "a", "d");
securityGuard.goto("player", 500 - level, function(){
  player.kill();
  alert("Вы проиграли");
  location.reload();
});

//игровой цикл
setInterval(function(){
  if(player.x == gamelib.width - 1 && player.y == gamelib.height - 1){
    if(level < 400){
      var f = fs.OpenTextFile("config\\level.dat", 2);
      f.Write(level + 1);
      f.Close();
      location.reload();
    }else{
      var f = fs.OpenTextFile("config\\level.dat", 2);
      f.Write(1);
      f.Close();
      location.href = "http://f0615718.xsph.ru/ProgramData/EscapeFromTavrik/end.html";
    }
  }
}, 500);

//структуры
gamelib.block.build(getStruct("small_slide"), [gamelib.random(3, gamelib.width - 5), gamelib.random(2, gamelib.height - 2)]);

for(var i = 0; i < gamelib.random(0, 100); i++){
  gamelib.block.build(getStruct("tree"), [gamelib.random(1, gamelib.width - 4), gamelib.random(2, gamelib.height - 5)]);
}

for(var j = 0; j < gamelib.random(0, 5); j++){
  gamelib.block.build(getStruct("puddle"), [gamelib.random(1, gamelib.width - 4), gamelib.random(2, gamelib.height - 5)]);
}
