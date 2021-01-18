({
    fetchInitialData : function(component) {
        component.set('v.data',null);
        component.set('v.data', [
            {
                id: 'a',
                groupName: 'ABC Corporation',
                quoteNumber: '3527282',
                effectiveDate: '09/26/2018',
                caseSize: 4,
                type: 'LFP',
                lines: 'M/V/D/L',
                status: 'Underwritten',
                quoteView: 'View Quote &rarr;' 
            },
            {
                id: 'b',
                groupName: 'SYZ Corporation',
                quoteNumber: '3739221',
                effectiveDate: '10/06/2019',
                caseSize: 43,
                type: 'LFP',
                lines: 'M/V/D/L',
                status: 'Baseline',
                quoteView: 'View Quote' 
            },
            {
                id: 'c',
                groupName: 'Smith Dell',
                quoteNumber: '233527282',
                effectiveDate: '4/12/2019',
                caseSize: 11,
                type: 'ACA',
                lines: 'M/V/D/L',
                status: 'Complete',
                quoteView: 'View Quote' 
            },
            {
                id: 'd',
                groupName: 'John LLC',
                quoteNumber: '9783527282',
                effectiveDate: '02/26/2019',
                caseSize: 34,
                type: 'LFP',
                lines: 'M/V/D/L',
                status: 'Sold',
                quoteView: 'View Quote' 
            },
            {
                id: 'e',
                groupName: 'Oakwood Academy',
                quoteNumber: '613527282',
                effectiveDate: '02/26/2019',
                caseSize: 14,
                type: 'LFP',
                lines: 'M/V/D/L',
                status: 'Underwritten',
                quoteView: 'View Quote;' 
            }                         
        ]);
    },
    fetchQuotesinUndertaking : function(component){
        component.set('v.data',null);
        component.set('v.data', [
            {
                id: 'a',
                groupName: 'TangleWood LLC',
                quoteNumber: '3527282',
                effectiveDate: '09/26/2018',
                caseSize: 4,
                type: 'LFP',
                lines: 'M/V/D/L',
                status: 'Undertaking',
                quoteView: 'View Quote &rarr;' 
            },
            {
                id: 'b',
                groupName: 'SUP Corp',
                quoteNumber: '3739221',
                effectiveDate: '10/06/2019',
                caseSize: 43,
                type: 'LFP',
                lines: 'M/V/D/L',
                status: 'Undertaking',
                quoteView: 'View Quote' 
            },
            {
                id: 'c',
                groupName: 'Colononel DC',
                quoteNumber: '233527282',
                effectiveDate: '4/12/2019',
                caseSize: 11,
                type: 'ACA',
                lines: 'M/V/D/L',
                status: 'Undertaking',
                quoteView: 'View Quote' 
            },
            {
                id: 'd',
                groupName: 'Sentia Aged',
                quoteNumber: '9783527282',
                effectiveDate: '02/26/2019',
                caseSize: 34,
                type: 'LFP',
                lines: 'M/V/D/L',
                status: 'Undertaking',
                quoteView: 'View Quote' 
            }
        ]);
    },
    fetchCaseInstallation : function(component){
        component.set('v.data',null);
        component.set('v.data', [
            {
                id: 'a',
                groupName: 'Pristina Travels',
                quoteNumber: '3527282',
                effectiveDate: '09/26/2018',
                caseSize: 4,
                type: 'LFP',
                lines: 'M/V/D/L',
                status: 'Case Installation',
                quoteView: 'View Quote &rarr;' 
            },
            {
                id: 'b',
                groupName: 'Denver Sockets',
                quoteNumber: '3739221',
                effectiveDate: '10/06/2019',
                caseSize: 43,
                type: 'LFP',
                lines: 'M/V/D/L',
                status: 'Case Installation',
                quoteView: 'View Quote' 
            },
            {
                id: 'c',
                groupName: 'Amumni S',
                quoteNumber: '233527282',
                effectiveDate: '4/12/2019',
                caseSize: 11,
                type: 'ACA',
                lines: 'M/V/D/L',
                status: 'Case Installation',
                quoteView: 'View Quote' 
            }
        ]);
    },
    fetchUpcomingRenewals : function(component){
        component.set('v.data',null);
        component.set('v.data', [
            {
                id: 'a',
                groupName: 'UCB Healthcares',
                quoteNumber: '3527282',
                effectiveDate: '10/16/2019',
                caseSize: 4,
                type: 'LFP',
                lines: 'M/V/D/L',
                status: 'Renewal',
                quoteView: 'View Quote &rarr;' 
            },
            {
                id: 'b',
                groupName: 'Sempre Cresendo',
                quoteNumber: '3739221',
                effectiveDate: '11/26/2019',
                caseSize: 43,
                type: 'LFP',
                lines: 'M/V/D/L',
                status: 'Renewal',
                quoteView: 'View Quote' 
            }
        ]);
    }
})