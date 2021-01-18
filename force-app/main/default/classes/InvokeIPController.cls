public with sharing class InvokeIPController {

    @AuraEnabled(cacheable=true)
    public static String getIPData(String procedureName, Map<String, Object> input, Map<String, Object> options) {
    
        Map<String,Object> ipOutput = (Map <String, Object>) vlocity_ins.IntegrationProcedureService.runIntegrationService(procedureName, input, options);
        return JSON.serialize(ipOutput);
        
    }
}