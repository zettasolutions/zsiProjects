
CREATE PROCEDURE [dbo].[afcs_consumer_payments_report_sel]  
(  
   @username NVARCHAR(300)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT 
		a.payment_date
		, a.from_location
		, a.to_location
		, a.total_paid_amount
		, a.is_cancelled
	FROM dbo.payments a
	JOIN dbo.generated_qrs b
	ON a.qr_id = b.id
	JOIN dbo.consumers c
	ON b.consumer_id = c.consumer_id
	WHERE 1 = 1
	AND c.email = @username
END;