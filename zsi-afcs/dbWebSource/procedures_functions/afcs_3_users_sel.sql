

CREATE PROCEDURE [dbo].[afcs_3_users_sel]  
(  
	 @vehicle_hash_key NVARCHAR(100)
    ,@hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	DECLARE @stmt NVARCHAR(MAX);
    DECLARE @client_id  INT;
	DECLARE @tbl_employees NVARCHAR(50);

	SELECT @client_id=company_id FROM dbo.active_vehicles_v WHERE hash_key =@vehicle_hash_key;
	SET @tbl_employees = CONCAT('zsi_hcm.dbo.employees_',@client_id, '_v');

	SET @stmt = CONCAT('SELECT
		  first_name
		, last_name
		, position_title AS position
		, id AS [user_id]
		, emp_hash_key AS user_hash_key
		, ISNULL(img_filename, '''') AS img_filename
		, is_active
	FROM ',@tbl_employees, ' WHERE (is_driver=''Y'' OR is_pao=''Y'') AND emp_hash_key = ''',@hash_key,'''')
	EXEC(@stmt);
END;