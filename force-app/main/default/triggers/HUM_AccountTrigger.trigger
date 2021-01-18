trigger HUM_AccountTrigger on Account (after update) {
    HUM_AccountTriggerHandler.afterUpdateAccount(Trigger.New,Trigger.oldMap);
}