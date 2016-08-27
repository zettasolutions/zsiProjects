CREATE PROCEDURE [dbo].[units_sel]
(
    @unit_id  INT = null
  )
AS
BEGIN
--  DECLARE @stmt		VARCHAR(4000);

  IF @unit_id IS NOT NULL  
	 SELECT * FROM units_v WHERE unit_id = @unit_id; 
  ELSE
	 SELECT * FROM units_v; 
 	
END
 



