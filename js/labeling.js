//watch
if (!Object.prototype.watch){ Object.defineProperty(Object.prototype, "watch", { enumerable: false , configurable: true , writable: false , value: function (prop, handler) { var oldval = this[prop] , newval = oldval , getter = function () { return newval; } , setter = function (val) { oldval = newval; return newval = handler.call(this, prop, oldval, val); } ; if (delete this[prop]) { Object.defineProperty(this, prop, { get: getter , set: setter , enumerable: true , configurable: true }); } } }); }

queryElement.prototype.changeAll = function(callback){
	var este = this;
	var val = miniQuery(this).val();
	var interval;

	function validate(){
		if( val != miniQuery(este).val() ){
			callback.call(este);
			val = miniQuery(este).val();
		}		
	}
	function init(){
		interval = setInterval(function(){
			validate();
		}, 20);		
	}

	miniQuery(this)[0].onfocus =function(){ init(); };
	miniQuery(this)[0].onblur = function(){ clearInterval(interval); };
	miniQuery(this)[0].oninput = function(){ validate(); };
	miniQuery(this)[0].onchange = function(){ validate(); };
	return this;
};

// **Modelo
var model = {
	//Constructor del modelo
	export : function(nameModel, valueModel){
		//nombres de modelos que estan restringidos
		var restrict = {
			export : true,
			reload : true,
			object : true
		};
		//Valida si no tiene un nombre de modelo restringido
		if( (!restrict[nameModel])&&(nameModel != '') ){
			//Crea las secciones scope, y object en el modelo
			model[nameModel] = valueModel;
			model[nameModel]['scope'] = [];
			model[nameModel]['object'] = miniQuery('*[env='+nameModel+']');
		}else{
			//Informa que el nombre del modelo esta restringido
			console.log('The word "'+nameModel+'" is restricted.');
		}
	},
	//Recarga las etiquetas dinamicas relacionadas con el modelo
	reload : function(e){
		var obj = e['object'];

		//Recorre todos los elementos hijos
		obj.find('*').each(function(){
			//Valida si el modelo del padre es igual al modelo del elemento
			if( (miniQuery(this).parent('*[env]').attr('env') == obj.attr('env'))&&(!miniQuery(this).children('*').length) ){
				if(miniQuery(this).is('input, textarea')){
					if(miniQuery(this).attr('bind') != ''){
						var text = miniQuery(this).attr('bind');
						miniQuery(this).removeAttr('bind');
					}
				}else{
					var text = miniQuery(this).text();
				}
					text = (this.modelText)?this.modelText:this.modelText = text; //Valida el binding
				var regexp = /\{\{([^\}]+)\}\}/;
				//Se repite hasta que no existan bindings
				while( regexp.test(text) ){
					var attr = regexp.exec(text)[1]; //Captura el contenido del binding
					var filterFunc = (attr.split(/\|/g)[1]||'').trim();
						attr = (attr.split(/\|/g)[0]||'').trim();
					if( /^#/.test(attr) ){
						text = text.replace(regexp, '&lcub;&lcub;'+attr.replace(/^#/, '')+'&rcub;&rcub;');
					}
					else if( (typeof eval('e.'+attr) == 'string')||(typeof eval('e.'+attr) == 'number') ){
						//Valida si existe el nombre de variable del binding y si es texto o numero
						if(filterFunc){
							var param = (/\(([^\)]+)\)/.exec(filterFunc)||['',''])[1];
							if( param ){
								filterFunc = filterFunc.split(/[\(\)]/g)[0];
								var val = (filter[filterFunc])?filter[filterFunc].call('"'+eval('e.'+attr)+'", '+param):eval('e.'+attr);
							}else{
								var val = (filter[filterFunc])?filter[filterFunc].call(eval('e.'+attr)):eval('e.'+attr);
							}
						}else{
							var val = eval('e.'+attr);
						}
						text = text.replace(regexp, val); //Reemplaza el binding por el valor
					}else{
						var aux = false;

						//Genera un siclo con las variables heredadas
						for(i = 0; i < e['scope'].length; i++){
							//Valida si existe una variable heredada con el nombre del binding
							if(typeof e['scope'][i][attr] != 'undefined'){
								aux = i;
							}
						}
						//Valida si se encontro una variable heredada con e nombre del binding
						if(aux !== false){
							this.modelText = this.modelText.replace(new RegExp('\\{\\{'+attr+'\\}\\}'), '{{scope['+aux+'].'+attr+'}}'); //Cambia el formato del binding por el de la nueva variable
							model.reload(e); //Recarga los bindings del modelo
							return true;
						}else{
							text = text.replace(regexp, ''); //Al no encontrarse la varible se borra el binding
						}
					}
				}

				//Valida si no tiene elementos hijos o comentarios en su interior
				if((! miniQuery(this).children('*').length)&&(! miniQuery(this).contents().filter(function(){ return this.nodeType == 8; }).length) ){
					if( miniQuery(this).is('input, textarea') ){
						var elem = this;
						if( (!this.changeAllEvent)&&(this.modelText) ){
							elem.changeEvent = true;
							miniQuery(this).changeAll(function(){
								elem.changeAllEvent = true;
								elem.changeEvent = false;
								var attr = elem.modelText.replace(/\{/g, '').replace(/\}/g, '');
								e[attr] = miniQuery(this).val();
							});
						}
						if(elem.changeEvent){
							miniQuery(this).val(text); //Cambia el value del input
						}else{
							elem.changeEvent = true;
						}
					}else{
						miniQuery(this).html(text); //Imprime el texto nuevo
					}
				}
			}
		});
	}
};
// **Controlador
var controller = {
	export : function(nameController, funcController){ //Constructor del controlador
		//Valida si el nombre del controlador es distinto a "export"
		if(nameController != 'export'){
			//Guarda el controlador con su nombre
			controller[nameController] = function(obj){
				var este = this;
				var attr = miniQuery(obj).attr('env');
				var labels = {};
					labels[attr] = miniQuery(obj);
				//Recorre todos las variables de su modelo
				for(var i in this){
					//Empieza a "escuchar" si hay un cambio en la variable
					this.watch(i, function(prop, oldval, val){
						setTimeout(function(){
							//Al cambiar el valor de la variable se recarga los bindings del modelo
							model.reload(este);
							//Recarga el modelo de los elementos hijos
							miniQuery(obj).find('*[env]').each(function(){
								var env = miniQuery(this).attr('env');
								model.reload(model[env]);
							});
						}, 20);
						return val;
					});
				}

				//Genera un objeto con los elementos con atributo label=""
				miniQuery(obj).find('*[label]').each(function(){
					var label = miniQuery(this).attr('label');
					labels[label] = miniQuery(obj).find('*[label='+label+']');
				});
				env[attr] = miniQuery(obj);
				for(var i in labels){
					env[attr][i] = labels[i];
				}
				model.reload(this); //Recarga los bindings del modelo
				funcController.call(this, labels); //Ejecuta el controlador
			}
		}
	}
};
// **Router
var router = {
	export : function(nameRouter, funcRouter){
		router.routes[nameRouter] = funcRouter;
	},
	change : function(url, step){
		if(step){
			for(i in router.routes){
				var dataGet = {};
				var urlAux = url;
				var iAux = i;
				var regexp = iAux.replace(/:([a-zA-Z0-9]+)/g, '[a-zA-Z0-9]+');
					regexp = new RegExp('^'+regexp+'$');

				if( regexp.test(urlAux) ){
					urlAux = urlAux.split(/\//g);
					iAux = iAux.split(/\//g);

					for(j = 0; j < iAux.length; j++){
						if( /^:/.test(iAux[j]) ){
							dataGet[iAux[j].replace(/^:/, '')] = urlAux[j];
						}
					}
					router.routes[i](dataGet);
				}
			}
		}else{
			window.location.hash = '#'+url;
		}
	},
	show : function(nameScene, data){
		var url = router.options.initUrl+router.scenes[nameScene].url;

		for(i in data){
			url = url.replace(':'+i, data[i]);
		}

		url = url.replace(/:[a-zA-Z0-9]+/g, '');
		router.hidden(nameScene);

		miniQuery.get(url, function(data){
			router.scenes[nameScene].obj.after(data);
		});
	},
	hidden : function(nameScene){
		var comment = false;
		router.scenes[nameScene].obj
			.parent()
			.contents()
			.each(function(){
				if(comment){
					if(!/:end$/.test((this.nodeValue||'').replace(/\s+$/, ''))){
							miniQuery(this).remove();
					}else{
						comment = false;
					}
				}else{
					comment = false;
				}
				if(this == router.scenes[nameScene].obj[0] ){
					comment = (comment)?false:true;
				}
			});
	},
	routes : {},
	scenes : {},
	options : {
		initUrl : '',
		history : {}
	}
};
var cookie = {
	get : function(cname){
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
		}
		return "";
	},
	set : function(cname, cvalue, exdays){
		var d = new Date();
		if(!exdays) var exdays = 360;
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
		return cvalue;
	}
};
var env = {};
var filter = {
	
};
var global = {
	url : window.location.url,
	browser : '',
	divice : '',
	lang : '',
	first : true
}
window.onhashchange = function(){
	router.change(window.location.hash.replace(/^#/, ''), true);
};
// **Comentarios dinamicos
//Busca todos los elementos
miniQuery('*').each(function(){
	var este = miniQuery(this); //Guarda el elemento del DOM
	
	miniQuery(this)
		.contents() //Busca sus elementos "hijos"
		.filter(function(){ return this.nodeType == 8; }) //Filtra solo los comentarios
		.each(function(i, e){ //Genera un siclo con los comentarios "hijos"
			var label = miniQuery(this); //Guarda el comentario del DOM
			var e = this;
			//Valida el contenido del comentario
			if( /^\s+?include\s/.test(e.nodeValue) ){ //En caso de ser un include:NOMBREDEARCHIVO
				//Consulta el contenido del archivo
				miniQuery.get(e.nodeValue.replace(/^\s+/g, '').replace(/\s+$/g, '').split(' ')[1], function(data){
					miniQuery(label)
						.after(data) //Despues del comentario imprime el conenido del archivo
						.remove(); //Elimina el comentario

					//Valida si el comentario tiene como padre un elemento con atributo env=""
					if( miniQuery(este).parent('*[env]').length ){
						var env = miniQuery(este).parent('*[env]').attr('env');

						//Recarga el modelo del atributo para activar el binding
						model.reload(model[env]);
					}
				});
			}else if( /^\s+?router\s[a-zA-Z0-9]+\s.+/.test(e.nodeValue) ){
				var values = e.nodeValue.replace(/^\s+/g, '').replace(/\s+$/g, '').split(/\s/g);
				router.scenes[values[1]] = {
					url : values[2],
					obj : miniQuery(this)
				};
				e.nodeValue = values[1]+':start';
				miniQuery(this).after('<!--'+values[1]+':end-->');
			}
		});
});

// **Inicializacion
miniQuery(function(){
	//Guarda la base de la url
	router.options.initUrl = window.location.origin+window.location.pathname.replace(/[a-zA-Z0-9\_\-\.]+$/, '');
	//Llama el evento router
	window.onhashchange();

	//Busca todos los elementos con env=""
	miniQuery('*[env]').each(function(){
		var env = miniQuery(this).attr('env');
		//Si no existe el modelo o controlador del elemento los crea "vacíos"
		(model[env])?model[env]:model.export(env, {});
		(controller[env])?controller[env]:controller.export(env, function(){});
		
		//Valida si este elemento tiene un padre con env="" 
		if( miniQuery(this).parents('*[env]').length ){

			//Por cada padre guarda en scope su modelo
			miniQuery(this).parents('*[env]').each(function(){
				var attr = miniQuery(this).attr('env');
				model[env]['scope'][model[env]['scope'].length] = model[attr];
			});
		}

		//Llama al controlador del elemento
		controller[env].call(model[env], miniQuery(this));
	});
});