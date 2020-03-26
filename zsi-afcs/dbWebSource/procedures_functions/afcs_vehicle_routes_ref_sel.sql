
CREATE PROCEDURE [dbo].[afcs_vehicle_routes_ref_sel]  
(  
   @hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT
		a.vehicle_plate_no AS asset_no
		, d.vehicle_type AS asset_code
		, b.route_code
		, b.route_desc
		, c.route_no
		, c.[location]
		, c.distance_km
		, c.seq_no
		, a.is_active
	FROM dbo.vehicles a 
	LEFT JOIN dbo.routes_ref b
	ON a.route_id = b.route_id
	LEFT JOIN dbo.route_details c
	ON b.route_id = c.route_id
	LEFT JOIN dbo.vehicle_types d
	ON a.vehicle_type_id = d.vehicle_type_id
	WHERE 1 = 1
	AND a.hash_key = @hash_key
	ORDER BY c.route_no, c.seq_no
END;