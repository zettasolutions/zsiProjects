


CREATE PROCEDURE [dbo].[sys_requests_sel]
(
	@ticket_id  INT = NULL
   ,@ticket_date   DATETIME	 = NULL
   ,@request_by INT	 = NULL
   ,@request_desc     NVARCHAR(max) = NULL
   ,@request_type_id INT = NULL
   ,@status_id  INT = NULL
   ,@img_filename NVARCHAR(max)= NULL
   

)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)

SET @stmt = 'SELECT * FROM dbo.sys_requests WHERE 1=1 '

  IF @ticket_date IS NOT NULL  
	SET @stmt = @stmt + ' AND ticket_date = ' + CAST(@ticket_date AS DATETIME); 
 
  IF @request_by IS NOT NULL  
	SET @stmt = @stmt + ' AND request_by = ''' + @request_by + '''' 
  
  IF @request_desc IS NOT NULL
	SET @stmt = @stmt + ' AND request_desc = ''' + @request_desc + '''' 
   
  IF @request_type_id IS NOT NULL
	SET @stmt = @stmt + ' AND request_type_id = ''' + @request_type_id + ''''   

  IF @status_id IS NOT NULL
	SET @stmt = @stmt + ' AND status_id = ''' + @status_id + ''''  

  IF @img_filename IS NOT NULL
	SET @stmt = @stmt + ' AND img_filename = ''' + @img_filename + ''''  


  SET @stmt = @stmt +  ' ORDER BY ticket_id';

EXEC(@stmt);
END



