CREATE PROCEDURE [dbo].[origin_sel]
(
    @origin_id  INT = null
	,@is_active varchar(1) = 'Y'
)
AS
BEGIN

SET NOCOUNT ON
	 DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.origin WHERE is_active=''' + @is_active + '''';

  IF isnull(@origin_id,0) <> 0
	 SET @stmt = @stmt + 'AND @origin_idd=' + cast(@origin_id as varchar(20));
	  
   SET @stmt = @stmt + ' ORDER BY origin_name'; 

  EXEC(@stmt);
	 	
END
