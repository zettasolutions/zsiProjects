var date = new Date();

$.get(procURL + "client_dashboard_sel @year=" + date.getFullYear() + "", function(d) {
    
    var chart = AmCharts.makeChart( "chartdiv", {
        "type": "pie",
        "theme": "light",
        "dataProvider": d.rows,
        "valueField": "status_count",
        "titleField": "status_id",
        "balloon":{
            "fixedPosition":true
        },
        "export": {
            "enabled": true
        },
        "startDuration" : 0,
        "outlineColor": "",
        "titles": [
    		{
    			"text": "My Dashboard",
    			"size": 12,
    			"color": "#ffffff"
    		}
    	],
    	"color": "#ffffff"
    } );
});   