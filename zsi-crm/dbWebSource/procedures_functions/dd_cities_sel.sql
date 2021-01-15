CREATE PROCEDURE [dbo].[dd_cities_sel]
( 
     @user_id INT = NULL
	,@state_id INT = NULL
)
AS
BEGIN
	SELECT city_id, city_name FROM zsi_afcs.dbo.cities WHERE state_id = @state_id;
 END;



