
CREATE PROCEDURE [dbo].[afcs_pao_sel]  
(  
   @hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	SELECT user_id pao_id,full_name emp_lfm_name
	FROM dbo.pao_active_v
	WHERE hash_key = @hash_key
	
END;