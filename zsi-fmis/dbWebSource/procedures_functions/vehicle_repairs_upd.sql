

CREATE procedure [dbo].[vehicle_repairs_upd](
   @repair_id		int=null
  ,@repair_date		char(10)=null
  ,@pms_type_id		int=null
  ,@vehicle_id		int=null
  ,@odo_reading		int=null
  ,@service_amount	decimal(10,2)=null
  ,@total_repair_amount decimal(10,2)=null
  ,@repair_location nvarchar(max)=null 
  ,@comment			nvarchar(max)=null
  ,@status_id		int=null
  ,@user_id			int
  ,@id				INT=NULL OUTPUT 
 
)
as
BEGIN
   SET NOCOUNT ON
   DECLARE @client_id  INT;
   DECLARE @stmt NVARCHAR(MAX)
   SELECT @client_id=company_id FROM dbo.users_v where user_id = @user_id;
   DECLARE @cur_date DATE = DATEADD(HOUR,8,GETUTCDATE())
   SET @id = @repair_id
	 IF ISNULL(@repair_id,0)=0
	 BEGIN
		SET @stmt = CONCAT('INSERT INTO dbo.vehicle_repairs_',@client_id,'
		 (
		  repair_date
		 ,pms_type_id
		 ,vehicle_id
		 ,odo_reading
		 ,service_amount
		 ,total_repair_amount
		 ,repair_location
		 ,comment
		 ,status_id
		 ,created_by
		 ,created_date
		 ) VALUES
		 (''',@repair_date,''','
		 ,@pms_type_id,','
		 ,@vehicle_id,','
		 ,@odo_reading,','
		 ,@service_amount,','
		 ,@total_repair_amount,','''
		 ,@repair_location,''','''
		 ,@comment,''','
		 ,@status_id,','
		 ,@user_id,','
		 ,@cur_date,')') 
		EXEC(@stmt);
		SET @id = @@IDENTITY
	END
	ELSE
	  BEGIN
		  SET @stmt = CONCAT('UPDATE dbo.vehicle_repairs_',@client_id,' SET
					repair_date			= ''',@repair_date,'''
				   ,pms_type_id			= ',@pms_type_id,'
				   ,vehicle_id			= ',@vehicle_id,'
				   ,odo_reading			= ',@odo_reading,'
				   ,service_amount		= ',@service_amount,'
				   ,total_repair_amount	= ',@total_repair_amount,'
  				   ,pm_location			= ''',@repair_location,'''
				   ,comment				= ''',@comment,'''
				   ,status_id			= ',@status_id,'
				   ,updated_by			= ',@user_id,'
				   ,updated_date		= ',@cur_date,'WHERE repair_id=',@repair_id,'');
		  EXEC(@stmt);
	  END

RETURN @id;
END;

 




