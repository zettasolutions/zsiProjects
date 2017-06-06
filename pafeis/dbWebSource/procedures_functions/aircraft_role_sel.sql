CREATE PROCEDURE [dbo].[aircraft_role_sel]
(
    @aircraft_role_id  INT = null
   ,@is_active varchar(1) = 'Y'
)
AS
BEGIN

SET NOCOUNT ON
	 DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.aircraft_role WHERE is_active=''' + @is_active + '''';

  IF isnull(@aircraft_role_id,0) <> 0
	 SET @stmt = @stmt + 'AND @aircraft_role_id=' + cast(@aircraft_role_id as varchar(20));
	  
   SET @stmt = @stmt + ' ORDER BY aircraft_role'; 

  EXEC(@stmt);
	 	
END