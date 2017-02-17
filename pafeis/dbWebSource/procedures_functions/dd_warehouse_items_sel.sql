

CREATE PROCEDURE [dbo].[dd_warehouse_items_sel]
(
   @item_code_id int = null
  ,@item_inv_id int = null

)
AS
BEGIN
SET NOCOUNT ON
  DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT serial_no, serial_no text FROM dbo.items_v WHERE 1=1 ';
  
   IF isnull(@item_code_id,0) <> 0
     SET @stmt =  @stmt + ' AND item_code_id = ' + cast(@item_code_id as varchar(20))

  IF isnull(@item_inv_id,0) <> 0
     SET @stmt =  @stmt + ' AND item_inv_id = ' + cast(@item_inv_id as varchar(20))

  EXEC(@stmt);

END
