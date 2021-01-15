

CREATE PROCEDURE [dbo].[dd_vehicles_sel]
(
    @client_id nvarchar(100)
   ,@user_id INT = NULL
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT vehicle_id, vehicle_plate_no FROM dbo.vehicles WHERE company_id=''' + @client_id + '''';
	exec(@stmt);
 END;


