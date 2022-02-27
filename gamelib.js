//GameLib JavaScript Library
//by YellowApps (https://github.com/YellowApps)

var gamelib = {
  block: {
    draw: function(){

      function drawer(x, y, size){
        var img = new Image(size, size);
        img.src = gamelib.blocks[x][y];
        img.onload = function(){ gamelib.game.drawImage(img, x * size, y * size, size, size); }
      }

      for(var i in gamelib.blocks){
        for(var j in gamelib.blocks[i]){
          drawer(i,j,this.size);
        }
      }
    },
    set: function(img, x, y){
      try{
        gamelib.blocks[x][y] = this.folder + img + this.ext;
      }catch(e){}
    },
    get: function(x, y){
      try{
        return gamelib.blocks[x][y].replaceAll(this.folder,"").replaceAll(this.ext, "");
      }catch(e){
        return "";
      }
    },
    build: function(text, blk, del){
      var x = blk[0], y = blk[1], b = blk[2];
      var arr = text.replaceAll("\r", "").split("\n" || del);
      for(var i in arr){
        eval("gamelib.block.set(" + arr[i] + ");");
      }
      gamelib.block.draw();
    }
  },

  entity: function(tex, x, y, name){
    this.x = x; this.y = y, this.tex = tex;


    gamelib.block.set(tex, x, y);
    gamelib.block.draw();

    this.isCollided = function(d){
      var r;
      switch(d){
        case "top": {
          r = gamelib.block.get(this.x, this.y - 1) == gamelib.block.default || gamelib.block.get(this.x, this.y - 1).includes("entity.");
          break;
        }
        case "bottom": {
          r = (gamelib.block.get(this.x, this.y + 1) == gamelib.block.default) || gamelib.block.get(this.x, this.y + 1).includes("entity.");
          break;
        }
        case "left": {
          r = gamelib.block.get(this.x - 1, this.y) == gamelib.block.default || gamelib.block.get(this.x - 1, this.y).includes("entity.");
          break;
        }
        case "right": {
          r = gamelib.block.get(this.x + 1, this.y) == gamelib.block.default || gamelib.block.get(this.x + 1, this.y).includes("entity.");
          break;
        }
      }
      return !r;
    }

    this.move = function(x, y){
      gamelib.block.set(gamelib.block.default, this.x, this.y);
      this.x += x;
      this.y += y;
      gamelib.block.set(tex, this.x, this.y);
      gamelib.block.draw();
    }

    this.moveTo = function(x, y){
      gamelib.block.set(gamelib.block.default, this.x, this.y);
      this.x = x;
      this.y = y;
      gamelib.block.set(tex, this.x, this.y);
      gamelib.block.draw();
    }

    this.goto = function(pos, step, collback){
      if(typeof(pos) != "string"){
          var x = pos[0], y = pos[1];
          this.entmiid = setInterval(function(){

            if((gamelib.entities[name].x == x) && (gamelib.entities[name].y == y)){
              console.log("stop");
              clearInterval(gamelib.entities[name].entmiid);
              collback();
            }

            if(gamelib.entities[name].x < x && !gamelib.entities[name].isCollided("right")){
              gamelib.entities[name].move(1, 0);
            }else if(gamelib.entities[name].x > x && !gamelib.entities[name].isCollided("left")){
              gamelib.entities[name].move(-1, 0);
            }

            if(gamelib.entities[name].y < y && !gamelib.entities[name].isCollided("bottom")){
              gamelib.entities[name].move(0, 1);
            }else if(gamelib.entities[name].y > y && !gamelib.entities[name].isCollided("top")){
              gamelib.entities[name].move(0, -1);
            }

            console.log(gamelib.entities[name].x, gamelib.entities[name].y);
          }, step);
        }else{
            var entityName = pos;
            gamelib.entities[name].entmiid = setInterval(function(){

              if((gamelib.entities[name].x == gamelib.entities[entityName].x) && (gamelib.entities[name].y == gamelib.entities[entityName].y)){
                console.log("stop");
                clearInterval(gamelib.entities[name].entmiid);
                setTimeout(function(){
                  collback();
                }, step);
              }

              if(gamelib.entities[name].x < gamelib.entities[entityName].x && !gamelib.entities[name].isCollided("right")){
                gamelib.entities[name].move(1, 0);
              }else if(gamelib.entities[name].x > gamelib.entities[entityName].x && !gamelib.entities[name].isCollided("left")){
                gamelib.entities[name].move(-1, 0);
              }

              if(gamelib.entities[name].y < gamelib.entities[entityName].y && !gamelib.entities[name].isCollided("bottom")){
                gamelib.entities[name].move(0, 1);
              }else if(gamelib.entities[name].y > gamelib.entities[entityName].y && !gamelib.entities[name].isCollided("top")){
                gamelib.entities[name].move(0, -1);
              }

              console.log(gamelib.entities[name].x, gamelib.entities[name].y);
          }, step);
        }
    }

    this.bind = function(top, bottom, left, right){
      window.onkeypress = function(e){
        switch(e.key){
          case top:{
            if(!gamelib.entities[name].isCollided("top")) gamelib.entities[name].move(0, -1);
            break;
          }
          case bottom:{
            if(!gamelib.entities[name].isCollided("bottom")) gamelib.entities[name].move(0, 1);
            break;
          }
          case left:{
            if(!gamelib.entities[name].isCollided("left")) gamelib.entities[name].move(-1, 0);
            break;
          }
          case right:{
            if(!gamelib.entities[name].isCollided("right")) gamelib.entities[name].move(1, 0);
            break;
          }
        }
      }
    }

    this.kill = function(){
      delete gamelib.entities[name];
      gamelib.block.set( gamelib.block.default, this.x, this.y);
      gamelib.block.draw();
      delete this;
    }

    gamelib.entities[name] = this;
  },

  build: function(s, b){
    if(s){
      gamec.onclick = function(e){
        var box = gamec.getBoundingClientRect();
        var x = Math.floor((e.x + box.left) / gamelib.block.size), y = Math.floor((e.y + box.top) / gamelib.block.size);
        gamelib.block.set(b, x, y);
        gamelib.block.draw();
        console.log(x, y);
      }
    }else{
      gamec.onclick = function(){}
    }
  },

  random: function(min, max){
    return Math.floor(Math.random() * max) + min;
  },

  init: function(cw, ch, bs, db, tf, tx, nl){
    this.width = cw;
    this.height =  ch;
    this.block.size = bs;
    this.block.folder = (tf || ".") + "/";
    this.block.ext = "." + (tx || "png");
    this.block.default = db;

    this.blocks = new Array(cw);
    for(var i = 0; i < cw; i++){
      this.blocks[i] = new Array(ch);
      for(var j = 0; j < ch; j++){
        this.blocks[i][j] = this.block.folder + this.block.default + this.block.ext;
      }
    }

    this.entities = {};

    if(!nl){
		document.write("<canvas id='gamec' width=" + (cw * bs) + " height=" + (ch * bs) + "></canvas>");
    //style='position: absolute; left: 0px; top: 0px;'
	}else{
		document.write("<canvas title='Made with GameLib' id='gamec' width=" + (cw * bs) + " height=" + (ch * bs) + "></canvas>");
	}

    this.game = gamec.getContext("2d");
    this.block.draw();
  }
}


window.gl = gamelib;
