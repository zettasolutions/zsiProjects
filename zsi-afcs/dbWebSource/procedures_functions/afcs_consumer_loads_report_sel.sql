
CREATE PROCEDURE [dbo].[afcs_consumer_loads_report_sel]  
(  
     @username NVARCHAR(300)
   , @user_id INT = NULL
)  
AS   
BEGIN  
	SET NOCOUNT ON;
	DECLARE @qr_id int
	SELECT @qr_id = qr_id FROM dbo.consumers where mobile_no = @username;

	SELECT top 1000
		loading_id
		, load_date
		, load_amount
		, store_code 
	FROM (
		SELECT a.loading_id
	  		, a.load_date
			, a.load_amount
			, concat('Ref. No.: ' ,a.ref_no,' | ',d.client_name)  store_code
		FROM dbo.loading a
		JOIN dbo.load_merchants_v d
		ON a.loading_branch_id = d.client_id
		WHERE a.qr_id = @qr_id
		UNION ALL
		SELECT a.loading_id
	  		 ,a.load_date
			 , a.load_amount
			 , concat('Ref. No.: ' ,a.ref_no,' | ',a.store_code)  store_code
		FROM load_top_up_v a
		WHERE a.qr_id = @qr_id
		UNION ALL
		SELECT loading_id 
	  		 , load_date
			 , load_amount
			 , concat('Ref. No.: ' ,ref_no,' | ',store_code)  store_code
		FROM load_top_up_neg_v
		WHERE cqr_id = @qr_id
	) x
	ORDER BY
		loading_id desc
END;

