var fs = WScript.CreateObject("Scripting.FileSystemObject");
var shell = WScript.CreateObject("WScript.Shell");

function getStruct(name){
  return fs.OpenTextFile("structures/" + name + ".txt", 1).ReadAll()
}

gamelib.init(14, 10, 50, "block.default", "textures");

var player = new gamelib.entity("entity.player", 0, 0, "player");
var enemy = new gamelib.entity("entity.default", 7, 5, "enemy");

player.bind("w", "s", "a", "d");
enemy.goto("player", 500, function(){
  player.kill();
  alert("Вы проиграли");
  shell.Run("launcher.hta");
  window.close();
});

setInterval(function(){
  if(player.x == gamelib.width - 1 && player.y == gamelib.height - 1){
    alert("Уровень пройден!");
    location.reload();
  }
}, 500);

gamelib.block.build(getStruct("small_slide"), [gamelib.random(3, gamelib.width - 3), gamelib.random(2, gamelib.height - 1)]);

for(var i = 0; i < gamelib.random(0, 100); i++){
  gamelib.block.build(getStruct("tree"), [gamelib.random(1, gamelib.width - 1), gamelib.random(2, gamelib.height - 2)]);
}
