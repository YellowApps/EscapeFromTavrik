var fs = WScript.CreateObject("Scripting.FileSystemObject");
var shell = WScript.CreateObject("WScript.Shell");

var level;
try{ level = +fs.OpenTextFile("level.dat", 1).ReadAll(); }catch(e){
  level = 1;
  var f = fs.CreateTextFile("level.dat");
  f.Write("1");
  f.Close();
}
ttl.innerHTML += " - Уровень " + level;

function getStruct(name){
  return fs.OpenTextFile("structures/" + name + ".txt", 1).ReadAll()
}

gamelib.init(14, 10, 50, "block.default", "textures");

var player = new gamelib.entity("entity.player", 0, 0, "player");
var enemy = new gamelib.entity("entity.security_guard", 7, 5, "enemy");

player.bind("w", "s", "a", "d");
enemy.goto("player", 500 - level, function(){
  player.kill();
  alert("Вы проиграли");
  location.reload();
});

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

gamelib.block.build(getStruct("small_slide"), [gamelib.random(3, gamelib.width - 3), gamelib.random(2, gamelib.height - 1)]);

for(var i = 0; i < gamelib.random(0, 100); i++){
  gamelib.block.build(getStruct("tree"), [gamelib.random(1, gamelib.width - 1), gamelib.random(2, gamelib.height - 2)]);
}

for(var j = 0; j < gamelib.random(0, 5); j++){
  gamelib.block.build(getStruct("puddle"), [gamelib.random(1, gamelib.width - 1), gamelib.random(2, gamelib.height - 2)]);
}
