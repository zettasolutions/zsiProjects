
CREATE PROCEDURE [dbo].[dd_drivers_sel]
(
    @client_id int 
   ,@user_id  int = null
)
AS
BEGIN
	DECLARE @stmt NVARCHAR(MAX);
	DECLARE @tbl_employees NVARCHAR(50);

	SET @tbl_employees = CONCAT('zsi_hcm.dbo.employees_',@client_id,'_v');

	SET @stmt = CONCAT('SELECT
		  id 
		, emp_lfm_name
	FROM ',@tbl_employees, ' WHERE is_driver=''Y'' AND is_active=''Y'' ORDER BY 2');
	EXEC(@stmt);

END


