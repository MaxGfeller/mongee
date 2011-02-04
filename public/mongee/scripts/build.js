//steal/js mongee/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('mongee/scripts/build.html',{to: 'mongee'});
});
