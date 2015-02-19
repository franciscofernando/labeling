model.export('contenedor', {
	bind : 'Texto'
});

model.export('heredero', {
	propio : 'Texto propio'
})

model.export('variable', {
	contador : 0,
	texto : 'Texto modificable'
});

controller.export('variable', function(labels){
	var este = this;

	labels.boton.click(function(){
		este.contador++;
	});

});

controller.export('router', function(labels){
	labels.boton.click(function(){
		router.change('/section/hola');
	});

	labels.boton2.click(function(){
		router.change('/');
	});
});

router.export('/section/:name', function(data){
	router.show('routerload', data);
});

router.export('/', function(data){
	router.hidden('routerload');
});