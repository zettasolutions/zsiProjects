
create proc [dbo].[test_chie_sel] 
 
(
    @id					INT = null
   ,@user_id			INT = NULL			
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
	SET @stmt = 'SELECT * FROM dbo.test_chie WHERE 1=1 ';

	IF @id <> '' 
	SET @stmt = @stmt + ' AND id' + CAST(@id AS VARCHAR);

	exec(@stmt);
 END;
