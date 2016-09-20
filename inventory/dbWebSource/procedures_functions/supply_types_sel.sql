
CREATE PROCEDURE [dbo].[supply_types_sel]
(
    @supply_type_id  INT = null
   ,@supply_type  varchar(100) = null,
   @user_id  int = null
)
AS
BEGIN
--  DECLARE @stmt		VARCHAR(4000);

  IF @supply_type_id IS NOT NULL  
	 SELECT * FROM supply_types_v WHERE supply_type_id = @supply_type_id; 
  ELSE IF @supply_type IS NOT NULL  
      SELECT * FROM supply_types_v WHERE supply_type = @supply_type 
	  ORDER BY supply_type; 
  ELSE
      SELECT * FROM supply_types_v
	  ORDER BY supply_type; 
	
END
 



