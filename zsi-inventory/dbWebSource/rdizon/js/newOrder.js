var issuedDate = "";


zsi.ready = function(){



};


$("#po_issue_date").datepicker()
    .on("show", function(e) {
        issuedDate = ($(this).val()? $(this).val():"");
    }).on("changeDate", function(e) {
        issuedDate = $(this).val();
    }).on("hide", function(e) {
        $(this).val(issuedDate);
});