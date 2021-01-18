({
	getStatus : function(component) {
		var action = component.get("c.getStatusVal");
        action.setCallback(this,function(response){
            if(response.getState()==='SUCCESS') {
                component.set("v.strStatus",response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	}
})