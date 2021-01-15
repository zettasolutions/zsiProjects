



CREATE PROCEDURE [dbo].[shifts_sel]
(
    @shift_id  INT = null
   ,@user_id INT = NULL
)
AS
BEGIN
    DECLARE @client_id int
	DECLARE @stmt		VARCHAR(4000);
	SELECT @client_id=company_id FROM dbo.users_v WHERE user_id = @user_id;
 	SET @stmt = CONCAT('SELECT * FROM dbo.shifts_',@client_id,' WHERE 1=1 ');
    
	IF @shift_id <> '' 
	    SET @stmt = @stmt + ' AND shift_id'+ @shift_id;

	exec(@stmt);
 END;




