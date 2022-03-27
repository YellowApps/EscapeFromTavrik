//BCLib JavaScript Library
//by pixels4tech@gmail.com

var bclib = {
      CLI: {
        createCLIWindow: function(t, state){
          createWindow(t, "<div id='clishell' style='background: black; color: white; font-family: Courier, monospace; "+ (state ? "width: 300px; height: 200px;" : "") + "'></div>")
        },
        echo: function(txt){
          clishell.innerHTML += txt+"<br>"
        },
        clear: function(){
          clishell.innerHTML = ""
        },
        input: function(todo){
          clishell.innerHTML += "<input type='text' id='inp' style='color: white; background: black; font-family: monospace;'><br><button style='color: white; background: black;' onclick='bclib.temp.inputValue = inp.value; "+todo+"'>OK</button><br>"
        }
      },
      util: {
        installApp: function(file){

        },
        utilmgr: function(object){
          createWindow("Utility Manager", "<input type='text' id='obj' placeholder='Адрес объекта' value='bclib.util'> <button id='ok'>OK</button><hr style='margin:0px;'><div id='list'></div><input type='text' id='params' placeholder='Параметры'>")

          ok.onclick = function(){
            list.innerHTML = ""
            for(var i in eval(obj.value)){
                if(typeof(eval(obj.value)[i]) == "function"){
                    list.innerHTML += "<img src='images/run.png' width=16 height=16> <code onclick='eval(\""+obj.value+"."+i+"(\"+params.value+\")"+"\")'>" + i +"</code><hr style='margin:0px;'>"
                }
            }
          }

          if(object){
            obj.value = object
            ok.click()
          }
        },
        yedit: function(object){
          createWindow("YEditor", "<input type='text' id='obj' placeholder='Адрес объекта' value='bclib.util'> <button id='ok'>OK</button><hr style='margin:0px;'><div id='list'></div><button id='del_'>Удалить</button> <button id='new_'>Создать</button>")

          ok.onclick = function(){
            list.innerHTML = ""
            for(var i in eval(obj.value)){
                list.innerHTML += "<img src='images/file-js.png' width=16 height=16> <code onclick='bclib.util.edit(\""+obj.value+"."+i+"\")'>" + i +"</code><hr style='margin:0px;'>"
            }
          }

          del_.onclick = function(){
            createWindow("Удалить", "<input id='todel'> <button id='okdel'>OK</button>");
            okdel.onclick = function(){eval("delete " + obj.value + "." + todel.value)}
          }

          new_.onclick = function(){
            createWindow("Создать", "<input id='tonew'> <button id='oknew'>OK</button>")
            oknew.onclick = function(){eval(obj.value + "." + tonew.value + " = ''")}
          }

          if(object){
            obj.value = object
            ok.click()
          }
        },
        run: function(tr){
          try{
            return eval(tr)
          }catch(e){
            return e
          }
        },
        close: function(){
          windows.innerHTML = ""
        },
        reboot: function(){
          window.location.reload()
        },
        showMessage: function(title, text, btn, click){
          createWindow(title, text + "<br><button onclick='"+click+"'>"+btn+"</button>")
        },
        addApp: function(file, url, width, height){
          bclib.storage[file] = "createWindow('"+file+"', '<iframe style=\"overflow: auto; resize: both;\" src=\""+url+"\" width="+width+" height="+height+"></iframe>')"
        },
        openPage: function(page){
          createWindow(page, "<iframe style='overflow: auto; resize: both;' src='"+page+"' width=400 height=300></iframe>")
        },
        mediaplayer: function(file, state){
          var fileJSON = JSON.parse(bclib.storage[file])
          if(state == "get"){
            return fileJSON
          }
          var out = "<h1>Error</h1>Incorrect mediafile."
          switch(fileJSON.type){
            case("video"):
              out = "<video width="+fileJSON.width+" height="+fileJSON.height+" src='"+fileJSON.link+"' controls></video>"
              createWindow(file + " - Mediaplayer", out)
              break
            case("audio"):
              out = "<audio width="+fileJSON.width+" height="+fileJSON.height+" src='"+fileJSON.link+"' controls></audio>"
              break
              case("image"):
              out = "<img width="+fileJSON.width+" height="+fileJSON.height+" src='"+fileJSON.link+"'>"
              createWindow(file + " - Mediaplayer", out)
              break
            case("canvas"):
              out = "<canvas id='cnv' width="+fileJSON.width+" height="+fileJSON.height+" ></canvas>"
              createWindow(file + " - Mediaplayer", out)
              bclib.temp.ctx = document.getElementById("cnv").getContext("2d")
              eval(fileJSON.code)
              break
          }

        },
        varexp: function(obj){
          createWindow("Variables Explorer", "<div id='varexp' style='color: white; background: black; font-family: monospace;'></div>")
          varexp.innerHTML += "Name&nbsp;&nbsp;&nbsp;Type&nbsp;&nbsp;&nbsp;Value<br><br>"
          var value = ""
          for(var i in window[obj]){
            switch(typeof(window[obj][i])){
            case("object"):
              value = Object.keys(window[obj][i]).join(", ")
              break
            case("function"):
              break
            default:
              value = window[obj][i]
            }
          varexp.innerHTML += (i + "&nbsp;&nbsp;&nbsp;" + typeof(window[obj][i]) + "&nbsp;&nbsp;&nbsp;" + value + "<br>")
          }
        },
        cmd: function(state){
			bclib.CLI.createCLIWindow('Command Line', state); bclib.CLI.input('bclib.CLI.echo(bclib.util.run(bclib.temp.inputValue))')
        },
        taskmgr: function(){
          taskmgr.click()
        },
        filemgr: function(){
        var systxt = ""
        var progtxt = ""
        var txt = ""
        var file = ""
        var title = ""
        var isSF = false
        for(var i in bclib.storage){
          var click = "bclib.util.file.edit(\""+i+"\")"
          var rclick = click
          if(i.slice(0, 7) == "hidden:"){
            continue
          }else if(i.slice(i.length-3) == ".js"){
            file = "run.png"
            title = "Программа JavaScript (*.js)"
            click="try{eval(bclib.storage[\""+i+"\"])}catch(e){createWindow(\"Error\", e)}"
          }else if(i.slice(i.length-5) == ".prog" || i.slice(i.length-4) == ".app"){
            file = "run.png"
            title = "Приложение (*.prog, *.app)"
            click="try{eval(bclib.storage[\""+i+"\"])}catch(e){createWindow(\"Error\", e)}"
            rclick=""
          }else if(i.slice(i.length-5) == ".html" || i.slice(i.length-4) == ".htm"){
            file = "file-html.png"
            title = "HTML - страница (*.htm, *.html)"
            click="bclib.util.file.open(\""+i+"\")"
            rclick="bclib.util.file.edit(\""+i+"\", true)"
          }else if(i.slice(i.length-4) == ".sys"){
            file = "file-sys.png"
            title = "Системный файл (*.sys)"
          }else if(i.slice(i.length-5) == ".func"){
            file = "file-js.png"
            title = "Функция (*.func)"
          }else if(i.slice(i.length-5) == ".json"){
            file = "file-js.png"
            title = "JSON - файл (*.json)"
            //click=""
            //rclick=""
          }else if(i.slice(i.length-4) == ".lib"){
            file = "file-sys.png"
            title = "Библиотека (*.lib)"
          }else if(i.slice(i.length-4) == ".txt"){
            file = "file.png"
            title = "Текстовый файл (*.txt)"
          }else if(i.slice(i.length-3) == ".bc"){
            file = "file-sys.png"
            title = "Системная программа (*.bc)"
            click="eval(bclib.storage[\""+i+"\"])"
            //rclick=""
          }else if(i.slice(i.length-4) == ".mlf"){
            file = "file.png"
            title = "Mediaplayer Link File"
            click="bclib.util.mediaplayer(\""+i+"\")"
          }else if(i.slice(i.length-4) == ".pkg"){
            file = "file-js.png"
            title = "Пакет"
            click="bclib.CLI.createCLIWindow(\"\",1);bclib.CLI.echo(bclib.pkg.install(\""+i+"\"))"
          }else{
            switch(i){
              case "key":
              case "length":
              case "getItem":
              case "setItem":
              case "removeItem":
              case "clear":
                continue
                break
              default:
                file = "file.png"
                title = "Файл (*.*)"
            }
          }
          if(file == "file-sys.png"){
            systxt += "<img src='images/"+file+"' width=20 height=22><code title='"+title+"' oncontextmenu=\'"+rclick+"; return false;\' onclick=\'"+click+"\' >" + i + "</code><hr style='margin: 0px;'>"
          }else if(file == "file-js.png" || file == "run.png"){
            progtxt += "<img src='images/"+file+"' width=20 height=22><code title='"+title+"' oncontextmenu=\'"+rclick+"; return false;\' onclick=\'"+click+"\' >" + i + "</code><hr style='margin: 0px;'>"
          }else{
            txt += "<img src='images/"+file+"' width=20 height=22><code title='"+title+"' oncontextmenu=\'"+rclick+"; return false;\' onclick='"+click+"' >" + i + "</code><hr style='margin: 0px;'>"
          }
        }
      createWindow("File Manager", systxt + progtxt + txt + "<button onclick='bclib.temp.del()'>Удалить файл</button> <button onclick='bclib.temp.new()'>Новый файл</button>")
        bclib.temp.del = function(){
          createWindow("Удалить","<input id='todel'> <button onclick='bclib.temp.deletedFiles[todel.value] = bclib.storage[todel.value]; delete bclib.storage[todel.value]'>OK</button>")
        }
        bclib.temp.new = function(){
          createWindow("Создать","<input id='fn'> <button onclick='bclib.file.write(fn.value, \"\")'>OK</button>")
        }
        },
        edit: function(v){
          createWindow(v, "<textarea id=TA rows=7 cols=22>"+eval(v)+"</textarea><br><button id=BTN>OK</button>")
          BTN.onclick = function(){eval(v + " = " + "'" + TA.value + "'")}
        },
        ythemer: function(){
          createWindow("YThemer", "\
          <fieldset><legend>Фон</legend>\
          <input id='clr' type='color' value='#ff0000'><button onclick='bclib.temp.chclr()' style='float: right;'>OK</button></fieldset>\
          <fieldset><legend>Окна</legend>\
          <div style='clear: both;'>windowStyle <button style='float: right;' onclick='bclib.util.edit(\"bclib.temp.windowStyle\")'>Открыть</button></div>\
          <div style='clear: both;'>windowHeaderStyle <button style='float: right;' onclick='bclib.util.edit(\"bclib.temp.windowHeaderStyle\")'>Открыть</button></div>\
          <div style='clear: both;'>closeButtonStyle <button style='float: right;' onclick='bclib.util.edit(\"bclib.temp.closeButtonStyle\")'>Открыть</button></div>\
          <div style='clear: both;'>closeButtonText <button style='float: right;' onclick='bclib.util.edit(\"bclib.temp.closeButtonText\")'>Открыть</button></div></fieldset>");

          bclib.temp.chclr = function(){
          delete document.body.style.backgroundImage;
          document.body.style.background = clr.value;
          }
        },
      },
        file: {
          write: function(filename, text){
            bclib.storage[filename] = text
          },
          add: function(filename, text){
            bclib.storage[filename] += text
          },
          read: function(filename){
            return bclib.storage[filename]
          },
          edit: function(filename, state){
            if(state){
              createWindow(filename, "<div id=TA contenteditable style=\"outline: none;\">" + bclib.storage[filename] + "</div><hr style=\"margin: 0px;\"><button id=BTN>OK</button>")
            }else{
              createWindow(filename, "<textarea rows=7 cols=22 id=TA>"+bclib.storage[filename]+"</textarea><br><button id=BTN>OK</button>")
            }
            BTN.onclick = function(){bclib.storage[filename] = TA.value || TA.innerHTML}
          },
          run: function(filename){
            try{
              return eval(bclib.storage[filename])
            }catch(e){
              return e
            }
          },
          delete: function(filename){
            delete bclib.storage[filename]
          },
          download: function(filename, link){
			var xhr = WScript.CreateObject("Microsoft.XMLHTTP");
			xhr.Open("GET", link, false);
			xhr.Send(null);
			bclib.file.write(filename, xhr.responseText);
          },
		  dump: function(obj){
			if(!obj) obj = bclib.storage;

			var r = "Dumping " + obj + " to FS...<br>";
			try{
				var fs = WScript.CreateObject("Scripting.FileSystemObject");
				var fls = Object.keys(bclib.storage);
				for(var i in bclib.storage){
					var f = fs.CreateTextFile("files\\" + i, 1, 0);
					f.Write(bclib.storage[i]);
					f.Close();
					r += "Dumped bclib.storage[\"" + i + "\"] to FS.<br>";
				}
				r += "Dumped bclib.storage to FS.";
			}catch(e){
				r += "Dump failed: " + e;
			}
			return r;
		  },
		  load: function(){
			var r = "Loading files to bclib.storage...<br>";
			bclib.storage = {}

			var fs = WScript.CreateObject("Scripting.FileSystemObject");
			var files = fs.GetFolder("files");

			for(var e = new Enumerator(files.Files); !e.atEnd(); e.moveNext()){
				bclib.storage[e.item().Name] = fs.OpenTextFile(e.item().Path).ReadAll();
				r += "Loaded " + e.item().Name + " to bclib.storage.<br>"
			}
			r += "Loaded files to bclib.storage.";
			return r;
		  },
          open: function(filename){
            createWindow(filename, "<div>" + bclib.util.file.read(filename) + "</div>")
          }
        },
      temp: {
        windowStyle: "overflow: auto; resize: both; background: white; display: inline-block; border: solid 1px black; position: absolute;",
        closeButtonStyle: "float: right; background: white; border: solid 1px black;",
        windowHeaderStyle: "",

        closeButtonText: " X ",

        deletedFiles: {},

      },
      themes: {
            normal: function(){
                 bclib.temp.windowStyle = "overflow: auto; resize: both; background: white; display: inline-block; border: solid 1px black; position: absolute;",
                 bclib.temp.closeButtonStyle = "float: right; background: white; border: solid 1px black;",
                 bclib.temp.windowHeaderStyle = "",
                 createWindow("", "<h1>Done.</h1>");
            },
            dark: function(){
                 delete document.body.style.backgroundImage;
                 document.body.style.background = "#000000";
                 bclib.temp.closeButtonStyle = "float: right; background: black; color: white; border: solid 1px white;";
                 bclib.temp.windowStyle += "background: black; color: white; border: solid 1px white;";
                 bclib.util.close();
                 createWindow("", "<h1>Done.</h1>");
            },
            winxp: function(){
                  bclib.temp.windowStyle = "overflow: auto; resize: both; background: white; display: inline-block; border: solid 2px blue; margin: 2px; position: absolute; border-radius: 5px;",
                  bclib.temp.closeButtonStyle = "float: right; background: red; color: white; padding-left: 5px; padding-right: 5px; font-weight: bold; border-radius: 5px;",
                  bclib.temp.windowHeaderStyle = "background: blue; color: white;"
            },
            secret: function(){
                  delete document.body.style.backgroundImage;
                  document.body.style.background = "#39ff14";
                  document.body.style.fontFamily = "Comic Sans MS, Comic Sans, cursive";
                  bclib.temp.windowHeaderStyle = "background: green; color: deepPink; font-size: 300%;";
                  bclib.temp.closeButtonStyle = "float: right; background: aqua; font-size: 100%;"
                  bclib.temp.closeButtonText = " # ";
                  bclib.temp.windowStyle += "background: red; color: blue;"
                  bclib.util.close();
                  createWindow("", "<h1>Done.</h1>");
            }
      },
      desktop: function(){
        desktop.innerHTML += "\
        <img src='images/folder.png' width=50 height=50 onclick='bclib.util.filemgr()'><br><span style='color: white'>Файловый<br>менеджер</span><br><br>\
        <img src='images/cmd.png' width=50 height=50 onclick='bclib.util.cmd(1)'><br><span style='color: white'>Командная<br>строка</span><br><br>"
      },
      json: {
          load: function(file){
              try{
                  bclib.json[file.replace(".json", "")] = JSON.parse(bclib.storage[file]);
              }catch(e){
                  createWindow("JSON", "<pre>" + e + "</pre>");
              }
          }
      },
      task: {
		  kill: function(name){
			  bclib.util.run(bclib.task[name].onclose);
			  delete bclib.task[name];
		  }
	  },
	  pkg: {
		  install: function(name){
			  var pkg;
			  try{
				pkg = JSON.parse(bclib.file.read(name));
			  }catch(e){
				  return "Incorrect package.";
			  }
			  if(pkg.bclibver > bclib.ver) return "Incorrect BCLib version.";
			  var r = "Installing package '" + name + "'...<br>";
			  for(var file in pkg.files){
				  r += "Downloading file '" + file + "'...<br>";
				  bclib.file.download(pkg.name + "." + file, pkg.files[file]);
				  r += "Downloaded file '" + file + "'.<br>";
			  }
			  if(bclib.file.read(pkg.name + ".setup.js")){
				  bclib.file.run(pkg.name + ".setup.js");
				  bclib.file.delete(pkg.name + ".setup.js");
				  r += "Setup.JS found, executing...<br>"
			  }
			  r += "Installed package '" + name + "'";
			  return r;
		  },
		  uninstall: function(name){
			  var r = "Uninstalling package '" + name + "'<br>";
			  for(var i in bclib.storage){
				  if(i.includes(name)){
					  r += "Deleting file '" + i + "'...<br>";
					  delete bclib.storage[i];
					  r += "Deleted file: " + i + "<br>";
				  }
			  }
			  r += "Uninstalled package '" + name + "'."
			  return r;
		  }
	  },
      winOffset: {x: 300, y: 300},
      storage: {},
      version: "BCLib v4.7.0 HTA (12.02.2022)",
      ver: 4.7
  }
