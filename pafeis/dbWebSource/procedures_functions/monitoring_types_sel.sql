
CREATE PROCEDURE [dbo].[monitoring_types_sel]
(
    @monitoring_type_id  INT = null
   ,@is_active CHAR(1) = 'Y'
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)

SET @stmt = 'SELECT * FROM dbo.monitoring_types WHERE is_active = ''' + @is_active + ''''


  IF @monitoring_type_id IS NOT NULL  
	 SET @stmt = @stmt + ' AND monitoring_type_id = ' + CAST(@monitoring_type_id AS VARCHAR(20)); 
 
  SET @stmt = @stmt + ' ORDER BY monitoring_type_name'; 
  EXEC(@stmt);
	
END




