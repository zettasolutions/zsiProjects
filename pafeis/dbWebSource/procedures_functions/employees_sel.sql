
CREATE PROCEDURE [dbo].[employees_sel]
(
     @user_id int = NULL
	,@is_active varchar(1) = 'Y'
	,@organization_id int = NULL
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);

	SET @stmt = 'SELECT * FROM dbo.users_v WHERE id_no IS NOT NULL AND is_active  = ''' + @is_active   + '''';

	IF @user_id <> '' 
		SET @stmt = @stmt + ' AND user_id='+ CAST(@user_id AS VARCHAR(50));

	IF @organization_id <> '' 
		SET @stmt = @stmt + ' AND organization_id='+ CAST(@organization_id AS VARCHAR(20));


   exec (@stmt);
end


