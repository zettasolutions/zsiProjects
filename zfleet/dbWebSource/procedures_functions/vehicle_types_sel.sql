CREATE PROCEDURE [dbo].[vehicle_types_sel]
(
   @user_id  int = null
  ,@vehicle_type_id  INT = null
)
AS
BEGIN
      SELECT * FROM dbo.vehicle_types WHERE 1=1; 
END


