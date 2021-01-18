({
    initialiseTabledata : function(component, event, helper) {
        component.set('v.columns', [
            {label: 'Group Name'},
            {label: 'Quote Number'},
            {label: 'Effective date'}, 
            {label: 'Case Size'}, 
            {label: 'Type'}, 
            {label: 'Lines'}, 
            {label: 'Status'},
            {label: ''}
        ]);
        helper.fetchInitialData(component);
    },
    handleActive : function(component, event, helper){
        var tab = event.getSource();
        switch(tab.get('v.id')){
            case 'recentQuotes': helper.fetchInitialData(component);
                break;
            case 'quotesUnderwriting': helper.fetchQuotesinUndertaking(component);
                break;
            case 'caseInstallation': helper.fetchCaseInstallation(component);
                break;
            case 'upcomingRenewals': helper.fetchUpcomingRenewals(component);
                break;    
        }
    }
})