
CREATE PROCEDURE [dbo].[adjustments_ref_sel]
(
    @adjmt_id  INT = null
   ,@adjmt_desc  varchar(20) = null
   ,@posted INT = null
)
AS
BEGIN
--  DECLARE @stmt		VARCHAR(4000);

  IF @adjmt_id IS NOT NULL  
	 SELECT * FROM adjustments_ref WHERE adjmt_id = @adjmt_id; 
  ELSE IF @adjmt_desc IS NOT NULL  
      SELECT * FROM adjustments_ref WHERE adjmt_desc = @adjmt_desc 
	  
  ELSE IF @posted IS NOT NULL  
      SELECT * FROM adjustments_ref WHERE posted = @posted  
	  ORDER BY adjmt_desc; 
  ELSE 
	 SELECT * FROM adjustments_ref 
END
 





