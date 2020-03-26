
CREATE PROCEDURE [dbo].[dd_vehicle_sel]
(
   @user_id  int = null
)
AS
BEGIN
      SELECT vehicle_id, vehicle_plate_no, is_active FROM dbo.vehicles WHERE is_active = 'Y'; 
END
