 $(document).ready(function(){
     $.get(execURL + "select dbo.getLogonName(" + userId+ ") as username",function(data){
         $("#username").val(data.rows[0].username);
     });

 }) 