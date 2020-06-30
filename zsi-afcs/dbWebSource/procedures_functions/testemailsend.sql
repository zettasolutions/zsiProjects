create procedure testemailsend
as


EXEC msdb.dbo.sp_send_dbmail @profile_name='crmnotify',
@recipients='ruel.ybanez18@gmail.com',
@subject='from database code - crmnotify',
@body='This is the body of the test message'


