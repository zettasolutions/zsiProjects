

CREATE PROCEDURE [dbo].[dd_trips_sel]
(
    @user_id  int = null 
) 
AS
BEGIN
  SELECT trip_id, trip_no FROM dbo.vehicle_trips_v WHERE 1 = 1; 
END
 
