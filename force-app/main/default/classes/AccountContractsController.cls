public class AccountContractsController {
    /**
* Datatable Data Wrapper class
*/    
    public class dataTableWrapper {
        @AuraEnabled
        public Map<string,List<sObject>> groupedSObjs {get; set;}
        @AuraEnabled
        public List<string> fieldType {get; set;} 
        @AuraEnabled
        public List<string> fieldName {get; set;}
        @AuraEnabled
        public List<string> fieldLabel {get; set;}
        @AuraEnabled
        public List<Id> preSelectedsIds {get; set;}
        
        public dataTableWrapper(Map<string,List<sObject>> groupedSObjs, List<string> fieldType, List<string> fieldName, List<string> fieldLabel, List<Id> preSelectedsIds) {
            this.groupedSObjs = groupedSObjs;
            this.fieldType = fieldType;
            this.fieldName = fieldName;
            this.fieldLabel = fieldLabel;
            if(preSelectedsIds != null && preSelectedsIds.size()>0){
                this.preSelectedsIds = preSelectedsIds;
            }
        }
    }
    
    /**
* To get the list of sobjects as a list of datatable wrapper
* @param        : String objName, List<String> fieldNames, List<sObject>> sobjectMap, Set<Id> selectedItemIds
* @return       : dataTableWrapper
*/
    private static dataTableWrapper getDataTableWrapper(String objName, List<String> fieldNames, Map<string, List<sObject>> sobjectMap, Set<Id> selectedItemSet){
        List<string> types= new List<string>();
        List<string> names= new List<string>();
        List<string> labels= new List<string>();
        Map<string, string> mapParentObjToFields = new map<string, string>();
        Map<string, string> mapObjToReferenceName = new map<string, string>();
        List<string> parentObject = new list<string>();
        
        //Modifying field lables to make them presentable for Datatable
        for(string fld : fieldNames) {
            Schema.DescribeFieldResult f; 
            string referenceName;
            
            //For Owner Information
            if(fld == 'owner.name'){
                types.add('STRING');
                names.add('OwnerId');
                referenceName = 'OwnerId';
                labels.add('OWNER NAME');
                parentObject.add('Owner');
                mapParentObjToFields.put('Owner' ,'Name');
                mapObjToReferenceName.put('Owner' ,referenceName);
                
            }
            //For custom relationship data
            else if(fld.contains('__r')|| fld.contains('.')) {
                if(fld.contains('__r')) {
                    f = Schema.getGlobalDescribe().get(objName).getDescribe().fields.getMap().get(fld.substringBefore('.').replace('__r', '__c')).getDescribe();
                }
                if(!fld.contains('__r') && fld.contains('.')) {
                    f = Schema.getGlobalDescribe().get(fld.substringBefore('.')).getDescribe().fields.getMap().get(fld.substringAfter('.')).getDescribe();
                    Schema.SObjectType sObjType = Schema.getGlobalDescribe().get(fld.substringBefore('.'));
                    Schema.DescribeSObjectResult result = sObjType.getDescribe();
                    f = result.fields.getMap().get(fld.substringAfter('.')).getDescribe();
                    types.add(string.valueOf(f.getType()));
                    names.add(string.valueOf(fld.substringBefore('.') + 'Id'));
                    referenceName =string.valueOf(fld.substringBefore('.') + 'Id');
                    labels.add(string.valueOf(f.getLabel()));
                    parentObject.add(fld.substringBefore('.'));
                    mapParentObjToFields.put(fld.substringBefore('.'),fld.substringAfter('.'));
                    mapObjToReferenceName.put(fld.substringBefore('.'),referenceName);
                }
                //For custom relationship's Standard relationship data
                if(f.getType() == Schema.DisplayType.REFERENCE) {
                    string obj = string.valueOf(f.getReferenceTo()).remove('(').remove(')');
                    parentObject.add(fld.substringBefore('.'));
                    Schema.SObjectType sObjType = Schema.getGlobalDescribe().get(obj);
                    Schema.DescribeSObjectResult result = sObjType.getDescribe();
                    Schema.DescribeFieldResult pf = result.fields.getMap().get(fld.substringAfter('.')).getDescribe();
                    types.add(string.valueOf(pf.getType()));
                    referenceName =string.valueOf(fld.substringBefore('.').replace('__r','__c'));
                    names.add(string.valueOf(fld.substringBefore('.').replace('__r','__c')));
                    labels.add(string.valueOf(pf.getLabel()));
                    mapParentObjToFields.put(fld.substringBefore('.'),fld.substringAfter('.'));
                    mapObjToReferenceName.put(fld.substringBefore('.'),referenceName);
                } 
            }
            //For Standard relationship data
            else if(!fld.contains('.')) {
                f = Schema.getGlobalDescribe().get(objName).getDescribe().fields.getMap().get(fld).getDescribe();
                types.add(string.valueOf(f.getType()));
                names.add(string.valueOf(f.getName()));
                labels.add(string.valueOf(f.getLabel()));
            }
        }
        
        //Putting data from relationships against the field label in sObject
        for(List<sObject> sobjList : sobjectMap.values()) { 
            for(sObject ob : sobjList) { 
                for(string str: parentObject) {
                    if(ob.getsObject(str)!=null) { 
                        string lookupValue = String.valueOf(ob.getSobject(str).get(mapParentObjToFields.get(str)));
                        ob.put(mapObjToReferenceName.get(str), lookupValue);
                    }
                } 
            }
        }
        return new dataTableWrapper(sobjectMap, types, names, labels, new List<Id>(selectedItemSet));
    }
    
    /**
* To get the contract line items
* @param        : Id siteId
* @return       : dataTableWrapper
*/
    @AuraEnabled
    public static dataTableWrapper getContracts(string accId){
        Map<string, List<vlocity_ins__ContractLineItem__c>> typeContractLineItemMap = new Map<string, List<vlocity_ins__ContractLineItem__c>>();
        for(vlocity_ins__ContractLineItem__c cli : [SELECT Id, vlocity_ins__ProductId__c, vlocity_ins__ProductId__r.Name, vlocity_ins__ProductCode__c, vlocity_ins__ProductDescription__c, vlocity_ins__ProductType__c 
                                                    FROM vlocity_ins__ContractLineItem__c
                                                    WHERE vlocity_ins__ContractId__r.AccountId =:accId])
        {
            if(typeContractLineItemMap.containsKey(cli.vlocity_ins__ProductType__c)){
                typeContractLineItemMap.get(cli.vlocity_ins__ProductType__c).add(cli);
            }
            else{
                typeContractLineItemMap.put(cli.vlocity_ins__ProductType__c, new List<vlocity_ins__ContractLineItem__c>{cli});
            }
        }
        
        DataTableWrapper wrappedDataTable = getDataTableWrapper('vlocity_ins__ContractLineItem__c', new List<String>{'Id', 'vlocity_ins__ProductId__r.Name', 'vlocity_ins__ProductCode__c', 'vlocity_ins__ProductDescription__c'}, typeContractLineItemMap, null);
        
        return wrappedDataTable;
    }
}