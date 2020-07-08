

CREATE PROCEDURE [dbo].[send_mail_upd]
( 
	@user_id INT = NULL
   ,@mail_recipients nvarchar(1000)=null
   ,@mail_subject nvarchar(1000)=null
   ,@mail_body nvarchar(max)=null
)
AS
BEGIN
	EXEC msdb.dbo.sp_send_dbmail 
	 @profile_name		='crmnotify'
	,@recipients		= @mail_recipients
	,@subject			= @mail_subject
	,@body				= @mail_body
END;
