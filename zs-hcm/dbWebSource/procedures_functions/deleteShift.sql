
CREATE PROCEDURE [dbo].[deleteShift]
(
      @pkey_ids     VARCHAR(max)
	 ,@client_id   VARCHAR(50)
	
)
AS
BEGIN
  SET NOCOUNT ON
  DECLARE @stmt							VARCHAR(max); 

  SET @stmt = 'DELETE FROM shift_' +  @client_id  + ' WHERE shift_id IN (' + REPLACE(@pkey_ids,'/',',') + ')' 
  print(@stmt);
  exec(@stmt);
 

  RETURN @@ROWCOUNT;
  

 


 END;





