CREATE procedure createFullBackup
(
   @user_id int
)
as  
begin
	declare @DbName as varchar(max) = 'zsipafeis'
	declare @backupPath as varchar(max) = '\\zsiserver\zsifiles\'  + @dbName +  '-' + convert(varchar, getdate(), 102) + '-'  +  dbo.getLogonName(@user_id) + '.bak'  
	declare @backupTitle as varchar(max) = 'Full Backup of ' + @dbName;  
	BACKUP DATABASE zsipafeis  
	TO DISK = @backupPath  
	   WITH FORMAT,  
		  MEDIANAME = 'zsipafeis',  
		  NAME = @backupTitle 

end


 
