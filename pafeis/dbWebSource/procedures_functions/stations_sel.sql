

CREATE PROCEDURE [dbo].[stations_sel]
(
   
	 @station_id int =NULL
	,@is_active char(1) NULL='Y'
)
AS
BEGIN


SET NOCOUNT ON
	 DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.stations WHERE is_active=''' + @is_active + '''';

  IF isnull(@station_id,0) <> 0
	 SET @stmt = @stmt + 'AND station_id=' + cast(@station_id as varchar(20));
	  
   SET @stmt = @stmt + ' ORDER BY station_code'; 

  EXEC(@stmt);
	 	
END



