


CREATE procedure [dbo].[vehicle_registrations_upd](
   @vehicle_registration_id  int=null
  ,@vehicle_id  int=null
  ,@registration_no nvarchar(50)=null
  ,@registration_date date =null
  ,@expiry_date date =null 
  ,@paid_amount decimal(10,2)=null   
  ,@user_id int
  
)
as
BEGIN
   SET NOCOUNT ON
   DECLARE @client_id  INT;
   DECLARE @stmt NVARCHAR(MAX);
   SELECT @client_id=company_id FROM dbo.users_v where user_id = @user_id;
   DECLARE @cur_date DATE = DATEADD(HOUR,8,GETUTCDATE());
	 IF ISNULL(@vehicle_registration_id,0)=0
		BEGIN
			SET @stmt = CONCAT('INSERT INTO dbo.vehicle_registrations_',@client_id,'
			 (
			  vehicle_id
			 ,registration_no
			 ,registration_date
			 ,expiry_date
			 ,paid_amount 
			 ,created_by
			 ,created_date
			 ) VALUES
			 ('
			 ,@vehicle_id,','''
			 ,@registration_no,''','''
			 ,@registration_date,''','''
			 ,@expiry_date,''','
			 ,@paid_amount ,','
			 ,@user_id,','
			 ,@cur_date,')') 
		EXEC(@stmt);
		END

	ELSE
		BEGIN
		   SET @stmt = CONCAT('UPDATE dbo.vehicle_registrations_',@client_id,' SET
					vehicle_id			= ',@vehicle_id,'
				   ,registration_no		= ''',@registration_no,'''
				   ,registration_date	= ''',@registration_date,'''
				   ,expiry_date			= ''',@expiry_date,'''
				   ,paid_amount			= ',@paid_amount ,'
				   ,updated_by			= ',@user_id,'
				   ,updated_date		= ',@cur_date,'WHERE vehicle_registration_id=',@vehicle_registration_id,'');
		EXEC(@stmt);
		END
END;
 

