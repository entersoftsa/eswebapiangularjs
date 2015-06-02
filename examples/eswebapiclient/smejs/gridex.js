function getData() {
    return {
        "Filter": [{
            "ID": "CustomerList",
            "Caption": "Κατάλογος πελατών",
            "QueryID": "ESFICustomer\\CustomerList\\CustomerList_Q1.esq",
            "RootTable": "ESFITradeAccount",
            "SelectedMasterTable": "ESFITradeAccount",
            "SelectedMasterField": "GID",
            "TotalRow": "0",
            "ColumnHeaders": "0",
            "ColumnSetHeaders": "0",
            "ColumnSetRowCount": "2",
            "ColumnSetHeaderLines": "1",
            "HeaderLines": "1",
            "GroupByBoxVisible": "true",
            "FilterLineVisible": "false",
            "PreviewRow": "false",
            "PreviewRowMember": "",
            "PreviewRowLines": "3"
        }],
        "Param": [{
            "ID": "Code",
            "AA": "1",
            "Caption": "Κωδικός",
            "Tooltip": "Κωδικός",
            "ControlType": "9",
            "ParameterType": "Entersoft.Framework.Platform.ESString, QueryProcess",
            "Precision": "0",
            "MultiValued": "true",
            "Visible": "true",
            "Required": "false",
            "ODSTag": "11AA2299-3F5E-4B2A-B530-6222866A7601",
            "InvQueryID": "ESFICustomer\\CustomerList\\CustomerList_Q2.esq",
            "InvSelectedMasterTable": "ESFITradeAccount",
            "InvSelectedMasterField": "Code",
            "InvTableMappings": "ESFITradeAccount",
            "Tags": "",
            "Visibility": "0"
        }, {
            "ID": "Name",
            "AA": "2",
            "Caption": "Επωνυμία",
            "Tooltip": "Επωνυμία/Ονοματεπώνυμο",
            "ControlType": "9",
            "ParameterType": "Entersoft.Framework.Platform.ESString, QueryProcess",
            "Precision": "0",
            "MultiValued": "true",
            "Visible": "true",
            "Required": "false",
            "ODSTag": "7699C12E-3B5F-47E8-B509-7AF97F4560B1",
            "InvQueryID": "ESFICustomer\\CustomerList\\CustomerList_Q3.esq",
            "InvSelectedMasterTable": "ESFITradeAccount",
            "InvSelectedMasterField": "Name",
            "InvTableMappings": "ESFITradeAccount",
            "Tags": "",
            "Visibility": "0"
        }, {
            "ID": "TaxRegistrationNumber",
            "AA": "3",
            "Caption": "Α.Φ.Μ. ",
            "Tooltip": "Α.Φ.Μ. ",
            "ControlType": "0",
            "ParameterType": "System.String, mscorlib",
            "Precision": "0",
            "MultiValued": "false",
            "Visible": "true",
            "Required": "false",
            "ODSTag": "85129C6D-258D-4FD6-9E72-E299B885D229",
            "Tags": "",
            "Visibility": "0"
        }, {
            "ID": "Description",
            "AA": "4",
            "Caption": "Επάγγελμα",
            "Tooltip": "Επάγγελμα",
            "ControlType": "0",
            "ParameterType": "System.String, mscorlib",
            "Precision": "0",
            "MultiValued": "true",
            "Visible": "true",
            "Required": "false",
            "ODSTag": "10D53929-FA90-46DA-8178-F1E532E1D7DF",
            "InvQueryID": "ESFICustomer\\CustomerList\\CustomerList_Q4.esq",
            "InvSelectedMasterTable": "ESGOZActivity",
            "InvSelectedMasterField": "Code",
            "InvTableMappings": "ESGOZActivity",
            "Tags": "",
            "Visibility": "0"
        }, {
            "ID": "Description2",
            "AA": "5",
            "Caption": "Γεωγρ.Ζώνη",
            "Tooltip": "Γεωγρ.Ζώνη",
            "ControlType": "0",
            "ParameterType": "System.String, mscorlib",
            "Precision": "0",
            "MultiValued": "true",
            "Visible": "true",
            "Required": "false",
            "ODSTag": "704C84DB-C318-472C-AA55-CEFE09A7906C",
            "InvQueryID": "ESFICustomer\\CustomerList\\CustomerList_Q5.esq",
            "InvSelectedMasterTable": "ESGOZRegionGroup",
            "InvSelectedMasterField": "Code",
            "InvTableMappings": "ESGOZRegionGroup",
            "Tags": "",
            "Visibility": "0"
        }, {
            "ID": "Code7",
            "AA": "6",
            "Caption": "Πωλητής",
            "Tooltip": "Κωδικός3",
            "ControlType": "0",
            "ParameterType": "System.String, mscorlib",
            "Precision": "0",
            "MultiValued": "true",
            "Visible": "true",
            "Required": "false",
            "ODSTag": "9317F24C-9B2D-4162-AD55-6AE820D9F1DC",
            "InvQueryID": "ESFICustomer\\CustomerList\\CustomerList_Q6.esq",
            "InvSelectedMasterTable": "ESFISalesPerson",
            "InvSelectedMasterField": "Code",
            "InvTableMappings": "ESFISalesPerson",
            "Tags": "",
            "Visibility": "0"
        }, {
            "ID": "Code5",
            "AA": "7",
            "Caption": "Οικογένεια",
            "Tooltip": "Οικογένεια",
            "ControlType": "0",
            "ParameterType": "System.String, mscorlib",
            "Precision": "0",
            "MultiValued": "true",
            "Visible": "true",
            "Required": "false",
            "ODSTag": "F8C3B378-1DF3-48CC-8AF6-A477030ADF22",
            "InvQueryID": "ESFICustomer\\CustomerList\\CustomerList_Q7.esq",
            "InvSelectedMasterTable": "ESFIZTradeAccountFamily",
            "InvSelectedMasterField": "Code",
            "InvTableMappings": "ESFIZTradeAccountFamily",
            "Tags": "",
            "Visibility": "0"
        }],
        "LayoutColumn": [{
            "fFilterID": "CustomerList",
            "ColName": "fCityCode1",
            "AA": "0",
            "Caption": "Πόλη",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "CA82BCAF-775A-47FA-9E35-A71EF4B8C53E",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "fSalesPersonGID",
            "AA": "1",
            "Caption": "Πωλητής/Συνεργάτης",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "14B5ABA4-E4B4-4936-B5B0-F610341224D7",
            "Visible": "false",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "Guid"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "fFamilyCode",
            "AA": "2",
            "Caption": "Οικογένεια",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "0E270E88-0F56-484E-896C-873BACDB5748",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Code",
            "AA": "3",
            "Caption": "Κωδικός",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "11AA2299-3F5E-4B2A-B530-6222866A7601",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "TaxRegistrationNumber",
            "AA": "4",
            "Caption": "Α.Φ.Μ. ",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "85129C6D-258D-4FD6-9E72-E299B885D229",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Name",
            "AA": "5",
            "Caption": "Επωνυμία",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "7699C12E-3B5F-47E8-B509-7AF97F4560B1",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Description",
            "AA": "6",
            "Caption": "Επάγγελμα",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "10D53929-FA90-46DA-8178-F1E532E1D7DF",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Address1",
            "AA": "7",
            "Caption": "Διεύθυνση",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "366F1CA4-0DC0-4E6F-B260-E551C0A6F6E7",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "fPostalCode",
            "AA": "8",
            "Caption": "Τ.Κ.",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "FD725B7E-53AE-40B3-BE34-137099A5F6FF",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "fCityCode",
            "AA": "9",
            "Caption": "Πόλη",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "B92AB124-86C0-4C70-9093-53337F91577B",
            "Visible": "false",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Description2",
            "AA": "10",
            "Caption": "Γεωγρ.Ζώνη",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "704C84DB-C318-472C-AA55-CEFE09A7906C",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Telephone1",
            "AA": "11",
            "Caption": "Τηλέφωνο",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "3F218D88-6607-4A81-BDF5-5182B19D70AC",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Name1",
            "AA": "12",
            "Caption": "Πωλητής",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "F7CB0BA7-CCC4-4DD4-BD84-518CDE3EDA1B",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Code4",
            "AA": "13",
            "Caption": "Λ/σμός Λογιστικής",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "D12E4CC6-217F-4231-8592-AE116EDFF2D9",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "GID",
            "AA": "14",
            "Caption": "Εσωτερικός κωδικός",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "B28492FC-A8A5-4CFB-99AC-C6A42D443969",
            "Visible": "false",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "Guid"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Code6",
            "AA": "15",
            "Caption": "Εμπορικό προφίλ",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "EB1763E5-2824-423A-9E03-6F5340EA859E",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Code5",
            "AA": "16",
            "Caption": "Οικογένεια",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "F8C3B378-1DF3-48CC-8AF6-A477030ADF22",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Area",
            "AA": "17",
            "Caption": "Περιοχή",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "821B5278-B913-4B50-A9E2-CDF8538844E2",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "EMailAddress",
            "AA": "18",
            "Caption": "Ηλεκτρονική διεύθυνση",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "99126375-0206-4FAB-AFA3-72251B260712",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Nature",
            "AA": "19",
            "Caption": "Φύση",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "E10F6C50-5197-4C11-9E65-64FA45A7E47E",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "5",
            "DataTypeName": "Byte"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "fSiteGID",
            "AA": "20",
            "Caption": "Υποκατάστημα",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "47B81391-0147-4C78-8616-C545D56B5A0E",
            "Visible": "false",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "Guid"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Remarks",
            "AA": "21",
            "Caption": "Παρατήρηση",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "FCA57E24-5860-4262-99F9-1836D9B1C71A",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "fAccountManagerGID",
            "AA": "22",
            "Caption": "Υπεύθυνος ",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "067702CC-C5B8-4896-B142-FDF9A69E3B0A",
            "Visible": "false",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "Guid"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "fTradeCurrencyCode",
            "AA": "23",
            "Caption": "Νόμισμα",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "34298084-2D21-4E43-999E-BC65A164FCA0",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "AccountStartDate",
            "AA": "24",
            "Caption": "Hμ/νία ανοίγματος",
            "FormatString": "d",
            "Width": "100",
            "ODSTag": "4526F0F0-AB39-455D-A975-64AC86846FCB",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "3",
            "DataTypeName": "DateTime"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "FacebookAccount",
            "AA": "25",
            "Caption": "Λογ/σμός Facebook",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "502FFB7A-36B7-4F81-B91E-87A3E283E934",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "TwitterAccount",
            "AA": "26",
            "Caption": "Λογ/σμός Twitter",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "672BCBDA-82F7-4C87-B83A-F11D9BD2A728",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "1",
            "DataTypeName": "String"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "IncludeTaxDocs",
            "AA": "27",
            "Caption": "πριντερ ινω",
            "FormatString": "",
            "Width": "100",
            "ODSTag": "4B19328D-27EB-4B72-8E6F-3594ED1C3B2D",
            "Visible": "false",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "0",
            "TextAlignment": "1",
            "EditType": "5",
            "DataTypeName": "Byte"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "NumericField1",
            "AA": "28",
            "Caption": "Αριθμός 1",
            "FormatString": "#,0.00",
            "Width": "100",
            "ODSTag": "86A741DB-B8CA-41B7-9855-0648C9DB698A",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "1",
            "TextAlignment": "3",
            "EditType": "1",
            "DataTypeName": "Decimal"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "NumericField2",
            "AA": "29",
            "Caption": "Αριθμός 2",
            "FormatString": "#,0.00",
            "Width": "100",
            "ODSTag": "F1F6716D-C1D0-4ADB-8F54-9DC22B86B890",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "2",
            "TextAlignment": "3",
            "EditType": "1",
            "DataTypeName": "Decimal"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "NumericField3",
            "AA": "30",
            "Caption": "Αριθμός 3",
            "FormatString": "#,0.00",
            "Width": "100",
            "ODSTag": "0FDEF018-64AE-4D59-AF28-017AA11F0B4A",
            "Visible": "true",
            "ColumnSetRow": "-1",
            "ColumnSetColumn": "-1",
            "RowSpan": "-1",
            "ColSpan": "-1",
            "AggregateFunction": "3",
            "TextAlignment": "3",
            "EditType": "1",
            "DataTypeName": "Decimal"
        }],
        "LayoutGroup": [{
            "fFilterID": "CustomerList",
            "ColName": "fCityCode",
            "AA": "0",
            "SortOrder": "1"
        }],
        "ValueList": [{
            "fFilterID": "CustomerList",
            "ColName": "Nature",
            "Value": "0",
            "Caption": "Απαιτήσεις"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "Nature",
            "Value": "1",
            "Caption": "Υποχρεώσεις"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "IncludeTaxDocs",
            "Value": "0",
            "Caption": "Όλα τα αρχεία"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "IncludeTaxDocs",
            "Value": "1",
            "Caption": "Μόνο αρχείο εκτύπωσης"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "IncludeTaxDocs",
            "Value": "2",
            "Caption": "Καμία αποστολή"
        }, {
            "fFilterID": "CustomerList",
            "ColName": "IncludeTaxDocs",
            "Value": "3",
            "Caption": "Μόνο αρχεία σήμανσης"
        }],
        "FormatingCondition": [{
            "fFilterID": "CustomerList",
            "Key": "NumericField1MarkNegativeValues",
            "AllowMerge": "true",
            "ColumnKey": "NumericField1",
            "ConditionOperator": "3",
            "Value1": "0",
            "TargetColumnKey": "NumericField1",
            "fFormatStyleKey": "04d08785-6029-4925-abee-bba7a0c02e86"
        }, {
            "fFilterID": "CustomerList",
            "Key": "NumericField2MarkNegativeValues",
            "AllowMerge": "true",
            "ColumnKey": "NumericField2",
            "ConditionOperator": "3",
            "Value1": "0",
            "TargetColumnKey": "NumericField2",
            "fFormatStyleKey": "6690471e-f637-42d7-b00e-896c324fc792"
        }, {
            "fFilterID": "CustomerList",
            "Key": "NumericField3MarkNegativeValues",
            "AllowMerge": "true",
            "ColumnKey": "NumericField3",
            "ConditionOperator": "3",
            "Value1": "0",
            "TargetColumnKey": "NumericField3",
            "fFormatStyleKey": "4e33c45f-75dd-4c03-82a5-d154e7d61c18"
        }],
        "FormatStyle": [{
            "Key": "04d08785-6029-4925-abee-bba7a0c02e86",
            "BackColor": "0",
            "ForeColor": "-65536",
            "FontBold": "0",
            "FontItalic": "0",
            "FontStrikeout": "0"
        }, {
            "Key": "6690471e-f637-42d7-b00e-896c324fc792",
            "BackColor": "0",
            "ForeColor": "-65536",
            "FontBold": "0",
            "FontItalic": "0",
            "FontStrikeout": "0"
        }, {
            "Key": "4e33c45f-75dd-4c03-82a5-d154e7d61c18",
            "BackColor": "0",
            "ForeColor": "-65536",
            "FontBold": "0",
            "FontItalic": "0",
            "FontStrikeout": "0"
        }]
    };
}
