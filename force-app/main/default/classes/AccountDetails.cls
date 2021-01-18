public class AccountDetails {
    @AuraEnabled
    public static List<Account> getAccountDetails(){
        List<Account>lstAccount = New List<Account>();
        lstAccount = [SELECT Id,Name,AccountNumber,Fax,Phone,BillingCity,BillingState,BillingCountry,createdDate,vlocity_ins__Status__c,BillingPostalCode,vlocity_ins__Email__c
                      from Account Order By Name Asc];
        return lstAccount;
    }
    @AuraEnabled
    public static List<Account> getAccountBySearch(String strSearch){
        List<Account>lstAccount = New List<Account>();
        if(strSearch!=null){
            lstAccount = [SELECT Id,Name,AccountNumber,Fax,Phone,BillingCity,BillingState,BillingCountry,createdDate,vlocity_ins__Status__c,BillingPostalCode,vlocity_ins__Email__c 
                          from Account where ((Name Like :strSearch+'%' OR vlocity_ins__Status__c LIKE:strSearch+'%')) Order By Name ASC];
        }else{
            lstAccount = [SELECT Id,Name,AccountNumber,Fax,Phone,BillingCity,BillingState,BillingCountry,createdDate,vlocity_ins__Status__c,
                          BillingPostalCode,vlocity_ins__Email__c from Account Order By Name Asc];
        }
        System.debug('lstAccount'+lstAccount);
        return lstAccount;
    }
    @Auraenabled
    public static List<string>getStatusVal(){
        List<String> pickListValuesList= new List<String>();
        Schema.DescribeFieldResult fieldResult = Account.vlocity_ins__Status__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple){
            pickListValuesList.add(pickListVal.getLabel());
        }     
        return pickListValuesList;
    }
    @AuraEnabled
    public static Account getAccountInfo(string strAccId){
        Account objAccount = new Account();
        if(strAccId!=null){
            objAccount = [SELECT Id,Name,AccountNumber,Fax,Phone,BillingCity,BillingState,BillingCountry,createdDate,vlocity_ins__Status__c,BillingPostalCode,vlocity_ins__Email__c 
                          ,vlocity_ins__SumOfEmployees__c,vlocity_ins__PremiumYear__c from Account where Id=:strAccId Order By Name Asc];
        }
        return objAccount;
    }
}