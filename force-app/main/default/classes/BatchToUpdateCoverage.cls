public class BatchToUpdateCoverage {

   
    public static void saveChildItemJSON(Set<Id> productIds)
    {
        Set<Id> childProductIds = new set<Id>();
      String pciQuery = 'Select '+ String.join(retrieveAllFieldsList('vlocity_ins__ProductChildItem__c'), ',')  +
            ' FROM vlocity_ins__ProductChildItem__c WHERE vlocity_ins__ParentProductId__c IN: productIds AND vlocity_ins__ChildRecordType__c = \'CoverageSpec\'';
        Map<Id,vlocity_ins__ProductChildItem__c> pciMap = new Map<Id,vlocity_ins__ProductChildItem__c>(
            (List<vlocity_ins__ProductChildItem__c>)Database.query(pciQuery));
        for(Id pciID : pciMap.keySet()){
            childProductIds.add(pciMap.get(pciId).vlocity_ins__childProductId__c);
        }

        String prodQuery = 'Select '+ String.join(retrieveAllFieldsList('Product2'), ',')  +
            ' FROM Product2 where Id in: childProductIds';
        Map<Id,Product2> childProductMap = new Map<Id,Product2>((List<Product2>)Database.query(prodQuery));
       
        Set<Id> productIdList = pciMap.keySet();
        String queryStr = 'Select '+ String.join(retrieveAllFieldsList('vlocity_ins__AttributeAssignment__c'), ',')  +
        ' FROM vlocity_ins__AttributeAssignment__c WHERE vlocity_ins__AttributeId__c != null AND vlocity_ins__ObjectId__c IN :productIdList ';
    List<vlocity_ins__AttributeAssignment__c> overridingAttributeAssignmentList = Database.query(queryStr);
Map<String,String> pciToAttDefaultValues = preparePCIToAttributeDefaultValue(overridingAttributeAssignmentList);
       
        String compOverrideQuery = 'Select '+ String.join(retrieveAllFieldsList('vlocity_ins__CompiledAttributeOverride__c'), ',')  +
            ' FROM vlocity_ins__CompiledAttributeOverride__c WHERE vlocity_ins__ProductChildItemId__c IN: productIdList AND vlocity_ins__ProductId__c IN: productIds';
        Map<String,Map<Id,Id>> pciToCompOverride = new Map<String,Map<Id,Id>>();
        for(vlocity_ins__CompiledAttributeOverride__c compOverride : (List<vlocity_ins__CompiledAttributeOverride__c>)Database.query(compOverrideQuery)){
            if(!pciToCompOverride.containsKey(compOverride.vlocity_ins__ProductId__c)){
                pciToCompOverride.put(compOverride.vlocity_ins__ProductId__c, new Map<Id,Id>());
            }
            pciToCompOverride.get(compOverride.vlocity_ins__ProductId__c).put(compOverride.vlocity_ins__ProductChildItemId__c,compOverride.ID);
        }
       
       
        List<vlocity_ins__CompiledAttributeOverride__c> compOverrideToUpsert = new List<vlocity_ins__CompiledAttributeOverride__c>();
        for(Id pciId : pciMap.keySet()){
            vlocity_ins__CompiledAttributeOverride__c compOverride = new vlocity_ins__CompiledAttributeOverride__c();
            if(pciToCompOverride.containsKey(pciMap.get(pciId).vlocity_ins__ParentProductId__c)
               && pciToCompOverride.get(pciMap.get(pciId).vlocity_ins__ParentProductId__c).containsKey(pciId)){
                compOverride.Id = pciToCompOverride.get(pciMap.get(pciId).vlocity_ins__ParentProductId__c).get(pciId);
            }
            compOverride.vlocity_ins__AttributeMetadata__c = childProductMap.get(pciMap.get(pciId).vlocity_ins__childProductId__c).vlocity_ins__AttributeMetadata__c;
            compOverride.vlocity_ins__AttributeDefaultValues__c = pciToAttDefaultValues.get(pciId);
            compOverride.vlocity_ins__ProductChildItemId__c = pciId;
            compOverride.vlocity_ins__ProductId__c = pciMap.get(pciId).vlocity_ins__ParentProductId__c;
            compOverrideToUpsert.add(compOverride);
        }
       
        if(!compOverrideToUpsert.isEmpty()){
            system.debug(JSON.serialize(compOverrideToUpsert));
            upsert compOverrideToUpsert;
        }
       
    }
   
   
    public static Map<String,String> preparePCIToAttributeDefaultValue(List<vlocity_ins__AttributeAssignment__c> overridingAttributeAssignmentList){
        Map<String,Map<String,String>> objectIdToAttCodewithvalue = new Map<String,Map<String,String>>();
        for(vlocity_ins__AttributeAssignment__c attAssign : overridingAttributeAssignmentList){
            if(!objectIdToAttCodewithvalue.containsKey(attAssign.vlocity_ins__ObjectId__c)){
                objectIdToAttCodewithvalue.put(attAssign.vlocity_ins__ObjectId__c, new Map<String,String>());
            }
            objectIdToAttCodewithvalue.get(attAssign.vlocity_ins__ObjectId__c).put(attAssign.vlocity_ins__AttributeUniqueCode__c,attAssign.vlocity_ins__Value__c);
        }
        Map<String,String> pciToAttDefaultValues = new Map<String,String>();
        for(String objId : objectIdToAttCodewithvalue.keySet()){
            pciToAttDefaultValues.put(objId, JSON.serialize(objectIdToAttCodewithvalue.get(objId)));
        }
        return pciToAttDefaultValues;
    }
   
   
    public static List<String> retrieveAllFieldsList(String sObjectName){

        Map<String, Schema.SObjectType> gdMap = Schema.getGlobalDescribe();
        Schema.Describesobjectresult dsr = gdMap.get(sObjectName).getDescribe();
        return new List<String>(dsr.fields.getMap().keySet());
    }
   
}