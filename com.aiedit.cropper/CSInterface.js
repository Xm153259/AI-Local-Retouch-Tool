/* Minimal local CEP bridge: no CDN or network required. */
(function(global){function CSInterface(){}CSInterface.prototype.evalScript=function(script,callback){
 if(global.__adobe_cep__&&typeof global.__adobe_cep__.evalScript==="function")global.__adobe_cep__.evalScript(script,callback||function(){});
 else if(callback)callback("ERR:未检测到 Photoshop CEP 运行环境。");
};global.CSInterface=CSInterface;}(window));