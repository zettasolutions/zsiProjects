CREATE procedure [dbo].[refuel_upd](
   @tt        refuel_transactions_tt readonly
  ,@user_id   int=null
)
as
BEGIN
   SET NOCOUNT ON
   DECLARE @client_id  INT;
   DECLARE @stmt NVARCHAR(MAX)
   SELECT @client_id=company_id FROM dbo.users_v where user_id = @user_id;

   CREATE TABLE #refuel (
	[refuel_id] [int] NULL,
	[is_edited] [char](1) NULL,
	[doc_date] [date] NULL,
	[doc_no] [nvarchar](50) NULL,
	[vehicle_id] [int] NULL,
	[driver_id] [int] NULL,
	[pao_id] [int] NULL,
	[odo_reading] [int] NULL,
	[gas_station_id] [int] NULL,
	[no_liters] [decimal](18, 2) NULL,
	[unit_price] [decimal](18, 2) NULL,
	[refuel_amount] [decimal](18, 2) NULL,
	[is_posted] [char](1) NULL)

	INSERT INTO #refuel SELECT * FROM @tt;
	   SET @stmt = CONCAT('UPDATE a SET
			    doc_no				= b.doc_no
			   ,doc_date			= b.doc_date
			   ,vehicle_id			= b.vehicle_id
			   ,driver_id			= b.driver_id
			   ,pao_id				= b.pao_id
  			   ,odo_reading			= b.odo_reading
			   ,gas_station_id		= b.gas_station_id
			   ,no_liters			= b.no_liters
			   ,unit_price			= b.unit_price
			   ,refuel_amount		= (b.no_liters * b.unit_price)		
			   ,is_posted           = b.is_posted
			   ,updated_by			= ',@user_id,'
			   ,updated_date		= DATEADD(HOUR, 8, GETUTCDATE())
         FROM dbo.refuel_transactions_',@client_id,' a inner join #refuel b 
		 ON a.refuel_id = b.refuel_id
		 WHERE ISNULL(b.is_edited,''N'')=''Y''') 
	EXEC(@stmt);


		SET @stmt = CONCAT('INSERT INTO dbo.refuel_transactions_',@client_id,'
		 (
		  doc_no
		 ,doc_date
		 ,vehicle_id
		 ,driver_id
		 ,pao_id
		 ,odo_reading
		 ,gas_station_id
		 ,no_liters
		 ,unit_price
		 ,refuel_amount		
		 ,is_posted
		 ,created_by
		 ,created_date
		 ) 
		 SELECT 
		  doc_no
		 ,doc_date
		 ,vehicle_id
		 ,driver_id
		 ,pao_id
		 ,odo_reading
		 ,gas_station_id
		 ,no_liters
		 ,unit_price
		 ,no_liters * unit_price
		 ,is_posted
		 ,',@user_id,'
		 ,DATEADD(HOUR, 8, GETUTCDATE())
		 FROM #refuel
		 WHERE refuel_id IS NULL
		 AND doc_no IS NOT NULL
		 AND doc_date IS NOT NULL
		 AND vehicle_id IS NOT NULL
		 AND no_liters IS NOT NULL
		 AND unit_price IS NOT NULL')
	EXEC(@stmt);
		 


END;

 




