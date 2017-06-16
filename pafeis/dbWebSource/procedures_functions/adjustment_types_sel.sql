


CREATE PROCEDURE [dbo].[adjustment_types_sel]
(
    @adjustment_type_id  INT = null   
   ,@adjustment_type nvarchar(50)=null
   ,@debit_credit char(1)=null
   
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.adjustment_types WHERE 1=1'


  IF @adjustment_type_id IS NOT NULL  
	 SET @stmt = @stmt + ' AND adjustment_type_id = ' + cast(@adjustment_type_id as varchar(20)); 
 

  SET @stmt = @stmt + ' ORDER BY adjustment_type '; 
  --PRINT @stmt;
  exec(@stmt);	
END



