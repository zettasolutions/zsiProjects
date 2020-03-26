CREATE PROCEDURE [dbo].[route_ref_sel]
(
   @user_id  int = null
  ,@route_id  INT = null
)
AS
BEGIN
      SELECT * FROM dbo.routes_ref WHERE 1=1; 
END


