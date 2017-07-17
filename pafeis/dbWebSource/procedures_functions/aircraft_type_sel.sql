CREATE PROCEDURE [dbo].[aircraft_type_sel]
(
    @aircraft_type_id  INT = null
	,@is_active varchar(1) = 'Y'
)
AS
BEGIN

SET NOCOUNT ON
	 DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.aircraft_types_v WHERE is_active=''' + @is_active + '''';

  IF isnull(@aircraft_type_id,0) <> 0
	 SET @stmt = @stmt + 'AND @aircraft_type_id=' + cast(@aircraft_type_id as varchar(20));
	  
   SET @stmt = @stmt + ' ORDER BY aircraft_type'; 

  EXEC(@stmt);
	 	
END



