CREATE FUNCTION [dbo].[getUserWarehouseId] 
(
	@user_id			as int
)
RETURNS int
AS
BEGIN   
   DECLARE @l_retval   int;
   SELECT @l_retval = warehouse_id FROM dbo.users where user_id = @user_id
   RETURN @l_retval;
END;


