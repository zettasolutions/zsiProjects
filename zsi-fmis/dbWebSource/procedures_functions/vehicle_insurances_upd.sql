CREATE PROCEDURE [dbo].[vehicle_insurances_upd]
(
    @tt    vehicle_insurances_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	SET NOCOUNT ON
    DECLARE @client_id  INT;
    DECLARE @stmt NVARCHAR(MAX)
    SELECT @client_id=company_id FROM dbo.users_v where user_id = @user_id;

   CREATE TABLE #insurance ([vehicle_insurance_id] [int] NULL,
	[is_edited] [varchar](1) NULL,
	[vehicle_id] [int] NULL,
	[insurance_no] [nvarchar](50) NULL,
	[insurance_date] [date] NULL,
	[insurance_company_id] [int] NULL,
	[expiry_date] [date] NULL,
	[insurance_type_id] [int] NULL,
	[insured_amount] [decimal](10, 2) NULL,
	[paid_amount] [decimal](10, 2) NULL,
	[is_posted] [char](1) NULL)
	INSERT INTO #insurance SELECT * FROM @tt;

	SET @stmt = CONCAT('UPDATE a SET 
	   	     vehicle_id				= b.vehicle_id	
			,insurance_no			= b.insurance_no
			,insurance_date			= b.insurance_date
			,insurance_company_id	= b.insurance_company_id
			,expiry_date 			= b.expiry_date
			,insurance_type_id		= b.insurance_type_id
			,insured_amount			= b.insured_amount
			,paid_amount			= b.paid_amount 
			,is_posted				= b.is_posted
	   	    ,updated_by				= ',@user_id,'
			,updated_date			= DATEADD(HOUR, 8, GETUTCDATE())

       FROM dbo.vehicle_insurances a INNER JOIN #insurance b
	     ON a.vehicle_insurance_id = b.vehicle_insurance_id
	     WHERE ISNULL(b.is_edited,''N'')=''Y''')
	EXEC(@stmt);
-- Insert Process
	SET @stmt = CONCAT('INSERT INTO vehicle_insurances(
			 vehicle_id				
			,insurance_no			
			,insurance_date			
			,insurance_company_id	
			,expiry_date 			
			,insurance_type_id		
			,insured_amount			
			,paid_amount		 
			,is_posted 
			,created_by
			,created_date
		)
		SELECT 
			 vehicle_id				
			,insurance_no			
			,insurance_date			
			,insurance_company_id	
			,expiry_date 			
			,insurance_type_id		
			,insured_amount			
			,paid_amount
			,is_posted
			,',@user_id,'
			,DATEADD(HOUR, 8, GETUTCDATE())

		FROM @tt 
		WHERE ISNULL(vehicle_insurance_id,0)=0
		AND ISNULL(vehicle_id,0)=0 
		AND ISNULL(insurance_no,0)=0')
	EXEC(@stmt);
	 
