public without sharing class HUM_AccountTriggerHandler {
    public static void afterUpdateAccount(List<Account> TriggerNew, Map<Id,Account> TriggeroldMap){
        Delegated_History_Tracking__c ht = new Delegated_History_Tracking__c ();
        List<Delegated_History_Tracking__c> listHt = new List<Delegated_History_Tracking__c>();
        String nameChanged,addressChanged;
        for(Account con : TriggerNew){
            //system.debug('UserInfo--->'+UserInfo.getUserType());
            for(String str : Auth.SessionManagement.getCurrentSession().keySet()){
                //system.debug('str-->'+str+'='+Auth.SessionManagement.getCurrentSession().get(str));
                if(str.equalsIgnoreCase('LoginType') && Auth.SessionManagement.getCurrentSession().get(str) == null){
                    String strT, loginUserId;
                    if(UserInfo.getUserType().equalsIgnoreCase('PowerPartner')){
                        strT = Auth.SessionManagement.getCurrentSession().get('ParentId');
                        loginUserId = [SELECT Id, UsersId FROM AuthSession WHERE Id =: strT].UsersId;
                    } else{
                        strT = Auth.SessionManagement.getCurrentSession().get('LoginHistoryId');
                        loginUserId = [SELECT UserId FROM LoginHistory where id =: strT][0].UserId;
                    }
                    //String LoginUserName = [Select Id, Name from user where id =: loginUserId][0].Name;
                    //System.debug('LoginUserName--->'+LoginUserName);
                    //con.addError('Actual Login User-->'+LoginUserName);
                    //ht.User__c = [Select Id, Name from user where id =: Auth.SessionManagement.getCurrentSession().get('UsersId')][0].Name +
                    //  		 '('+LoginUserName+')';
					ht.Support_Agent_User__c = Auth.SessionManagement.getCurrentSession().get('UsersId');
                    ht.Current_User__c = loginUserId;
                    ht.Account__c = con.id;
                    if(con.Name != TriggeroldMap.get(con.Id).Name){
                        nameChanged = 'Changed Name From '+TriggeroldMap.get(con.Id).Name+' to '+con.Name;
                    } 
                    if(con.BillingStreet != TriggeroldMap.get(con.Id).BillingStreet){
                        addressChanged = 'Changed BillingAddress From '+
                            TriggeroldMap.get(con.Id).BillingStreet + ', ' +
                            TriggeroldMap.get(con.Id).BillingCity + ', ' +
                            TriggeroldMap.get(con.Id).BillingState + ', ' +
                            TriggeroldMap.get(con.Id).BillingPostalCode + ', ' +
                            TriggeroldMap.get(con.Id).BillingCountry +
                            '\n' +
                            ' TO '+
                            '\n' +
                            con.BillingStreet+ ', ' +
                            con.BillingCity+ ', ' +
                            con.BillingState+ ', ' +
                            con.BillingPostalCode+ ', ' +
                            con.BillingCountry;
                    }
                    if(con.BillingCity != TriggeroldMap.get(con.Id).BillingCity){
                        addressChanged = 'Changed BillingAddress From '+
                            TriggeroldMap.get(con.Id).BillingStreet + ', ' +
                            TriggeroldMap.get(con.Id).BillingCity + ', ' +
                            TriggeroldMap.get(con.Id).BillingState + ', ' +
                            TriggeroldMap.get(con.Id).BillingPostalCode + ', ' +
                            TriggeroldMap.get(con.Id).BillingCountry +
                            '\n' +
                            ' TO '+
                            '\n' +
                            con.BillingStreet+ ', ' +
                            con.BillingCity+ ', ' +
                            con.BillingState+ ', ' +
                            con.BillingPostalCode+ ', ' +
                            con.BillingCountry;
                    }
                    if(con.BillingState != TriggeroldMap.get(con.Id).BillingState){
                        addressChanged = 'Changed BillingAddress From '+
                            TriggeroldMap.get(con.Id).BillingStreet + ', ' +
                            TriggeroldMap.get(con.Id).BillingCity + ', ' +
                            TriggeroldMap.get(con.Id).BillingState + ', ' +
                            TriggeroldMap.get(con.Id).BillingPostalCode + ', ' +
                            TriggeroldMap.get(con.Id).BillingCountry +
                            '\n' +
                            ' TO '+
                            '\n' +
                            con.BillingStreet+ ', ' +
                            con.BillingCity+ ', ' +
                            con.BillingState+ ', ' +
                            con.BillingPostalCode+ ', ' +
                            con.BillingCountry;
                    }
                    if(con.BillingPostalCode != TriggeroldMap.get(con.Id).BillingPostalCode){
                        addressChanged = 'Changed BillingAddress From '+
                            TriggeroldMap.get(con.Id).BillingStreet + ', ' +
                            TriggeroldMap.get(con.Id).BillingCity + ', ' +
                            TriggeroldMap.get(con.Id).BillingState + ', ' +
                            TriggeroldMap.get(con.Id).BillingPostalCode + ', ' +
                            TriggeroldMap.get(con.Id).BillingCountry +
                            '\n' +
                            ' TO '+
                            '\n' +
                            con.BillingStreet+ ', ' +
                            con.BillingCity+ ', ' +
                            con.BillingState+ ', ' +
                            con.BillingPostalCode+ ', ' +
                            con.BillingCountry;
                    }
                    if(con.BillingCountry != TriggeroldMap.get(con.Id).BillingCountry){
                        addressChanged = 'Changed BillingAddress From '+
                            TriggeroldMap.get(con.Id).BillingStreet + ', ' +
                            TriggeroldMap.get(con.Id).BillingCity + ', ' +
                            TriggeroldMap.get(con.Id).BillingState + ', ' +
                            TriggeroldMap.get(con.Id).BillingPostalCode + ', ' +
                            TriggeroldMap.get(con.Id).BillingCountry +
                            '\n' +
                            ' TO '+
                            '\n' +
                            con.BillingStreet+ ', ' +
                            con.BillingCity+ ', ' +
                            con.BillingState+ ', ' +
                            con.BillingPostalCode+ ', ' +
                            con.BillingCountry;
                    }
                    if(String.isNotBlank(nameChanged) && String.isNotBlank(addressChanged)){
                        ht.Action__c = nameChanged + '\n' + ' AND ' + '\n' + addressChanged;
                    } else if(String.isNotBlank(nameChanged)){
                        ht.Action__c = nameChanged;
                    } else if(String.isNotBlank(addressChanged)){
                        ht.Action__c = addressChanged;
                    }
                    listHt.add(ht);
                }
            }
            //con.addError(''+Auth.SessionManagement.getCurrentSession());
            //system.assertEquals(null, Auth.SessionManagement.getCurrentSession());
        }
        if(listHt != null && listHt.size() > 0){
            insert listHt;
        }
    } 
}