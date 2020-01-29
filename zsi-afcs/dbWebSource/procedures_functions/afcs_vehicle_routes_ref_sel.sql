
CREATE PROCEDURE [dbo].[afcs_vehicle_routes_ref_sel]  
(  
   @hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT
          a.asset_no
		, d.asset_code
		, b.route_code
		, b.route_desc
		, c.route_no
		, c.[location]
		, c.distance_km
		, c.seq_no
		, a.is_active
	FROM zsi_fmis.dbo.assets a 
	JOIN zsi_fmis.dbo.routes_ref b
	ON a.route_id = b.route_id
	JOIN zsi_fmis.dbo.route_details c
	ON b.route_id = c.route_id
	JOIN zsi_fmis.dbo.asset_types d
	ON a.asset_type_id = d.id
	WHERE 1 = 1
	AND a.hash_key = @hash_key
	ORDER BY c.route_no, c.seq_no
END;