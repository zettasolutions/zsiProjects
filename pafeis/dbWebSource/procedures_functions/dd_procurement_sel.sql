CREATE PROCEDURE [dbo].[dd_procurement_sel]
   @dealer_id   INT
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
   SELECT procurement_id, po_code FROM procurement_v where total_balance_qty > 0 AND status_code='V' AND supplier_id=@dealer_id 
END
