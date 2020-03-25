



CREATE PROCEDURE [dbo].[bw_locations_sel]
( 
   @user_id INT = NULL 
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.bw_locations WHERE 1=1 '; 

	exec(@stmt);
 END;


