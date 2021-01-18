global with  sharing class LookupController implements vlocity_ins.VlocityOpenInterface2 {
    private final static Integer MAX_RESULTS = 5;

    global Object invokeMethod(String methodName,Map<String,Object> inputs, Map<String,Object> output, Map<String,Object> options) {
        Boolean success = true;
        if(methodName == 'search'){
            return search(inputs, output, options);
        }   
        return success;
    }

    global boolean search(Map < String, Object > inputs, 
                          Map < String, Object > output, 
                          Map < String, Object > options)
    {
        List<String> selectedIds = new List<String>();
        // Prepare query paramters
        //searchTerm += '*';
        Map<String,Object> search = (Map<String,Object>)inputs.get('search');
		String searchTerm = (String) search.get('searchTerm');
        // Execute search query
        List<List<SObject>> searchResults = [
            FIND :searchTerm
            IN ALL FIELDS
            RETURNING
                Account(Id, Name, Group_ID__c WHERE id NOT IN :selectedIds)
            LIMIT :MAX_RESULTS
        ];

        // Prepare results
        List<LookupSearchResult> results = new List<LookupSearchResult>();

        // Extract Accounts & convert them into LookupSearchResult
        String accountIcon = 'standard:account';
        Account[] accounts = ((List<Account>) searchResults[0]);
        for (Account account : accounts) {
            results.add(
                new LookupSearchResult(
                    account.Id,
                    'Account',
                    accountIcon,
                    account.Name,
                    account.Group_ID__c
                )
            );
        }

        output.put('results',results);
        return true;
    }
}