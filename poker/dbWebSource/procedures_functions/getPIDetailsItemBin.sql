CREATE FUNCTION [dbo].[getPIDetailsItemBin] 
(
   @physical_inv_id int
  ,@item_inv_id    int
  ,@item_status_id  int
)
RETURNS VARCHAR(max)
AS
BEGIN
   DECLARE @return_var VARCHAR(max);
   DECLARE @Delimiter CHAR(2) 
   SET @Delimiter = ', '

   SELECT @return_var = COALESCE(@return_var + @Delimiter,'') + f.bin
             FROM dbo.physical_inv_details_v f
             WHERE f.physical_inv_id = @physical_inv_id
			   AND f.item_inv_id = @item_inv_id
			   AND f.item_status_id = @item_status_id
             
   RETURN @return_var;

END


