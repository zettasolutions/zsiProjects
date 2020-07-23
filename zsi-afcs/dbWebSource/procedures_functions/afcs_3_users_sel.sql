

CREATE PROCEDURE [dbo].[afcs_3_users_sel]  
(  
     @hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT
		  id AS [user_id]
	    , client_id AS company_code
		, null AS logon
		, position_title AS position
		, last_name
		, first_name
		, emp_lfm_name AS full_name
		, is_active
		, emp_hash_key AS user_hash_key
	FROM zsi_hcm.dbo.employees_active_v
	WHERE position_id in (3,4,20)
	AND emp_hash_key = @hash_key
END;