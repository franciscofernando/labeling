function queryElement(elements, selector, indicator){
	if(elements.window){
		this[0] = window;
		this.length = 1;
		return this;
	}
	for(var i = 0; i < elements.length; i++){
		this[i] = elements[i];
	}
	this.length = i;
	this.selector = selector || '';
	return this;
};
function miniQuery(selector){
	if(typeof selector == 'function'){ //Document ready
		document.addEventListener('DOMContentLoaded', selector);
	}else if(typeof selector == 'string'){ //Selector
		var elements = document.querySelectorAll( selector );
		var ar = [].slice.call( elements );
		return new queryElement(ar, selector);
	}else if( ((typeof selector.length != 'undefined')&&(typeof selector.selector == 'string')) ){ //QueryElement
		return selector;
	}else if(typeof selector == 'object'){
		if(typeof selector.length != 'undefined'){
			if(selector.length){
				if(selector.tagName){
					return new queryElement([selector]);
				}else{
					return new queryElement(selector);
				}
			}else{
				return new queryElement(selector);				
			}
		}else{
			return new queryElement([selector]);
		}
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
queryElement.prototype.toggleClass = function(name){
	for(var i = 0; i < this.length; i++){
		if( miniQuery(this[i]).is('.'+name) ){
			miniQuery(this[i]).removeClass(name);
		}else{
			miniQuery(this[i]).addClass(name);
		}
	}
	return this;
};
queryElement.prototype.css = function(name, value){
	function cssName(name){
		return name.replace(/-[a-z]/, function(m){ return m.toUpperCase().replace(/^\-/, ''); });
	}
	if(typeof name == 'string'){
		if(typeof value == 'undefined'){
			return window.getComputedStyle(this[0],null).getPropertyValue(name);
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
	if(this[pos]){
		return miniQuery(this[pos]);
	}
	return miniQuery([]);
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
	return miniQuery(ar);
};
queryElement.prototype.children = function(selector){
	var ar = [];
	for(var i = 0; i < this[0].children.length; i++){
		if( this[0].children[i].matches(selector) ){
			ar.push(this[0].children[i]);
		}
	}
	return miniQuery(ar);
};
queryElement.prototype.height = function(val){
	var this2 = this;
	for(var i = 0; i < this2.length; i++){
		if(this2[i].window){
			this2[i] = window.document.documentElement;
		}
	}
	if(!val){
		return this2[0].offsetHeight;
	}else{
		for(var i = 0; i < this2.length; i++){
			var height = (typeof val == 'string')?val:val+'px';
			miniQuery(this2[i]).css('height', height);
		}
		return this;
	}
};
queryElement.prototype.width = function(val){
	var this2 = this;
	for(var i = 0; i < this2.length; i++){
		if(this2[i].window){
			this2[i] = window.document.documentElement;
		}
	}
	if(!val){
		return this2[0].offsetWidth;
	}else{
		for(var i = 0; i < this2.length; i++){
			var height = (typeof val == 'string')?val:val+'px';
			miniQuery(this2[i]).css('width', height);
		}
		return this;
	}
};
queryElement.prototype.attr = function(name, val){
	if(!val){
		if(this.length){
			if(this[0].getAttribute){
				return this[0].getAttribute(name)||'';
			}else{
				return '';
			}
		}else{
			return '';
		}
	}else{
		for(var i = 0; i < this.length; i++){
			this[i].setAttribute(name, val);
		}
		return this;
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
	if(typeof html == 'string'){
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
	return miniQuery(ar);
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
	return miniQuery(ar);
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
				return miniQuery(element.parentElement);
			}
		}else{
			return miniQuery(element.parentElement);
		}
		element = element.parentElement;
	}
	return miniQuery([]);
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
	return miniQuery(ar);
};
queryElement.prototype.is = function(selector){
	if(this.length){
		if(this[0].matches){
			return this[0].matches(selector);
		}
	}
	return false;
};
queryElement.prototype.val = function(value){
	if(typeof value == 'undefined'){
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
queryElement.prototype.prepend = function(html){
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
				return miniQuery(element.nextElementSibling);
			}
			element = element.nextElementSibling;				
		}else{
			return miniQuery(element.nextElementSibling);
		}
	}
	return miniQuery([]);
};
queryElement.prototype.prev = function(selector){
	var element = this[0];
	while(element.previousElementSibling){
		if(selector){
			if(element.previousElementSibling.matches(selector)){
				return miniQuery(element.previousElementSibling);
			}
			element = element.previousElementSibling;				
		}else{
			return miniQuery(element.previousElementSibling);
		}
	}
	return miniQuery([]);
}
queryElement.prototype.last = function(){
	return miniQuery(this[this.length-1]);
}
queryElement.prototype.first = function(){
	return miniQuery(this[0]);
}
queryElement.prototype.index = function(){
	if(!this.length){
		return -1;
	}else{
		var parent = miniQuery(this[0]).parent();
		if(parent.length){
			for(var i = 0; i < parent[0].children.length; i++){
				if(parent[0].children[i] == this[0]){
					return i;
				}
			}
		}else{
			return -1;
		}
		return -1;
	}
};
queryElement.prototype.animate = function(object, milliseconds, callback){
	var milliseconds = milliseconds||300;
	var callback = callback||function(){};
	
	function cssName(name){
		return name.replace(/-[a-z]/, function(m){ return m.toUpperCase().replace(/^\-/, ''); });
	}
	function animate(object, property, start, end, unity){
		var frame_rate = 0.06;
		var frame = 0;
		var delta = (end-start)/milliseconds/frame_rate;
		var handle = setInterval(function() {
			frame++;
			var value = start+delta*frame;
				value = ( ((delta < 0)?(value>end):(value<end)) )?value:end;
			object.style[property] = value+unity;
			if (value == end){
				callback.call(miniQuery(object));
				clearInterval(handle);
			}
		},1/frame_rate);
	}

	for(var i = 0; i < this.length; i++){
		for(var j in object){
			var cssVal = miniQuery(this[i]).css(j);
			var start = parseInt( cssVal );
			var end = parseInt(object[j]);
			var unity = cssVal.replace(/[0-9\.]/g, '');
			animate(this[i], cssName(j), start, end, unity);
		}
	}
	return this;
};
queryElement.prototype.defaultDisplay = function(){
	var name = this[0].localName;
	if( (name=='div')||(name=='body')||(name=='section')||(name=='article')||(name=='footer')||(name=='header')||(name=='nav')||(name=='form')||(name=='ul') ){
		return 'block';
	}else{
		return 'inline-block';
	}
};
queryElement.prototype.fadeIn = function(milliseconds, callback){
	if(typeof milliseconds == 'function'){
		var callback = milliseconds;
		var milliseconds = null;
	}	
	for(var i = 0; i < this.length; i++){
		var element = miniQuery(this[i]);
		if( element.css('display') == 'none' ){
			element
				.css({
					display : (element[0].fadeDisplay)?element[0].fadeDisplay:element.defaultDisplay(),
					opacity : 0
				})
				.animate({
					opacity : 1
				}, milliseconds, callback);
		}
	}
	return this;
};
queryElement.prototype.fadeOut = function(milliseconds, callback){
	if(typeof milliseconds == 'function'){
		var callback = milliseconds;
		var milliseconds = null;
	}
	for(var i = 0; i < this.length; i++){
		var element = miniQuery(this[i]);
		if( element.css('display') != 'none' ){
			element
				.animate({
					opacity : 0
				}, milliseconds, function(){
					miniQuery(this)[0].fadeDisplay = (miniQuery(this).css('display') != 'none')?miniQuery(this).css('display'):false;
					miniQuery(this).css('display', 'none');
					if(callback){
						callback();
					}
				});
		}
	}
	return this;
};
queryElement.prototype.fadeToggle = function(milliseconds, callback){
	for(var i = 0; i < this.length; i++){
		if( miniQuery(this[i]).css('display') == 'none' ){
			miniQuery(this[i]).fadeIn(milliseconds, callback);
		}else{
			miniQuery(this[i]).fadeOut(milliseconds, callback);
		}
	}
	return this;
}
queryElement.prototype.slideDown = function(milliseconds, callback){
	if(typeof milliseconds == 'function'){
		var callback = milliseconds;
		var milliseconds = null;
	}
	for(var i = 0; i < this.length; i++){
		var element = miniQuery(this[i]);
		if( element.css('display') == 'none' ){
			element
				.css({
					display: (element[0].fadeDisplay)?element[0].fadeDisplay:element.defaultDisplay()
				})
			var height = element.css('height');
			element
				.css({
					height: '0px'
				})
				.animate({
					height: height
				}, milliseconds, callback);
		}
	}
	return this;
};
queryElement.prototype.slideUp = function(milliseconds, callback){
	if(typeof milliseconds == 'function'){
		var callback = milliseconds;
		var milliseconds = null;
	}
	for(var i = 0; i < this.length; i++){
		var element = miniQuery(this[i]);
		if( element.css('display') != 'none' ){
			element
				.animate({
					height: '0px'
				}, milliseconds, function(){
					miniQuery(this)[0].fadeDisplay = (miniQuery(this).css('display') != 'none')?miniQuery(this).css('display'):false;
					miniQuery(this).css({
						display: 'none',
						height: ''
					});
					if(callback){
						callback();
					}
				});
		}
	}
}
queryElement.prototype.slideToggle = function(milliseconds, callback){
	for(var i = 0; i < this.length; i++){
		if( miniQuery(this[i]).css('display') == 'none' ){
			miniQuery(this[i]).slideDown(milliseconds, callback);
		}else{
			miniQuery(this[i]).slideUp(milliseconds, callback);
		}
	}
	return this;
}
miniQuery.ajax = function(object){
	var ajax = new XMLHttpRequest();
	var type = (object.type)?object.type.toUpperCase():'GET';
	var url = (object.url || '');
	var data = '';
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
				if( dataType.toUpperCase() == 'JSON' ){
					try{
						var resp = eval('('+ajax.responseText+')');
						ajax.doneCallback(resp);
						delete ajax.doneCallback;
					}
					catch(e){
						if(ajax.errorCallback){
							ajax.errorCallback(ajax.responseText);
							delete ajax.errorCallback;
						}
					}
				}else{
					ajax.doneCallback(response);
					delete ajax.doneCallback;
				}
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
		ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");
		ajax.send(data);
	}
	return ajax;
};
miniQuery.get = function(url, callback){
	miniQuery.ajax({url: url}).done(callback);
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
					}, false);
				}						
			}
			return this;
		};
	}

	var events = {
		afterprint : false,
		animationend : false,
		animationiteration : false,
		animationstart : false,
		beforeprint : false,
		blur : function(){ this[0].blur(); },
		change : false,
		click : function(){ this[0].click(); },
		contextmenu : false,
		copy : false,
		cut : false,
		dblclick : false,
		DOMNodeInserted : false,
		drag : false,
		dragend : false,
		dragenter : false,
		dragleave : false,
		dragover : false,
		dragstart : false,
		drop : false,
		focus : function(){ this[0].focus(); },
		fullscreenchange : false,
		input : false,
		keydown : false,
		keypress : false,
		keyup : false,
		load : false,
		mousedown : false,
		mouseenter : false,
		mouseleave : false,
		mousemove : false,
		mouseup : false,
		resize : false,
		scroll : false,
		select : function(){ this[0].select(); },
		storage : false,
		submit : false,
		touchcancel : false,
		touchend : false,
		touchenter : false,
		touchleave : false,
		touchmove : false,
		touchstart : false
	};
	for(var i in events){
		setEvent(i, events[i]);
	}
})();
queryElement.prototype.trigger = function(event){
	for(var i = 0; i < this.length; i++){
		this[i].dispatchEvent( new Event(event) );
	}
	return this;
};
queryElement.prototype.on = function(event, selector, callback){
	if( typeof selector == 'function' ){
		for(var i = 0; i < this.length; i++){
			this[i][event](selector);
		}
	}else{
		for(var i = 0; i < this.length; i++){
			miniQuery(this[i]).find(selector)[event](callback);
			miniQuery(this[i]).DOMNodeInserted(function(e){
				if(e.srcElement.matches){
					if( e.srcElement.matches(selector) ){
						miniQuery(e.srcElement)[event](callback);
					}
					miniQuery(e.srcElement).find(selector).each(function(){
						miniQuery(this)[event](callback);
					});
				}
			});
		}
	}
	return this;
};
var $ = (window.jQuery)?window.jQuery:miniQuery;