({
    doInit : function(component, event, helper) {
     /*  var myPageRef = component.get("v.pageReference");
        var recId = myPageRef.state.c__recordId;
        component.set("v.recordId", recId);*/
        var action = component.get("c.getAccountInfo");
        action.setParams({"strAccId":component.get("v.recordId")});
        action.setCallback(this,function(response){
            if(response.getState()==='SUCCESS'){
                component.set("v.objAccount",response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    handleSelect:function(component,event,helper){
        alert('here');
    }
})