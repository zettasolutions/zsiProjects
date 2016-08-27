
CREATE PROCEDURE [dbo].[zsi_employees_sel]
(
    
     @employee_id  INT = null
	,@is_active varchar(1) = 'Y'
	,@user_id  int = null
    
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);

	SET @stmt = 'SELECT * FROM dbo.zsi_employees_v WHERE is_active  = ''' + @is_active   + '''';
	IF @employee_id <> '' 
		SET @stmt = @stmt + ' AND employee_id='+ CAST(@employee_id AS VARCHAR(50));
	
   exec (@stmt);
end
