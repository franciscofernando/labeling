// **https://gist.github.com/eligrey/384583
//Crea un prototipo watch en el objeto
if (!Object.prototype.watch){ Object.defineProperty(Object.prototype, "watch", { enumerable: false , configurable: true , writable: false , value: function (prop, handler) { var oldval = this[prop] , newval = oldval , getter = function () { return newval; } , setter = function (val) { oldval = newval; return newval = handler.call(this, prop, oldval, val); } ; if (delete this[prop]) { Object.defineProperty(this, prop, { get: getter , set: setter , enumerable: true , configurable: true }); } } }); }
//Crea un prototipo watch en el arreglo
if (!Array.prototype.watch){Array.defineProperty(Array.prototype, "watch", {enumerable: false ,configurable: true ,writable: false ,value: function (prop, handler) {var oldval = this[prop], newval = oldval, getter = function () { return newval; }, setter = function (val) {oldval = newval;return newval = handler.call(this, prop, oldval, val);};if (delete this[prop]) {Array.defineProperty(this, prop, {get: getter, set: setter, enumerable: true, configurable: true});}}});}

$.fn.changeAll = function(callback){
	var este = this;
	var val = $(this).val();
	var interval;

	function init(){
		interval = setInterval(function(){
			if(val != $(este).val()){
				val = $(este).val();
				callback.call(este);
			}
		}, 20);		
	}

	$(this).focus(function(){ init(); });
	$(this).focusout(function(){ clearInterval(interval); });

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
		if( !restrict[nameModel] ){
			//Crea las secciones scope, y object en el modelo
			model[nameModel] = valueModel;
			model[nameModel]['scope'] = [];
			model[nameModel]['object'] = $('*[name='+nameModel+']');
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
			if( $(this).closest('*[name]').attr('name') == obj.attr('name') ){

				var text = ( $(this).is('input, textarea') )?$(this).val():$(this).text();
					text = (this.modelText)?this.modelText:this.modelText = text; //Valida el binding
				var regexp = /\{\{([a-zA-Z0-9.\[\]\'\#]+)\}\}/;

				//Se repite hasta que no existan bindings
				while( regexp.test(text) ){
					var attr = regexp.exec(text)[1]; //Captura el contenido del binding
					
					if( /^#/.test(attr) ){
						text = text.replace(regexp, '&lcub;&lcub;'+attr.replace(/^#/, '')+'&rcub;&rcub;');
					}
					else if( (typeof eval('e.'+attr) == 'string')||(typeof eval('e.'+attr) == 'number') ){
						//Valida si existe el nombre de variable del binding y si es texto o numero
						text = text.replace(regexp, eval('e.'+attr)); //Reemplaza el binding por el valor
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
				if((! $(this).children('*').length)&&(! $(this).contents().filter(function(){ return this.nodeType == 8; }).length) ){
					if( $(this).is('input, textarea') ){
						var elem = this;
						if(!this.changeAllEvent){
							$(this).changeAll(function(){
								elem.changeAllEvent = true;
								var attr = elem.modelText.replace(/\{/g, '').replace(/\}/g, '');
								e[attr] = $(this).val();
							});
						}
						$(this).val(text); //Cambia el value del input
					}else{
						$(this).html(text); //Imprime el texto nuevo
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
				var labels = {};

				//Recorre todos las variables de su modelo
				for(i in this){

					//Empieza a "escuchar" si hay un cambio en la variable
					this.watch(i, function(prop, oldval, val){
						setTimeout(function(){
							//Al cambiar el valor de la variable se recarga los bindings del modelo
							model.reload(este);
							//Recarga el modelo de los elementos hijos
							$(obj).find('*[name]').each(function(){
								var name = $(this).attr('name');
								model.reload(model[name]);
							});
						}, 20);
						return val;
					});
				}

				//Genera un objeto con los elementos con atributo label=""
				$(obj).find('*[label]').each(function(){
					var label = $(this).attr('label');
					labels[label] = $(obj).find('*[label='+label+']');
				});

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

		$.get(url, function(data){
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
							$(this).remove();
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
window.onhashchange = function() {
	router.change(window.location.hash.replace(/^#/, ''), true);
}
// **Comentarios dinamicos
//Busca todos los elementos
$('*').each(function(){
	var este = $(this); //Guarda el elemento del DOM
	
	$(this)
		.contents() //Busca sus elementos "hijos"
		.filter(function(){ return this.nodeType == 8; }) //Filtra solo los comentarios
		.each(function(i, e){ //Genera un siclo con los comentarios "hijos"
			var label = $(this); //Guarda el comentario del DOM

			//Valida el contenido del comentario
			if( /^\s+?include\s/.test(e.nodeValue) ){ //En caso de ser un include:NOMBREDEARCHIVO
				//Consulta el contenido del archivo
				$.get(e.nodeValue.replace(/^\s+/g, '').replace(/\s+$/g, '').split(' ')[1], function(data){
					$(label)
						.after(data) //Despues del comentario imprime el conenido del archivo
						.remove(); //Elimina el comentario

					//Valida si el comentario tiene como padre un elemento con atributo name=""
					if( $(este).closest('*[name]').length ){
						var name = $(este).closest('*[name]').attr('name');

						//Recarga el modelo del atributo para activar el binding
						model.reload(model[name]);
					}
				});
			}else if( /^\s+?router\s[a-zA-Z0-9]+\s.+/.test(e.nodeValue) ){
				var values = e.nodeValue.replace(/^\s+/g, '').replace(/\s+$/g, '').split(/\s/g);
				router.scenes[values[1]] = {
					url : values[2],
					obj : $(this)
				};
				e.nodeValue = values[1]+':start';
				$(this).after('<!--'+values[1]+':end-->');
			}
		});
});

// **Inicializacion
$(document).ready(function(){
	//Guarda la base de la url
	router.options.initUrl = window.location.origin+window.location.pathname.replace(/[a-zA-Z0-9\_\-\.]+$/, '');
	//Llama el evento router
	window.onhashchange();

	//Busca todos los elementos con name=""
	$('*[name]').each(function(){
		var name = $(this).attr('name');

		//Si no existe el modelo o controlador del elemento los crea "vacíos"
		(model[name])?model[name]:model.export(name, {});
		(controller[name])?controller[name]:controller.export(name, function(){});
		
		//Valida si este elemento tiene un padre con name="" 
		if( $(this).parents('*[name]').length ){

			//Por cada padre guarda en scope su modelo
			$(this).parents('*[name]').each(function(){
				var attr = $(this).attr('name');
				model[name]['scope'][model[name]['scope'].length] = model[attr];
			});
		}

		//Llama al controlador del elemento
		controller[name].call(model[name], this);
	});
});