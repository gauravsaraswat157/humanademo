global with sharing class ProducerHelper implements vlocity_ins.VlocityOpenInterface {
    
    global static Integer lineNum = 100;
    
    global Boolean invokeMethod(String methodName, Map<String,Object> inputMap, Map<String,Object> outputMap, Map<String,Object> options) {
        
        List<Object> arguments = (List<Object>) inputMap.get('arguments');
        
        system.debug(':::methodName: ' + methodName);
        system.debug(':::inputMap: ' + inputMap);
        
        if(methodName == 'setUserPass'){
            return setUserPass(inputMap, outputMap);
        }
        else if(methodName == 'editAlertReport'){
            return editAlertReport(inputMap, outputMap);
        }
        else if(methodName == 'editNPNBody'){
            return editNPNBody(inputMap, outputMap);
        }
        else if(methodName == 'retrieveProducerInfo'){
            return retrieveProducerInfo(inputMap, outputMap, options);
        }
        
        return false;
    }
    
    // system.debug(':::options: ' + options);
    
    private Boolean retrieveProducerInfo(Map<String,Object> inputMap, Map<String,Object> outputMap, Map<String,Object> options) {
        if(options.get('nbnNumber') == null){
            return false;
        }
        String conRecordId = (String)inputMap.get('ContactRecId');
        String npnNumber = (String)options.get('nbnNumber');
        
        
        List<vlocity_ins__ContactRegulatoryAction__c> regulatoryActions = [select id from vlocity_ins__ContactRegulatoryAction__c 
                                                                            where vlocity_ins__ContactId__c = :conRecordId];
        
        if(!regulatoryActions.isEmpty()){
            outputMap.put('regulatoryActionExists',true);
        }
        else{
            outputMap.put('regulatoryActionExists',false);
        }
        List<Object> licensereports = (List<Object>)inputMap.get('LicensingReport');
        
        for(Object obj : licensereports){
           Map<String,Object> licenseMap = (Map<String,Object>)Obj;
        }
        return true;
    }
    
    private Boolean setUserPass(Map<String,Object> inputMap, Map<String,Object> outputMap) {
        //String usr = 'beta83vlocity';
        // String pwd = 'KevinRileyVlocity2018';
        
        String usr = (String)inputMap.get('USER');
        String pwd = (String)inputMap.get('PWD');
        
        //String utf8 = EncodingUtil.urlEncode(usr + ':' + pwd, 'UTF-8');
        String utf8 = usr + ':' + pwd;
        System.debug('utf8 ' + utf8);
        
        Blob targetBlob = Blob.valueOf(utf8);
        //System.debug('Blob');
        //System.debug(targetBlob.toString());
        String base64 = EncodingUtil.base64Encode(targetBlob);
        System.debug('base64 ' + base64);
        
        String authValue = 'Basic ' + base64;
        System.debug(':::authValue: ' + authValue);
        
        outputMap.put('encodeUserPass', authValue);
        
        return true;
    }
    
    
    private Boolean editAlertReport(Map<String,Object> inputMap, Map<String,Object> outputMap) {
        
        String pdbRept = (String)inputMap.get('pdbReport');
        system.debug('::: pdbRept1: ' + pdbRept.left(25));
        Integer startInt = pdbRept.indexOf('<LicensingReport>');
        pdbRept = pdbRept.substring(startInt);
        system.debug('::: pdbRept2: ' + pdbRept.left(25));
        
        Integer endInt = pdbRept.indexOf('</LicensingReportProcess');
        system.debug(':::end: ' + endInt);
        pdbRept = pdbRept.substring(0, endInt);
        system.debug(':::pdbRept3: '+ pdbRept.right(25));
        
        /* // this calls TD's code directly.  Works but got better results letting a DR do the conversion
String jsonRept = vlocity_ins.XmlToJson.convertXMLToJson(pdbRept);
system.debug(':::jsonRept: ' + jsonRept.left(50));
system.debug(':::jsonReptFull: ' + jsonRept);
pdbRept = jsonRept;
// outputMap.put('editedRept', jsonRept);  
*/
        outputMap.put('editedRept', pdbRept);
        
        return true;
    }
    
    private Boolean editNPNBody(Map<String,Object> inputMap, Map<String,Object> outputMap) {
        
        system.debug(':::input: ' + inputMap);
        system.debug('****npnBodyFEIN'+(String)inputMap.get('npnBodyFEIN')); 
        system.debug('****npnBodySSN'+(String)inputMap.get('npnBodySSN'));
        system.debug('****npnBodyLicense'+(String)inputMap.get('npnBodyLicense')); 
        
        String FEIN= (String)inputMap.get('npnBodyFEIN'); 
        String SSN= (String)inputMap.get('npnBodySSN');
        String License=(String)inputMap.get('npnBodyLicense');
        String npnBody; 
        String SoapEnvString='<soapenv:Envelope>';
        // system.debug('FEIN.substring(20)=='>''+FEIN.substring(21));
        if(FEIN.containsIgnoreCase(SoapEnvString)){ 
            npnBody=FEIN;
            system.debug('***npnBody1F***'+npnBody); //FEIN data
        }
        else if (SSN.containsIgnoreCase(SoapEnvString)){
            npnBody = SSN;  // SSN data
            system.debug('***npnBody2S***'+npnBody);
        }
        else if(License.containsIgnoreCase(SoapEnvString)){
            npnBody = License;  // License data
            system.debug('***npnBody3L***'+npnBody);
        }
        System.debug(':::npnBody: ' + npnBody);
        
        integer st = npnBody.indexOf('<soapenv:Body>');
        integer fin = npnBody.indexOf('</soapenv:Envelope>');
        //        integer fin = npnBody.indexOf('<@xmlns>');
        
        npnBody = npnBody.substring(st,fin);
        
        System.debug(':::npnBody2: ' + npnBody);
        
        String hdr = '<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/';
        String hdr2 = '\" xmlns:npn=\"https://pdb.nipr.com/npn-ws/\"><soapenv:Header>/</soapenv:Header>';
        npnBody = hdr + hdr2 +npnBody + '</soapenv:Envelope>';
        
        System.debug(':::npnBody3: ' + npnBody);
        
        outputMap.put('editedBody', npnBody);    
        
        return true;
        
    }
    
    
}