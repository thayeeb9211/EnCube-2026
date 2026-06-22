/*
content.js
*/


/*************************
Main functionality SECTION
*************************/

let input = document.getElementById("search_widget");
let storageInput = document.getElementById("storage_widget");

/* Focus on input so user doesn't have to click into it */
input.focus(); 

storageInput.addEventListener('keydown', (event) => {
	if(event.key === "Enter") {
		let siteId = storageInput.value.trim();
		if (siteId) {
			const cleanSiteId = encodeURIComponent(siteId);
			let urls = [
				`https://enlighten.enphaseenergy.com/admin/sites/${cleanSiteId}?`,
				`https://enlighten.enphaseenergy.com/app/system_dashboard/sites/${cleanSiteId}`,
				`https://enlighten.enphaseenergy.com/app/system_dashboard/sites/${cleanSiteId}/live-stream`,
				`https://enlighten.enphaseenergy.com/admin/sites/${cleanSiteId}/devices?status=active`,
				`https://enlighten.enphaseenergy.com/systems/${cleanSiteId}/arrays?range=last7Days&view=power_production`
			];
			chrome.runtime.sendMessage({message: urls});
		}
	}
}); 

//using validator.js 
//documentation: https://www.npmjs.com/package/validatorjs
/*detects what type of input this is*/

//encoding for Saleforce search 
function sfdc_search_url(search_term){
	const to_encode = {
		componentDef: "forceSearch:searchPageDesktop",
		attributes: {
		  term: search_term,
		  scopeMap: {
			nameField: "Name",
			name: "Case",
			id: "Case",
			label: "Cases",
			fields: "CaseNumber"
		  }
		},
		state: {}
  };
  
  const json = JSON.stringify(to_encode);
  const encoded = btoa(json)
  return "https://enphase.lightning.force.com/one/one.app#" + encoded

}

function validate_input(input){
	
	//if they open tools 
	if(input.toLowerCase() === 'tools'){ return 'tools'}; 
	
	if(validator.isEmail(input)){
		return ['https://enlighten.enphaseenergy.com/admin/users?email=' + encodeURIComponent(input)];
	}
	else if(validator.isNumeric(input)){
		switch(input.length){
			case 12: {
			/*serial number*/
				return ['https://enlighten.enphaseenergy.com/admin/devices/search?serial_num=' + encodeURIComponent(input)];
			}
			case 8: {
			/*case number*/
				return [(sfdc_search_url(input))];
			}
			default: {
			/*site ID*/
				return ['https://enlighten.enphaseenergy.com/admin/sites/' + encodeURIComponent(input)];
			}
		}
	/* if it doesn't match any of these conditions - then search the wiki */ 
	}
	return ['http://10.200.48.57/index.php/Special:Search?fulltext=&search=' + encodeURIComponent(input)];
}

input.addEventListener('keydown', (event) => {
	if(event.key === "Enter") {
		let query = input.value.trim();
		if (!query) return; // Prevent empty searches
		let url_str = validate_input(query);
		console.log(url_str); 
		if(url_str === 'tools'){
			chrome.runtime.sendMessage({ action: "open_sidebar" });
			window.close();
		} else {
			chrome.runtime.sendMessage({message: url_str});
		}
	}
});