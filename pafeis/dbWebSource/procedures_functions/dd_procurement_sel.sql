CREATE PROCEDURE [dbo].[dd_procurement_sel]
   @dealer_id   INT
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
   SELECT procurement_id, po_code FROM procurement where status_id=16 AND supplier_id=@dealer_id 
END
