
CREATE PROCEDURE [dbo].[items_inv_sel]
(
      @user_id      INT 
	 ,@item_cat_id  INT = null
	 

)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)

SET @stmt = 'SELECT * FROM dbo.items_inv_v WHERE organization_id = ' + cast(dbo.getUserOrganizationId(@user_id) as varchar(20))
IF isnull(@item_cat_id,0) <> 0
   SET @stmt = @stmt + ' AND item_cat_id = ' + cast(@item_cat_id as varchar(20))

EXEC(@stmt);
	
END

