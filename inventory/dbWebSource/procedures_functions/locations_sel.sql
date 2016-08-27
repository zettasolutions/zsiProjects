CREATE PROCEDURE [dbo].[locations_sel]
(
    @loc_id  INT = null
   ,@location  varchar(100) = null
   ,@loc_group_id INT = null
)
AS
BEGIN
--  DECLARE @stmt		VARCHAR(4000);

  IF @loc_id IS NOT NULL  
	 SELECT * FROM locations_v WHERE loc_id = @loc_id; 
  ELSE IF @location IS NOT NULL  
      SELECT * FROM locations_v WHERE location = @location 
	  ORDER BY location; 
  ELSE
      SELECT * FROM locations_v	  ORDER BY location; 
	
END
 




