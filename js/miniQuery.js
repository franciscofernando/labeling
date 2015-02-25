function queryElement(elements, selector){
	if(elements.window){
		this[0] = elements.document.documentElement;
		this.length = 1;
		return this;
	}
	for(var i = 0; i < elements.length; i++){
		this[i] = elements[i];
	}
	this.length = i;
	this.selector = selector || '';
	return this;
}
function $(selector){
	if(typeof selector == 'function'){
		document.addEventListener('DOMContentLoaded', selector);
	}else if(typeof selector == 'string'){
		var elements = document.querySelectorAll( selector );
		var ar = [].slice.call( elements );
		return new queryElement(ar, selector);
	}else if(typeof selector.length != 'undefined'){
		return new queryElement(selector);
	}else if(typeof selector == 'object'){
		return new queryElement([selector]);
	}
};

queryElement.prototype.addClass = function(name){
	for(var i = 0; i < this.length; i++){
		var clases = this[i].className;
		if(!new RegExp(name).test(clases)){
			this[i].className += ((clases == '')?'':' ')+name;
		}
	}
	return this;
};
queryElement.prototype.removeClass = function(name){
	for(var i = 0; i < this.length; i++){
		this[i].className = this[i].className.replace(new RegExp(name+'\\s?'), '');
	}
	return this;
};
queryElement.prototype.css = function(name, value){
	function cssName(name){
		return name.replace(/-[a-z]/, function(m){ return m.toUpperCase().replace(/^\-/, ''); });
	}
	if(typeof name == 'string'){
		if(!value){
			return this[0]['style'][cssName(name)];
		}else{
			for(var i = 0; i < this.length; i++){
				this[i]['style'][cssName(name)] = value;
			}
			return this;
		}
	}else if(typeof name == 'object'){
		for(var i in name){
			for(var j = 0; j < this.length; j++){
				this[j]['style'][cssName(i)] = name[i];
			}
		}
		return this;
	}
};
queryElement.prototype.each = function(callback){
	for(var i = 0; i < this.length; i++){
		callback.call(this[i]);
	}
	return this;
};
queryElement.prototype.eq = function(pos){
	return $(this[pos]);
};
queryElement.prototype.find = function(selector){
	var ar = [];
	for(var i = 0; i < this.length; i++){
		var elements = this[i].querySelectorAll(selector);
		if(elements.length){
			for(var j = 0; j < elements.length; j++){
				ar.push(elements[j]);
			}
		}
	}
	return $(ar);
};
queryElement.prototype.children = function(selector){
	for(var i = 0; i < this[0].children.length; i++){
		if( (selector)&&(i == 0) ){
			return this[0].children[j];
		}
		if( this[0].children[i].matches(selector) ){
			return this[0].children[i];
		}
	}
	return $([]);
};
queryElement.prototype.height = function(val){
	if(!val){
		return this[0].offsetHeight;
	}else{
		for(var i = 0; i < this.length; i++){
			var height = (typeof val == 'string')?val:val+'px';
			$(this[i]).css('height', height);
		}
		return this;
	}
};
queryElement.prototype.width = function(val){
	if(!val){
		return this[0].offsetWidth;
	}else{
		for(var i = 0; i < this.length; i++){
			var height = (typeof val == 'string')?val:val+'px';
			$(this[i]).css('width', height);
		}
		return this;
	}
};
queryElement.prototype.attr = function(name, val){
	if(!val){
		return this[0].getAttribute(name);
	}else{
		for(var i = 0; i < this.length; i++){
			this[i].setAttribute(name, val);
		}
		return val;
	}
};
queryElement.prototype.removeAttr = function(name){
	for(var i = 0; i < this.length; i++){
		this[i].removeAttribute(name);
	}
	return this;
};
queryElement.prototype.text = function(text){
	if(text){
		for(var i = 0; i < this.length; i++){
			this[i].textContent = text;
		}
		return this;
	}else{
		return this[0].textContent;
	}
};
queryElement.prototype.html = function(html){
	if(html){
		for(var i = 0; i < this.length; i++){
			this[i].innerHTML = html;
		}
		return this;
	}else{
		return this[0].innerHTML;
	}
};
queryElement.prototype.contents = function(){
	var ar = [];
	for(var i = 0; i < this.length; i++){
		var elements = this[i].childNodes;
		if(elements.length){
			for(var j = 0; j < elements.length; j++){
				ar.push(elements[j]);
			}
		}
	}
	return $(ar);
};
queryElement.prototype.filter = function(callback){
	var ar = [];
	for(var i = 0; i < this.length; i++){
		if(! callback.call(this[i]) ){
			delete this[i];
		}
	}
	for(var i in this){
		if(this[i].nodeName){
			ar.push(this[i]);
		}
	}
	return $(ar);
};
queryElement.prototype.remove = function(){
	for(var i = 0; i < this.length; i++){
		var parent = this[i].parentNode;
		parent.removeChild( this[i] );
	}
};
queryElement.prototype.parent = function(selector){
	var element = this[0];
	while(element.parentElement){
		if(selector){
			if(element.parentElement.matches(selector)){
				return $(element.parentElement);
			}
		}else{
			return $(element.parentElement);
		}
		element = element.parentElement;
	}
	return $([]);
};
queryElement.prototype.parents = function(selector){
	var ar = [];
	var element = this[0];
	while(element.parentElement){
		if(selector){
			if(element.parentElement.matches(selector)){
				ar.push(element.parentElement);
			}
		}else{
			ar.push(element.parentElement);
		}
		element = element.parentElement;
	}
	return $(ar);
};
queryElement.prototype.is = function(selector){
	return this[0].matches(selector);
};
queryElement.prototype.val = function(value){
	if(!value){
		return this[0].value;
	}else{
		for(var i = 0; i < this.length; i++){
			this[i].value = value;
		}
		return this;
	}
};
queryElement.prototype.append = function(html){
	for(var i = 0; i < this.length; i++){
		var node = document.createElement('div');
			node.innerHTML = html;
		for(var j = 0; j < node.childNodes.length; j++){
			this[i].appendChild(node.childNodes[j]);
			j--;
		}
	}
	return this;
};
queryElement.prototype.preppend = function(html){
	for(var i = 0; i < this.length; i++){
		var node = document.createElement('div');
			node.innerHTML = html;
		var element = this[i].children[0];
		for(var j = 0; j < node.childNodes.length; j++){
			this[i].insertBefore(node.childNodes[j], element);
			j--;
		}				
	}
	return this;
};
queryElement.prototype.before = function(html){
	for(var i = 0; i < this.length; i++){
		var parent = this[i].parentElement;
		var node = document.createElement('div');
			node.innerHTML = html;
		for(var j = 0; j < node.childNodes.length; j++){
			parent.insertBefore(node.childNodes[j], this[i]);
			j--;
		}
	}
	return this;
};
queryElement.prototype.after = function(html){
	for(var i = 0; i < this.length; i++){
		var parent = this[i].parentElement;
		var node = document.createElement('div');
			node.innerHTML = html;
		var element = this[i].nextSibling;
		for(var j = 0; j < node.childNodes.length; j++){
			parent.insertBefore(node.childNodes[j], element);
			j--;
		}
	}
	return this;
};
queryElement.prototype.next = function(selector){
	var element = this[0];
	while(element.nextElementSibling){
		if(selector){
			if(element.nextElementSibling.matches(selector)){
				return $(element.nextElementSibling);
			}
			element = element.nextElementSibling;				
		}else{
			return $(element.nextElementSibling);
		}
	}
	return $([]);
};
queryElement.prototype.prev = function(selector){
	var element = this[0];
	while(element.previousElementSibling){
		if(selector){
			if(element.previousElementSibling.matches(selector)){
				return $(element.previousElementSibling);
			}
			element = element.previousElementSibling;				
		}else{
			return $(element.previousElementSibling);
		}
	}
	return $([]);
}
$.ajax = function(object){
	var ajax = new XMLHttpRequest();
	var type = (object.type)?object.type.toUpperCase():'GET';
	var url = (object.url || '');
	var data = object.data || '';
	var dataType = object.dataType || '';
	if(typeof object.data == 'object'){
		for(var i in object.data){
			data += ((data == '')?'':'&')+i+'='+object.data[i];
		}
		if(type == 'GET'){
			url = url.replace(/\?$/, '')+'?'+data;
		}
	}else{
		data = object.data;
	}
	ajax.onreadystatechange = function(){
		if (ajax.readyState==4 && ajax.status==200){
			if(ajax.doneCallback){
				var response = (dataType == 'JSON')?eval('('+ajax.responseText+')'):ajax.responseText;
				ajax.doneCallback(response);
				delete ajax.doneCallback;
			}
		}else{
			if(ajax.errorCallback){
				ajax.errorCallback(ajax.responseText);
				delete ajax.errorCallback;
			}
		}
	};
	ajax.done = function(callback){
		this.doneCallback = callback;
		return this;
	};
	ajax.error = function(callback){
		this.errorCallback = callback;
		return this;
	}
	ajax.open(type, url, true);
	if(type == 'GET'){
		ajax.send();
	}else{
		ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		ajax.send(data);
	}
	return ajax;
};
$.get = function(url, callback){
	$.ajax({url: url}).done(callback);
};
(function(){
	function setEvent(event, callbackDefault){
		queryElement.prototype[event] = function(callback){
			if(!callback){
				callbackDefault.call(this);
			}else{
				for(var i = 0; i < this.length; i++){
					this[i].addEventListener.call(this[i], event, function(e){
						callback.call(this, e);
					});
				}						
			}
			return this;
		};
	}

	var events = {
		click : function(){
			this[0].click();
		},
		dblclick : false,
		change : false,
		focus : function(){
			this[0].focus();
		},
		blur : function(){
			this[0].blur();
		},
		cut : false,
		copy : false,
		contextmenu : false,
		drag : false,
		dragend : false,
		dragenter : false,
		dragleave : false,
		dragover : false,
		dragstart : false,
		drop : false,
		keydown : false,
		keypress : false,
		keyup : false,
		load : false,
		mousedown : false,
		mouseenter : false,
		mouseleave : false,
		mousemove : false,
		scroll : false,
		submit : false,
		afterprint : false,
		beforeprint : false,
		animationstart : false,
		animationiteration : false,
		animationend : false,
		fullscreenchange : false,
		storage : false,
		touchcancel : false,
		touchenter : false,
		touchend : false,
		touchleave : false,
		touchmove : false,
		touchstart : false,
		DOMNodeInserted : false
	};
	for(var i in events){
		setEvent(i, events[i]);
	}
})();
queryElement.prototype.on = function(event, selector, callback){
	if( (typeof selector == 'function')||(this.selector == '') ){
		for(var i = 0; i < this.length; i++){
			this[i][event](selector);
		}
	}else{
		for(var i = 0; i < this.length; i++){
			$(this[i]).find(selector)[event](callback);
			if(!this[i].livesEvents){
				this[i].livesEvents = [];
			}
			this[i].livesEvents.push({
				selector : selector,
				event: event,
				callback : callback
			});
			$(this[i]).DOMNodeInserted(function(e){
				if( this.livesEvents ){
					for(var i = 0; i < this.livesEvents.length; i++){
						if( e.srcElement.matches(this.livesEvents[i].selector) ){
							$(e.srcElement)[event](callback);
						}
					}
				}
			});
		}
	}
	return this;
};