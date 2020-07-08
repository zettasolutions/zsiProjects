
CREATE PROCEDURE [dbo].[afcs_2_history_sel]  
(  
     @vehicle_hash_key NVARCHAR(MAX)
   , @history_date DATE
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	
	SELECT
		a.payment_date
		, a.trip_no
		, a.total_paid_amount
		, c.full_name AS driver_name
		, b.vehicle_id
	FROM dbo.payments a
	JOIN dbo.vehicles b
	ON a.vehicle_id = b.vehicle_id
	JOIN dbo.[users] c
	ON a.driver_id = c.[user_id]
	WHERE 1 = 1
	AND CAST(a.payment_date AS DATE) = @history_date
	AND b.hash_key = @vehicle_hash_key
	ORDER BY
		payment_date;
END;