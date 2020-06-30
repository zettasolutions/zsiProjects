
CREATE PROCEDURE [dbo].[zload_transactions_sel]  
(  
     @merchant_hash_key NVARCHAR(MAX)
   , @history_date DATE
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	
	SELECT TOP 10000
		a.load_date
		, a.load_amount
		, a.ref_no
		, ISNULL(c.full_name, 'N/A') AS loader_name
	FROM dbo.loading a
	LEFT JOIN dbo.[loaders_v] c
	ON a.load_by = c.[user_id]
	LEFT JOIN load_merchants_v d
	ON a.[loading_branch_id] = d.client_id
	WHERE 1 = 1
	AND d.hash_key = @merchant_hash_key
	AND CAST(a.load_date AS DATE) = @history_date
	ORDER BY
		load_date;
END;