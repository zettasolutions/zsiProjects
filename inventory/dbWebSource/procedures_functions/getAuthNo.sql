CREATE FUNCTION [dbo].[getAuthNo](
	@userId			as int
) 
RETURNS INT
AS
BEGIN
	declare @count as int
	declare @result as int=0
	select @count = count(*) from users where user_id = @userId and role_id is null

	if(@count > 0 ) set @result=999
	RETURN @result;
END