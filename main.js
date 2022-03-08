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
  try{ level = +fs.OpenTextFile("level.dat", 1).ReadAll(); }catch(e){
    level = 1;
    var f = fs.CreateTextFile("level.dat");
    f.Write("1");
    f.Close();
  }
}
ttl.innerHTML += " - Уровень " + level;

//Просто переменные и функции
function getStruct(name){
  return fs.OpenTextFile("structures/" + name + ".txt", 1).ReadAll()
}

//блок gamelib
gamelib.init(14, 10, 50, "block.default", "textures");

//сущности
var player = new gamelib.entity("entity.player", 0, 0, "player");
var enemy = new gamelib.entity("entity.security_guard", 7, 5, "enemy");

player.bind("w", "s", "a", "d");
enemy.goto("player", 500 - level, function(){
  player.kill();
  alert("Вы проиграли");
  location.reload();
});

//игровой цикл
setInterval(function(){
  if(player.x == gamelib.width - 1 && player.y == gamelib.height - 1){
    if(level < 400){
      var f = fs.OpenTextFile("level.dat", 2);
      f.Write(level + 1);
      f.Close();
      location.reload();
    }else{
      var f = fs.OpenTextFile("level.dat", 2);
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
