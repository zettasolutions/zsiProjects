CREATE FUNCTION [dbo].[createUserLogon] 
(
	@user_id varchar(20)
)
RETURNS VARCHAR(25)
AS
BEGIN
	DECLARE @logon VARCHAR(25); 
	DECLARE @count int;
	SELECT @logon = concat(SUBSTRING(first_name,1,1),last_name) FROM users where user_id=@user_id;
	SELECT @count=count(*) FROM users where logon = @logon

	IF @count>0
	   SET @logon = @logon + cast(@count as varchar(20))

	RETURN @logon;

END
