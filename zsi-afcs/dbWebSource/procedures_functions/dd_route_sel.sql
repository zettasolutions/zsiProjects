
CREATE PROCEDURE [dbo].[dd_route_sel]
(
   @user_id  int = null
)
AS
BEGIN
      SELECT route_code, route_id FROM dbo.routes_ref; 
END


