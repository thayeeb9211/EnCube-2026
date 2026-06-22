console.log('Content.js from CS-Lookup 2025 is running!'); 

function add_input_to_rma_page(){
	document.body.addEventListener('click', () => {
		const el = document.activeElement
		if(
			el.tagName === 'INPUT' &&
			el.type === 'text' &&
			el.placeholder === 'Search serial number or product'
		){
			console.log('clicked input');
			
			//get the URL for icon so I can use it 
			const icon_url = chrome.runtime.getURL('images/icon-19.png')
			
			//this is where we add elements 
			const add_devices_div = el.parentNode;
			const vanilla_input = add_devices_div.querySelector('input')
			
			//injected button creation and styling
			if(!document.getElementById('injected_cs_lookup_button')){
				const cs_lookup_button = document.createElement('button');
				cs_lookup_button.id = "injected_cs_lookup_button";
				cs_lookup_button.style.backgroundImage = `url(${icon_url})`;
				cs_lookup_button.style.backgroundSize = 'cover';
				cs_lookup_button.style.border = 'none';
				cs_lookup_button.style.cursor = 'pointer';
				cs_lookup_button.style.height = '19px';
				cs_lookup_button.style.width = '19px';
				cs_lookup_button.style.margin = '10px';
				const lookup_field = document.createElement('input');
				lookup_field.id = 'injected_input';
				lookup_field.type = 'text';
				lookup_field.className = "slds-input device-input slds-m-right_xx-small"
				lookup_field.style.display = 'none'; 
				lookup_field.style.width = '25%'; 
				lookup_field.style.margin = '0 4px 10px 0';
				lookup_field.style.padding = '0 16px 0 12px'; 
				lookup_field.placeholder = 'Enter serials separated by spaces'; 
				lookup_field.style.backgroundColor = '#343d46';
				lookup_field.style.color = "white"; 
				
				const style = document.createElement('style');
				style.textContent = `
					#injected_input:focus{
						box-shadow: 0 0 0 2px rgba(243, 115, 33, 0.65);
					}
					#injected_input::placeholder{
						color: rgba(255,255,255,0.6);
					}
					`;
				document.head.appendChild(style); 
				
				//add button to webpage
				add_devices_div.prepend(cs_lookup_button);
				add_devices_div.insertBefore(lookup_field, cs_lookup_button.nextSibling);
				
				//add event listener to input to run our function to check check boxes
				lookup_field.addEventListener('keydown', (event) => {
					if(event.key === "Enter") {
						const input_array = event.target.value.trim().split(' ');
						const rma_table = el.parentNode.parentNode.querySelector('table');
						console.log(rma_table);
						rma_table.querySelectorAll('tr').forEach((element) => {
							if(input_array.includes(element.children[1].children[0].innerText)){
								
								//check checkbox 
								const checkbox = element.children[0].children[0].querySelector('input[type="checkbox"]');
								checkbox.checked = true;
								checkbox.dispatchEvent(new Event('change', {bubbles: true})); 
								
								//set voltage
								const ac_voltage = element.children[4].querySelector('input[type="text"]')
								ac_voltage.value = 'In range';
								ac_voltage.dispatchEvent(new Event('change', {bubbles: true})); 
								
								const dc_voltage = element.children[5].querySelector('input[type="text"]')
								dc_voltage.value = 'In range';
								dc_voltage.dispatchEvent(new Event('change', {bubbles: true})); 
								
								//order this row to top of table
								rma_table.insertBefore(element, rma_table.firstChild);
							}
						});
						console.log(input_array); 
					}
				});
				
				//keep track of toggle
				var tog = 0; 
				
				//onclick function 
				cs_lookup_button.addEventListener('click', () => {
					if(tog == 0){
						vanilla_input.style.display = 'none';
						lookup_field.style.display = 'inline-block';
						lookup_field.focus();
						tog = 1;
						return; 
					} else {
						vanilla_input.style.display = 'inline-block';
						lookup_field.style.display = 'none';
						tog = 0;
						return; 
					}
				});
			}
		}
	});
} 

window.addEventListener('DOMContentLoaded', () => {
	add_input_to_rma_page();
});
