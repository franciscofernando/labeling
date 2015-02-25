//miniQuery
function queryElement(e,t){if(e.window)return this[0]=e.document.documentElement,this.length=1,this;for(var r=0;r<e.length;r++)this[r]=e[r];return this.length=r,this.selector=t||"",this}function $(e){if("function"==typeof e)document.addEventListener("DOMContentLoaded",e);else{if("string"==typeof e){var t=document.querySelectorAll(e),r=[].slice.call(t);return new queryElement(r,e)}if("undefined"!=typeof e.length)return new queryElement(e);if("object"==typeof e)return new queryElement([e])}}queryElement.prototype.addClass=function(e){for(var t=0;t<this.length;t++){var r=this[t].className;new RegExp(e).test(r)||(this[t].className+=(""==r?"":" ")+e)}return this},queryElement.prototype.removeClass=function(e){for(var t=0;t<this.length;t++)this[t].className=this[t].className.replace(new RegExp(e+"\\s?"),"");return this},queryElement.prototype.css=function(e,t){function r(e){return e.replace(/-[a-z]/,function(e){return e.toUpperCase().replace(/^\-/,"")})}if("string"==typeof e){if(t){for(var n=0;n<this.length;n++)this[n].style[r(e)]=t;return this}return this[0].style[r(e)]}if("object"==typeof e){for(var n in e)for(var i=0;i<this.length;i++)this[i].style[r(n)]=e[n];return this}},queryElement.prototype.each=function(e){for(var t=0;t<this.length;t++)e.call(this[t]);return this},queryElement.prototype.eq=function(e){return $(this[e])},queryElement.prototype.find=function(e){for(var t=[],r=0;r<this.length;r++){var n=this[r].querySelectorAll(e);if(n.length)for(var i=0;i<n.length;i++)t.push(n[i])}return $(t)},queryElement.prototype.children=function(e){for(var t=0;t<this[0].children.length;t++){if(e&&0==t)return this[0].children[j];if(this[0].children[t].matches(e))return this[0].children[t]}return $([])},queryElement.prototype.height=function(e){if(e){for(var t=0;t<this.length;t++){var r="string"==typeof e?e:e+"px";$(this[t]).css("height",r)}return this}return this[0].offsetHeight},queryElement.prototype.width=function(e){if(e){for(var t=0;t<this.length;t++){var r="string"==typeof e?e:e+"px";$(this[t]).css("width",r)}return this}return this[0].offsetWidth},queryElement.prototype.attr=function(e,t){if(t){for(var r=0;r<this.length;r++)this[r].setAttribute(e,t);return t}return this[0].getAttribute(e)},queryElement.prototype.removeAttr=function(e){for(var t=0;t<this.length;t++)this[t].removeAttribute(e);return this},queryElement.prototype.text=function(e){if(e){for(var t=0;t<this.length;t++)this[t].textContent=e;return this}return this[0].textContent},queryElement.prototype.html=function(e){if(e){for(var t=0;t<this.length;t++)this[t].innerHTML=e;return this}return this[0].innerHTML},queryElement.prototype.contents=function(){for(var e=[],t=0;t<this.length;t++){var r=this[t].childNodes;if(r.length)for(var n=0;n<r.length;n++)e.push(r[n])}return $(e)},queryElement.prototype.filter=function(e){for(var t=[],r=0;r<this.length;r++)e.call(this[r])||delete this[r];for(var r in this)this[r].nodeName&&t.push(this[r]);return $(t)},queryElement.prototype.remove=function(){for(var e=0;e<this.length;e++){var t=this[e].parentNode;t.removeChild(this[e])}},queryElement.prototype.parent=function(e){for(var t=this[0];t.parentElement;){if(!e)return $(t.parentElement);if(t.parentElement.matches(e))return $(t.parentElement);t=t.parentElement}return $([])},queryElement.prototype.parents=function(e){for(var t=[],r=this[0];r.parentElement;)e?r.parentElement.matches(e)&&t.push(r.parentElement):t.push(r.parentElement),r=r.parentElement;return $(t)},queryElement.prototype.is=function(e){return this[0].matches(e)},queryElement.prototype.val=function(e){if(e){for(var t=0;t<this.length;t++)this[t].value=e;return this}return this[0].value},queryElement.prototype.append=function(e){for(var t=0;t<this.length;t++){var r=document.createElement("div");r.innerHTML=e;for(var n=0;n<r.childNodes.length;n++)this[t].appendChild(r.childNodes[n]),n--}return this},queryElement.prototype.preppend=function(e){for(var t=0;t<this.length;t++){var r=document.createElement("div");r.innerHTML=e;for(var n=this[t].children[0],i=0;i<r.childNodes.length;i++)this[t].insertBefore(r.childNodes[i],n),i--}return this},queryElement.prototype.before=function(e){for(var t=0;t<this.length;t++){var r=this[t].parentElement,n=document.createElement("div");n.innerHTML=e;for(var i=0;i<n.childNodes.length;i++)r.insertBefore(n.childNodes[i],this[t]),i--}return this},queryElement.prototype.after=function(e){for(var t=0;t<this.length;t++){var r=this[t].parentElement,n=document.createElement("div");n.innerHTML=e;for(var i=this[t].nextSibling,o=0;o<n.childNodes.length;o++)r.insertBefore(n.childNodes[o],i),o--}return this},queryElement.prototype.next=function(e){for(var t=this[0];t.nextElementSibling;){if(!e)return $(t.nextElementSibling);if(t.nextElementSibling.matches(e))return $(t.nextElementSibling);t=t.nextElementSibling}return $([])},queryElement.prototype.prev=function(e){for(var t=this[0];t.previousElementSibling;){if(!e)return $(t.previousElementSibling);if(t.previousElementSibling.matches(e))return $(t.previousElementSibling);t=t.previousElementSibling}return $([])},$.ajax=function(object){var ajax=new XMLHttpRequest,type=object.type?object.type.toUpperCase():"GET",url=object.url||"",data=object.data||"",dataType=object.dataType||"";if("object"==typeof object.data){for(var i in object.data)data+=(""==data?"":"&")+i+"="+object.data[i];"GET"==type&&(url=url.replace(/\?$/,"")+"?"+data)}else data=object.data;return ajax.onreadystatechange=function(){if(4==ajax.readyState&&200==ajax.status){if(ajax.doneCallback){var response="JSON"==dataType?eval("("+ajax.responseText+")"):ajax.responseText;ajax.doneCallback(response),delete ajax.doneCallback}}else ajax.errorCallback&&(ajax.errorCallback(ajax.responseText),delete ajax.errorCallback)},ajax.done=function(e){return this.doneCallback=e,this},ajax.error=function(e){return this.errorCallback=e,this},ajax.open(type,url,!0),"GET"==type?ajax.send():(ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded"),ajax.send(data)),ajax},$.get=function(e,t){$.ajax({url:e}).done(t)},function(){function e(e,t){queryElement.prototype[e]=function(r){if(r)for(var n=0;n<this.length;n++)this[n].addEventListener.call(this[n],e,function(e){r.call(this,e)});else t.call(this);return this}}var t={click:function(){this[0].click()},dblclick:!1,change:!1,focus:function(){this[0].focus()},blur:function(){this[0].blur()},cut:!1,copy:!1,contextmenu:!1,drag:!1,dragend:!1,dragenter:!1,dragleave:!1,dragover:!1,dragstart:!1,drop:!1,keydown:!1,keypress:!1,keyup:!1,load:!1,mousedown:!1,mouseenter:!1,mouseleave:!1,mousemove:!1,scroll:!1,submit:!1,afterprint:!1,beforeprint:!1,animationstart:!1,animationiteration:!1,animationend:!1,fullscreenchange:!1,storage:!1,touchcancel:!1,touchenter:!1,touchend:!1,touchleave:!1,touchmove:!1,touchstart:!1,DOMNodeInserted:!1};for(var r in t)e(r,t[r])}(),queryElement.prototype.on=function(e,t,r){if("function"==typeof t||""==this.selector)for(var n=0;n<this.length;n++)this[n][e](t);else for(var n=0;n<this.length;n++)$(this[n]).find(t)[e](r),this[n].livesEvents||(this[n].livesEvents=[]),this[n].livesEvents.push({selector:t,event:e,callback:r}),$(this[n]).DOMNodeInserted(function(t){if(this.livesEvents)for(var n=0;n<this.livesEvents.length;n++)t.srcElement.matches(this.livesEvents[n].selector)&&$(t.srcElement)[e](r)});return this};
//watch
if (!Object.prototype.watch){ Object.defineProperty(Object.prototype, "watch", { enumerable: false , configurable: true , writable: false , value: function (prop, handler) { var oldval = this[prop] , newval = oldval , getter = function () { return newval; } , setter = function (val) { oldval = newval; return newval = handler.call(this, prop, oldval, val); } ; if (delete this[prop]) { Object.defineProperty(this, prop, { get: getter , set: setter , enumerable: true , configurable: true }); } } }); }

$.fn.changeAll = function(callback){
	var este = this;
	var val = $(this).val();
	var interval;

	function init(){
		interval = setInterval(function(){
			if( val != $(este).val() ){
				if(! /^\{\{.+\}\}$/.test(val) ){
					callback.call(este);
				}
				val = $(este).val();
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
			model[nameModel]['object'] = $('*[env='+nameModel+']');
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
			if( $(this).parent('*[env]').attr('env') == obj.attr('env') ){

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
							elem.changeEvent = true;
							$(this).changeAll(function(){
								elem.changeAllEvent = true;
								elem.changeEvent = false;
								var attr = elem.modelText.replace(/\{/g, '').replace(/\}/g, '');
								e[attr] = $(this).val();
							});
						}
						if(elem.changeEvent){
							$(this).val(text); //Cambia el value del input
						}else{
							elem.changeEvent = true;
						}
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
							$(obj).find('*[env]').each(function(){
								var env = $(this).attr('env');
								model.reload(model[env]);
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
var filter = {
	
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

					//Valida si el comentario tiene como padre un elemento con atributo env=""
					if( $(este).parent('*[env]').length ){
						var env = $(este).parent('*[env]').attr('env');

						//Recarga el modelo del atributo para activar el binding
						model.reload(model[env]);
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

	//Busca todos los elementos con env=""
	$('*[env]').each(function(){
		var env = $(this).attr('env');

		//Si no existe el modelo o controlador del elemento los crea "vacíos"
		(model[env])?model[env]:model.export(env, {});
		(controller[env])?controller[env]:controller.export(env, function(){});
		
		//Valida si este elemento tiene un padre con env="" 
		if( $(this).parents('*[env]').length ){

			//Por cada padre guarda en scope su modelo
			$(this).parents('*[env]').each(function(){
				var attr = $(this).attr('env');
				model[env]['scope'][model[env]['scope'].length] = model[attr];
			});
		}

		//Llama al controlador del elemento
		controller[env].call(model[env], this);
	});
});