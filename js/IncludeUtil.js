var Dependencies = ["js/resources.js", "js/resources.js"];

for(var depend in Dependencies) {
	include(Dependencies[depend]);
}

function include(filename) {
    
    var head = document.getElementsByTagName("include")[0];
    console.log(head.getElementsByTagName("script")[1]);
	for(var source in head.getElementsByTagName("script")[1]) {
		
		console.log("Source: "+source);
		console.log(head.getElementsByTagName("script")[source].attributes[0].value);
		//console.log(source);
		//console.log(filename);
		if(head.getElementsByTagName("script")[source].attributes[0].value === filename) {
			console.log("hue");
			return;
		}
	}
    script = document.createElement("script");
    script.src = filename;
    
    head.appendChild(script);
	console.log(head);
}