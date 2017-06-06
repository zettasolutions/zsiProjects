CREATE PROCEDURE [dbo].[unit_of_measure_sel]
(
     @unit_of_measure_id  INT = null
	,@is_active varchar(1) = 'Y'
)
AS
BEGIN

SET NOCOUNT ON
	 DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.unit_of_measure WHERE is_active=''' + @is_active + '''';

  IF isnull(@unit_of_measure_id,0) <> 0
	 SET @stmt = @stmt + 'AND @unit_of_measure_id=' + cast(@unit_of_measure_id as varchar(20));
	  
   SET @stmt = @stmt + ' ORDER BY unit_of_measure_name'; 

  EXEC(@stmt);
	 	
END
