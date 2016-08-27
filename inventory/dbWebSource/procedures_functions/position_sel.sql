

CREATE PROCEDURE [dbo].[position_sel]
(
    
     @position_id  INT = null
	,@is_active varchar(1) = 'Y'
    
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);

	SET @stmt = 'SELECT * FROM dbo.position_v WHERE is_active  = ''' + @is_active   + '''';
	IF @position_id <> '' 
		SET @stmt = @stmt + ' AND position_id='+ CAST(@position_id AS VARCHAR(50));
	
   exec (@stmt);
end

