

CREATE FUNCTION [dbo].[createUserLogon] 
(
   @logon varchar(20)
)
RETURNS VARCHAR(25)
AS
BEGIN
	DECLARE @nlogon VARCHAR(25); 
	DECLARE @count int;
	
	SET @nlogon= replace(lower(@nlogon),'ñ','n')
	SELECT @count = COUNT(*) FROM dbo.users WHERE logon = @nlogon;

	IF @count>0
	begin
	   IF @count < 10
	      SET @logon = @nlogon + '0' + cast(@count as varchar(20))
       ELSE
	      SET @logon = @nlogon + cast(@count as varchar(20))
	END
    ELSE
	   SET @logon = @nlogon
	 
	RETURN @logon;

END