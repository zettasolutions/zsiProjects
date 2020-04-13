CREATE PROCEDURE [dbo].[dd_countries_sel]
( 
     @user_id INT = NULL
	,@country_id INT = NULL
)
AS
BEGIN
	SELECT country_id, country_name FROM dbo.countries;
 END;



