({
    doInit : function(component, event, helper) {
        var action = component.get("c.getAccountDetails");
        var pageSize = component.get("v.pageSize");
        action.setCallback(this,function(response){
            if(response.getState()==='SUCCESS'){
                component.set("v.paginationList",response.getReturnValue());
                component.set("v.totalSize", component.get("v.paginationList").length);
                component.set("v.start",0);
                component.set("v.end",pageSize-1);
                var paginationList = [];
                for(var i=0; i< pageSize; i++)
                {
                    paginationList.push(response.getReturnValue()[i]);
                }
                component.set("v.objAccount", paginationList);	
            }
            else{
                console.log('Error');
            }
        });
        helper.getStatus(component);
        
        $A.enqueueAction(action);
    },
    searchAccounts:function(component,event,helper){
        var pageSize ;
        var action = component.get("c.getAccountBySearch");
        action.setParams({"strSearch":component.get("v.strSearchString")});
        action.setCallback(this,function(response){
            if(response.getState()==='SUCCESS') {
                component.set("v.paginationList",response.getReturnValue());
                if(component.get("v.paginationList").length>10)
                    pageSize =  component.get("v.pageSize");
                else
                    pageSize  =component.get("v.paginationList").length;
                component.set("v.totalSize", component.get("v.paginationList").length);
                component.set("v.start",0);
                component.set("v.end",pageSize-1);
                var paginationList = [];
                for(var i=0; i< pageSize; i++)
                {
                    paginationList.push(response.getReturnValue()[i]);
                }
                component.set("v.objAccount", paginationList);	
                
            }
        });
        $A.enqueueAction(action);
    },
    
    showSpinner: function(component, event, helper) {
        
        component.set("v.Spinner", true); 
    },
    hideSpinner : function(component,event,helper){
        
        component.set("v.Spinner", false);
    },
    first : function(component, event, helper)
    {
        var oppList = component.get("v.paginationList");
        var pageSize = component.get("v.pageSize");
        var totalSize = component.get("v.totalSize");
        var paginationList = [];
        for(var i=0; i< pageSize; i++)
        {
            paginationList.push(oppList[i]);
        }
        component.set("v.start",0);
        component.set("v.end",pageSize-1);
        component.set("v.objAccount", paginationList);
        
    },
    last : function(component, event, helper)
    {
        var oppList = component.get("v.paginationList");
        var pageSize = component.get("v.pageSize");
        var totalSize = component.get("v.totalSize");
        var paginationList = [];
        var modVal = totalSize/pageSize;
        var strVal = modVal.toString();
        var sub;
        if((totalSize%10)!=0){
            var index = strVal.indexOf('.');
                sub =parseInt(strVal.substring(0, index));
        }
        var tot = sub*10;
        
        component.set("v.start",tot);
        component.set("v.end",totalSize);
      
        for(var i=tot; i< totalSize; i++)
        {
            paginationList.push(oppList[i]);
        }
        component.set("v.objAccount", paginationList);
    },
    next : function(component, event, helper)
    {
        var oppList = component.get("v.paginationList");
        var end = component.get("v.end");
        var start = component.get("v.start");
        var pageSize = component.get("v.pageSize");
        var paginationList = [];
        var counter = 0;
        for(var i=end+1; i<end+pageSize+1; i++)
        {
            if(oppList.length > end)
            {
                paginationList.push(oppList[i]);
                counter ++ ;
            }
        }
        start = start + counter;
        end = end + counter;
        component.set("v.start",start);
        component.set("v.end",end);
        component.set("v.objAccount", paginationList);
    },
    previous : function(component, event, helper)
    {
        var oppList = component.get("v.paginationList");
        var end = component.get("v.end");
        var start = component.get("v.start");
        var pageSize = component.get("v.pageSize");
        var paginationList = [];
        var counter = 0;
       // alert(start);
        //alert(pageSize)
        for(var i= start-pageSize; i < start ; i++)
        {
            if(i > -1)
            {
                paginationList.push(oppList[i]);
                counter ++;
            }
            else {
                start++;
            }
        }
        start = start-counter;
        end = end-counter;
        //end = counter;
        component.set("v.start",start);
        component.set("v.end",end);
        component.set("v.objAccount", paginationList);
        
    },
    navigateToMyComponent : function(component, event, helper) {
        //alert(event.target.getAttribute("data-recId"));
        var pageReference = {
            type: 'standard__component',
            attributes: {
                componentName: 'c__AccountDetails',
            },
            state: {
                "c__recordId": event.target.getAttribute("data-recId")
            }
        };
        component.set("v.pageReference", pageReference);
        var navService = component.find("navService");
        var pageReference = component.get("v.pageReference");
        event.preventDefault();
        navService.navigate(pageReference);
    }
    
})