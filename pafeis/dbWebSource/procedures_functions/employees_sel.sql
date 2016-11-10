



CREATE PROCEDURE [dbo].[employees_sel]
(
    
     @employee_id int = NULL
	,@is_active varchar(1) = 'Y'
    
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);

	SET @stmt = 'SELECT * FROM dbo.employees WHERE is_active  = ''' + @is_active   + '''';
	IF @employee_id <> '' 
		SET @stmt = @stmt + ' AND employee_id='+ CAST(@employee_id AS VARCHAR(50));
   exec (@stmt);
end


