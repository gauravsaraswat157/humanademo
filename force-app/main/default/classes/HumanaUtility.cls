global with sharing class HumanaUtility implements vlocity_ins.VlocityOpenInterface2 {

    global Object invokeMethod(String methodName,Map<String,Object> inputs, Map<String,Object> output, Map<String,Object> options) {
        Boolean success = true;
        if(methodName == 'fetchQuotesSummary'){
            return fetchQuotesSummary(inputs, output, options);
        } else if(methodName == 'fetchContacts'){
            return fetchContacts(inputs, output, options);
        }   
        return success;
    }


    global boolean fetchContacts(Map < String, Object > inputs, 
                                      Map < String, Object > output, 
                                      Map < String, Object > options) {
        String accountId = (String) inputs.get('accountId'); 
        accountId = accountId == '0012w000002uqYLAAY' ? '0012E00001tjmWV' : accountId;
        List<Contact> contacts = [SELECT Id, Name, Email, Phone, Title FROM Contact WHERE AccountId = :accountId LIMIT 10];
        output.put('contacts',contacts);
        return true;
    }

    global boolean fetchQuotesSummary(Map < String, Object > inputs, 
                                      Map < String, Object > output, 
                                      Map < String, Object > options){

        Map<String,Integer> counts  = new Map<String,Integer>{'Pending' => 0, 'In Review' => 0, 'Needs Review' => 0,'Approved' => 0,'Rejected' => 0,'Presented' =>0,'Accepted' => 0,'Denied' =>0}; 
        AggregateResult[] groupedResults = [SELECT Count(ID) total,Status type FROM Quote group by status];
        for (AggregateResult r : groupedResults){
            counts.put((String)r.get('type'), (Integer)r.get('total'));
        }
        output.put('counts',counts);
        return true;         
    }

    
    @AuraEnabled(cacheable=true)
    public static AccountWrapper getAccountDetails(String accountId) {
        AccountWrapper accountWrapper = new AccountWrapper();
        List<Account> account = [SELECT Id,Name,Group_Id__c,BillingAddress,(Select Id,Name,Title,Phone,Email from Contacts) from Account where Id=:accountId];
        accountWrapper.account = account[0];
        accountWrapper.contacts = account[0].Contacts;
        return accountWrapper;
    }

    @AuraEnabled(cacheable=true)
    public static List<RecordWrapper> fetchAccounts() {
        List<RecordWrapper> recordWrapperList = new List<RecordWrapper>();
        Integer caseSize = 10;
        for(Quote qrec : [SELECT Id, RecordType.Name, QuoteNumber, Status, AccountId, Account.Name, vlocity_ins__EffectiveDate__c FROM Quote LIMIT 10]) {
            recordWrapperList.add(new RecordWrapper(qrec.Id, qrec.Account.Name, qrec.QuoteNumber, qrec.vlocity_ins__EffectiveDate__c, String.valueOf(caseSize), qrec.RecordType.Name, 'M/V/D/L', qrec.Status, 'View quote', qrec.AccountId));
            caseSize++;
        }
        /* for(Account acc : [SELECT Id, Name, Phone, Website FROM Account LIMIT 10]) {
            recordWrapperList.add(new RecordWrapper(acc.Id, acc.Name, acc.Phone, acc.Website, 'View Account'));
        } */
        return recordWrapperList;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String accId) {
		return [SELECT Id,Name,Phone,Email FROM Contact WHERE AccountId = :accId ORDER BY Name];        
    }

    @AuraEnabled(cacheable=true)
    public static AccountPolicyWrapper fetchAccountPolicies(String accountId) {
        AccountPolicyWrapper accPolicyWrap  = new AccountPolicyWrapper();
        List<PolicyWrapper> medicalPolicies = new List<PolicyWrapper>();
        List<PolicyWrapper> dentalPolicies  = new List<PolicyWrapper>();
        Double medicalMonthlyPremium        = 0;
        Double dentalMonthlyPremium         = 0;
        Decimal eligibleEmployees           = 0;
        Decimal enrolledEmployees           = 0;
        String groupStatus                  = 'Active';
        Boolean setOnce                     = true;
        for(Asset assetRec : [SELECT Id, Account.Total_Employees_Count__c, Account.vlocity_ins__Status__c, Account.Total_Enroll_Employee__c, vlocity_ins__BenefitPlanId__r.Name, 
                                    vlocity_ins__EffectiveDate__c, vlocity_ins__ExpirationDate__c, Product2.vlocity_ins__Type__c, vlocity_ins__MonthlyPremium__c 
                                FROM Asset 
                                WHERE AccountId =: accountId AND Product2.vlocity_ins__Type__c IN ('Medical', 'Dental')]) {
            if(setOnce) {
                eligibleEmployees = (assetRec.Account.Total_Employees_Count__c == null ? 0 : assetRec.Account.Total_Employees_Count__c);
                enrolledEmployees = (assetRec.Account.Total_Enroll_Employee__c == null ? 0 : assetRec.Account.Total_Enroll_Employee__c);
                groupStatus       = assetRec.Account.vlocity_ins__Status__c;
                setOnce = false;
            }
            if(assetRec.Product2.vlocity_ins__Type__c == 'Medical') {
                medicalMonthlyPremium += (assetRec.vlocity_ins__MonthlyPremium__c == null ? 0 : assetRec.vlocity_ins__MonthlyPremium__c);
                medicalPolicies.add(new PolicyWrapper(assetRec.Id, assetRec.vlocity_ins__BenefitPlanId__r.Name, assetRec.vlocity_ins__EffectiveDate__c, assetRec.vlocity_ins__ExpirationDate__c, '50/80', '1000', '500'));
            } else {
                dentalMonthlyPremium += (assetRec.vlocity_ins__MonthlyPremium__c == null ? 0 : assetRec.vlocity_ins__MonthlyPremium__c);
                dentalPolicies.add(new PolicyWrapper(assetRec.Id, assetRec.vlocity_ins__BenefitPlanId__r.Name, assetRec.vlocity_ins__EffectiveDate__c, assetRec.vlocity_ins__ExpirationDate__c, '50/80', '1000', '500'));
            }
        }
        accPolicyWrap.eligibleEmployeesMedical  = String.valueOf(eligibleEmployees);
        accPolicyWrap.enrolledEmployeesMedical  = String.valueOf(enrolledEmployees);
        accPolicyWrap.eligibleEmployeesDental   = String.valueOf(eligibleEmployees);
        accPolicyWrap.enrolledEmployeesDental   = String.valueOf(enrolledEmployees);
        accPolicyWrap.monthlyPremiumMedical     = String.valueOf(medicalMonthlyPremium);
        accPolicyWrap.monthlyPremiumDental      = String.valueOf(dentalMonthlyPremium);
        accPolicyWrap.medicalPolicies           = medicalPolicies;
        accPolicyWrap.dentalPolicies            = dentalPolicies;
        accPolicyWrap.groupStatus               = groupStatus;
        return accPolicyWrap;
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> fetchAccountEmployees(String accountId) {
		return [SELECT Id, Name, Phone, Email FROM Contact WHERE AccountId =: accountId ORDER BY Name LIMIT 100];        
    }

    @AuraEnabled(cacheable=true)
    public static List<Order> fetchAccountBillings(String accountId) {
		return [SELECT Id, EffectiveDate, Status, TotalAmount, OrderNumber FROM Order WHERE TotalAmount != 0 LIMIT 100];        
    }

    @AuraEnabled(cacheable=true)
    public static List<Quote> fetchAccountQuotes(String accountId) {
		return [SELECT Id, Name, QuoteNumber, Status, TotalPrice FROM Quote WHERE TotalPrice != 0 and AccountId =:accountId LIMIT 100];        
    }

    public class RecordWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String groupName;
        @AuraEnabled public String quoteNumber;
        @AuraEnabled public Date effectiveDate;
        @AuraEnabled public String caseSize;
        @AuraEnabled public String type;
        @AuraEnabled public String lines;
        @AuraEnabled public String status;
        @AuraEnabled public String actionLabel;
        @AuraEnabled public String accountId;

        public RecordWrapper(String id, String groupName, String quoteNumber, Date effectiveDate, String caseSize, String type, String lines, String status, String actionLabel, String accountId) {
            this.id             = id;
            this.groupName      = groupName;
            this.quoteNumber    = quoteNumber;
            this.effectiveDate  = effectiveDate;
            this.caseSize       = caseSize;
            this.type           = type;
            this.lines          = lines;
            this.status         = status;
            this.actionLabel    = actionLabel;
            this.accountId      = accountId;
        }
    }

    public class AccountWrapper {
        @AuraEnabled public Account account;
        @AuraEnabled public List<Contact> contacts;
    }

    public class AccountPolicyWrapper {
        @AuraEnabled public String eligibleEmployeesMedical;
        @AuraEnabled public String enrolledEmployeesMedical;
        @AuraEnabled public String monthlyPremiumMedical;
        @AuraEnabled public String eligibleEmployeesDental;
        @AuraEnabled public String enrolledEmployeesDental;
        @AuraEnabled public String monthlyPremiumDental;
        @AuraEnabled public String groupStatus;
        @AuraEnabled public List<PolicyWrapper> medicalPolicies;
        @AuraEnabled public List<PolicyWrapper> dentalPolicies;
    }

    public class PolicyWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String planName;
        @AuraEnabled public Date effectiveDate;
        @AuraEnabled public Date expiresOn;
        @AuraEnabled public String coinsurance;
        @AuraEnabled public String deductible;
        @AuraEnabled public String oopMaximum;

        public PolicyWrapper(String id, String planName, Date effectiveDate, Date expiresOn, String coinsurance, String deductible, String oopMaximum) {
            this.id             = id;
            this.planName       = planName;
            this.effectiveDate  = effectiveDate;
            this.expiresOn      = expiresOn;
            this.coinsurance    = coinsurance;
            this.deductible     = deductible;
            this.oopMaximum     = oopMaximum;
        }
    }
}