CREATE FUNCTION [dbo].[getItemBins](
@item_inv_id int
) 
RETURNS VARCHAR(100) 
AS
BEGIN
   DECLARE @l_bin VARCHAR(100); 

SELECT @l_bin = STUFF((SELECT ', ' + wb.bin 
          FROM dbo.warehouse_bins wb
          WHERE wb.item_inv_id = @item_inv_id
          ORDER BY bin
          FOR XML PATH('')), 1, 1, '') 

      RETURN @l_bin;
END;


