
CREATE PROCEDURE [dbo].[afcs_users_sel]  
(  
     @hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT
		  employee_id [user_id]
	    , client_id company_code
		, null logon
		, position_title position
		, last_name
		, first_name
		, emp_lfm_name full_name
		, is_active
		, emp_hash_key AS user_hash_key
	FROM zsi_payroll.dbo.employees_v
	WHERE position_id in (3,4,20)
	AND is_active='Y'
	AND emp_hash_key = @hash_key
END;