var wnd = 0
      function createWindow(title, html){
        wnd++
        var left = Math.floor(Math.random()*(window.innerWidth - bclib.winOffset.x))
        var top = Math.floor(Math.random()*(window.innerHeight - bclib.winOffset.y))
        windows.innerHTML += "<div draggable='true' id='w"+wnd+"' style='"+bclib.temp.windowStyle+"'> <div id='header' style='"+bclib.temp.windowHeaderStyle+"'>" +
        title + " <button tabindex='-1' onclick='windows.removeChild(document.getElementById(\"w"+wnd+"\")); delete bclib.task[\""+title+"\"]' title=\"Закрыть\" style='"+bclib.temp.closeButtonStyle+"'>" + bclib.temp.closeButtonText + "</button></div> " +
          "<hr style='margin: 0px; clear: both; background: black;'>" + html + "</div>"
        document.getElementById("w"+wnd).style.left = left+"px"
        document.getElementById("w"+wnd).style.top = top+"px"
        document.getElementById("w"+wnd).ondragend = function(e){
          e.preventDefault()
          var dx = e.pageX
          var dy = e.pageY
          document.getElementById("w"+wnd).style.left = dx+"px"
          document.getElementById("w"+wnd).style.top = dy+"px"
          //console.log(dx+" "+dy)
          //console.log(document.getElementById("w"+window.wnd)+" "+document.getElementById("w"+window.wnd))
        }
        document.getElementById("w"+wnd).ondrag = function(e){
          e.preventDefault()
        }
        bclib.task[title] = {
          name: title,
          onclose: 'windows.removeChild(document.getElementById("w'+wnd+'")); delete bclib.task["'+title+'"]'
        }

      }

String.prototype.includes = function(search, start){
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
}

bclib.util.tmp = bclib.temp;
bclib.util.file = bclib.file;


window.oncontextmenu = function(){return false}
window.ondragover = function(e){e.preventDefault()}

bclib.storage = {};
