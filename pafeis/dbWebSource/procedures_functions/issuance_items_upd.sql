
CREATE PROCEDURE [dbo].[issuance_items_upd] (
  @issuance_id INT
 ,@user_id     INT
)
AS
BEGIN
SET NOCOUNT ON

        UPDATE a  
		   SET stock_qty = stock_qty - b.quantity  
		   FROM dbo.items_inv a INNER JOIN dbo.issuance_details_v b
		   ON a.item_code_id = b.item_code_id 
		   WHERE a.organization_id = b.organization_id
		   AND b.issuance_id = @issuance_id 

        UPDATE a
		  SET organization_id = NULL
		 FROM dbo.items a INNER JOIN dbo.issuance_details_v b
		   ON a.item_id = b.item_id
		  AND b.issuance_id = @issuance_id;
		 
	END;
