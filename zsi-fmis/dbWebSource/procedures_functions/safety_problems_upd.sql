
CREATE procedure [dbo].[safety_problems_upd](
   @safety_report_id  int=null
  ,@safety_report_date    date=null
  ,@vehicle_id int=null
  ,@safety_id int=null
  ,@comments nvarchar(max)=null
  ,@reported_by int=null
  ,@is_active char(1)=null
  ,@closed_date date=null
  ,@user_id   int=null
)
as
BEGIN
   SET NOCOUNT ON
   DECLARE @client_id  INT;
   DECLARE @stmt NVARCHAR(MAX);
   SELECT @client_id=company_id FROM dbo.users_v where user_id = @user_id;
   DECLARE @cur_date DATE = DATEADD(HOUR,8,GETUTCDATE());
	 IF ISNULL(@safety_report_id,0)=0
		BEGIN
			SET @stmt = CONCAT('INSERT INTO dbo.safety_problems_',@client_id,'
			 (
			  safety_report_date
			 ,vehicle_id
			 ,safety_id
			 ,comments
			 ,reported_by
			 ,is_active
			 ,closed_date
			 ,created_by
			 ,created_date
			 ) VALUES
			 (''',@safety_report_date,''','
			 ,@vehicle_id,','
			 ,@safety_id,','''
			 ,@comments,''','
			 ,@reported_by,','''
			 ,@is_active,''','''
			 ,@closed_date,''','
			 ,@user_id,','
			 ,@cur_date,')') 
		EXEC(@stmt);
		END
	ELSE
		BEGIN
		   SET @stmt = CONCAT('UPDATE dbo.safety_problems_',@client_id,' SET
					safety_report_date	= ''',@safety_report_date,'''
				   ,vehicle_id			= ',@vehicle_id,'
				   ,safety_id			= ',@safety_id,'
  				   ,comments			= ''',@comments,'''
				   ,reported_by			= ',@reported_by,'
				   ,is_active			= ''',@is_active,'''
				   ,closed_date			= ''',@closed_date,'''
				   ,updated_by			= ',@user_id,'
				   ,updated_date		= ',@cur_date,' WHERE safety_report_id =',@safety_report_id,'');
		EXEC(@stmt);
		END
END;

 



