
CREATE FUNCTION [dbo].[countRoleDashboards] 
(
   @role_id AS INT
)
RETURNS INT
AS
BEGIN   
   DECLARE @retval INT;
     SELECT @retval = COUNT(*)  
       FROM dbo.role_dashboards WHERE role_id = @role_id;       
   RETURN @retval;
END
