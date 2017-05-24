

CREATE PROCEDURE [dbo].[statuses_sel]
(
    @status_id   INT	 = NULL
   ,@status_name nvarchar(100)	 = NULL
   ,@is_item     CHAR(1) = NULL
   ,@is_aircraft CHAR(1) = NULL
   ,@is_process  CHAR(1) = NULL
   ,@is_receiving CHAR(1)= NULL
   ,@is_issuance CHAR(1) = NULL
   ,@is_returned CHAR(1) = NULL

)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)

SET @stmt = 'SELECT * FROM dbo.statuses WHERE is_active=''Y'''
  IF @status_id IS NOT NULL  
	SET @stmt = @stmt + ' AND status_id = ' + CAST(@status_id AS VARCHAR(20)); 
 
  IF @status_name IS NOT NULL  
	SET @stmt = @stmt + ' AND status_name = ''' + @status_name + '''' 
  
  IF @is_item IS NOT NULL
	SET @stmt = @stmt + ' AND is_item = ''' + @is_item + '''' 
   
  IF @is_aircraft IS NOT NULL
	SET @stmt = @stmt + ' AND is_aircraft = ''' + @is_aircraft + ''''   

  IF @is_aircraft IS NOT NULL
	SET @stmt = @stmt + ' AND is_aircraft = ''' + @is_aircraft + ''''  

  IF @is_process IS NOT NULL
	SET @stmt = @stmt + ' AND is_process = ''' + @is_process + ''''  

  IF @is_returned IS NOT NULL
	SET @stmt = @stmt + ' AND is_returned = ''' + @is_returned + '''' 

  SET @stmt = @stmt +  ' ORDER BY status_name';

EXEC(@stmt);
END



