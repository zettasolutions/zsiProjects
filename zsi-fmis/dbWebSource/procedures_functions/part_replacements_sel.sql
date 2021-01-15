

CREATE PROCEDURE [dbo].[part_replacements_sel]
(
    @pms_id  INT = null
   ,@repair_id  INT = null
   ,@user_id INT = NULL
)
AS
BEGIN
SET NOCOUNT ON
	DECLARE @stmt		VARCHAR(4000);
	DECLARE @client_id  INT;
    SELECT @client_id=company_id FROM dbo.users_v where user_id = @user_id;
	SET @stmt = CONCAT('SELECT * FROM dbo.part_replacements_',@client_id,' WHERE 1=1 ');

	IF ISNULL(@pms_id,0)<>0
	   SET @stmt = @stmt + ' AND pms_id = ' + CAST(@pms_id AS VARCHAR(20))
    
	IF ISNULL(@repair_id,0)<>0
	   SET @stmt = @stmt + ' AND repair_id = ' + CAST(@repair_id AS VARCHAR(20))
	
	SET @stmt = @stmt +  ' ORDER BY seq_no'

	exec(@stmt);
 END;
