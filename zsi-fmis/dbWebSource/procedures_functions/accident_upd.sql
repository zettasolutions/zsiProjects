CREATE procedure [dbo].[accident_upd](
   @accident_id  int=null
  ,@accident_date date=null
  ,@vehicle_id int=null
  ,@driver_id int=null
  ,@pao_id int=null
  ,@accident_type_id int=null
  ,@accident_level char(50)=null
  ,@error_type_id int=null
  ,@comments nvarchar(max)=null
  ,@user_id   int=null
)
as
BEGIN
   SET NOCOUNT ON
   DECLARE @client_id  INT;
   DECLARE @stmt NVARCHAR(MAX);
   DECLARE @cur_date DATE = DATEADD(HOUR,8,GETUTCDATE());
   SELECT @client_id=company_id FROM dbo.users_v where user_id = @user_id;
	 IF ISNULL(@accident_id,0)=0
		BEGIN
		   SET @stmt = CONCAT('INSERT INTO dbo.accident_transactions_',@client_id,'
			 (
			  accident_date
			 ,vehicle_id
			 ,driver_id
			 ,pao_id
			 ,accident_type_id
			 ,accident_level
			 ,error_type_id
			 ,comments
			 ,created_by
			 ,created_date
			 ) VALUES
			 (''',@accident_date,''','
			 ,@vehicle_id,','
			 ,@driver_id,','
			 ,@pao_id,','
			 ,@accident_type_id,','
			 ,@accident_level,','
			 ,@error_type_id,','''
			 ,@comments,''','
			 ,@user_id,','
			 ,@cur_date,')')
		EXEC(@stmt);
		END
	ELSE
		BEGIN
		   SET @stmt = CONCAT('UPDATE dbo.accident_transactions_',@client_id,' SET
					accident_date		= ''',@accident_date,'''
				   ,vehicle_id			= ',@vehicle_id,'
				   ,driver_id			= ',@driver_id,'
				   ,pao_id				= ',@pao_id,'
  				   ,accident_type_id	= ',@accident_type_id,'
				   ,accident_level		= ',@accident_level,'
				   ,error_type_id		= ',@error_type_id,'
				   ,comments			= ''',@comments,'''
				   ,updated_by			= ',@user_id,'
				   ,updated_date		= ',@cur_date,' WHERE accident_id=',@accident_id,'');
		EXEC(@stmt);
		END
END;