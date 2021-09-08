/*

Warning:
This script should preferably be included at the bottom of the page, before the </body> tag.

*/

"use strict";

var cookiePolicy = {
	
	isActive: true,
	
	// Text Appearance
	bgColor: "#1f1f1f",
	textColor: "#ffffff",

	// Links in languages
	lnkPt: "https://www.scielo.org/pt/sobre-o-scielo/politica-de-privacidade/",
	lnkEn: "https://www.scielo.org/en/about-scielo/privacy-policy/",
	lnkEs: "https://www.scielo.org/es/sobre-el-scielo/politica-de-privacidad/",
	
	// Message in languages
	msgPt: "Este site usa cookies para garantir que você obtenha uma melhor experiência de navegação. Leia nossa ",
	msgEn: "This site uses cookies to ensure you get a better browsing experience. Read our ",
	msgEs: "Este sitio utiliza cookies para garantizar una mejor experiencia de navegación. Lea nuestra ",

	
	setCookie: function (cname, cvalue, exdays){
		var d = new Date();

		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	},
	getCookie: function (cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		
		for(var i = 0; i <ca.length; i++) {
			
			var c = ca[i];
			
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}

			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	},
	checkLanguageAtUrl: function (){

		var url 		= window.location.href,
			urlPart		= url.split("/"),
			langParam 	= "",
			splitParam	= url.split("?"),
			justParams	= "",
			theParam	= "",
			langParam 	= "",
			validParam =  ["pt", "pt-br", "en", "es"];

	
		if (urlPart[2] == "preprints.scielo.org"){
			return false;
		}

		// check if is in blog, because blog without param is pt-br
		
		if (urlPart[2] == "blog.scielo.org"){

			if(!validParam.includes(urlPart[3])){
				return "pt-br";
			}
			
		}

		if (splitParam.length > 1){
			justParams = splitParam[1].split("&");

			for (var i = 0; i < justParams.length; i++) {

				theParam = justParams[i].split("=");
				
				if(theParam[0] == "lang" || theParam[0] == "language" || theParam[0] == "lng"){
					langParam = theParam[1]; 
				}
			}
		}

		if (langParam == ""){
			
			if(urlPart[3]){
				urlPart[3] = urlPart[3].replace("_","-").toLowerCase();

				// Check language in the case of scielo.org/pt, where the language comes right after the first slash
				if(validParam.includes(urlPart[3])){
					langParam = urlPart[3];
				}
			}
			if (urlPart[4]){
				urlPart[4] = urlPart[4].replace("_","-").toLowerCase();	

				// Check language in the case of http://eventos.scielo.org/brazil-chinameeting/pt, where the language comes right after the second slash
				if(validParam.includes(urlPart[4])){
					langParam = urlPart[4]; 
				}
			}
			
		}

		if (langParam != ""){
			return langParam;
		}else{
			return false;
		}
	},

	// check if is in preprint.scielo.org
	checkLanguageAtHtmlLang: function (){

		var element = document.documentElement;

		if (element.hasAttribute("lang")) {
			return element.getAttribute('lang');
		}else{
			return false;
		}		
	},

	// hasScriptParam
	hasParam: function () {
		var thisScript 	= document.currentScript.src,
			splitScript = thisScript.split("?");

		if(splitScript.length > 1){
			return true;
		}else{
			return false;
		}
	},
	// checkScriptParam
	checkLanguageAtParam: function (){

		if(cookiePolicy.hasParam()){

			var thisScript 	= document.currentScript.src,
				splitParam	= thisScript.split("?"),
				justParams	= splitParam[1],
				langParam 	= "",
				theParam	= "";

			// Check if there is more than one parameter
			if (justParams.split("&").length > 1){

				//console.log(justParams.split("&"));

				justParams 	= justParams.split("&");
				nParams		= justParams.length;

				/*
				console.log("temos mais de um parametro aqui. Veja: " + justParams + "\n");
				console.log("O total de parâmetros é: " + justParams.length + "\n");
				console.log("Os parâmetros são os seguintes: \n")
				*/

				for (var i = 0; i < nParams; i++) {
				   
					theParam = justParams[i].split("=");
						 	
				   	
					if(theParam[0] == "lang" || theParam[0] == "language"){
						langParam = theParam[1]; 
					}
				   	// console.log(justParams[i]);
				}
				
			}else{

				theParam = justParams.split("=");
				
				if(theParam[0] == "lang" || theParam[0] == "language"){
					langParam = theParam[1]; 
				}
				
			}
		}

		if (langParam != ""){
			return langParam;
		}else{
			return false;
		}
	},
	checkCookie: function (cname){
		var cookieName = cookiePolicy.getCookie(cname);
		
		// If there is no cookie accepting cookie policies, set it.
		if (!(cookieName != "" && cookieName != null)) {


			// Look for parameter in url
			if(cookiePolicy.checkLanguageAtUrl()){

				cookiePolicy.createElementCookieBar(cookiePolicy.checkLanguageAtUrl());

			// Else, look for parameter in script call
			}else if(cookiePolicy.checkLanguageAtParam()){

				cookiePolicy.createElementCookieBar(cookiePolicy.checkLanguageAtParam());

			// Else, look for "language" cookie
			}else if(cookiePolicy.getCookie("language")){
				
				cookiePolicy.createElementCookieBar(cookiePolicy.getCookie("language"));
			
			// Else, look for "lang" cookie
			}else if(cookiePolicy.getCookie("lang")){
			
				cookiePolicy.createElementCookieBar(cookiePolicy.getCookie("lang"));
			
			// Else, verify if is lang attribute on html tag. Only in preprints
			}else if(cookiePolicy.checkLanguageAtHtmlLang()){

				cookiePolicy.createElementCookieBar(cookiePolicy.checkLanguageAtHtmlLang());

			// Else, look for browser language
			}else{
				var userLang = navigator.language || navigator.userLanguage; 

				if (userLang != "" && userLang != null) {
					cookiePolicy.createElementCookieBar(userLang);
					
				/*
				 If there is no: 
					
					- language in URL
					- language in script call parameter
					- cookie language
					- cookie lang
					- browser language
					- lang attribute on html tag
				*/
				}else{
					cookiePolicy.createElementCookieBar("en");
				}
			}
		}
	},
	clearCookie: function (cname){
		cookiePolicy.setCookie(cname, "no", -365);
	},
	checkIfIsArticle: function (){

		var cookieBar = document.querySelector(".alert-cookie-notification"),
			floatingMenu = document.querySelector(".floatingMenu"),
			floatingMenuItem = document.querySelectorAll(".floatingMenuItem"),
			floatingMenuMobile = document.querySelector(".floatingMenuMobile");

		if(floatingMenu){

			if(cookieBar.style.display != "none"){
			    
		    	// Add class to move up floating buttons
		    	floatingMenu.classList.add("isCookiebarActive");

		    	if(floatingMenuMobile){
		    		floatingMenuMobile.classList.add("isCookiebarActive");
		    	}
		    	if(floatingMenuItem){
		    		for (var i = 0; i < floatingMenuItem.length; ++i) {
					  floatingMenuItem[i].classList.add("isCookiebarActive");
					}
		    	}
			    
			}else{

				//Remove class to move up floating buttons
		    	floatingMenu.classList.remove("isCookiebarActive");
		    	
		    	if(floatingMenuMobile){
		    		floatingMenuMobile.classList.remove("isCookiebarActive");
		    	}
		    	if(floatingMenuItem){
		    		for (var i = 0; i < floatingMenuItem.length; ++i) {
					  floatingMenuItem[i].classList.remove("isCookiebarActive");
					}
		    	}
			}
		}
	},
	createElementCookieBar: function (lang){

		var lang = (/^[\w_-]{2,5}$/.exec(lang) ? /[\w_-]{2,5}/.exec(lang)[0].toLowerCase().replace("_", "-") : undefined);
        
        if (lang == undefined) {
            console.group("SciELO Cookie Banner")
            console.error("Cannot detect the correct language to show the cookie banner. The selected code language does not exists, please verify https://developer.chrome.com/webstore/i18n table or https://tools.ietf.org/html/rfc5646 RFC.")
            console.log("Using English as fallback language.")
            console.groupEnd()
            lang = "en";
        }

		// Create container element
	    var div = document.createElement('div');
	    div.setAttribute('class', 'alert-cookie-notification');
	    
	    // Choose content by language
        if (lang.indexOf("pt") == 0) {
            div.innerHTML = cookiePolicy.msgPt;
        } else if (lang.indexOf("es") == 0) {
            div.innerHTML = cookiePolicy.msgEs;
        } else {
            div.innerHTML = cookiePolicy.msgEn;
        }
	    
	    // Add CSS Styles to element
	    div.style.backgroundColor = cookiePolicy.bgColor;
	    div.style.fontFamily = "Helvetica, Sans-Serif";
	    div.style.fontWeight = 100;
	    div.style.color = cookiePolicy.textColor;
	    div.style.fontSize = "16px";
	    div.style.display = "block";
	    div.style.position = "fixed";
		div.style.bottom = "0px";
	    div.style.width = "100%";
	    div.style.textAlign = "center";
	    div.style.padding = "13px 10px";
	    div.style.zIndex = "99999";

	    // Create button
	    var link = document.createElement('a');
	    link.setAttribute('class', 'btn');
	    link.innerHTML = "OK";

	    // Add CSS Styles to element
	    link.style.margin = "5px";
	    link.style.backgroundColor = "white";
	    link.style.color = "black";
	    link.style.borderRadius = 0;
	    link.style.border = "1px solid black";
	    link.style.fontWeight = 400;
	    link.style.lineHeight = "20px";
	    link.style.padding = "6px 16px";
	    link.style.cursor = "pointer";
	    link.style.marginLeft = "15px";
		link.style.borderRadius = "4px";

	    link.addEventListener("click", function() {
	  		cookiePolicy.setCookie("cookie-policy-accepted", "yes", 365);
	  		this.parentNode.style.display = "none";

	  		// Check if is Article to move floating buttons
	    	cookiePolicy.checkIfIsArticle();
		});


	    // Create link Privacy Policy
	    var linkPp = document.createElement('a');
	    linkPp.style.cursor = "pointer";
	    linkPp.style.color = "#fff";
	    linkPp.style.textDecoration = "underline";


		// Choose content by language
        if (lang.indexOf("pt") == 0 || lang.indexOf("pt-br") == 0) {
            
            linkPp.innerHTML = "Política de Privacidade";
			linkPp.href = cookiePolicy.lnkPt;

        } else if (lang.indexOf("es") == 0) {

            linkPp.innerHTML = "Política de Privacidad";
			linkPp.href = cookiePolicy.lnkEs;
        
        } else {

			linkPp.innerHTML = "Privacy Policy";
			linkPp.href = cookiePolicy.lnkEn;

        }

		// set link to open in new window
		linkPp.setAttribute('target', '_blank');

        // append Privacy Policy link
	    div.appendChild(linkPp);

		// append Text "." outside the link
	    div.innerHTML += ".";

	    // append Ok Button
	    div.appendChild(link);

	    // Remove padding left and padding right from body
	    document.body.style.paddingLeft = 0;
	    document.body.style.paddingRight = 0;

	    // Append element to body
	    document.body.appendChild(div);

	    // Check if is Article to move floating buttons
	    cookiePolicy.checkIfIsArticle();
	 
	},
	Init: function (){

		if(cookiePolicy.isActive){
			cookiePolicy.checkCookie("cookie-policy-accepted");	
		}else{
			cookiePolicy.clearCookie("cookie-policy-accepted");
		}
		
	}		
}

cookiePolicy.Init();