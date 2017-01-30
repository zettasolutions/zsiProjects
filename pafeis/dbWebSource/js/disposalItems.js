var bs          = zsi.bs.ctrl
   ,svn         = zsi.setValIfNull
   ,dataItemDisposal
   ,dataItemDisposalIndex =-1
;



zsi.ready(function(){
    displayRecords();
    getTemplate();
});

var contextModalWindow = { 
                  id    :"ctxItemDisposal"
                //, sizeAttr : "modal-lg"
                , title : "New"
                , footer: '<div class="pull-left"><button type="button" onclick="submitData();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button>' 
                        +' <button type="button" onclick="resetData();" class="btn btn-primary"><span class="glyphicon glyphicon-ban-circle"></span> Reset</button></div>' 
                        +' </div>'
                , body  : '<div id="frmItemDisposal" class="form-horizontal" style="padding:5px">'
 
                        +'    <div class="form-group  "> ' 
                        +'        <label class=" col-xs-3 control-label">Item</label>'
                        +'        <div class=" col-xs-6">'
                        +'             <input type="hidden" name="disposal_item_id" id="disposal_item_id" >'
                        +'             <input type="hidden" name="item_id" id="item_id" >'
                        +'             <input type="text" name="item_search" id="item_search" class="form-control input-sm" placeholder="Search Item" >'
                        +'    </div>'
                        +'    <div class="form-group  "> ' 
                        +'        </div> ' 
                        +'        <label class=" col-xs-3 control-label">Quantity</label>'
                        +'        <div class=" col-xs-6">'
                        +'             <input type="text" name="quantity" id="quantity" class="form-control input-sm"  >'
                        +'        </div>'

                        +'    </div>'
                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-3 control-label">Authority Reference</label>'
                        +'        <div class=" col-xs-6">'
                        +'             <input type="text" name="authority_ref" id="authority_ref" class="form-control input-sm" >'
                        +'        </div>'  
                        +'    </div>'
                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-3 control-label">Remarks</label>'
                        +'        <div class=" col-xs-6">'
                        +'           <textarea type="text" name="remarks" id="remarks" cols="62" rows="2" class="form-control input-sm" ></textarea>'
                        +'         </div>'
                        +'    </div>'
                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-3 control-label">Status</label>'
                        +'        <div class=" col-xs-6">'
                        +'          <input type="hidden" id="status_id" value="27" class="form-control input-sm" name="status_id" readonly="readonly" >'
                        +'          <label id="status_name" class=" col-xs-1 control-label" name="status_name" > DISPOSED </label>'
                        +'         </div>'
                        +'      </div>'
                        +'</div>'

            };
            

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalWindow));

    });    
}

function fixTextAreaEvent(){
    var insertAt=function(value, index, string) { 
        return value.substr(0, index) + string + value.substr(index);
    };
    
    
    $('TEXTAREA').keypress(function(e){
        if (e.keyCode == 13) {
            var startPos = this.selectionStart;
            this.value  = insertAt(this.value,startPos,"\r\n");
            this.selectionEnd =startPos + 1;
        }
    }) ;   
}

function resetData(obj) {
    var result = confirm("This will clear the items. Continue?");
    if (result) {
        clearForm();
    }
}

$("#btnNew").click(function () {
    $("#ctxItemDisposal .modal-title").text("New Disposal of Items");
    $('#ctxItemDisposal').modal({ show: true, keyboard: false, backdrop: 'static' });
    clearForm();
    fixTextAreaEvent();
    setSearch();
});

function submitData(){    
         $("#frmItemDisposal").jsonSubmit({
             procedure : "disposal_item_upd"
            ,optionalItems : ["disposal_item_id"]
            ,notInclude : "#item_search"
            ,onComplete: function (data) {
             if(data.isSuccess===true){ 
                clearForm();
                zsi.form.showAlert("alert");
                $("#grid").trigger("refresh");
                $('#ctxItemDisposal').modal('hide');
             }
             else {
                    console.log(data.errMsg);
                }
            }
            
        });
}

function showModalEditItemDisposal(index) {
   var _info = dataItemDisposal[index];
   console.log(_info);
    $("#ctxItemDisposal .modal-title").text("Issuance Directive » " + _info.item_id);
 
    $("#ctxItemDisposal").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#ctxctxItemDisposalMW #disposal_item_id").val(_info.disposal_item_id);
    
    displayItemDisposal(_info);
    fixTextAreaEvent();
    setSearch();
}

function displayItemDisposal(d){
  var $f = $("#frmItemDisposal");
   $f.find("#item_search").val( d.disposal_item_id );
   $f.find("#quantity").val(  d.quantity );
   $f.find("#authority_ref").val(  d.authority_ref );
   $f.find("#remarks").val(  d.remarks );
   $f.find("#item_search").val(  d.item_name );
   $f.find("#status_id").attr("selectedvalue",   d.status_id );

   $("select[name='unit_of_measure_id']").dataBind( "unit_of_measure");
    
}

function setSearch(){
    new zsi.search({
        tableCode: "adm-0005"
        , colNames: ["item_description"] 
        , displayNames: ["item_description"]  
        , searchColumn:"item_description"
        , input: "input[name = item_search]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){ 
            $(currentObject).prev().val(data.item_id);
            currentObject.value = data.item_description;
        }
       , onChange: function(text){
          if(text === ""){ 
              
          }
       }
    });        
}

function clearForm(){ 
    $('input[type=text], input[type=hidden]').val('');
    $('textarea[type=text]').val('');
    $('select').val('');

    dataItemDisposalIndex=-1;
}
function displayRecords(){
    
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     
     $("#grid").dataBind({
	     url            : execURL + "disposal_item_sel"
	    ,width          : $(document).width() -150
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
                 {text  : cb                                                   , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"disposal_item_id",type:"hidden",value: svn (d,"disposal_item_id")})
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                                                      
                            }
                }	 
                ,{text  : "Items"                      , type  : "input"       , width : 200       , style : "text-align:left;"
        		    ,onRender : function(d){ 
        		        dataItemDisposalIndex++;
        		        return "<a href='javascript:showModalEditItemDisposal(\"" + dataItemDisposalIndex + "\");'>" 
        		        + svn(d,"serial_no") + " </a>";
        		    }
        		}
        	    ,{text  : "Quantity"                    , type  : "label"     , width : 120        , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"quantity")}
        		}
        		,{text  : "Authority Reference"         , type  : "label"     , width : 200       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"authority_ref")}
        		}
        		,{text  : "Remarks"                     , type  : "label"     , width : 600       , style : "text-align:left;"
        		    ,onRender : function(d){ return  svn(d,"remarks")}  
        		}
        		,{text  : "Status"                      , type  : "label"     , width : 200       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"status_name")}
        		}
	    ]  
    	     ,onComplete: function(data){
    	         dataItemDisposal = data.rows;
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0021"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
        
                                                                  