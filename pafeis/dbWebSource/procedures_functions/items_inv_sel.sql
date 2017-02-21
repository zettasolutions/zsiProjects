
CREATE PROCEDURE [dbo].[items_inv_sel]
(
      @warehouse_id INT 
	 ,@item_cat_id  INT = null
	 ,@option_id	CHAR(3)
	 ,@user_id      INT
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)

SET @stmt = 'SELECT * FROM dbo.items_inv_v WHERE warehouse_id = ' + cast(@warehouse_id as varchar(20))

IF isnull(@item_cat_id,0) <> 0
   SET @stmt = @stmt + ' AND item_cat_id = ' + cast(@item_cat_id as varchar(20))

IF @option_id = 'C'
   SET @stmt = @stmt + ' AND critical_level IS NOT NULL'

IF @option_id = 'R'
   SET @stmt = @stmt + ' AND reorder_level IS NOT NULL'

EXEC(@stmt);
	
END

