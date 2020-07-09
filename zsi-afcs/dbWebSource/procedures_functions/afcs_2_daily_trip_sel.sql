
CREATE PROCEDURE [dbo].[afcs_2_daily_trip_sel]  
(  
     @vehicle_hash_key NVARCHAR(50)
   , @driver_hash_key NVARCHAR(50)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	
	DECLARE @trip_no INT;
	DECLARE @daily_amount DECIMAL(12,2);
	DECLARE @vehicle_id INT;
    DECLARE @vehicle_plate_no NVARCHAR(20);
	DECLARE @vehicle_type NVARCHAR(50);
	DECLARE @driver_id INT;
	DECLARE @driver NVARCHAR(50);

	SELECT 
		@vehicle_id = a.vehicle_id
		, @vehicle_plate_no = a.vehicle_plate_no 
		, @vehicle_type = b.vehicle_type
	FROM dbo.vehicles a
	JOIN dbo.fare_matrix b
	ON a.vehicle_type_id = b.fare_id
	WHERE 1 = 1 
	AND hash_key = @vehicle_hash_key;
	
	SELECT 
		@driver_id = [user_id]
		, @driver = full_name
	FROM dbo.drivers_v
	WHERE hash_key = @driver_hash_key;

	SELECT 
		@daily_amount = SUM(total_paid_amount) 
	FROM dbo.payments 
	WHERE 1 = 1 
	AND vehicle_id = @vehicle_id 
	AND driver_id = @driver_id
	AND CAST(payment_date AS DATE) = CAST(GETDATE() AS DATE);

	SELECT 
		TOP 1 @trip_no = trip_no 
	FROM dbo.payments 
	WHERE 1 = 1 
	AND vehicle_id = @vehicle_id 
	AND driver_id = @driver_id
	AND CAST(payment_date AS DATE) = CAST(GETDATE() AS DATE)
	ORDER BY 
		payment_id DESC;

    SELECT 
		@vehicle_id AS vehicle_id
		, @vehicle_plate_no AS vehicle_plate_no
		, @vehicle_type AS vehicle_type
		, @driver_id AS driver_id
		, @driver AS driver
		, ISNULL(@trip_no, 0) AS trip_no
		, ISNULL(@daily_amount, 0) AS daily_fare_collection  
END;