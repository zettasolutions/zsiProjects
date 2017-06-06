CREATE PROCEDURE [dbo].[aircraft_class_sel]
(
    @aircraft_class_id  INT = null
	,@is_active varchar(1) = 'Y'
)
AS
BEGIN

SET NOCOUNT ON
	 DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.aircraft_class WHERE is_active=''' + @is_active + '''';

  IF isnull(@aircraft_class_id,0) <> 0
	 SET @stmt = @stmt + 'AND @aircraft_class_id=' + cast(@aircraft_class_id as varchar(20));
	  
   SET @stmt = @stmt + ' ORDER BY aircraft_class'; 

  EXEC(@stmt);
	 	
END
