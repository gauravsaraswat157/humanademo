({
	init : function(component, event) {
        let action = component.get('c.getContracts');
        action.setParams({ 	
            "accId": component.get("v.recordId")
        });
        action.setCallback(this, $A.getCallback(function (response) {
            let state = response.getState();
            let data = response.getReturnValue();
            component.set('v.dtData', '');
            component.set('v.dataTableColumns', '');
            if (state === "SUCCESS" && data != null) {
                component.set('v.dtData', '');
                let columnList =[];
                for(let j=0 ; j< data.fieldName.length ; j++) {
                    // Default cell attributes
                    let columnCellAttributes = { alignment: 'left' };

                    if(data.fieldName[j] != 'Id'){
                        columnList.push({
                            label: data.fieldLabel[j],
                            fieldName: data.fieldName[j],
                            type: data.fieldType[j].toLowerCase(),
                            sortable: true,
                            sortedBy: data.fieldName[j],
                            cellAttributes: columnCellAttributes
                        });
                    }
                }
                component.set('v.dataTableColumns', columnList);
				var contracts = [];
                var mappedData = data.groupedSObjs;
                for(var key in mappedData){
                    contracts.push({value:mappedData[key], key:key});
                }
                component.set('v.dtData', contracts);
            } else if (state === "ERROR") {
                let errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
    }
})