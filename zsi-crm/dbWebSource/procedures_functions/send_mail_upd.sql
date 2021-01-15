

CREATE PROCEDURE [dbo].[send_mail_upd]
( 
	@user_id INT = NULL
   ,@name nvarchar(1000)=null
   ,@mail_recipients nvarchar(1000)=null
   ,@password nvarchar(1000)=null
)
AS
BEGIN

	DECLARE @mail_body as varchar(max)=''   
	set @mail_body =
	'
	<html>
	<head>
     	<meta charset="utf-8">
		<style>
		   .fs-15{ font-size:15px;}
		</style>
		
	</head>
	<body>

		<p style="text-transform:capitalize">Dear User,</p>
		<p>
			<span>You are now registered to our AFCS web application.</span><br/>
			<span>Your current password is <b class="fs-15">'+ @password + '</b></span>
		</p>
		<p>Sincerely yours,</p>
		<p>The ZFleet Team</p>
	</body>
	</html>
	' 
	

	EXEC msdb.dbo.sp_send_dbmail 
	 @profile_name		='crmnotify'
	,@recipients		= @mail_recipients
	,@subject			= 'AFCS Password'
	,@body				= @mail_body
	,@body_format		= HTML
END;