

CREATE FUNCTION [dbo].[getOrganizationWarehouse] 
(
	@warehouse_id			as int
)
RETURNS varchar(50)
AS
BEGIN   
   DECLARE @l_retval   varchar(50);
   SELECT @l_retval = organization_warehouse FROM dbo.warehouses_v where warehouse_id = @warehouse_id
   RETURN @l_retval;
END;

