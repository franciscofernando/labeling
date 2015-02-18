model.export('head', {
	title : 'Example labeling'
});

model.export('heredero', {
	texto : 'Este es un elemento heredero'
})

model.export('body', {
	nombre : 'Francisco Poblete',
	contador : 0
});

controller.export('body', function(labels){
	var este = this;

	labels.boton.click(function(){
		este.contador++;
	});

	labels.boton2.click(function(){
		alert('Tu nombre es: '+este.nombre);
	});
});